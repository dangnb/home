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
    public long? UserId { get; set; }
    public long? TenantId { get; set; }
    public bool IsSuperAdmin { get; set; }
    public bool IsAuthenticated { get; set; } = true;
    public string? IpAddress { get; set; } = "127.0.0.1";
}

public class MultiTenancyAndAuditTests
{
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
            UserId = 100,
            TenantId = 1,
            IsSuperAdmin = false
        };

        using var context = CreateDbContext(currentUserService, dbName);

        var department = new Department
        {
            Name = "Engineering",
            Code = "ENG"
            // TenantId not explicitly set
        };

        // Act
        context.Departments.Add(department);
        await context.SaveChangesAsync();

        // Assert
        Assert.Equal(1, department.TenantId);
        Assert.Equal(100, department.CreatedBy);
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
            UserId = 100,
            TenantId = 1,
            IsSuperAdmin = false
        };

        using var context = CreateDbContext(currentUserService, dbName);

        var department = new Department
        {
            Name = "Marketing",
            Code = "MKT",
            TenantId = 1
        };

        context.Departments.Add(department);
        await context.SaveChangesAsync();

        // Act
        context.Departments.Remove(department);
        await context.SaveChangesAsync();

        // Assert - entity is soft deleted
        Assert.Equal(EntityStatus.DELETED, department.Status);
        Assert.NotNull(department.UpdatedAt);
        Assert.Equal(100, department.UpdatedBy);

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
        var adminService = new TestCurrentUserService { IsSuperAdmin = true, UserId = 1 };

        // Seed data for 2 different tenants
        using (var seedContext = CreateDbContext(adminService, dbName))
        {
            seedContext.Departments.Add(new Department { Name = "Tenant 1 Sales", Code = "T1_SALES", TenantId = 1 });
            seedContext.Departments.Add(new Department { Name = "Tenant 2 Sales", Code = "T2_SALES", TenantId = 2 });
            await seedContext.SaveChangesAsync();
        }

        // Act & Assert for Tenant 1 User
        var tenant1User = new TestCurrentUserService { TenantId = 1, UserId = 10, IsSuperAdmin = false };
        using (var t1Context = CreateDbContext(tenant1User, dbName))
        {
            var t1Depts = await t1Context.Departments.ToListAsync();
            Assert.Single(t1Depts);
            Assert.Equal("T1_SALES", t1Depts[0].Code);
        }

        // Act & Assert for Tenant 2 User
        var tenant2User = new TestCurrentUserService { TenantId = 2, UserId = 20, IsSuperAdmin = false };
        using (var t2Context = CreateDbContext(tenant2User, dbName))
        {
            var t2Depts = await t2Context.Departments.ToListAsync();
            Assert.Single(t2Depts);
            Assert.Equal("T2_SALES", t2Depts[0].Code);
        }

        // Act & Assert for SuperAdmin (sees all tenants)
        var superAdmin = new TestCurrentUserService { TenantId = null, UserId = 1, IsSuperAdmin = true };
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
            UserId = 999,
            TenantId = 1,
            IsSuperAdmin = false,
            IpAddress = "192.168.1.50"
        };

        using var context = CreateDbContext(currentUserService, dbName, includeAuditLogInterceptor: true);

        // Act - Create department
        var dept = new Department
        {
            Name = "Research & Development",
            Code = "RND",
            TenantId = 1
        };
        context.Departments.Add(dept);
        await context.SaveChangesAsync();

        // Assert - Audit Log recorded
        var auditLogs = await context.AuditLogs.ToListAsync();
        Assert.NotEmpty(auditLogs);

        var createLog = auditLogs.FirstOrDefault(l => l.EntityName == nameof(Department) && l.Action == "CREATE");
        Assert.NotNull(createLog);
        Assert.Equal(1, createLog.TenantId);
        Assert.Equal(999, createLog.UserId);
        Assert.Equal("192.168.1.50", createLog.IpAddress);
        Assert.Contains("Research & Development", createLog.NewData);
    }
}
