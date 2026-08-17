using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsBase.Domain.Entities;
using ConsBase.Domain.Enums;
using ConsBase.Infrastructure.Persistence;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModulesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ModulesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // --- MATERIALS & WAREHOUSES ---
    [HttpGet("materials/requisitions")]
    public async Task<IActionResult> GetMaterialRequisitions()
    {
        var reqs = await _context.MaterialRequisitions.Include(m => m.Project).Include(m => m.Items).ToListAsync();
        return Ok(reqs);
    }

    [HttpPost("materials/requisitions")]
    public async Task<IActionResult> CreateMaterialRequisition([FromBody] MaterialRequisition req)
    {
        req.RequisitionCode = $"DX-VT-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(100, 999)}";
        req.Status = MaterialRequisitionStatus.PendingApproval;
        _context.MaterialRequisitions.Add(req);
        await _context.SaveChangesAsync();
        return Ok(req);
    }

    [HttpGet("materials/warehouses")]
    public async Task<IActionResult> GetWarehouses()
    {
        var warehouses = await _context.Warehouses.ToListAsync();
        return Ok(warehouses);
    }

    // --- CHANGE ORDERS (PHÁT SINH) ---
    [HttpGet("change-orders")]
    public async Task<IActionResult> GetChangeOrders()
    {
        var orders = await _context.ChangeOrders.Include(c => c.Project).ToListAsync();
        return Ok(orders);
    }

    [HttpPost("change-orders")]
    public async Task<IActionResult> CreateChangeOrder([FromBody] ChangeOrder order)
    {
        order.ChangeOrderCode = $"VO-PS-{DateTime.Now:yyyyMM}-{Random.Shared.Next(100, 999)}";
        order.Status = ChangeOrderStatus.Submitted;
        _context.ChangeOrders.Add(order);
        await _context.SaveChangesAsync();
        return Ok(order);
    }

    [HttpPost("change-orders/{id}/approve")]
    public async Task<IActionResult> ApproveChangeOrder(Guid id)
    {
        var order = await _context.ChangeOrders.FirstOrDefaultAsync(c => c.Id == id);
        if (order == null) return NotFound();

        order.Status = ChangeOrderStatus.Approved;

        // Auto update project budget & timeline extension
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == order.ProjectId);
        if (project != null)
        {
            project.Budget += order.AdditionalCost;
            project.EndDate = project.EndDate.AddDays(order.ExtensionDays);
            await _context.SaveChangesAsync();
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã phê duyệt Phụ lục phát sinh VO & tự động cập nhật Ngân sách / Tiến độ dự án.", order });
    }

    // --- ACCEPTANCE & WARRANTY ---
    [HttpGet("acceptance-records")]
    public async Task<IActionResult> GetAcceptanceRecords()
    {
        var records = await _context.AcceptanceRecords.Include(a => a.Project).ToListAsync();
        return Ok(records);
    }

    [HttpPost("acceptance-records")]
    public async Task<IActionResult> CreateAcceptanceRecord([FromBody] AcceptanceRecord record)
    {
        record.RecordCode = $"NT- nghiệm thu-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(100, 999)}";
        record.Status = AcceptanceStatus.Accepted;
        _context.AcceptanceRecords.Add(record);
        await _context.SaveChangesAsync();
        return Ok(record);
    }

    // --- DOCUMENTS (DMS) ---
    [HttpGet("documents")]
    public async Task<IActionResult> GetDocuments()
    {
        var docs = await _context.DocumentRecords.ToListAsync();
        return Ok(docs);
    }

    [HttpPost("documents")]
    public async Task<IActionResult> UploadDocument([FromBody] DocumentRecord doc)
    {
        doc.Version = 1;
        _context.DocumentRecords.Add(doc);
        await _context.SaveChangesAsync();
        return Ok(doc);
    }

    // --- QC & HSE INCIDENTS ---
    [HttpGet("qchse")]
    public async Task<IActionResult> GetQcHseIncidents()
    {
        var incidents = await _context.QcHseIncidents.Include(q => q.Project).ToListAsync();
        return Ok(incidents);
    }

    [HttpPost("qchse")]
    public async Task<IActionResult> ReportQcHseIncident([FromBody] QcHseIncident incident)
    {
        incident.ReportedDate = DateTime.UtcNow;
        incident.IsResolved = false;
        _context.QcHseIncidents.Add(incident);
        await _context.SaveChangesAsync();
        return Ok(incident);
    }

    [HttpPost("qchse/{id}/resolve")]
    public async Task<IActionResult> ResolveQcHseIncident(Guid id, [FromBody] string correctiveAction)
    {
        var incident = await _context.QcHseIncidents.FirstOrDefaultAsync(q => q.Id == id);
        if (incident == null) return NotFound();

        incident.IsResolved = true;
        incident.CorrectiveAction = correctiveAction;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã cập nhật phương án khắc phục sự cố QC/HSE.", incident });
    }

    // --- SUBCONTRACTORS ---
    [HttpGet("subcontractors")]
    public async Task<IActionResult> GetSubcontractors()
    {
        var subs = await _context.Subcontractors.ToListAsync();
        return Ok(subs);
    }

    [HttpPost("subcontractors")]
    public async Task<IActionResult> CreateSubcontractor([FromBody] Subcontractor sub)
    {
        sub.Code = $"NTP-{DateTime.Now:yyyy}-{Random.Shared.Next(100, 999)}";
        _context.Subcontractors.Add(sub);
        await _context.SaveChangesAsync();
        return Ok(sub);
    }
}
