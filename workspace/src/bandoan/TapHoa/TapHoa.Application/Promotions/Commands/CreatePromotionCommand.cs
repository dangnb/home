using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Promotions.Commands;

public class CreatePromotionCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public PromotionType Type { get; set; }
    public decimal MinOrderAmount { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal DiscountValue { get; set; }
    public int? BuyQuantity { get; set; }
    public int? GetQuantity { get; set; }
    public Guid? TargetProductId { get; set; }
    public string? CouponCode { get; set; }
    public int? MaxUsageCount { get; set; }
    public Guid? ApplicableCategoryId { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
}

public class CreatePromotionCommandHandler : IRequestHandler<CreatePromotionCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreatePromotionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreatePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = new Promotion(
            request.Name,
            request.Description,
            request.Type,
            request.MinOrderAmount,
            request.StartDate,
            request.EndDate,
            request.DiscountValue,
            request.BuyQuantity,
            request.GetQuantity,
            request.TargetProductId,
            request.CouponCode,
            request.MaxUsageCount,
            request.ApplicableCategoryId,
            request.MaxDiscountAmount
        );

        _context.Promotions.Add(promotion);
        await _context.SaveChangesAsync(cancellationToken);

        return promotion.Id;
    }
}
