namespace HrmPlatform.Domain.Common;

/// <summary>
/// Hợp đồng cho thực thể có thể thuộc Tenant hoặc thuộc phạm vi Hệ thống toàn cục (Super Admin / System Roles)
/// </summary>
public interface IMayHaveTenant
{
    long? TenantId { get; set; }
}
