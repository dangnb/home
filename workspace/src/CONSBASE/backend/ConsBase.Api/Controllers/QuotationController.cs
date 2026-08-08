using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using ConsBase.Domain.Entities;
using ConsBase.Domain.Enums;
using ConsBase.Infrastructure.Persistence;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuotationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public QuotationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetQuotations()
    {
        var quotations = await _context.Quotations
            .Include(q => q.Customer)
            .Include(q => q.Items)
            .ToListAsync();
        return Ok(quotations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuotationById(Guid id)
    {
        var quotation = await _context.Quotations
            .Include(q => q.Customer)
            .Include(q => q.Items)
            .FirstOrDefaultAsync(q => q.Id == id);
        
        if (quotation == null) return NotFound();
        return Ok(quotation);
    }

    [HttpPost]
    public async Task<IActionResult> CreateQuotation([FromBody] Quotation quotation)
    {
        quotation.QuotationCode = $"BG-{DateTime.Now:yyyyMM}-{Random.Shared.Next(100, 999)}";
        quotation.Version = 1;
        quotation.Status = QuotationStatus.Draft;
        _context.Quotations.Add(quotation);
        await _context.SaveChangesAsync();
        return Ok(quotation);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddQuotationItem([FromBody] QuotationItem item)
    {
        _context.QuotationItems.Add(item);
        await _context.SaveChangesAsync();

        // Recalculate quotation total
        await RecalculateQuotationTotal(item.QuotationId);

        return Ok(item);
    }

    [HttpDelete("items/{itemId}")]
    public async Task<IActionResult> DeleteQuotationItem(Guid itemId)
    {
        var item = await _context.QuotationItems.FindAsync(itemId);
        if (item == null) return NotFound();

        var quotationId = item.QuotationId;
        _context.QuotationItems.Remove(item);
        await _context.SaveChangesAsync();

        await RecalculateQuotationTotal(quotationId);
        return Ok(new { message = "Đã xóa hạng mục BOQ." });
    }

    [HttpPost("{id}/import-excel")]
    public async Task<IActionResult> ImportExcel(Guid id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Vui lòng tải lên file Excel (.xlsx) hợp lệ.");

        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var quotation = await _context.Quotations.Include(q => q.Items).FirstOrDefaultAsync(q => q.Id == id);
        if (quotation == null) return NotFound("Báo giá không tồn tại.");

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        using var package = new ExcelPackage(stream);
        var worksheet = package.Workbook.Worksheets.FirstOrDefault();
        if (worksheet == null) return BadRequest("File Excel không có dữ liệu sheet.");

        int rowCount = worksheet.Dimension?.Rows ?? 0;
        int importedCount = 0;

        for (int row = 2; row <= rowCount; row++)
        {
            var category = worksheet.Cells[row, 1].Value?.ToString();
            var workName = worksheet.Cells[row, 2].Value?.ToString();
            if (string.IsNullOrWhiteSpace(workName)) continue;

            var unit = worksheet.Cells[row, 3].Value?.ToString() ?? "m3";
            decimal.TryParse(worksheet.Cells[row, 4].Value?.ToString(), out decimal length);
            decimal.TryParse(worksheet.Cells[row, 5].Value?.ToString(), out decimal width);
            decimal.TryParse(worksheet.Cells[row, 6].Value?.ToString(), out decimal height);
            decimal.TryParse(worksheet.Cells[row, 7].Value?.ToString(), out decimal quantity);
            decimal.TryParse(worksheet.Cells[row, 8].Value?.ToString(), out decimal coefficient);
            decimal.TryParse(worksheet.Cells[row, 9].Value?.ToString(), out decimal unitPrice);

            var item = new QuotationItem
            {
                QuotationId = id,
                Category = string.IsNullOrWhiteSpace(category) ? "HẠNG MỤC BỔ SUNG" : category,
                WorkName = workName,
                Unit = unit,
                Length = length > 0 ? length : 1,
                Width = width > 0 ? width : 1,
                Height = height > 0 ? height : 1,
                Quantity = quantity > 0 ? quantity : 1,
                Coefficient = coefficient > 0 ? coefficient : 1,
                UnitPrice = unitPrice
            };

            _context.QuotationItems.Add(item);
            importedCount++;
        }

        await _context.SaveChangesAsync();
        await RecalculateQuotationTotal(id);

        return Ok(new { message = $"Đã nhập thành công {importedCount} hạng mục BOQ từ file Excel.", importedCount });
    }

    [HttpGet("{id}/export-excel")]
    public async Task<IActionResult> ExportExcel(Guid id)
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var quotation = await _context.Quotations
            .Include(q => q.Customer)
            .Include(q => q.Items)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quotation == null) return NotFound();

        using var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add("Báo giá BOQ");

        worksheet.Cells[1, 1].Value = "CONSBASE ENTERPRISE - BẢNG BÁO GIÁ & BOQ KHỐI LƯỢNG";
        worksheet.Cells[1, 1].Style.Font.Bold = true;
        worksheet.Cells[1, 1].Style.Font.Size = 14;

        worksheet.Cells[2, 1].Value = $"Mã báo giá: {quotation.QuotationCode} | Khách hàng: {quotation.Customer?.Name}";
        
        string[] headers = { "STT", "Hạng mục", "Tên công việc/vật tư", "ĐVT", "Dài (m)", "Rộng (m)", "Cao (m)", "Số lượng", "Hệ số", "Khối lượng", "Đơn giá (VNĐ)", "Thành tiền (VNĐ)" };
        for (int c = 0; c < headers.Length; c++)
        {
            worksheet.Cells[4, c + 1].Value = headers[c];
            worksheet.Cells[4, c + 1].Style.Font.Bold = true;
        }

        int row = 5;
        int stt = 1;
        foreach (var item in quotation.Items)
        {
            worksheet.Cells[row, 1].Value = stt++;
            worksheet.Cells[row, 2].Value = item.Category;
            worksheet.Cells[row, 3].Value = item.WorkName;
            worksheet.Cells[row, 4].Value = item.Unit;
            worksheet.Cells[row, 5].Value = item.Length;
            worksheet.Cells[row, 6].Value = item.Width;
            worksheet.Cells[row, 7].Value = item.Height;
            worksheet.Cells[row, 8].Value = item.Quantity;
            worksheet.Cells[row, 9].Value = item.Coefficient;
            worksheet.Cells[row, 10].Value = item.TotalVolume;
            worksheet.Cells[row, 11].Value = item.UnitPrice;
            worksheet.Cells[row, 12].Value = item.TotalPrice;
            row++;
        }

        worksheet.Cells[row + 1, 11].Value = "TỔNG CỘNG:";
        worksheet.Cells[row + 1, 11].Style.Font.Bold = true;
        worksheet.Cells[row + 1, 12].Value = quotation.FinalAmount;
        worksheet.Cells[row + 1, 12].Style.Font.Bold = true;

        var fileBytes = package.GetAsByteArray();
        return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"BOQ_{quotation.QuotationCode}.xlsx");
    }

    private async Task RecalculateQuotationTotal(Guid quotationId)
    {
        var quotation = await _context.Quotations.Include(q => q.Items).FirstOrDefaultAsync(q => q.Id == quotationId);
        if (quotation != null)
        {
            quotation.TotalAmount = quotation.Items.Sum(i => i.TotalPrice);
            quotation.FinalAmount = quotation.TotalAmount * (1 - (quotation.DiscountPercent / 100));
            await _context.SaveChangesAsync();
        }
    }
}
