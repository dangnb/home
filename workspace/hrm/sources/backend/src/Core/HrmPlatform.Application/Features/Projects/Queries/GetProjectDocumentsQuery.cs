using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Projects.Queries;

// ─── Lấy danh sách tài liệu của một dự án ────────────────────────────────────
public class GetProjectDocumentsQuery : IRequest<IReadOnlyList<ProjectDocumentDto>>
{
    public long ProjectId { get; init; }
}

public record ProjectDocumentDto
{
    public long Id { get; init; }
    public long ProjectId { get; init; }
    public string FileName { get; init; } = string.Empty;
    public string DocumentType { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string StoredPath { get; init; } = string.Empty;
    public string DownloadUrl { get; init; } = string.Empty;
    public long FileSizeBytes { get; init; }
    public string MimeType { get; init; } = string.Empty;
    public long? UploadedBy { get; init; }
    public string? UploadedByName { get; init; }
    public DateTime CreatedAt { get; init; }
}

public class GetProjectDocumentsQueryHandler : IRequestHandler<GetProjectDocumentsQuery, IReadOnlyList<ProjectDocumentDto>>
{
    private readonly ISqlConnectionFactory _connFactory;

    public GetProjectDocumentsQueryHandler(ISqlConnectionFactory connFactory)
    {
        _connFactory = connFactory;
    }

    public async Task<IReadOnlyList<ProjectDocumentDto>> Handle(GetProjectDocumentsQuery request, CancellationToken cancellationToken)
    {
        const string sql = @"
            SELECT
                pd.id           AS Id,
                pd.project_id   AS ProjectId,
                pd.file_name    AS FileName,
                pd.document_type AS DocumentType,
                pd.description  AS Description,
                pd.stored_path  AS StoredPath,
                pd.file_size_bytes AS FileSizeBytes,
                pd.mime_type    AS MimeType,
                pd.uploaded_by  AS UploadedBy,
                CONCAT(u.first_name, ' ', u.last_name) AS UploadedByName,
                pd.created_at   AS CreatedAt
            FROM project_documents pd
            LEFT JOIN users u ON pd.uploaded_by = u.id
            WHERE pd.project_id = @ProjectId
              AND pd.status != 'DELETED'
            ORDER BY pd.created_at DESC;";

        using var conn = _connFactory.CreateConnection();
        var rows = await conn.QueryAsync<ProjectDocumentDto>(sql, new { request.ProjectId });

        // Tạo DownloadUrl từ stored_path (dạng: uploads/projects/{id}/{filename})
        var result = new List<ProjectDocumentDto>();
        foreach (var d in rows)
        {
            var downloadUrl = "/" + d.StoredPath.Replace("\\", "/").TrimStart('/');
            result.Add(d with { DownloadUrl = downloadUrl });
        }
        return result;
    }
}
