using EduProCRM.Domain.Entities;
using FluentValidation;
using MediatR;

namespace EduProCRM.Application.Approvals.Commands;

// CQRS Command
public record ApproveRequestCommand(Guid RequestId, string ApproverName) : IRequest<bool>;

// Validator
public class ApproveRequestCommandValidator : AbstractValidator<ApproveRequestCommand>
{
    public ApproveRequestCommandValidator()
    {
        RuleFor(x => x.RequestId).NotEmpty().WithMessage("Mã đề xuất không được để trống.");
        RuleFor(x => x.ApproverName).NotEmpty().WithMessage("Tên người phê duyệt không được để trống.");
    }
}

// CQRS Handler
public class ApproveRequestCommandHandler : IRequestHandler<ApproveRequestCommand, bool>
{
    private readonly IApprovalRepository _repository;

    public ApproveRequestCommandHandler(IApprovalRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(ApproveRequestCommand request, CancellationToken cancellationToken)
    {
        var approval = await _repository.GetByIdAsync(request.RequestId, cancellationToken);
        if (approval == null) return false;

        approval.ApproveByDirector();
        await _repository.UpdateAsync(approval, cancellationToken);
        return true;
    }
}

public interface IApprovalRepository
{
    Task<ApprovalRequest?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<IEnumerable<ApprovalRequestDto>> GetPendingApprovalsAsync(CancellationToken ct);
    Task AddAsync(ApprovalRequest request, CancellationToken ct);
    Task UpdateAsync(ApprovalRequest request, CancellationToken ct);
}

public record ApprovalRequestDto(
    Guid Id,
    string RequestType,
    Guid StudentId,
    string StudentName,
    Guid ContractId,
    decimal Amount,
    string ProposerName,
    DateTime CreatedAt,
    string StatusLevel1,
    string StatusLevel2,
    string Status
);
