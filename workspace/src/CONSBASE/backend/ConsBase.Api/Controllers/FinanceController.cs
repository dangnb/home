using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsBase.Domain.Entities;
using ConsBase.Domain.Enums;
using ConsBase.Infrastructure.Persistence;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FinanceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FinanceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("debts")]
    public async Task<IActionResult> GetDebts()
    {
        var debts = await _context.DebtRecords.Include(d => d.Project).ToListAsync();
        return Ok(debts);
    }

    [HttpGet("payment-requests")]
    public async Task<IActionResult> GetPaymentRequests()
    {
        var requests = await _context.PaymentRequests.Include(p => p.Project).ToListAsync();
        return Ok(requests);
    }

    [HttpPost("payment-requests")]
    public async Task<IActionResult> CreatePaymentRequest([FromBody] PaymentRequest request)
    {
        request.RequestCode = $"DN-PAY-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(100, 999)}";
        request.Status = PaymentRequestStatus.Submitted;
        _context.PaymentRequests.Add(request);
        await _context.SaveChangesAsync();
        return Ok(request);
    }

    [HttpPost("payment-requests/{id}/approve")]
    public async Task<IActionResult> ApprovePaymentRequest(Guid id)
    {
        var req = await _context.PaymentRequests.FirstOrDefaultAsync(p => p.Id == id);
        if (req == null) return NotFound();

        req.Status = PaymentRequestStatus.Approved;
        req.ApprovedAmount = req.RequestedAmount;
        req.PaymentDate = DateTime.UtcNow;

        // Automatically update actual cost on project
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == req.ProjectId);
        if (project != null)
        {
            project.ActualCost += req.ApprovedAmount;
            await _context.SaveChangesAsync();
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã duyệt Đề nghị thanh toán & cập nhật chi phí thực tế dự án.", req });
    }

    [HttpGet("cost-overrun-analysis/{projectId}")]
    public async Task<IActionResult> GetCostOverrunAnalysis(Guid projectId)
    {
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId);
        if (project == null) return NotFound();

        decimal budget = project.Budget;
        decimal actualCost = project.ActualCost;
        decimal variance = actualCost - budget;
        bool isOverrun = actualCost > budget;
        decimal overrunPercentage = budget > 0 ? Math.Round((variance / budget) * 100, 2) : 0;

        return Ok(new
        {
            project.ProjectCode,
            project.Name,
            budget,
            actualCost,
            variance,
            isOverrun,
            overrunPercentage,
            status = isOverrun ? "CẢNH BÁO: VƯỢT NGÂN SÁCH" : "AN TOÀN NGÂN SÁCH"
        });
    }
}
