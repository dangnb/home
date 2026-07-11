using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Promotions.DTOs;

namespace TapHoa.Application.Promotions.Queries;

public class GetPagedPromotionsQuery : IRequest<PagedResult<PromotionDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
}

public class GetPagedPromotionsQueryHandler : IRequestHandler<GetPagedPromotionsQuery, PagedResult<PromotionDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPagedPromotionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<PromotionDto>> Handle(GetPagedPromotionsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Promotions.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(searchTerm));
        }

        query = query.OrderByDescending(x => x.CreatedDate);

        var count = await query.CountAsync(cancellationToken);
        
        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
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

        return new PagedResult<PromotionDto>(items, count, request.PageNumber, request.PageSize);
    }
}
