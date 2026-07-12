using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Promotions.DTOs;

namespace TapHoa.Application.Promotions.Queries;

public class GetPromotionByIdQuery : IRequest<PromotionDto?>
{
    public Guid Id { get; set; }
}

public class GetPromotionByIdQueryHandler : IRequestHandler<GetPromotionByIdQuery, PromotionDto?>
{
    private readonly IApplicationDbContext _context;

    public GetPromotionByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PromotionDto?> Handle(GetPromotionByIdQuery request, CancellationToken cancellationToken)
    {
        var x = await _context.Promotions
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (x == null) return null;

        return new PromotionDto
        {
            Id = x.Id,
            Name = x.Name,
            Description = x.Description,
            Type = x.Type,
            MinOrderAmount = x.MinOrderAmount,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            IsActive = x.IsActive,
            DiscountValue = x.DiscountValue,
            BuyQuantity = x.BuyQuantity,
            GetQuantity = x.GetQuantity,
            TargetProductId = x.TargetProductId,
            CouponCode = x.CouponCode,
            MaxUsageCount = x.MaxUsageCount,
            CurrentUsageCount = x.CurrentUsageCount,
            ApplicableCategoryId = x.ApplicableCategoryId,
            MaxDiscountAmount = x.MaxDiscountAmount
        };
    }
}
