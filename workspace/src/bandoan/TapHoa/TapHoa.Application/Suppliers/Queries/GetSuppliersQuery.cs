using MediatR;
using Dapper;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Suppliers.DTOs;

namespace TapHoa.Application.Suppliers.Queries;

public class GetSuppliersQuery : IRequest<List<SupplierDto>>
{
}

public class GetSuppliersQueryHandler : IRequestHandler<GetSuppliersQuery, List<SupplierDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetSuppliersQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<List<SupplierDto>> Handle(GetSuppliersQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = "SELECT * FROM Suppliers WHERE IsDeleted = 0";
        var suppliers = await connection.QueryAsync<SupplierDto>(sql);
        return suppliers.ToList();
    }
}
