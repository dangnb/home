using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Thành viên tham gia dự án (liên kết Dự án ↔ Nhân sự kèm vai trò)
/// </summary>
public class ProjectMember : BaseEntity
{
    public long ProjectId { get; private set; }

    /// <summary>ID User nhân sự tham gia</summary>
    public long UserId { get; private set; }

    /// <summary>Vai trò trong dự án: SALES_LEAD, TECH_PM, DEV, TESTER, BA, DESIGNER, ...</summary>
    public string Role { get; private set; } = string.Empty;

    /// <summary>Ngày tham gia dự án</summary>
    public DateOnly JoinedDate { get; private set; }

    /// <summary>Ngày rời dự án (null = vẫn còn tham gia)</summary>
    public DateOnly? LeftDate { get; private set; }

    /// <summary>Ghi chú về vai trò / trách nhiệm cụ thể</summary>
    public string? Note { get; private set; }

    #region Navigation
    public virtual Project Project { get; private set; } = null!;
    public virtual User User { get; private set; } = null!;
    #endregion

    protected ProjectMember() { }

    public static ProjectMember Create(long projectId, long userId, string role, string? note = null)
    {
        if (projectId <= 0) throw new DomainException("ProjectId không hợp lệ.");
        if (userId <= 0) throw new DomainException("UserId không hợp lệ.");
        if (string.IsNullOrWhiteSpace(role)) throw new DomainException("Vai trò không được để trống.");

        return new ProjectMember
        {
            ProjectId = projectId,
            UserId = userId,
            Role = role.Trim().ToUpper(),
            JoinedDate = DateOnly.FromDateTime(DateTime.UtcNow),
            Note = note?.Trim(),
            CreatedAt = DateTime.UtcNow
        };
    }

    public void MarkLeft()
    {
        LeftDate = DateOnly.FromDateTime(DateTime.UtcNow);
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateNote(string? note)
    {
        Note = note?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
