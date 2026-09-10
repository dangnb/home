using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Quy định, quy chế và chính sách HR công ty
/// </summary>
public class HrPolicy : BaseEntity<HrPolicyStatus>, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public string PolicyCode { get; private set; } = null!;
    public string Title { get; private set; } = null!;
    public HrPolicyCategory Category { get; private set; }
    public DateOnly EffectiveDate { get; private set; }
    public DateOnly? ExpiryDate { get; private set; }
    public string? Summary { get; private set; }
    public string? Content { get; private set; }
    public string? AttachmentUrl { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    #endregion

    protected HrPolicy()
    {
    }

    public static HrPolicy Create(
        long tenantId,
        string policyCode,
        string title,
        HrPolicyCategory category,
        DateOnly effectiveDate,
        DateOnly? expiryDate = null,
        string? summary = null,
        string? content = null,
        string? attachmentUrl = null,
        HrPolicyStatus status = HrPolicyStatus.PUBLISHED)
    {
        if (string.IsNullOrWhiteSpace(policyCode))
            throw new DomainException("Mã chính sách không được để trống.");

        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Tên chính sách không được để trống.");

        if (expiryDate.HasValue && effectiveDate > expiryDate.Value)
            throw new DomainException("Ngày hiệu lực không thể sau ngày hết hạn.");

        return new HrPolicy
        {
            TenantId = tenantId,
            PolicyCode = policyCode.Trim().ToUpper(),
            Title = title.Trim(),
            Category = category,
            EffectiveDate = effectiveDate,
            ExpiryDate = expiryDate,
            Summary = summary?.Trim(),
            Content = content?.Trim(),
            AttachmentUrl = attachmentUrl?.Trim(),
            Status = status
        };
    }

    public void Update(
        string title,
        HrPolicyCategory category,
        DateOnly effectiveDate,
        DateOnly? expiryDate,
        string? summary,
        string? content,
        string? attachmentUrl,
        HrPolicyStatus status)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Tên chính sách không được để trống.");

        if (expiryDate.HasValue && effectiveDate > expiryDate.Value)
            throw new DomainException("Ngày hiệu lực không thể sau ngày hết hạn.");

        Title = title.Trim();
        Category = category;
        EffectiveDate = effectiveDate;
        ExpiryDate = expiryDate;
        Summary = summary?.Trim();
        Content = content?.Trim();
        AttachmentUrl = attachmentUrl?.Trim();
        Status = status;
    }
}
