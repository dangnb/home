using HrmPlatform.Domain.Enums;

namespace HrmPlatform.Domain.Common;

/// <summary>
/// Hợp đồng cho thực thể hỗ trợ xóa mềm (Soft Delete thông qua EntityStatus)
/// </summary>
public interface ISoftDeletable
{
    EntityStatus Status { get; set; }
    bool IsDeleted => Status == EntityStatus.DELETED;
}
