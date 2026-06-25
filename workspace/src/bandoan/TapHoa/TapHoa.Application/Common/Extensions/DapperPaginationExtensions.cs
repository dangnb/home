using System.Data;
using Dapper;
using TapHoa.Application.Common.Models;

namespace TapHoa.Application.Common.Extensions;

public static class DapperPaginationExtensions
{
    public static async Task<PagedResult<T>> QueryPagedAsync<T>(
        this IDbConnection connection,
        string countSql,
        string dataSql,
        object? parameters,
        int pageIndex,
        int pageSize)
    {
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);
        
        var items = await connection.QueryAsync<T>(dataSql, parameters);
        
        return new PagedResult<T>(items.ToList(), totalCount, pageIndex, pageSize);
    }
}
