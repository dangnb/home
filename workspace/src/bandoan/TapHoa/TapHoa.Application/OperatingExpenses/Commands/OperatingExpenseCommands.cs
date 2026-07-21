using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.OperatingExpenses.Commands;

// ── Create ──────────────────────────────────────────────────────────────────
public class CreateOperatingExpenseCommand : IRequest<Guid>
{
    public string Name { get; set; } = "";
    public int Type { get; set; }
    public decimal Amount { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }
}

public class CreateOperatingExpenseHandler : IRequestHandler<CreateOperatingExpenseCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateOperatingExpenseHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateOperatingExpenseCommand request, CancellationToken cancellationToken)
    {
        var expense = OperatingExpense.Create(
            request.Name,
            (OperatingExpenseType)request.Type,
            request.Amount,
            request.Month,
            request.Year,
            request.DueDate,
            request.Notes
        );

        _context.OperatingExpenses.Add(expense);
        await _context.SaveChangesAsync(cancellationToken);
        return expense.Id;
    }
}

// ── Update ──────────────────────────────────────────────────────────────────
public class UpdateOperatingExpenseCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public int Type { get; set; }
    public decimal Amount { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }
}

public class UpdateOperatingExpenseHandler : IRequestHandler<UpdateOperatingExpenseCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateOperatingExpenseHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateOperatingExpenseCommand request, CancellationToken cancellationToken)
    {
        var expense = await _context.OperatingExpenses.FindAsync(new object[] { request.Id }, cancellationToken);
        if (expense == null) return false;

        expense.Update(
            request.Name,
            (OperatingExpenseType)request.Type,
            request.Amount,
            request.Month,
            request.Year,
            request.DueDate,
            request.Notes
        );

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ── Mark as Paid ────────────────────────────────────────────────────────────
public class MarkExpensePaidCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public DateTime PaidDate { get; set; }
}

public class MarkExpensePaidHandler : IRequestHandler<MarkExpensePaidCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public MarkExpensePaidHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(MarkExpensePaidCommand request, CancellationToken cancellationToken)
    {
        var expense = await _context.OperatingExpenses.FindAsync(new object[] { request.Id }, cancellationToken);
        if (expense == null) return false;

        expense.MarkAsPaid(request.PaidDate);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ── Delete (Soft) ───────────────────────────────────────────────────────────
public class DeleteOperatingExpenseCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteOperatingExpenseHandler : IRequestHandler<DeleteOperatingExpenseCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteOperatingExpenseHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteOperatingExpenseCommand request, CancellationToken cancellationToken)
    {
        var expense = await _context.OperatingExpenses.FindAsync(new object[] { request.Id }, cancellationToken);
        if (expense == null) return false;

        expense.IsDeleted = true;
        expense.DeletedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
