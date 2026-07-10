using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Warehouse.Queries;

public record GetSuggestedBatchesQuery(Guid ProductId) : IRequest<IEnumerable<SuggestedBatchDto>>;

public class SuggestedBatchDto
{
    public Guid Id { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime? ExpirationDate { get; set; }
    public int CurrentStock { get; set; }
}

public class GetSuggestedBatchesQueryHandler : IRequestHandler<GetSuggestedBatchesQuery, IEnumerable<SuggestedBatchDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetSuggestedBatchesQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<SuggestedBatchDto>> Handle(GetSuggestedBatchesQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        
        // FEFO (First Expiring, First Out)
        // Only return batches that have positive stock levels
        const string sql = @"
            SELECT 
                pb.Id, 
                pb.BatchNumber, 
                pb.ExpirationDate,
                sl.Quantity as CurrentStock
            FROM ProductBatches pb
            JOIN StockLevels sl ON pb.Id = sl.BatchId
            WHERE pb.ProductId = @ProductId
              AND sl.Quantity > 0
            ORDER BY pb.ExpirationDate ASC NULLS LAST, pb.CreatedDate ASC
        ";
        
        return await connection.QueryAsync<SuggestedBatchDto>(sql, new { request.ProductId });
    }
}
