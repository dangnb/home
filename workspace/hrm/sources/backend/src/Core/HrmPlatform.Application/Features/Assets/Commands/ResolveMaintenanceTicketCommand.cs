using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Assets.Commands;

public class ResolveMaintenanceTicketCommand : IRequest<bool>
{
    public long TicketId { get; set; }
    public long? TechnicianId { get; set; }
    public string ResolutionNotes { get; set; } = string.Empty;
    public decimal RepairCost { get; set; }
}

public class ResolveMaintenanceTicketCommandValidator : AbstractValidator<ResolveMaintenanceTicketCommand>
{
    public ResolveMaintenanceTicketCommandValidator()
    {
        RuleFor(x => x.TicketId)
            .GreaterThan(0).WithMessage("ID phiếu bảo trì không hợp lệ.");

        RuleFor(x => x.ResolutionNotes)
            .NotEmpty().WithMessage("Vui lòng nhập phương án xử lý / kết quả khắc phục.");

        RuleFor(x => x.RepairCost)
            .GreaterThanOrEqualTo(0).WithMessage("Chi phí sửa chữa không được âm.");
    }
}

public class ResolveMaintenanceTicketCommandHandler : IRequestHandler<ResolveMaintenanceTicketCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ResolveMaintenanceTicketCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ResolveMaintenanceTicketCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var ticket = await _context.MaintenanceTickets
            .Include(m => m.Asset)
            .FirstOrDefaultAsync(m => m.Id == request.TicketId && m.TenantId == tenantId, cancellationToken);

        if (ticket == null)
            throw new NotFoundException($"Không tìm thấy phiếu bảo trì có ID = {request.TicketId}");

        if (request.TechnicianId.HasValue && request.TechnicianId.Value > 0)
        {
            ticket.AssignTechnician(request.TechnicianId.Value);
        }

        ticket.Resolve(request.ResolutionNotes, request.RepairCost);

        if (ticket.Asset != null && ticket.Asset.Status == AssetStatus.MAINTENANCE || ticket.Asset?.Status == AssetStatus.BROKEN)
        {
            ticket.Asset.CompleteMaintenance();
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
