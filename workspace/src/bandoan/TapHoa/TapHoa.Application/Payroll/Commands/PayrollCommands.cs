using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Payroll.Commands;

// ── Create Payroll Period ──
public class CreatePayrollPeriodCommand : IRequest<Guid>
{
    public int Month { get; set; }
    public int Year { get; set; }
    public string? Notes { get; set; }
}

public class CreatePayrollPeriodCommandHandler : IRequestHandler<CreatePayrollPeriodCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreatePayrollPeriodCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreatePayrollPeriodCommand request, CancellationToken cancellationToken)
    {
        var exists = await _context.PayrollPeriods
            .AnyAsync(p => p.Month == request.Month && p.Year == request.Year && !p.IsDeleted, cancellationToken);

        if (exists)
            throw new InvalidOperationException($"Payroll period for {request.Month}/{request.Year} already exists.");

        var period = new PayrollPeriod(request.Month, request.Year, request.Notes);
        _context.PayrollPeriods.Add(period);
        await _context.SaveChangesAsync(cancellationToken);
        return period.Id;
    }
}

// ── Calculate Payroll ──
public class CalculatePayrollCommand : IRequest<bool>
{
    public Guid PeriodId { get; set; }
    public decimal DefaultBaseSalary { get; set; } = 5000000m; // 5 triệu/tháng
    public decimal OvertimeRate { get; set; } = 1.5m;
    public decimal DefaultAllowance { get; set; } = 500000m;
}

public class CalculatePayrollCommandHandler : IRequestHandler<CalculatePayrollCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public CalculatePayrollCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(CalculatePayrollCommand request, CancellationToken cancellationToken)
    {
        var period = await _context.PayrollPeriods
            .Include(p => p.Entries)
            .FirstOrDefaultAsync(p => p.Id == request.PeriodId && !p.IsDeleted, cancellationToken)
            ?? throw new InvalidOperationException("Payroll period not found.");

        if (period.Status != PayrollPeriodStatus.Draft)
            throw new InvalidOperationException("Can only calculate Draft payroll periods. Reset to Draft first.");

        // Remove old entries
        if (period.Entries.Any())
        {
            foreach (var entry in period.Entries.ToList())
                entry.IsDeleted = true;
        }

        // Get all attendances for the period
        var attendances = await _context.Attendances
            .Where(a => a.Date >= period.StartDate && a.Date <= period.EndDate && !a.IsDeleted)
            .ToListAsync(cancellationToken);

        // Get all active users
        var users = await _context.Users
            .Where(u => u.IsActive)
            .ToListAsync(cancellationToken);

        // Calculate hourly rate from base salary (assuming 22 working days * 8 hours)
        var hourlyRate = request.DefaultBaseSalary / (22m * 8m);

        foreach (var user in users)
        {
            var userAttendances = attendances.Where(a => a.Username == user.Username).ToList();

            var workDays = userAttendances.Count(a => a.Status != AttendanceStatus.Absent && a.Status != AttendanceStatus.DayOff);
            var totalHours = userAttendances.Sum(a => a.TotalHours);
            var overtimeHours = userAttendances.Sum(a => a.OvertimeHours);

            var overtimePay = Math.Round(overtimeHours * hourlyRate * request.OvertimeRate, 0);

            var entry = new PayrollEntry(
                payrollPeriodId: period.Id,
                username: user.Username,
                employeeName: user.FullName,
                workDays: workDays,
                totalHours: totalHours,
                overtimeHours: overtimeHours,
                baseSalary: request.DefaultBaseSalary,
                overtimePay: overtimePay,
                allowance: request.DefaultAllowance
            );

            _context.PayrollEntries.Add(entry);
        }

        period.MarkCalculated();
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ── Update Payroll Entry (Adjustments) ──
public class UpdatePayrollEntryCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal Bonus { get; set; }
    public decimal Deduction { get; set; }
    public decimal Allowance { get; set; }
    public string? Notes { get; set; }
}

public class UpdatePayrollEntryCommandHandler : IRequestHandler<UpdatePayrollEntryCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdatePayrollEntryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdatePayrollEntryCommand request, CancellationToken cancellationToken)
    {
        var entry = await _context.PayrollEntries
            .Include(e => e.PayrollPeriod)
            .FirstOrDefaultAsync(e => e.Id == request.Id && !e.IsDeleted, cancellationToken)
            ?? throw new InvalidOperationException("Payroll entry not found.");

        if (entry.PayrollPeriod.Status == PayrollPeriodStatus.Paid)
            throw new InvalidOperationException("Cannot modify entries of a paid payroll period.");

        entry.UpdateBaseSalary(request.BaseSalary);
        entry.UpdateAdjustments(request.Bonus, request.Deduction, request.Allowance, request.Notes);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ── Approve Payroll ──
public class ApprovePayrollCommand : IRequest<bool>
{
    public Guid PeriodId { get; set; }
}

public class ApprovePayrollCommandHandler : IRequestHandler<ApprovePayrollCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ApprovePayrollCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ApprovePayrollCommand request, CancellationToken cancellationToken)
    {
        var period = await _context.PayrollPeriods
            .FirstOrDefaultAsync(p => p.Id == request.PeriodId && !p.IsDeleted, cancellationToken)
            ?? throw new InvalidOperationException("Payroll period not found.");

        period.Approve();
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
