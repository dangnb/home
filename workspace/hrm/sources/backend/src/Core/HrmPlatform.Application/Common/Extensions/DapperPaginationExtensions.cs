using System;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Models;

namespace HrmPlatform.Application.Common.Extensions;

/// <summary>
/// Business Common Extension hỗ trợ phân trang Dapper tập trung & dùng chung cho toàn bộ Application Layer
/// </summary>
public static class DapperPaginationExtensions
{
    /// <summary>
    /// Thực hiện truy vấn phân trang Dapper dùng chung (tự động gán Limit/Offset, đếm TotalCount và trả về PaginatedResultDto)
    /// </summary>
    public static async Task<PaginatedResultDto<T>> QueryPaginatedAsync<T>(
        this IDbConnection connection,
        string countSql,
        string dataSql,
        DynamicParameters parameters,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var validPage = page > 0 ? page : 1;
        var validPageSize = pageSize > 0 ? pageSize : 20;
        var offset = Math.Max(0, (validPage - 1) * validPageSize);

        parameters.Add("Limit", validPageSize);
        parameters.Add("Offset", offset);

        // 1. Thực thi đếm tổng số bản ghi
        var countCmd = new CommandDefinition(countSql, parameters, cancellationToken: cancellationToken);
        var totalCount = await connection.ExecuteScalarAsync<int>(countCmd);

        // 2. Thực thi lấy danh sách dữ liệu theo phân trang (tự động gắn LIMIT & OFFSET nếu chưa có)
        var finalDataSql = dataSql.TrimEnd(';', ' ', '\r', '\n');
        if (!finalDataSql.Contains("LIMIT", StringComparison.OrdinalIgnoreCase))
        {
            finalDataSql += " LIMIT @Limit OFFSET @Offset;";
        }

        var dataCmd = new CommandDefinition(finalDataSql, parameters, cancellationToken: cancellationToken);
        var items = (await connection.QueryAsync<T>(dataCmd)).ToList();

        // 3. Đóng gói và trả về DTO chuẩn
        return PaginatedResultDto<T>.Create(items, totalCount, validPage, validPageSize);
    }
}

