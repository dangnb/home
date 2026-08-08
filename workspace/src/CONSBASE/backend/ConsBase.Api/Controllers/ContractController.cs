using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsBase.Domain.Entities;
using ConsBase.Domain.Enums;
using ConsBase.Infrastructure.Persistence;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ContractController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetContracts()
    {
        var contracts = await _context.Contracts
            .Include(c => c.Customer)
            .Include(c => c.Quotation)
            .Include(c => c.PaymentTerms)
            .ToListAsync();
        return Ok(contracts);
    }

    [HttpPost("{id}/convert-to-project")]
    public async Task<IActionResult> ConvertToProject(Guid id)
    {
        var contract = await _context.Contracts.Include(c => c.Customer).FirstOrDefaultAsync(c => c.Id == id);
        if (contract == null) return NotFound("Hợp đồng không tồn tại.");

        if (contract.ProjectId.HasValue)
        {
            return BadRequest("Hợp đồng này đã được khởi tạo dự án duy nhất trước đó.");
        }

        // Create Project 1-to-1
        var project = new Project
        {
            ProjectCode = $"DA-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(100, 999)}",
            Name = $"Dự án theo HĐ: {contract.Title}",
            ContractId = contract.Id,
            CustomerId = contract.CustomerId,
            Budget = contract.TotalValue * 0.85m, // 85% budget estimation
            Status = ProjectStatus.InExecution,
            StartDate = contract.StartDate,
            EndDate = contract.EndDate
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        contract.ProjectId = project.Id;
        contract.Status = ContractStatus.Active;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Chuyển đổi thành công 1 Hợp đồng -> 1 Dự án duy nhất.", projectId = project.Id });
    }
}
