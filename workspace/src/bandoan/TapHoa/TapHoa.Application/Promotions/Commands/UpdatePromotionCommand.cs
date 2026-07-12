using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Promotions.Commands;

public class UpdatePromotionCommand : IRequest<bool>
{
    public Guid Id { get; set; }
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

public class UpdatePromotionCommandHandler : IRequestHandler<UpdatePromotionCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdatePromotionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdatePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = await _context.Promotions.FindAsync(new object[] { request.Id }, cancellationToken);

        if (promotion == null)
            throw new ApplicationException("Promotion not found.");

        promotion.Update(
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

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
