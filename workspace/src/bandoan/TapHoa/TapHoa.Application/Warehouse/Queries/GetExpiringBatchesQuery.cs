using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Warehouse.Queries;

public record ExpiringBatchDto(Guid BatchId, string BatchNumber, Guid ProductId, string ProductName, DateTime MfgDate, DateTime ExpiryDate, int DaysUntilExpiry);

public class GetExpiringBatchesQuery : IRequest<IEnumerable<ExpiringBatchDto>>
{
    public int DaysThreshold { get; set; } = 30; // Default to 30 days
}

public class GetExpiringBatchesQueryHandler : IRequestHandler<GetExpiringBatchesQuery, IEnumerable<ExpiringBatchDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetExpiringBatchesQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<ExpiringBatchDto>> Handle(GetExpiringBatchesQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT 
                b.Id as BatchId, 
                b.BatchNumber, 
                p.Id as ProductId, 
                p.Name as ProductName, 
                b.MfgDate, 
                b.ExpiryDate,
                DATEDIFF(b.ExpiryDate, UTC_DATE()) as DaysUntilExpiry
            FROM ProductBatches b
            JOIN Products p ON p.Id = b.ProductId
            WHERE DATEDIFF(b.ExpiryDate, UTC_DATE()) <= @DaysThreshold
            AND p.IsDeleted = 0
            ORDER BY b.ExpiryDate ASC
        ";

        return await connection.QueryAsync<ExpiringBatchDto>(sql, new { request.DaysThreshold });
    }
}
