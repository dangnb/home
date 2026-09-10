using HrmPlatform.Domain.Entities.Audit;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Common.Interfaces;

/// <summary>
/// Hợp đồng truy cập DbContext trong Application Layer (Inversion of Control)
/// </summary>
public interface IApplicationDbContext
{
    DbSet<Tenant> Tenants { get; }
    DbSet<User> Users { get; }
    DbSet<UserToken> UserTokens { get; }
    DbSet<Role> Roles { get; }
    DbSet<Permission> Permissions { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<AuditLog> AuditLogs { get; }

    DbSet<Department> Departments { get; }
    DbSet<EmployeeProfile> EmployeeProfiles { get; }
    DbSet<Attendance> Attendances { get; }
    DbSet<LeaveRequest> LeaveRequests { get; }
    DbSet<RewardDiscipline> RewardDisciplines { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
