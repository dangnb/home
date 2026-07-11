using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Orders.Queries;

public record OrderDto(
    Guid Id,
    string OrderCode,
    Guid? CustomerId,
    string? CustomerName,
    DateTime OrderDate,
    decimal SubTotal,
    decimal DiscountAmount,
    decimal TotalAmount,
    decimal AmountPaid,
    PaymentMethod PaymentMethod,
    OrderStatus Status,
    string CreatedBy,
    string? Notes
);

public record GetOrdersQuery : IRequest<PagedResult<OrderDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? SearchTerm { get; init; }
    public DateTime? FromDate { get; init; }
    public DateTime? ToDate { get; init; }
    public OrderStatus? Status { get; init; }
}

public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, PagedResult<OrderDto>>
{
    private readonly IApplicationDbContext _context;

    public GetOrdersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        var rawCount = await _context.Orders.IgnoreQueryFilters().CountAsync(cancellationToken);
        Console.WriteLine($"[DEBUG] Total raw orders in DB (ignoring filters): {rawCount}");

        var query = _context.Orders
            .Include(o => o.Customer)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(x => 
                x.OrderCode.ToLower().Contains(searchTerm) ||
                (x.Customer != null && x.Customer.FullName.ToLower().Contains(searchTerm))
            );
        }

        if (request.FromDate.HasValue)
        {
            query = query.Where(x => x.OrderDate >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(x => x.OrderDate <= request.ToDate.Value);
        }

        if (request.Status.HasValue)
        {
            query = query.Where(x => x.Status == request.Status.Value);
        }

        query = query.OrderByDescending(x => x.OrderDate);

        var totalCount = await query.CountAsync(cancellationToken);
        
        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new OrderDto(
                x.Id,
                x.OrderCode,
                x.CustomerId,
                x.Customer != null ? x.Customer.FullName : null,
                x.OrderDate,
                x.SubTotal,
                x.DiscountAmount,
                x.TotalAmount,
                x.AmountPaid,
                x.PaymentMethod,
                x.Status,
                x.CreatedBy,
                x.Notes
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<OrderDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
