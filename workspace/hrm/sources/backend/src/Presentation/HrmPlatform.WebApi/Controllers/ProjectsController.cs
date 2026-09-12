using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Features.Projects.Commands;
using HrmPlatform.Application.Features.Projects.Queries;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/projects")]
public class ProjectsController : ControllerBase
{
    private readonly ISender _sender;
    private readonly IWebHostEnvironment _env;

    public ProjectsController(ISender sender, IWebHostEnvironment env)
    {
        _sender = sender;
        _env = env;
    }

    /// <summary>Lấy danh sách dự án kèm thống kê tổng quan</summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? keyword,
        [FromQuery] string? salesStatus,
        [FromQuery] string? techStatus,
        [FromQuery] string? priority,
        [FromQuery] string? projectType,
        [FromQuery] long? salesUserId,
        [FromQuery] long? techLeadUserId,
        [FromQuery] long? salesDepartmentId,
        [FromQuery] long? techDepartmentId,
        [FromQuery] System.DateOnly? contractSignedFrom,
        [FromQuery] System.DateOnly? contractSignedTo,
        [FromQuery] bool? isOverdue,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetProjectsQuery
        {
            Keyword = keyword,
            SalesStatus = salesStatus,
            TechStatus = techStatus,
            Priority = priority,
            ProjectType = projectType,
            SalesUserId = salesUserId,
            TechLeadUserId = techLeadUserId,
            SalesDepartmentId = salesDepartmentId,
            TechDepartmentId = techDepartmentId,
            ContractSignedFrom = contractSignedFrom,
            ContractSignedTo = contractSignedTo,
            IsOverdue = isOverdue,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>Lấy chi tiết dự án kèm Milestones, Tasks, Members</summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetProjectByIdQuery { Id = id }, cancellationToken);
        return Ok(result);
    }

    /// <summary>Tạo dự án mới (trạng thái LEAD)</summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateProjectCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { success = true, id, message = "Đã khai báo dự án mới thành công." });
    }

    /// <summary>Cập nhật thông tin chung dự án</summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateProjectCommand command, CancellationToken cancellationToken)
    {
        command.Id = id;
        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã cập nhật thông tin dự án thành công." });
    }

    /// <summary>Ký hợp đồng — chuyển sang CONTRACT_SIGNED và bàn giao Kỹ thuật</summary>
    [HttpPost("{id:long}/sign-contract")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> SignContract(long id, [FromBody] SignContractRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new SignProjectContractCommand
        {
            ProjectId = id,
            ContractValue = request.ContractValue,
            ContractSignedDate = request.ContractSignedDate,
            ContractFileRef = request.ContractFileRef,
            WarrantyMonths = request.WarrantyMonths,
            PlannedStartDate = request.PlannedStartDate,
            PlannedEndDate = request.PlannedEndDate
        }, cancellationToken);
        return Ok(new { success = true, message = "Đã ghi nhận ký hợp đồng và chuyển dự án sang trạng thái chờ triển khai kỹ thuật." });
    }

    /// <summary>Chuyển trạng thái kinh doanh (Sales Pipeline)</summary>
    [HttpPost("{id:long}/sales-status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AdvanceSalesStatus(long id, [FromBody] AdvanceSalesStatusRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new AdvanceProjectSalesStatusCommand
        {
            ProjectId = id,
            NewStatus = request.NewStatus,
            Note = request.Note
        }, cancellationToken);
        return Ok(new { success = true, message = "Đã cập nhật trạng thái kinh doanh dự án." });
    }

    /// <summary>Đánh dấu thua thầu / hủy dự án</summary>
    [HttpPost("{id:long}/close-lost")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> CloseLost(long id, [FromBody] CloseLostRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new CloseProjectLostCommand { ProjectId = id, Reason = request.Reason }, cancellationToken);
        return Ok(new { success = true, message = "Đã đánh dấu dự án thua thầu / hủy." });
    }

    /// <summary>Phân công Team Kỹ Thuật cho dự án</summary>
    [HttpPost("{id:long}/assign-tech")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AssignTech(long id, [FromBody] AssignTechTeamCommand command, CancellationToken cancellationToken)
    {
        command.ProjectId = id;
        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã phân công Team Kỹ Thuật và chuyển dự án sang giai đoạn lập kế hoạch." });
    }

    /// <summary>Cập nhật trạng thái kỹ thuật (PLANNING, IN_PROGRESS, TESTING_UAT,...)</summary>
    [HttpPost("{id:long}/tech-status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateTechStatus(long id, [FromBody] UpdateTechStatusRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new UpdateProjectTechStatusCommand { ProjectId = id, NewTechStatus = request.NewTechStatus }, cancellationToken);
        return Ok(new { success = true, message = "Đã cập nhật trạng thái kỹ thuật dự án." });
    }

    /// <summary>Tạo Hạng Mục / Milestone trong dự án</summary>
    [HttpPost("{id:long}/milestones")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateMilestone(long id, [FromBody] CreateProjectMilestoneCommand command, CancellationToken cancellationToken)
    {
        command.ProjectId = id;
        var milestoneId = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { success = true, id = milestoneId, message = "Đã tạo hạng mục dự án thành công." });
    }

    /// <summary>Tạo Task kỹ thuật trong dự án</summary>
    [HttpPost("{id:long}/tasks")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateTask(long id, [FromBody] CreateProjectTaskCommand command, CancellationToken cancellationToken)
    {
        command.ProjectId = id;
        var taskId = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { success = true, id = taskId, message = "Đã tạo công việc kỹ thuật thành công." });
    }

    /// <summary>Kỹ sư cập nhật tiến độ Task</summary>
    [HttpPatch("tasks/{taskId:long}/progress")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateTaskProgress(long taskId, [FromBody] UpdateProjectTaskProgressCommand command, CancellationToken cancellationToken)
    {
        command.TaskId = taskId;
        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã cập nhật tiến độ công việc thành công." });
    }

    // ─── DOCUMENT ENDPOINTS ──────────────────────────────────────────────────────

    /// <summary>Lấy danh sách tài liệu đính kèm của dự án</summary>
    [HttpGet("{id:long}/documents")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDocuments(long id, CancellationToken cancellationToken)
    {
        var docs = await _sender.Send(new GetProjectDocumentsQuery { ProjectId = id }, cancellationToken);
        return Ok(new { success = true, data = docs });
    }

    /// <summary>Upload tài liệu đính kèm (multipart/form-data)</summary>
    [HttpPost("{id:long}/documents")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [RequestSizeLimit(52_428_800)] // 50 MB
    public async Task<IActionResult> UploadDocument(
        long id,
        IFormFile file,
        [FromForm] string documentType = "OTHER",
        [FromForm] string? description = null,
        CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { success = false, message = "Không có file được gửi lên." });

        const long maxSize = 52_428_800; // 50 MB
        if (file.Length > maxSize)
            return BadRequest(new { success = false, message = "File vượt quá dung lượng cho phép (50 MB)." });

        // Sanitize filename
        var originalName = Path.GetFileName(file.FileName);
        var ext = Path.GetExtension(originalName);
        var safeFileName = $"{Guid.NewGuid():N}{ext}";

        // Build physical path: wwwroot/uploads/projects/{projectId}/{safeFileName}
        var uploadsRoot = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "projects", id.ToString());
        Directory.CreateDirectory(uploadsRoot);
        var physicalPath = Path.Combine(uploadsRoot, safeFileName);

        await using (var stream = new FileStream(physicalPath, FileMode.Create))
            await file.CopyToAsync(stream, cancellationToken);

        // stored_path dạng: uploads/projects/{id}/{safeFileName}
        var storedPath = Path.Combine("uploads", "projects", id.ToString(), safeFileName).Replace("\\", "/");

        var docId = await _sender.Send(new UploadProjectDocumentCommand
        {
            ProjectId = id,
            FileName = originalName,
            DocumentType = documentType,
            Description = description,
            StoredPath = storedPath,
            FileSizeBytes = file.Length,
            MimeType = file.ContentType
        }, cancellationToken);

        return CreatedAtAction(nameof(GetDocuments), new { id }, new
        {
            success = true,
            id = docId,
            downloadUrl = $"/{storedPath}",
            fileName = originalName,
            message = "Đã tải tài liệu lên thành công."
        });
    }

    /// <summary>Xóa tài liệu đính kèm</summary>
    [HttpDelete("documents/{documentId:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteDocument(long documentId, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteProjectDocumentCommand { DocumentId = documentId }, cancellationToken);
        return Ok(new { success = true, message = "Đã xóa tài liệu." });
    }
}

// ─── Request Records ──────────────────────────────────────────────────────────
public record SignContractRequest(
    decimal ContractValue,
    System.DateOnly ContractSignedDate,
    string? ContractFileRef = null,
    int WarrantyMonths = 0,
    System.DateOnly? PlannedStartDate = null,
    System.DateOnly? PlannedEndDate = null);

public record AdvanceSalesStatusRequest(ProjectSalesStatus NewStatus, string? Note = null);
public record CloseLostRequest(string Reason);
public record UpdateTechStatusRequest(ProjectTechStatus NewTechStatus);
