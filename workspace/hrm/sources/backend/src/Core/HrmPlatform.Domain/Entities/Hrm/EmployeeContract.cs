using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Hợp đồng lao động của nhân sự
/// </summary>
public class EmployeeContract : BaseEntity<EmployeeContractStatus>, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public long EmployeeId { get; private set; }
    public string ContractNumber { get; private set; } = null!;
    public EmployeeContractType ContractType { get; private set; }
    public DateOnly SignDate { get; private set; }
    public DateOnly StartDate { get; private set; }
    public DateOnly? EndDate { get; private set; }
    public decimal BasicSalary { get; private set; }
    public decimal InsuranceSalary { get; private set; }
    public string? Note { get; private set; }
    public string? AttachmentUrl { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual EmployeeProfile Employee { get; private set; } = null!;
    #endregion

    protected EmployeeContract()
    {
    }

    /// <summary>
    /// Khởi tạo Hợp đồng Lao động mới
    /// </summary>
    public static EmployeeContract Create(
        long tenantId,
        long employeeId,
        string contractNumber,
        EmployeeContractType contractType,
        DateOnly signDate,
        DateOnly startDate,
        DateOnly? endDate,
        decimal basicSalary,
        decimal insuranceSalary,
        string? note = null,
        string? attachmentUrl = null)
    {
        if (employeeId <= 0)
            throw new DomainException("Mã nhân sự không hợp lệ.");

        if (string.IsNullOrWhiteSpace(contractNumber))
            throw new DomainException("Mã hợp đồng không được để trống.");

        if (startDate > endDate)
            throw new DomainException("Ngày bắt đầu hợp đồng không thể sau ngày kết thúc.");

        var contract = new EmployeeContract
        {
            TenantId = tenantId,
            EmployeeId = employeeId,
            ContractNumber = contractNumber.Trim().ToUpper(),
            ContractType = contractType,
            SignDate = signDate,
            StartDate = startDate,
            EndDate = endDate,
            BasicSalary = basicSalary >= 0 ? basicSalary : 0,
            InsuranceSalary = insuranceSalary >= 0 ? insuranceSalary : 0,
            Note = note?.Trim(),
            AttachmentUrl = attachmentUrl?.Trim(),
            Status = EmployeeContractStatus.ACTIVE
        };

        return contract;
    }

    /// <summary>
    /// Cập nhật thông tin Hợp đồng
    /// </summary>
    public void Update(
        EmployeeContractType contractType,
        DateOnly signDate,
        DateOnly startDate,
        DateOnly? endDate,
        decimal basicSalary,
        decimal insuranceSalary,
        EmployeeContractStatus status,
        string? note = null,
        string? attachmentUrl = null)
    {
        if (startDate > endDate)
            throw new DomainException("Ngày bắt đầu hợp đồng không thể sau ngày kết thúc.");

        ContractType = contractType;
        SignDate = signDate;
        StartDate = startDate;
        EndDate = endDate;
        BasicSalary = basicSalary >= 0 ? basicSalary : 0;
        InsuranceSalary = insuranceSalary >= 0 ? insuranceSalary : 0;
        Status = status;
        Note = note?.Trim();
        AttachmentUrl = attachmentUrl?.Trim();
    }

    /// <summary>
    /// Gán mã hợp đồng tự phát sinh
    /// </summary>
    public void SetContractNumber(string number)
    {
        if (!string.IsNullOrWhiteSpace(number))
        {
            ContractNumber = number.Trim().ToUpper();
        }
    }
}
