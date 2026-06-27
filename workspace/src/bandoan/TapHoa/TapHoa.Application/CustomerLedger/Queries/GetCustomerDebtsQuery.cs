using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.CustomerLedger.Queries;

public record CustomerDebtDto(Guid Id, Guid CustomerId, string CustomerName, string? PhoneNumber, decimal TotalDebt);

public class GetCustomerDebtsQuery : IRequest<IEnumerable<CustomerDebtDto>>
{
}

public class GetCustomerDebtsQueryHandler : IRequestHandler<GetCustomerDebtsQuery, IEnumerable<CustomerDebtDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCustomerDebtsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<CustomerDebtDto>> Handle(GetCustomerDebtsQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT Id, CustomerId, CustomerName, PhoneNumber, TotalDebt
            FROM CustomerDebts
            WHERE IsDeleted = 0
            ORDER BY CustomerName ASC
        ";

        return await connection.QueryAsync<CustomerDebtDto>(sql);
    }
}
