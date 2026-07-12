using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public enum PromotionType
{
    PercentageOff = 1,
    FixedAmountOff = 2,
    BuyXGetY = 3,
    CouponCode = 4,
    CategoryDiscount = 5
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

    // --- Advanced Fields ---
    public string? CouponCode { get; private set; } // Unique coupon code, e.g. "SALE50K"
    public int? MaxUsageCount { get; private set; } // Max number of times this promo can be used (null = unlimited)
    public int CurrentUsageCount { get; private set; } // How many times it has been used
    public Guid? ApplicableCategoryId { get; private set; } // Apply to a specific product category
    public decimal? MaxDiscountAmount { get; private set; } // Cap for percentage discounts, e.g. 20% but max 100k

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
        Guid? targetProductId = null,
        string? couponCode = null,
        int? maxUsageCount = null,
        Guid? applicableCategoryId = null,
        decimal? maxDiscountAmount = null)
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

        CouponCode = couponCode?.ToUpper().Trim();
        MaxUsageCount = maxUsageCount;
        CurrentUsageCount = 0;
        ApplicableCategoryId = applicableCategoryId;
        MaxDiscountAmount = maxDiscountAmount;
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
        Guid? targetProductId = null,
        string? couponCode = null,
        int? maxUsageCount = null,
        Guid? applicableCategoryId = null,
        decimal? maxDiscountAmount = null)
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
        CouponCode = couponCode?.ToUpper().Trim();
        MaxUsageCount = maxUsageCount;
        ApplicableCategoryId = applicableCategoryId;
        MaxDiscountAmount = maxDiscountAmount;
    }

    public void SetStatus(bool isActive)
    {
        IsActive = isActive;
    }

    /// <summary>
    /// Check if this promotion can still be used (active, within date range, within usage limit).
    /// </summary>
    public bool CanBeUsed()
    {
        if (!IsActive) return false;

        var now = DateTime.UtcNow;
        if (StartDate.HasValue && StartDate.Value > now) return false;
        if (EndDate.HasValue && EndDate.Value < now) return false;
        if (MaxUsageCount.HasValue && CurrentUsageCount >= MaxUsageCount.Value) return false;

        return true;
    }

    /// <summary>
    /// Increment usage count after a successful order.
    /// </summary>
    public void IncrementUsage()
    {
        CurrentUsageCount++;
    }

    /// <summary>
    /// Calculate the actual discount amount for a given subtotal.
    /// </summary>
    public decimal CalculateDiscount(decimal subTotal)
    {
        if (subTotal < MinOrderAmount) return 0;

        decimal discount = Type switch
        {
            PromotionType.PercentageOff or PromotionType.CategoryDiscount =>
                subTotal * (DiscountValue / 100),
            PromotionType.FixedAmountOff or PromotionType.CouponCode =>
                DiscountValue,
            _ => 0
        };

        // Apply max discount cap for percentage-based promotions
        if (MaxDiscountAmount.HasValue && discount > MaxDiscountAmount.Value)
        {
            discount = MaxDiscountAmount.Value;
        }

        // Never discount more than the subtotal
        return Math.Min(discount, subTotal);
    }
}
