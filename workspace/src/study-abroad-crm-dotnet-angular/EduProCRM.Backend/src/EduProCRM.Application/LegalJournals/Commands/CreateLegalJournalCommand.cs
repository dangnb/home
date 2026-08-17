using EduProCRM.Domain.Entities;
using EduProCRM.Domain.Enums;
using FluentValidation;
using MediatR;

namespace EduProCRM.Application.LegalJournals.Commands;

// 1. CQRS COMMAND
public record CreateLegalJournalCommand(
    Guid StudentId,
    Guid ContractId,
    ContractClause Clause,
    DateTime ActionDateTime,
    string Summary,
    string Content,
    string? PortalUrl,
    Guid MentorId
) : IRequest<Guid>;

// 2. FLUENT VALIDATION
public class CreateLegalJournalCommandValidator : AbstractValidator<CreateLegalJournalCommand>
{
    public CreateLegalJournalCommandValidator()
    {
        RuleFor(x => x.StudentId)
            .NotEmpty().WithMessage("Mã học viên không được để trống.");

        RuleFor(x => x.ContractId)
            .NotEmpty().WithMessage("Mã hợp đồng không được để trống.");

        RuleFor(x => x.Clause)
            .IsInEnum().WithMessage("Điều khoản hợp đồng (Điều 2) không hợp lệ.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Nội dung ghi chép công việc không được để trống.")
            .MinimumLength(15).WithMessage("Nội dung công việc phải dài ít nhất 15 ký tự để làm bằng chứng hợp pháp.");

        RuleFor(x => x.MentorId)
            .NotEmpty().WithMessage("Mã Mentor thực hiện không được để trống.");
    }
}

// 3. CQRS HANDLER
public class CreateLegalJournalCommandHandler : IRequestHandler<CreateLegalJournalCommand, Guid>
{
    private readonly ILegalJournalRepository _repository;

    public CreateLegalJournalCommandHandler(ILegalJournalRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(CreateLegalJournalCommand request, CancellationToken cancellationToken)
    {
        var journal = LegalJournal.Create(
            request.StudentId,
            request.ContractId,
            request.Clause,
            request.ActionDateTime,
            request.Summary,
            request.Content,
            request.PortalUrl,
            request.MentorId
        );

        await _repository.AddAsync(journal, cancellationToken);
        return journal.Id;
    }
}

public interface ILegalJournalRepository
{
    Task AddAsync(LegalJournal journal, CancellationToken cancellationToken);
    Task<IEnumerable<LegalJournalDto>> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken);
}

public record LegalJournalDto(
    Guid Id,
    Guid StudentId,
    string StudentName,
    Guid ContractId,
    string ContractClauseName,
    DateTime ActionDateTime,
    string Summary,
    string Content,
    string? PortalUrl,
    string MentorName,
    bool IsLocked,
    DateTime LockedAt,
    string SignatureHash
);
