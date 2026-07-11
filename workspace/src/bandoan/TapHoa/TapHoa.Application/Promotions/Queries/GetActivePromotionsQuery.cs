using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Promotions.DTOs;

namespace TapHoa.Application.Promotions.Queries;

public class GetActivePromotionsQuery : IRequest<List<PromotionDto>>
{
}

public class GetActivePromotionsQueryHandler : IRequestHandler<GetActivePromotionsQuery, List<PromotionDto>>
{
    private readonly IApplicationDbContext _context;

    public GetActivePromotionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PromotionDto>> Handle(GetActivePromotionsQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var items = await _context.Promotions
            .AsNoTracking()
            .Where(x => x.IsActive 
                        && (x.StartDate == null || x.StartDate <= now)
                        && (x.EndDate == null || x.EndDate >= now))
            .OrderByDescending(x => x.CreatedDate)
            .Select(x => new PromotionDto
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
                TargetProductId = x.TargetProductId
            })
            .ToListAsync(cancellationToken);

        return items;
    }
}
