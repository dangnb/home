using SalesManagement.Domain.Enums;

namespace SalesManagement.Domain.Entities;

public class InventoryTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    
    public Guid WarehouseId { get; set; }
    public Warehouse? Warehouse { get; set; }

    public string Note { get; set; } = string.Empty;
    public TransactionStatus Status { get; set; } = TransactionStatus.DRAFT;

    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<TransactionDetail> Details { get; set; } = new List<TransactionDetail>();
}
