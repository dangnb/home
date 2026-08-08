using System;
using System.Collections.Generic;
using ConsBase.Domain.Common;
using ConsBase.Domain.Enums;

namespace ConsBase.Domain.Entities;

public class Quotation : BaseEntity
{
    public string QuotationCode { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public Guid? OpportunityId { get; set; }
    public int Version { get; set; } = 1;
    public string Title { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal FinalAmount { get; set; }
    public QuotationStatus Status { get; set; } = QuotationStatus.Draft;
    public string Notes { get; set; } = string.Empty;

    public List<QuotationItem> Items { get; set; } = new();
}

public class QuotationItem : BaseEntity
{
    public Guid QuotationId { get; set; }
    public string Category { get; set; } = string.Empty; // Nhóm công việc
    public string WorkName { get; set; } = string.Empty;  // Tên công việc/vật tư
    public string Unit { get; set; } = string.Empty;      // Đơn vị tính (m2, m3, bộ...)
    
    // Bổ sung các thông số đo đạc BOQ Excel
    public decimal Length { get; set; } = 1;      // Dài
    public decimal Width { get; set; } = 1;       // Rộng
    public decimal Height { get; set; } = 1;      // Cao
    public decimal Quantity { get; set; } = 1;    // Số lượng
    public decimal Coefficient { get; set; } = 1; // Hệ số
    
    // Tự động tính Khối lượng = Dài * Rộng * Cao * Số lượng * Hệ số
    public decimal TotalVolume => Length * Width * Height * Quantity * Coefficient;
    
    public decimal UnitPrice { get; set; }        // Đơn giá
    public decimal TotalPrice => TotalVolume * UnitPrice; // Thành tiền
    public string Formula { get; set; } = "Length * Width * Height * Quantity * Coefficient";
    public string Notes { get; set; } = string.Empty;
}
