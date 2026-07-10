using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Application.Common.Models;

namespace TapHoa.Application.Warehouse.Queries.GetStockTakes;

public class GetStockTakesQuery : IRequest<PagedResult<StockTakeDto>>
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class StockTakeDto
{
    public Guid Id { get; set; }
    public string DocumentNo { get; set; } = string.Empty;
    public StockTakeStatus Status { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public int TotalLines { get; set; }
}



public class GetStockTakesQueryHandler : IRequestHandler<GetStockTakesQuery, PagedResult<StockTakeDto>>
{
    private readonly IApplicationDbContext _context;

    public GetStockTakesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<StockTakeDto>> Handle(GetStockTakesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.StockTakes.AsNoTracking();

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.CreatedDate)
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new StockTakeDto
            {
                Id = x.Id,
                DocumentNo = x.DocumentNo,
                Status = x.Status,
                Notes = x.Notes,
                CreatedDate = x.CreatedDate.GetValueOrDefault(),
                CreatedBy = x.CreatedBy ?? "System",
                TotalLines = x.Lines.Count
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<StockTakeDto>(items, totalCount, request.PageIndex, request.PageSize);
    }
}
