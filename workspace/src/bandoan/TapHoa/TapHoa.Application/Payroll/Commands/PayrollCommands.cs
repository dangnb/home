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

// ── Helper ──
public static class PayrollCalculatorHelper
{
    public static decimal EvaluateNetSalary(string formula, decimal baseSalary, int workDays, decimal totalHours, decimal overtimeHours, decimal overtimePay, decimal allowance, decimal bonus, decimal deduction, Dictionary<string, decimal>? customVariables = null)
    {
        try
        {
            var interpreter = new DynamicExpresso.Interpreter();
            interpreter.SetVariable("BaseSalary", (double)baseSalary);
            interpreter.SetVariable("WorkDays", (double)workDays);
            interpreter.SetVariable("TotalHours", (double)totalHours);
            interpreter.SetVariable("OvertimeHours", (double)overtimeHours);
            interpreter.SetVariable("OvertimePay", (double)overtimePay);
            interpreter.SetVariable("Allowance", (double)allowance);
            interpreter.SetVariable("Bonus", (double)bonus);
            interpreter.SetVariable("Deduction", (double)deduction);

            if (customVariables != null)
            {
                foreach (var kvp in customVariables)
                {
                    interpreter.SetVariable(kvp.Key, (double)kvp.Value);
                }
            }

            var result = interpreter.Eval(formula);
            return Convert.ToDecimal(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Formula Error: {ex.Message}");
            // Fallback in case of syntax error in formula
            return baseSalary + overtimePay + allowance + bonus - deduction;
        }
    }
}

// ── Calculate Payroll ──
public class CalculatePayrollCommand : IRequest<bool>
{
    public Guid PeriodId { get; set; }
    public decimal DefaultBaseSalary { get; set; } = 5000000m; // 5 triệu/tháng
    public decimal OvertimeRate { get; set; } = 1.5m;
    public decimal DefaultAllowance { get; set; } = 500000m;
    public string Formula { get; set; } = "(BaseSalary / 22 * WorkDays) + OvertimePay + Allowance + Bonus - Deduction";
    public Dictionary<string, decimal>? CustomVariables { get; set; }
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

        if (period.Status != PayrollPeriodStatus.Draft && period.Status != PayrollPeriodStatus.Calculated)
            throw new InvalidOperationException("Can only calculate Draft or Calculated payroll periods.");

        string? customVarsJson = request.CustomVariables != null && request.CustomVariables.Any()
            ? System.Text.Json.JsonSerializer.Serialize(request.CustomVariables)
            : null;

        period.UpdateFormula(request.Formula, customVarsJson);

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

        // Get all active employees with linked users
        var employees = await _context.Employees
            .Include(e => e.SalaryTemplate)
            .Include(e => e.User)
            .Where(e => e.User != null && e.User.IsActive)
            .ToListAsync(cancellationToken);

        foreach (var employee in employees)
        {
            var username = employee.User!.Username;
            var userAttendances = attendances.Where(a => a.Username == username).ToList();

            var workDays = userAttendances.Count(a => a.Status != AttendanceStatus.Absent && a.Status != AttendanceStatus.DayOff);
            var totalHours = userAttendances.Sum(a => a.TotalHours);
            var overtimeHours = userAttendances.Sum(a => a.OvertimeHours);

            var baseSalary = employee.BaseSalary > 0 ? employee.BaseSalary : request.DefaultBaseSalary;
            var formula = employee.SalaryTemplate?.Formula ?? period.Formula;

            // Calculate hourly rate from base salary (assuming 22 working days * 8 hours)
            var hourlyRate = baseSalary / (22m * 8m);
            var overtimePay = Math.Round(overtimeHours * hourlyRate * request.OvertimeRate, 0);

            var netSalary = PayrollCalculatorHelper.EvaluateNetSalary(
                formula: formula,
                baseSalary: baseSalary,
                workDays: workDays,
                totalHours: totalHours,
                overtimeHours: overtimeHours,
                overtimePay: overtimePay,
                allowance: request.DefaultAllowance,
                bonus: 0,
                deduction: 0,
                customVariables: request.CustomVariables
            );

            var entry = new PayrollEntry(
                payrollPeriodId: period.Id,
                username: username,
                employeeName: employee.FullName,
                workDays: workDays,
                totalHours: totalHours,
                overtimeHours: overtimeHours,
                baseSalary: baseSalary,
                overtimePay: overtimePay,
                allowance: request.DefaultAllowance,
                netSalary: netSalary
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

        Dictionary<string, decimal>? customVars = null;
        if (!string.IsNullOrWhiteSpace(entry.PayrollPeriod.CustomVariables))
        {
            try { customVars = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(entry.PayrollPeriod.CustomVariables); } catch { }
        }

        var netSalary = PayrollCalculatorHelper.EvaluateNetSalary(
            formula: entry.PayrollPeriod.Formula,
            baseSalary: request.BaseSalary,
            workDays: entry.WorkDays,
            totalHours: entry.TotalHours,
            overtimeHours: entry.OvertimeHours,
            overtimePay: entry.OvertimePay,
            allowance: request.Allowance,
            bonus: request.Bonus,
            deduction: request.Deduction,
            customVariables: customVars
        );

        entry.UpdateBaseSalary(request.BaseSalary, netSalary);
        entry.UpdateAdjustments(request.Bonus, request.Deduction, request.Allowance, netSalary, request.Notes);
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
