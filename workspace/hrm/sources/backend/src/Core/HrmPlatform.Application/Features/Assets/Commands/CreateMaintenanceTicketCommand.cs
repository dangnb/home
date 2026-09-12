using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Assets.Commands;

public class CreateMaintenanceTicketCommand : IRequest<long>
{
    public long AssetId { get; set; }
    public string IssueDescription { get; set; } = string.Empty;
}

public class CreateMaintenanceTicketCommandValidator : AbstractValidator<CreateMaintenanceTicketCommand>
{
    public CreateMaintenanceTicketCommandValidator()
    {
        RuleFor(x => x.AssetId)
            .GreaterThan(0).WithMessage("ID tài sản không hợp lệ.");

        RuleFor(x => x.IssueDescription)
            .NotEmpty().WithMessage("Mô tả sự cố hỏng hóc không được để trống.");
    }
}

public class CreateMaintenanceTicketCommandHandler : IRequestHandler<CreateMaintenanceTicketCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateMaintenanceTicketCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateMaintenanceTicketCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId ?? 1;

        var asset = await _context.Assets
            .FirstOrDefaultAsync(a => a.Id == request.AssetId && a.TenantId == tenantId, cancellationToken);

        if (asset == null)
            throw new NotFoundException($"Không tìm thấy tài sản có ID = {request.AssetId}");

        asset.MarkBroken();

        var ticket = MaintenanceTicket.Create(
            tenantId: tenantId,
            assetId: asset.Id,
            reportedBy: currentUserId,
            issueDescription: request.IssueDescription
        );

        _context.MaintenanceTickets.Add(ticket);
        await _context.SaveChangesAsync(cancellationToken);

        return ticket.Id;
    }
}
