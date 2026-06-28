using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace TapHoa.Application.CustomerLedger.Queries;

public record CustomerDebtTransactionDto(
    Guid Id, 
    Guid CustomerId, 
    int Type, 
    decimal Amount, 
    decimal PaidAmount, 
    string? Note, 
    Guid? RelatedDebtId,
    DateTime CreatedDate);

public class GetCustomerDebtTransactionsQuery : IRequest<IEnumerable<CustomerDebtTransactionDto>>
{
    public Guid CustomerId { get; set; }

    public GetCustomerDebtTransactionsQuery(Guid customerId)
    {
        CustomerId = customerId;
    }
}

public class GetCustomerDebtTransactionsQueryHandler : IRequestHandler<GetCustomerDebtTransactionsQuery, IEnumerable<CustomerDebtTransactionDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCustomerDebtTransactionsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<CustomerDebtTransactionDto>> Handle(GetCustomerDebtTransactionsQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT Id, CustomerId, Type, Amount, PaidAmount, Note, RelatedDebtId, CreatedDate
            FROM CustomerDebtTransactions
            WHERE CustomerId = @CustomerId AND IsDeleted = 0
            ORDER BY CreatedDate DESC
        ";

        return await connection.QueryAsync<CustomerDebtTransactionDto>(sql, new { CustomerId = request.CustomerId });
    }
}
