using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Payroll.Queries;

public class PayrollPeriodDto
{
    public Guid Id { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public PayrollPeriodStatus Status { get; set; }
    public string StatusText => Status switch
    {
        PayrollPeriodStatus.Draft => "Nháp",
        PayrollPeriodStatus.Calculated => "Đã tính",
        PayrollPeriodStatus.Approved => "Đã duyệt",
        PayrollPeriodStatus.Paid => "Đã trả",
        _ => "N/A"
    };
    public string? Notes { get; set; }
    public int EmployeeCount { get; set; }
    public decimal TotalNetSalary { get; set; }
}

public class PayrollEntryDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string EmployeeName { get; set; } = null!;
    public int WorkDays { get; set; }
    public decimal TotalHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal OvertimePay { get; set; }
    public decimal Allowance { get; set; }
    public decimal Bonus { get; set; }
    public decimal Deduction { get; set; }
    public decimal NetSalary { get; set; }
    public string? Notes { get; set; }
}

public class PayrollDetailDto
{
    public PayrollPeriodDto Period { get; set; } = null!;
    public List<PayrollEntryDto> Entries { get; set; } = new();
}

// ── Get Payroll Periods ──
public class GetPayrollPeriodsQuery : IRequest<List<PayrollPeriodDto>>
{
    public int? Year { get; set; }
}

public class GetPayrollPeriodsQueryHandler : IRequestHandler<GetPayrollPeriodsQuery, List<PayrollPeriodDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPayrollPeriodsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayrollPeriodDto>> Handle(GetPayrollPeriodsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.PayrollPeriods.Where(p => !p.IsDeleted);

        if (request.Year.HasValue)
            query = query.Where(p => p.Year == request.Year.Value);

        return await query
            .OrderByDescending(p => p.Year).ThenByDescending(p => p.Month)
            .Select(p => new PayrollPeriodDto
            {
                Id = p.Id,
                Month = p.Month,
                Year = p.Year,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status,
                Notes = p.Notes,
                EmployeeCount = p.Entries.Count(e => !e.IsDeleted),
                TotalNetSalary = p.Entries.Where(e => !e.IsDeleted).Sum(e => e.NetSalary)
            })
            .ToListAsync(cancellationToken);
    }
}

// ── Get Payroll Detail ──
public class GetPayrollDetailQuery : IRequest<PayrollDetailDto>
{
    public Guid PeriodId { get; set; }
}

public class GetPayrollDetailQueryHandler : IRequestHandler<GetPayrollDetailQuery, PayrollDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetPayrollDetailQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PayrollDetailDto> Handle(GetPayrollDetailQuery request, CancellationToken cancellationToken)
    {
        var period = await _context.PayrollPeriods
            .Where(p => p.Id == request.PeriodId && !p.IsDeleted)
            .Select(p => new PayrollPeriodDto
            {
                Id = p.Id,
                Month = p.Month,
                Year = p.Year,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status,
                Notes = p.Notes,
                EmployeeCount = p.Entries.Count(e => !e.IsDeleted),
                TotalNetSalary = p.Entries.Where(e => !e.IsDeleted).Sum(e => e.NetSalary)
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new InvalidOperationException("Payroll period not found.");

        var entries = await _context.PayrollEntries
            .Where(e => e.PayrollPeriodId == request.PeriodId && !e.IsDeleted)
            .OrderBy(e => e.EmployeeName)
            .Select(e => new PayrollEntryDto
            {
                Id = e.Id,
                Username = e.Username,
                EmployeeName = e.EmployeeName,
                WorkDays = e.WorkDays,
                TotalHours = e.TotalHours,
                OvertimeHours = e.OvertimeHours,
                BaseSalary = e.BaseSalary,
                OvertimePay = e.OvertimePay,
                Allowance = e.Allowance,
                Bonus = e.Bonus,
                Deduction = e.Deduction,
                NetSalary = e.NetSalary,
                Notes = e.Notes
            })
            .ToListAsync(cancellationToken);

        return new PayrollDetailDto { Period = period, Entries = entries };
    }
}
