using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.SupplierLedger.Queries;

public record SupplierDebtDto(Guid Id, Guid SupplierId, string SupplierName, string? PhoneNumber, decimal TotalDebt);

public class GetSupplierDebtsQuery : IRequest<IEnumerable<SupplierDebtDto>>
{
}

public class GetSupplierDebtsQueryHandler : IRequestHandler<GetSupplierDebtsQuery, IEnumerable<SupplierDebtDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetSupplierDebtsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<SupplierDebtDto>> Handle(GetSupplierDebtsQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT Id, SupplierId, SupplierName, PhoneNumber, TotalDebt
            FROM SupplierDebts
            WHERE IsDeleted = 0
            ORDER BY SupplierName ASC
        ";

        return await connection.QueryAsync<SupplierDebtDto>(sql);
    }
}
