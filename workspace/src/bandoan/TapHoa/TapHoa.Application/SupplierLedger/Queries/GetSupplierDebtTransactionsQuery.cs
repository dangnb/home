using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.SupplierLedger.Queries;

public record SupplierDebtTransactionDto(Guid Id, Guid SupplierId, SupplierDebtTransactionType Type, decimal Amount, decimal PaidAmount, string? Note, Guid? RelatedDebtId, DateTime? DueDate, DateTime CreatedDate);

public class GetSupplierDebtTransactionsQuery : IRequest<IEnumerable<SupplierDebtTransactionDto>>
{
    public Guid SupplierId { get; set; }
}

public class GetSupplierDebtTransactionsQueryHandler : IRequestHandler<GetSupplierDebtTransactionsQuery, IEnumerable<SupplierDebtTransactionDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetSupplierDebtTransactionsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<SupplierDebtTransactionDto>> Handle(GetSupplierDebtTransactionsQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT Id, SupplierId, Type, Amount, PaidAmount, Note, RelatedDebtId, DueDate, CreatedDate
            FROM SupplierDebtTransactions
            WHERE SupplierId = @SupplierId AND IsDeleted = 0
            ORDER BY CreatedDate DESC
        ";

        return await connection.QueryAsync<SupplierDebtTransactionDto>(sql, new { SupplierId = request.SupplierId });
    }
}
