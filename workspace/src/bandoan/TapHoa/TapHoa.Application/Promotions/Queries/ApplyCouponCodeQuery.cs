using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Promotions.Queries;

public class ApplyCouponCodeQuery : IRequest<ApplyCouponCodeResult>
{
    public string CouponCode { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
}

public class ApplyCouponCodeResult
{
    public bool IsValid { get; set; }
    public string? ErrorMessage { get; set; }
    public Guid? PromotionId { get; set; }
    public string? PromotionName { get; set; }
    public decimal CalculatedDiscount { get; set; }
}

public class ApplyCouponCodeQueryHandler : IRequestHandler<ApplyCouponCodeQuery, ApplyCouponCodeResult>
{
    private readonly IApplicationDbContext _context;

    public ApplyCouponCodeQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApplyCouponCodeResult> Handle(ApplyCouponCodeQuery request, CancellationToken cancellationToken)
    {
        var code = request.CouponCode.Trim().ToUpper();

        var promotion = await _context.Promotions
            .FirstOrDefaultAsync(p => p.CouponCode == code, cancellationToken);

        if (promotion == null)
        {
            return new ApplyCouponCodeResult
            {
                IsValid = false,
                ErrorMessage = "Mã khuyến mãi không tồn tại."
            };
        }

        if (!promotion.CanBeUsed())
        {
            string reason = "Mã khuyến mãi không còn hiệu lực.";

            if (promotion.MaxUsageCount.HasValue && promotion.CurrentUsageCount >= promotion.MaxUsageCount.Value)
                reason = "Mã khuyến mãi đã hết lượt sử dụng.";
            else if (!promotion.IsActive)
                reason = "Mã khuyến mãi đã bị vô hiệu hóa.";

            return new ApplyCouponCodeResult
            {
                IsValid = false,
                ErrorMessage = reason
            };
        }

        if (request.SubTotal < promotion.MinOrderAmount)
        {
            return new ApplyCouponCodeResult
            {
                IsValid = false,
                ErrorMessage = $"Đơn hàng cần tối thiểu {promotion.MinOrderAmount:N0}₫ để áp dụng mã này."
            };
        }

        decimal discount = promotion.CalculateDiscount(request.SubTotal);

        return new ApplyCouponCodeResult
        {
            IsValid = true,
            PromotionId = promotion.Id,
            PromotionName = promotion.Name,
            CalculatedDiscount = discount
        };
    }
}
