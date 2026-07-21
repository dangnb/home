using Dapper;
using MediatR;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Common.Extensions;

namespace TapHoa.Application.Orders.Queries.GetCustomerOrders;

public class CustomerOrderDetailDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImageUrl { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal { get; set; }
}

public class CustomerOrderDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
    public int PaymentMethod { get; set; }
    public int Status { get; set; }
    public int PaymentStatus { get; set; }
    public string Notes { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerAddress { get; set; } = string.Empty;
    public List<CustomerOrderDetailDto> Details { get; set; } = new();
}

public record GetCustomerOrdersQuery(Guid CustomerId, int PageIndex, int PageSize) : IRequest<PagedResult<CustomerOrderDto>>;

public class GetCustomerOrdersQueryHandler : IRequestHandler<GetCustomerOrdersQuery, PagedResult<CustomerOrderDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCustomerOrdersQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<PagedResult<CustomerOrderDto>> Handle(GetCustomerOrdersQuery request, CancellationToken cancellationToken)
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
                o.Id, o.OrderCode as Code, o.OrderDate, o.TotalAmount, o.DiscountAmount, o.AmountPaid as FinalAmount,
                o.PaymentMethod, o.Status, 
                o.Notes,
                o.CustomerId, c.FullName AS CustomerName, c.PhoneNumber AS CustomerPhone, c.Address AS CustomerAddress
            FROM Orders o
            LEFT JOIN Customers c ON o.CustomerId = c.Id
            WHERE o.IsDeleted = 0 
              AND o.CustomerId = @CustomerId
            ORDER BY o.CreatedDate DESC
            LIMIT @PageSize OFFSET @Offset;";

        var result = await connection.QueryPagedAsync<CustomerOrderDto>(
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
                SELECT od.Id, od.OrderId, od.ProductId, p.Name AS ProductName, p.MainImageUrl AS ProductImageUrl,
                       od.Quantity, od.UnitPrice, od.SubTotal
                FROM OrderDetails od
                LEFT JOIN Products p ON od.ProductId = p.Id
                WHERE od.OrderId IN @OrderIds;";
                
            var details = await connection.QueryAsync<CustomerOrderDetailDto>(detailsSql, new { OrderIds = orderIds });
            
            foreach (var order in result.Items)
            {
                order.Details = details.Where(d => d.OrderId == order.Id).ToList();
            }
        }
        
        return result;
    }
}
