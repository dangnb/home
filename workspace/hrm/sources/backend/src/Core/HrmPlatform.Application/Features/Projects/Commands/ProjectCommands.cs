using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Projects.Commands;

// ─── Create Project ──────────────────────────────────────────────────────────

public class CreateProjectCommand : IRequest<long>
{
    public string Name { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerContactName { get; set; }
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public long SalesUserId { get; set; }
    public long SalesDepartmentId { get; set; }
    public ProjectType ProjectType { get; set; } = ProjectType.FIXED_PRICE;
    public ProjectPriority Priority { get; set; } = ProjectPriority.MEDIUM;
    public decimal? QuotedValue { get; set; }
    public DateOnly? PlannedStartDate { get; set; }
    public DateOnly? PlannedEndDate { get; set; }
    public string? Description { get; set; }
    public string? InternalNote { get; set; }
}

public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Tên dự án không được để trống.")
            .MaximumLength(255).WithMessage("Tên dự án tối đa 255 ký tự.");

        RuleFor(x => x.CustomerName).NotEmpty().WithMessage("Tên khách hàng không được để trống.")
            .MaximumLength(255).WithMessage("Tên khách hàng tối đa 255 ký tự.");

        RuleFor(x => x.SalesUserId).GreaterThan(0).WithMessage("Vui lòng chọn nhân viên kinh doanh phụ trách.");
        RuleFor(x => x.SalesDepartmentId).GreaterThan(0).WithMessage("Vui lòng chọn phòng kinh doanh phụ trách.");
    }
}

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateProjectCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        // Tự sinh mã dự án: DPA-[YEAR]-[SEQ4]
        var year = DateTime.UtcNow.Year;
        var countThisYear = await _context.Projects
            .CountAsync(p => p.TenantId == tenantId && p.CreatedAt.Year == year, cancellationToken);
        var code = $"DPA-{year}-{(countThisYear + 1):D4}";

        var project = Project.Create(
            tenantId: tenantId,
            code: code,
            name: request.Name,
            customerName: request.CustomerName,
            salesUserId: request.SalesUserId,
            salesDepartmentId: request.SalesDepartmentId,
            projectType: request.ProjectType,
            priority: request.Priority,
            customerContactName: request.CustomerContactName,
            customerPhone: request.CustomerPhone,
            customerEmail: request.CustomerEmail,
            quotedValue: request.QuotedValue,
            plannedStartDate: request.PlannedStartDate,
            plannedEndDate: request.PlannedEndDate,
            description: request.Description,
            internalNote: request.InternalNote
        );

        _context.Projects.Add(project);
        await _context.SaveChangesAsync(cancellationToken);
        return project.Id;
    }
}

// ─── Update Project Info ──────────────────────────────────────────────────────

public class UpdateProjectCommand : IRequest<bool>
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerContactName { get; set; }
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public ProjectType ProjectType { get; set; }
    public ProjectPriority Priority { get; set; }
    public decimal? QuotedValue { get; set; }
    public DateOnly? PlannedStartDate { get; set; }
    public DateOnly? PlannedEndDate { get; set; }
    public string? Description { get; set; }
    public string? InternalNote { get; set; }
}

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateProjectCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == request.Id && p.TenantId == tenantId, cancellationToken)
                      ?? throw new NotFoundException("Dự án không tồn tại.");

        project.UpdateInfo(request.Name, request.CustomerName, request.CustomerContactName,
            request.CustomerPhone, request.CustomerEmail, request.ProjectType, request.Priority,
            request.QuotedValue, request.PlannedStartDate, request.PlannedEndDate,
            request.Description, request.InternalNote);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ─── Sign Contract ────────────────────────────────────────────────────────────

public class SignProjectContractCommand : IRequest<bool>
{
    public long ProjectId { get; set; }
    public decimal ContractValue { get; set; }
    public DateOnly ContractSignedDate { get; set; }
    public string? ContractFileRef { get; set; }
    public int WarrantyMonths { get; set; } = 0;
    public DateOnly? PlannedStartDate { get; set; }
    public DateOnly? PlannedEndDate { get; set; }
}

public class SignProjectContractCommandHandler : IRequestHandler<SignProjectContractCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public SignProjectContractCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(SignProjectContractCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.TenantId == tenantId, cancellationToken)
                      ?? throw new NotFoundException("Dự án không tồn tại.");

        project.SignContract(request.ContractValue, request.ContractSignedDate,
            request.ContractFileRef, request.WarrantyMonths, request.PlannedStartDate, request.PlannedEndDate);

        // Gửi notification cho Tech Lead (nếu đã phân công) hoặc quản lý KT
        var notification = Notification.Create(
            tenantId: tenantId,
            userId: _currentUserService.UserId ?? 1,
            title: "Dự án mới chờ phân công kỹ thuật",
            message: $"Dự án [{project.Code}] - {project.Name} đã ký hợp đồng. Vui lòng phân công PM và tiếp nhận triển khai.",
            notificationType: "PROJECT_CONTRACT_SIGNED",
            referenceId: project.Id,
            targetUrl: $"/hrm/projects/{project.Id}"
        );
        _context.Notifications.Add(notification);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ─── Advance Sales Status ─────────────────────────────────────────────────────

public class AdvanceProjectSalesStatusCommand : IRequest<bool>
{
    public long ProjectId { get; set; }
    public ProjectSalesStatus NewStatus { get; set; }
    public string? Note { get; set; }
}

public class AdvanceProjectSalesStatusCommandHandler : IRequestHandler<AdvanceProjectSalesStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AdvanceProjectSalesStatusCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(AdvanceProjectSalesStatusCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.TenantId == tenantId, cancellationToken)
                      ?? throw new NotFoundException("Dự án không tồn tại.");

        project.AdvanceSalesStatus(request.NewStatus, request.Note);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ─── Close Lost ───────────────────────────────────────────────────────────────

public class CloseProjectLostCommand : IRequest<bool>
{
    public long ProjectId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class CloseProjectLostCommandHandler : IRequestHandler<CloseProjectLostCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CloseProjectLostCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(CloseProjectLostCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.TenantId == tenantId, cancellationToken)
                      ?? throw new NotFoundException("Dự án không tồn tại.");

        project.CloseLost(request.Reason);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
