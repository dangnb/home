using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Warehouse.Queries;

public class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, List<TransactionListDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetTransactionsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<List<TransactionListDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");

        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT 
                t.Id, 
                t.Code, 
                t.Type, 
                t.CreatedBy, 
                (SELECT COUNT(*) FROM InventoryTransactionLines l WHERE l.TransactionId = t.Id) as ItemsCount,
                (SELECT COALESCE(SUM(l.Quantity * l.UnitCost), 0) FROM InventoryTransactionLines l WHERE l.TransactionId = t.Id) as TotalCost,
                t.CreatedAt, 
                t.Status
            FROM InventoryTransactions t
            WHERE t.StoreId = @CompanyId
            ORDER BY t.CreatedAt DESC
        ";

        var txs = await connection.QueryAsync<TransactionListDto>(sql, new { CompanyId = companyId.ToString() });
        return txs.ToList();
    }
}
