using Dapper;
using MediatR;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Common.Extensions;
using System.Text.Json.Serialization;
using TapHoa.Application.Orders.DTOs;

namespace TapHoa.Application.Orders.Queries.GetCustomerOrders;

public record GetCustomerOrdersQuery(Guid CustomerId, int PageIndex, int PageSize) : IRequest<PagedResult<OrderDto>>;

public class GetCustomerOrdersQueryHandler : IRequestHandler<GetCustomerOrdersQuery, PagedResult<OrderDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCustomerOrdersQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<PagedResult<OrderDto>> Handle(GetCustomerOrdersQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var countSql = @"
            SELECT COUNT(*) 
            FROM Orders o
            WHERE o.IsDeleted = 0 
              AND o.CustomerId = @CustomerId;";

        var parameters = new
        {
            CustomerId = request.CustomerId,
            PageSize = request.PageSize,
            Offset = (request.PageIndex - 1) * request.PageSize
        };

        var dataSql = @"
            SELECT 
                o.Id, o.Code, o.OrderDate, o.TotalAmount, o.DiscountAmount, o.FinalAmount,
                o.PaymentMethod, o.Status, o.PaymentStatus, o.Notes,
                o.CustomerId, c.FullName AS CustomerName, c.PhoneNumber AS CustomerPhone, c.Address AS CustomerAddress
            FROM Orders o
            LEFT JOIN Customers c ON o.CustomerId = c.Id
            WHERE o.IsDeleted = 0 
              AND o.CustomerId = @CustomerId
            ORDER BY o.CreatedDate DESC
            LIMIT @PageSize OFFSET @Offset;";

        var result = await connection.QueryPagedAsync<OrderDto>(
            countSql, 
            dataSql, 
            parameters, 
            request.PageIndex, 
            request.PageSize);
            
        // Fetch order details for these orders
        if (result.Items.Any())
        {
            var orderIds = result.Items.Select(x => x.Id).ToList();
            var detailsSql = @"
                SELECT od.*, p.Name AS ProductName, p.MainImageUrl AS ProductImageUrl 
                FROM OrderDetails od
                LEFT JOIN Products p ON od.ProductId = p.Id
                WHERE od.OrderId IN @OrderIds;";
                
            var details = await connection.QueryAsync<OrderDetailDto>(detailsSql, new { OrderIds = orderIds });
            
            foreach (var order in result.Items)
            {
                order.Details = details.Where(d => d.OrderId == order.Id).ToList();
            }
        }
        
        return result;
    }
}
