using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public enum PromotionType
{
    PercentageOff = 1,
    FixedAmountOff = 2,
    BuyXGetY = 3
}

public class Promotion : BaseAuditableEntity<Guid>
{
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public PromotionType Type { get; private set; }
    
    // Conditions
    public decimal MinOrderAmount { get; private set; }
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public bool IsActive { get; private set; }

    // Values based on Type
    public decimal DiscountValue { get; private set; } // % off or Fixed Amount off
    public int? BuyQuantity { get; private set; } // X in Buy X Get Y
    public int? GetQuantity { get; private set; } // Y in Buy X Get Y
    public Guid? TargetProductId { get; private set; } // If promotion applies to a specific product (optional)

    private Promotion() { }

    public Promotion(
        string name, 
        string? description, 
        PromotionType type, 
        decimal minOrderAmount, 
        DateTime? startDate, 
        DateTime? endDate,
        decimal discountValue = 0,
        int? buyQuantity = null,
        int? getQuantity = null,
        Guid? targetProductId = null)
    {
        Name = name;
        Description = description;
        Type = type;
        MinOrderAmount = minOrderAmount;
        StartDate = startDate;
        EndDate = endDate;
        IsActive = true;
        
        DiscountValue = discountValue;
        BuyQuantity = buyQuantity;
        GetQuantity = getQuantity;
        TargetProductId = targetProductId;
    }

    public void Update(
        string name, 
        string? description, 
        PromotionType type, 
        decimal minOrderAmount, 
        DateTime? startDate, 
        DateTime? endDate,
        decimal discountValue = 0,
        int? buyQuantity = null,
        int? getQuantity = null,
        Guid? targetProductId = null)
    {
        Name = name;
        Description = description;
        Type = type;
        MinOrderAmount = minOrderAmount;
        StartDate = startDate;
        EndDate = endDate;
        DiscountValue = discountValue;
        BuyQuantity = buyQuantity;
        GetQuantity = getQuantity;
        TargetProductId = targetProductId;
    }

    public void SetStatus(bool isActive)
    {
        IsActive = isActive;
    }
}
