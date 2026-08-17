using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsBase.Domain.Entities;
using ConsBase.Domain.Enums;
using ConsBase.Infrastructure.Persistence;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CrmController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CrmController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers()
    {
        var customers = await _context.Customers.ToListAsync();
        return Ok(customers);
    }

    [HttpPost("customers")]
    public async Task<IActionResult> CreateCustomer([FromBody] Customer customer)
    {
        customer.Code = $"KH-{DateTime.Now:yyyy}-{Random.Shared.Next(100, 999)}";
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return Ok(customer);
    }

    [HttpGet("opportunities")]
    public async Task<IActionResult> GetOpportunities()
    {
        var opportunities = await _context.Opportunities
            .Include(o => o.Customer)
            .Include(o => o.AssignedUser)
            .ToListAsync();
        return Ok(opportunities);
    }

    [HttpPost("opportunities")]
    public async Task<IActionResult> CreateOpportunity([FromBody] Opportunity opp)
    {
        opp.Stage = OpportunityStage.Lead;
        _context.Opportunities.Add(opp);
        await _context.SaveChangesAsync();
        return Ok(opp);
    }

    [HttpPost("opportunities/{id}/convert-to-quotation")]
    public async Task<IActionResult> ConvertOpportunityToQuotation(Guid id)
    {
        var opp = await _context.Opportunities.Include(o => o.Customer).FirstOrDefaultAsync(o => o.Id == id);
        if (opp == null) return NotFound("Cơ hội kinh doanh không tồn tại.");

        opp.Stage = OpportunityStage.QuotationSent;

        // Auto create Quotation with BOQ items
        var quotation = new Quotation
        {
            QuotationCode = $"BG-{DateTime.Now:yyyyMM}-{Random.Shared.Next(100, 999)}",
            CustomerId = opp.CustomerId,
            OpportunityId = opp.Id,
            Title = $"Báo Giá Chi Tiết Theo Cơ Hội: {opp.Title}",
            Version = 1,
            TotalAmount = opp.EstimatedValue,
            DiscountPercent = 2,
            FinalAmount = opp.EstimatedValue * 0.98m,
            Status = QuotationStatus.Submitted,
            Notes = $"Báo giá tự động khởi tạo từ khảo sát ngày {opp.SurveyDate:dd/MM/yyyy}: {opp.SurveyNotes}"
        };

        _context.Quotations.Add(quotation);
        await _context.SaveChangesAsync();

        // Sample initial BOQ items based on survey
        var item1 = new QuotationItem
        {
            QuotationId = quotation.Id,
            Category = "A. HẠNG MỤC KHẢO SÁT & MÓNG",
            WorkName = "Đào hố móng & đổ bê tông lót M100",
            Unit = "m3",
            Length = 30, Width = 20, Height = 2.5m, Quantity = 1, Coefficient = 1,
            UnitPrice = 850000m
        };

        var item2 = new QuotationItem
        {
            QuotationId = quotation.Id,
            Category = "B. HẠNG MỤC THI CÔNG KẾT CẤU",
            WorkName = "Gia công & thi công bê tông cốt thép dầm cột",
            Unit = "m3",
            Length = 30, Width = 20, Height = 3.6m, Quantity = 5, Coefficient = 0.2m,
            UnitPrice = 2650000m
        };

        _context.QuotationItems.AddRange(item1, item2);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã chuyển đổi thành công Cơ hội -> Báo giá & BOQ chi tiết.", quotationId = quotation.Id });
    }
}
