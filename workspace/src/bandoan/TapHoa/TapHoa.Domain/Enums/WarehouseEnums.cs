namespace TapHoa.Domain.Enums;

public enum TransactionType
{
    Inbound = 1,      // Import goods from suppliers
    Outbound = 2,     // Sell goods to customers / Export
    Adjustment = 3,   // Audit adjustments
    Transfer = 4,     // Transfer between warehouses/branches
    Wastage = 5       // Damaged / Expired goods
}

public enum TransactionStatus
{
    Draft = 1,
    PendingApproval = 2,
    Completed = 3,
    Cancelled = 4
}
