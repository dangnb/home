using System.Linq.Expressions;
using System.Reflection;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Audit;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Infrastructure.Persistence;

/// <summary>
/// DbContext ghi dữ liệu (Write-side) cho hệ thống Core HRM Multi-Tenant SaaS
/// </summary>
public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly ICurrentUserService _currentUserService;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ICurrentUserService currentUserService)
        : base(options)
    {
        _currentUserService = currentUserService;
    }

    #region Tenant & User Context for Global Query Filters
    public long? CurrentTenantId => _currentUserService.TenantId;
    public bool IsSuperAdmin => _currentUserService.IsSuperAdmin;
    #endregion

    #region DbSets
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserToken> UserTokens => Set<UserToken>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<EmployeeProfile> EmployeeProfiles => Set<EmployeeProfile>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<RewardDiscipline> RewardDisciplines => Set<RewardDiscipline>();
    public DbSet<EmployeeContract> EmployeeContracts => Set<EmployeeContract>();
    public DbSet<EmployeeJobHistory> EmployeeJobHistories => Set<EmployeeJobHistory>();
    public DbSet<HrPolicy> HrPolicies => Set<HrPolicy>();
    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Áp dụng tự động tất cả các cấu hình Fluent API trong Assembly
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Cấu hình Global Query Filter cho Multi-Tenancy và Soft Delete
        ConfigureGlobalFilters(modelBuilder);
    }

    private void ConfigureGlobalFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var clrType = entityType.ClrType;
            var parameter = Expression.Parameter(clrType, "e");
            Expression? filterExpression = null;

            // 1. Soft Delete Filter cho ISoftDeletable
            if (typeof(ISoftDeletable).IsAssignableFrom(clrType))
            {
                var statusProp = Expression.Property(parameter, nameof(ISoftDeletable.Status));
                var deletedConstant = Expression.Constant(EntityStatus.DELETED);
                var notDeletedExpr = Expression.NotEqual(statusProp, deletedConstant);
                filterExpression = notDeletedExpr;
            }

            // 2. Multi-Tenant Filter cho ITenantScopedEntity (Bắt buộc có TenantId)
            if (typeof(ITenantScopedEntity).IsAssignableFrom(clrType))
            {
                var isSuperAdminExpr = Expression.Property(Expression.Constant(this), nameof(IsSuperAdmin));
                var tenantIdProp = Expression.Property(parameter, nameof(ITenantScopedEntity.TenantId));
                var currentTenantExpr = Expression.Property(Expression.Constant(this), nameof(CurrentTenantId));

                // e.TenantId == CurrentTenantId
                var nullableTenantId = Expression.Convert(tenantIdProp, typeof(long?));
                var tenantEquals = Expression.Equal(nullableTenantId, currentTenantExpr);

                // IsSuperAdmin || (e.TenantId == CurrentTenantId)
                var tenantFilter = Expression.OrElse(isSuperAdminExpr, tenantEquals);

                filterExpression = filterExpression == null
                    ? tenantFilter
                    : Expression.AndAlso(filterExpression, tenantFilter);
            }
            // 3. Multi-Tenant Filter cho IMayHaveTenant (User, Role: tenant_id có thể null đối với SuperAdmin / System Roles)
            else if (typeof(IMayHaveTenant).IsAssignableFrom(clrType))
            {
                var isSuperAdminExpr = Expression.Property(Expression.Constant(this), nameof(IsSuperAdmin));
                var tenantIdProp = Expression.Property(parameter, nameof(IMayHaveTenant.TenantId));
                var currentTenantExpr = Expression.Property(Expression.Constant(this), nameof(CurrentTenantId));

                // e.TenantId == null
                var tenantIsNull = Expression.Equal(tenantIdProp, Expression.Constant(null, typeof(long?)));

                // e.TenantId == CurrentTenantId
                var tenantEquals = Expression.Equal(tenantIdProp, currentTenantExpr);

                // IsSuperAdmin || e.TenantId == null || e.TenantId == CurrentTenantId
                var tenantFilter = Expression.OrElse(
                    isSuperAdminExpr,
                    Expression.OrElse(tenantIsNull, tenantEquals)
                );

                filterExpression = filterExpression == null
                    ? tenantFilter
                    : Expression.AndAlso(filterExpression, tenantFilter);
            }

            if (filterExpression != null)
            {
                var lambda = Expression.Lambda(filterExpression, parameter);
                modelBuilder.Entity(clrType).HasQueryFilter(lambda);
            }
        }
    }
}
