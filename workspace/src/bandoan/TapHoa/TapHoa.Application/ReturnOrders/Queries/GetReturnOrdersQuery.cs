using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Interfaces;
using TapHoa.Application.ReturnOrders.DTOs;

namespace TapHoa.Application.ReturnOrders.Queries;

public class GetReturnOrdersQuery : IRequest<PagedResult<ReturnOrderDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
}

public class GetReturnOrdersQueryHandler : IRequestHandler<GetReturnOrdersQuery, PagedResult<ReturnOrderDto>>
{
    private readonly IApplicationDbContext _context;

    public GetReturnOrdersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<ReturnOrderDto>> Handle(GetReturnOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.ReturnOrders
            .Include(r => r.OriginalOrder)
                .ThenInclude(o => o!.Customer)
            .Include(r => r.ReturnOrderDetails)
                .ThenInclude(d => d.Product)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(r => r.ReturnCode.Contains(request.SearchTerm) || 
                                     r.OriginalOrder!.OrderCode.Contains(request.SearchTerm));
        }

        query = query.OrderByDescending(r => r.ReturnDate);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query.Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(r => new ReturnOrderDto
            {
                Id = r.Id,
                ReturnCode = r.ReturnCode,
                OriginalOrderId = r.OriginalOrderId,
                OriginalOrderCode = r.OriginalOrder != null ? r.OriginalOrder.OrderCode : string.Empty,
                CustomerName = r.OriginalOrder != null && r.OriginalOrder.Customer != null ? r.OriginalOrder.Customer.FullName : "Khách lẻ",
                ReturnDate = r.ReturnDate,
                Reason = r.Reason,
                Status = r.Status,
                RefundAmount = r.RefundAmount,
                CreatedBy = r.CreatedBy,
                Details = r.ReturnOrderDetails.Select(d => new ReturnOrderDetailDto
                {
                    Id = d.Id,
                    ProductId = d.ProductId,
                    ProductName = d.Product != null ? d.Product.Name : "Sản phẩm không tồn tại",
                    Unit = d.Product != null ? d.Product.Unit : string.Empty,
                    Quantity = d.Quantity,
                    RefundPrice = d.RefundPrice,
                    SubTotal = d.SubTotal
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<ReturnOrderDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
