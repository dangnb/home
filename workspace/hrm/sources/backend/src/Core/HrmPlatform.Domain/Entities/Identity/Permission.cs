using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Quyền hạn truy cập các tính năng / API theo từng Module
/// </summary>
public class Permission : BaseEntity
{
    public string Module { get; private set; } = string.Empty;
    public string Code { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    #region Navigation Properties
    public virtual ICollection<RolePermission> RolePermissions { get; private set; } = new HashSet<RolePermission>();
    #endregion

    protected Permission()
    {
    }

    public static Permission Create(string module, string code, string name, string? description = null)
    {
        if (string.IsNullOrWhiteSpace(module))
            throw new DomainException("Module không được để trống.");

        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Mã quyền hạn không được để trống.");

        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên quyền hạn không được để trống.");

        return new Permission
        {
            Module = module.Trim().ToUpperInvariant(),
            Code = code.Trim().ToUpperInvariant(),
            Name = name.Trim(),
            Description = description?.Trim(),
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }
}
