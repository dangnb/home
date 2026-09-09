using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace HrmPlatform.Application.Common.Models;

/// <summary>
/// Chuẩn hóa cấu trúc phản hồi dữ liệu đơn lẻ cho Frontend
/// </summary>
public class ApiResponseDto<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("data")]
    public T? Data { get; set; }

    public static ApiResponseDto<T> Ok(T data, string? message = null)
        => new() { Success = true, Data = data, Message = message };
}

/// <summary>
/// Chuẩn hóa cấu trúc phản hồi danh sách phân trang cho Frontend
/// </summary>
public class PaginatedResultDto<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("data")]
    public IReadOnlyList<T> Data { get; set; } = Array.Empty<T>();

    [JsonPropertyName("pagination")]
    public PaginationMeta Pagination { get; set; } = new();

    public static PaginatedResultDto<T> Create(IReadOnlyList<T> items, int totalCount, int page, int pageSize)
    {
        return new PaginatedResultDto<T>
        {
            Success = true,
            Data = items,
            Pagination = new PaginationMeta
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = pageSize > 0 ? (int)Math.Ceiling(totalCount / (double)pageSize) : 0
            }
        };
    }
}

public class PaginationMeta
{
    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }

    [JsonPropertyName("totalPages")]
    public int TotalPages { get; set; }
}
