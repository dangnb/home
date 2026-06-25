using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Common.Models;

namespace TapHoa.Application.Common.Extensions;

public static class QueryablePaginationExtensions
{
    public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
        this IQueryable<T> query,
        int pageIndex,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var totalCount = await query.CountAsync(cancellationToken);
        
        var items = await query
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
            
        return new PagedResult<T>(items, totalCount, pageIndex, pageSize);
    }
}
