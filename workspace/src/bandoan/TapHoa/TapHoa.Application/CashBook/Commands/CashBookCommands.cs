using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.CashBook.Commands;

// ── Create ──────────────────────────────────────────────────────────────────
public class CreateCashBookEntryCommand : IRequest<Guid>
{
    public DateTime EntryDate { get; set; }
    public int Type { get; set; }
    public string Category { get; set; } = "";
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string? ReferenceId { get; set; }
    public string? ReferenceType { get; set; }
    public Guid? ShiftId { get; set; }
}

public class CreateCashBookEntryHandler : IRequestHandler<CreateCashBookEntryCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateCashBookEntryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateCashBookEntryCommand request, CancellationToken cancellationToken)
    {
        var entry = CashBookEntry.Create(
            request.EntryDate,
            (CashBookEntryType)request.Type,
            request.Category,
            request.Amount,
            request.Description ?? "",
            request.ReferenceId,
            request.ReferenceType,
            request.ShiftId
        );

        _context.CashBookEntries.Add(entry);
        await _context.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

// ── Update ──────────────────────────────────────────────────────────────────
public class UpdateCashBookEntryCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public DateTime EntryDate { get; set; }
    public int Type { get; set; }
    public string Category { get; set; } = "";
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string? ReferenceId { get; set; }
    public string? ReferenceType { get; set; }
    public Guid? ShiftId { get; set; }
}

public class UpdateCashBookEntryHandler : IRequestHandler<UpdateCashBookEntryCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateCashBookEntryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateCashBookEntryCommand request, CancellationToken cancellationToken)
    {
        var entry = await _context.CashBookEntries.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entry == null) return false;

        entry.Update(
            request.EntryDate,
            (CashBookEntryType)request.Type,
            request.Category,
            request.Amount,
            request.Description ?? "",
            request.ReferenceId,
            request.ReferenceType,
            request.ShiftId
        );

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ── Delete (Soft) ───────────────────────────────────────────────────────────
public class DeleteCashBookEntryCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteCashBookEntryHandler : IRequestHandler<DeleteCashBookEntryCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteCashBookEntryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteCashBookEntryCommand request, CancellationToken cancellationToken)
    {
        var entry = await _context.CashBookEntries.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entry == null) return false;

        entry.IsDeleted = true;
        entry.DeletedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
