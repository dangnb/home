using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsBase.Infrastructure.Persistence;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("executive-stats")]
    public async Task<IActionResult> GetExecutiveStats()
    {
        var totalProjects = await _context.Projects.CountAsync();
        var activeProjects = await _context.Projects.CountAsync(p => p.Status == Domain.Enums.ProjectStatus.InExecution);
        var totalContractValue = await _context.Contracts.SumAsync(c => c.TotalValue);
        var totalReceived = await _context.ContractPaymentTerms.Where(t => t.IsPaid).SumAsync(t => t.Amount);
        
        var debts = await _context.DebtRecords.ToListAsync();
        var totalReceivables = debts.Where(d => d.Type == "Receivable").Sum(d => d.RemainingDebt);
        var totalPayables = debts.Where(d => d.Type == "Payable").Sum(d => d.RemainingDebt);
        
        var delayedTasks = await _context.ProjectTasks.CountAsync(t => t.Status == Domain.Enums.TaskStatusEnum.Delayed);

        return Ok(new
        {
            totalProjects,
            activeProjects,
            totalContractValue,
            totalReceived,
            totalReceivables,
            totalPayables,
            delayedTasks,
            cashflowRatio = totalContractValue > 0 ? Math.Round((totalReceived / totalContractValue) * 100, 2) : 0
        });
    }
}
