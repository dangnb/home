using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Equipments.Commands;

public class ReportBrokenEquipmentCommand : IRequest<bool>
{
    public Guid EquipmentId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Note { get; set; }
}

public class ReportBrokenEquipmentCommandValidator : AbstractValidator<ReportBrokenEquipmentCommand>
{
    public ReportBrokenEquipmentCommandValidator()
    {
        RuleFor(x => x.EquipmentId)
            .NotEmpty().WithMessage("ID trang thiết bị không hợp lệ.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Mô tả sự cố hỏng hóc không được để trống.")
            .MaximumLength(500).WithMessage("Mô tả sự cố tối đa 500 ký tự.");
    }
}

public class ReportBrokenEquipmentCommandHandler : IRequestHandler<ReportBrokenEquipmentCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ReportBrokenEquipmentCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ReportBrokenEquipmentCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");

        var equipment = await _context.Equipments
            .Include(e => e.Histories)
            .FirstOrDefaultAsync(e => e.Id == request.EquipmentId && e.TenantId == tenantId, cancellationToken);

        if (equipment == null)
            throw new NotFoundException($"Không tìm thấy trang thiết bị có ID = {request.EquipmentId}");

        equipment.ReportBroken(request.Description, request.Note);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
