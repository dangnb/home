using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Projects.Commands;

// ─── Upload tài liệu đính kèm dự án ──────────────────────────────────────────
public class UploadProjectDocumentCommand : IRequest<long>
{
    public long ProjectId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = "OTHER";
    public string? Description { get; set; }
    public string StoredPath { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string MimeType { get; set; } = string.Empty;
}

public class UploadProjectDocumentCommandHandler : IRequestHandler<UploadProjectDocumentCommand, long>
{
    private readonly ISqlConnectionFactory _connFactory;
    private readonly ICurrentUserService _currentUser;

    public UploadProjectDocumentCommandHandler(ISqlConnectionFactory connFactory, ICurrentUserService currentUser)
    {
        _connFactory = connFactory;
        _currentUser = currentUser;
    }

    public async Task<long> Handle(UploadProjectDocumentCommand request, CancellationToken cancellationToken)
    {
        const string sql = @"
            INSERT INTO `project_documents`
                (`project_id`, `file_name`, `document_type`, `description`,
                 `stored_path`, `file_size_bytes`, `mime_type`,
                 `uploaded_by`, `created_at`)
            VALUES
                (@ProjectId, @FileName, @DocumentType, @Description,
                 @StoredPath, @FileSizeBytes, @MimeType,
                 @UploadedBy, UTC_TIMESTAMP(6));
            SELECT LAST_INSERT_ID();";

        using var conn = _connFactory.CreateConnection();
        var id = await conn.ExecuteScalarAsync<long>(sql, new
        {
            request.ProjectId,
            request.FileName,
            request.DocumentType,
            request.Description,
            request.StoredPath,
            request.FileSizeBytes,
            request.MimeType,
            UploadedBy = _currentUser.UserId
        });
        return id;
    }
}

// ─── Xóa tài liệu đính kèm ───────────────────────────────────────────────────
public class DeleteProjectDocumentCommand : IRequest<Unit>
{
    public long DocumentId { get; set; }
}

public class DeleteProjectDocumentCommandHandler : IRequestHandler<DeleteProjectDocumentCommand, Unit>
{
    private readonly ISqlConnectionFactory _connFactory;

    public DeleteProjectDocumentCommandHandler(ISqlConnectionFactory connFactory)
    {
        _connFactory = connFactory;
    }

    public async Task<Unit> Handle(DeleteProjectDocumentCommand request, CancellationToken cancellationToken)
    {
        using var conn = _connFactory.CreateConnection();

        // Lấy stored_path trước khi soft-delete
        var storedPath = await conn.ExecuteScalarAsync<string>(
            "SELECT `stored_path` FROM `project_documents` WHERE `id` = @Id;",
            new { Id = request.DocumentId });

        // Soft delete trong DB
        await conn.ExecuteAsync(
            "UPDATE `project_documents` SET `status` = 'DELETED' WHERE `id` = @Id;",
            new { Id = request.DocumentId });

        // Xóa file vật lý nếu còn tồn tại
        if (!string.IsNullOrEmpty(storedPath) && File.Exists(storedPath))
        {
            File.Delete(storedPath);
        }

        return Unit.Value;
    }
}
