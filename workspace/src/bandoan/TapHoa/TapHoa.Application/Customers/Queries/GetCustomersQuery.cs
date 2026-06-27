using MediatR;
using TapHoa.Application.Customers.DTOs;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities;
using Microsoft.EntityFrameworkCore;

using Dapper;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Customers.Queries;

public class GetCustomersQuery : IRequest<List<CustomerDto>>
{
}

public class GetCustomersQueryHandler : IRequestHandler<GetCustomersQuery, List<CustomerDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCustomersQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<List<CustomerDto>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = "SELECT * FROM Customers WHERE IsDeleted = 0";
        var customers = await connection.QueryAsync<CustomerDto>(sql);
        return customers.ToList();
    }
}
