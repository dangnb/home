using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Infrastructure.Persistence;
using HrmPlatform.Infrastructure.Persistence.Interceptors;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace HrmPlatform.Infrastructure.Tests;

public class TestCurrentUserService : ICurrentUserService
{
    public Guid? UserId { get; set; }
    public Guid? TenantId { get; set; }
    public bool IsSuperAdmin { get; set; }
    public bool IsAuthenticated { get; set; } = true;
    public string? IpAddress { get; set; } = "127.0.0.1";
}

public class MultiTenancyAndAuditTests
{
    private static readonly Guid Tenant1Id = Guid.Parse("01956100-0000-7000-8000-000000000001");
    private static readonly Guid Tenant2Id = Guid.Parse("01956100-0000-7000-8000-000000000099");
    private static readonly Guid User100Id = Guid.Parse("01956100-0000-7000-8000-000000000100");
    private static readonly Guid User999Id = Guid.Parse("01956100-0000-7000-8000-000000000999");

    private ApplicationDbContext CreateDbContext(TestCurrentUserService currentUserService, string dbName, bool includeAuditLogInterceptor = false)
    {
        var builder = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .AddInterceptors(new AuditableEntityInterceptor(currentUserService));

        if (includeAuditLogInterceptor)
        {
            builder.AddInterceptors(new AuditLogInterceptor(currentUserService));
        }

        return new ApplicationDbContext(builder.Options, currentUserService);
    }

    [Fact]
    public async Task SaveChangesAsync_ShouldAutomaticallySetAuditFieldsAndTenantId()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var currentUserService = new TestCurrentUserService
        {
            UserId = User100Id,
            TenantId = Tenant1Id,
            IsSuperAdmin = false
        };

        using var context = CreateDbContext(currentUserService, dbName);

        var department = Department.Create("ENG", "Engineering");

        // Act
        context.Departments.Add(department);
        await context.SaveChangesAsync();

        // Assert
        Assert.Equal(Tenant1Id, department.TenantId);
        Assert.Equal(User100Id, department.CreatedBy);
        Assert.True(department.CreatedAt <= DateTime.UtcNow);
        Assert.Equal(EntityStatus.ACTIVE, department.Status);
    }

    [Fact]
    public async Task SaveChangesAsync_ShouldSoftDeleteWhenRemoveCalled()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var currentUserService = new TestCurrentUserService
        {
            UserId = User100Id,
            TenantId = Tenant1Id,
            IsSuperAdmin = false
        };

        using var context = CreateDbContext(currentUserService, dbName);

        var department = Department.Create("MKT", "Marketing", tenantId: Tenant1Id);

        context.Departments.Add(department);
        await context.SaveChangesAsync();

        // Act
        context.Departments.Remove(department);
        await context.SaveChangesAsync();

        // Assert - entity is soft deleted
        Assert.Equal(EntityStatus.DELETED, department.Status);
        Assert.NotNull(department.UpdatedAt);
        Assert.Equal(User100Id, department.UpdatedBy);

        // Assert - query filter ignores soft-deleted items
        var count = await context.Departments.CountAsync();
        Assert.Equal(0, count);

        // Assert - IgnoreQueryFilters can still find it
        var deletedDept = await context.Departments.IgnoreQueryFilters().FirstOrDefaultAsync(d => d.Code == "MKT");
        Assert.NotNull(deletedDept);
        Assert.Equal(EntityStatus.DELETED, deletedDept.Status);
    }

    [Fact]
    public async Task GlobalQueryFilter_ShouldIsolateDataBetweenTenants()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var adminService = new TestCurrentUserService { IsSuperAdmin = true, UserId = Guid.NewGuid() };

        // Seed data for 2 different tenants
        using (var seedContext = CreateDbContext(adminService, dbName))
        {
            seedContext.Departments.Add(Department.Create("T1_SALES", "Tenant 1 Sales", tenantId: Tenant1Id));
            seedContext.Departments.Add(Department.Create("T2_SALES", "Tenant 2 Sales", tenantId: Tenant2Id));
            await seedContext.SaveChangesAsync();
        }

        // Act & Assert for Tenant 1 User
        var tenant1User = new TestCurrentUserService { TenantId = Tenant1Id, UserId = Guid.NewGuid(), IsSuperAdmin = false };
        using (var t1Context = CreateDbContext(tenant1User, dbName))
        {
            var t1Depts = await t1Context.Departments.ToListAsync();
            Assert.Single(t1Depts);
            Assert.Equal("T1_SALES", t1Depts[0].Code);
        }

        // Act & Assert for Tenant 2 User
        var tenant2User = new TestCurrentUserService { TenantId = Tenant2Id, UserId = Guid.NewGuid(), IsSuperAdmin = false };
        using (var t2Context = CreateDbContext(tenant2User, dbName))
        {
            var t2Depts = await t2Context.Departments.ToListAsync();
            Assert.Single(t2Depts);
            Assert.Equal("T2_SALES", t2Depts[0].Code);
        }

        // Act & Assert for SuperAdmin (sees all tenants)
        var superAdmin = new TestCurrentUserService { TenantId = null, UserId = Guid.NewGuid(), IsSuperAdmin = true };
        using (var saContext = CreateDbContext(superAdmin, dbName))
        {
            var allDepts = await saContext.Departments.ToListAsync();
            Assert.Equal(2, allDepts.Count);
        }
    }

    [Fact]
    public async Task SaveChangesAsync_ShouldCreateAuditLogOnDataMutation()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var currentUserService = new TestCurrentUserService
        {
            UserId = User999Id,
            TenantId = Tenant1Id,
            IsSuperAdmin = false,
            IpAddress = "192.168.1.50"
        };

        using var context = CreateDbContext(currentUserService, dbName, includeAuditLogInterceptor: true);

        // Act - Create department
        var dept = Department.Create("RND", "Research & Development", tenantId: Tenant1Id);
        context.Departments.Add(dept);
        await context.SaveChangesAsync();

        // Assert - Audit Log recorded
        var auditLogs = await context.AuditLogs.ToListAsync();
        Assert.NotEmpty(auditLogs);

        var createLog = auditLogs.FirstOrDefault(l => l.EntityName == nameof(Department) && l.Action == "CREATE");
        Assert.NotNull(createLog);
        Assert.Equal(Tenant1Id, createLog.TenantId);
        Assert.Equal(User999Id, createLog.UserId);
        Assert.Equal("192.168.1.50", createLog.IpAddress);
        Assert.Contains("Research & Development", createLog.NewData);
    }
}
