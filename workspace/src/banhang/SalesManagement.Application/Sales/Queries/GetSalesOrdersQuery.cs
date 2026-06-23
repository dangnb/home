using MediatR;
using Microsoft.EntityFrameworkCore;
using SalesManagement.Application.Interfaces;

namespace SalesManagement.Application.Sales.Queries;

public record SalesOrderSummaryDto(Guid Id, string Code, string CustomerName, DateTime OrderDate, string Status, decimal TotalAmount);

public record GetSalesOrdersQuery() : IRequest<List<SalesOrderSummaryDto>>;

public class GetSalesOrdersQueryHandler : IRequestHandler<GetSalesOrdersQuery, List<SalesOrderSummaryDto>>
{
    private readonly IApplicationDbContext _db;
    public GetSalesOrdersQueryHandler(IApplicationDbContext db) => _db = db;

    public async Task<List<SalesOrderSummaryDto>> Handle(GetSalesOrdersQuery request, CancellationToken cancellationToken)
    {
        return await _db.SalesOrders
            .Include(o => o.Customer)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new SalesOrderSummaryDto(
                o.Id,
                o.Code,
                o.Customer != null ? o.Customer.Name : "N/A",
                o.OrderDate,
                o.Status.ToString(),
                o.TotalAmount
            ))
            .ToListAsync(cancellationToken);
    }
}
