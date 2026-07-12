using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Promotions.DTOs;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Promotions.Queries;

public class CartItemInput
{
    public Guid ProductId { get; set; }
    public Guid? CategoryId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class ApplicablePromotionResult
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public PromotionType Type { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal CalculatedDiscount { get; set; } // Actual discount amount for this cart
    public string? CouponCode { get; set; }
}

public class CalculateApplicablePromotionsQuery : IRequest<List<ApplicablePromotionResult>>
{
    public List<CartItemInput> Items { get; set; } = new();
    public decimal SubTotal { get; set; }
}

public class CalculateApplicablePromotionsQueryHandler : IRequestHandler<CalculateApplicablePromotionsQuery, List<ApplicablePromotionResult>>
{
    private readonly IApplicationDbContext _context;

    public CalculateApplicablePromotionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ApplicablePromotionResult>> Handle(CalculateApplicablePromotionsQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;

        // Get all active promotions that are within date range
        var activePromotions = await _context.Promotions
            .AsNoTracking()
            .Where(p => p.IsActive
                        && (p.StartDate == null || p.StartDate <= now)
                        && (p.EndDate == null || p.EndDate >= now)
                        && (p.MaxUsageCount == null || p.CurrentUsageCount < p.MaxUsageCount)
                        && p.MinOrderAmount <= request.SubTotal)
            .ToListAsync(cancellationToken);

        // Filter out CouponCode type — those require explicit code entry
        var autoPromotions = activePromotions
            .Where(p => p.Type != PromotionType.CouponCode && string.IsNullOrEmpty(p.CouponCode))
            .ToList();

        var results = new List<ApplicablePromotionResult>();
        var cartCategoryIds = request.Items
            .Where(i => i.CategoryId.HasValue)
            .Select(i => i.CategoryId!.Value)
            .Distinct()
            .ToHashSet();

        var cartProductIds = request.Items
            .Select(i => i.ProductId)
            .Distinct()
            .ToHashSet();

        foreach (var promo in autoPromotions)
        {
            // Check TargetProductId filter
            if (promo.TargetProductId.HasValue && !cartProductIds.Contains(promo.TargetProductId.Value))
                continue;

            // Check CategoryDiscount filter
            if (promo.Type == PromotionType.CategoryDiscount
                && promo.ApplicableCategoryId.HasValue 
                && !cartCategoryIds.Contains(promo.ApplicableCategoryId.Value))
                continue;

            decimal calculatedDiscount = promo.CalculateDiscount(request.SubTotal);

            if (calculatedDiscount > 0)
            {
                results.Add(new ApplicablePromotionResult
                {
                    Id = promo.Id,
                    Name = promo.Name,
                    Description = promo.Description,
                    Type = promo.Type,
                    DiscountValue = promo.DiscountValue,
                    CalculatedDiscount = calculatedDiscount,
                    CouponCode = promo.CouponCode
                });
            }
        }

        // Sort by highest discount first
        return results.OrderByDescending(r => r.CalculatedDiscount).ToList();
    }
}
