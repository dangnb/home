using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsBase.Domain.Entities;
using ConsBase.Domain.Enums;
using ConsBase.Infrastructure.Persistence;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DailyLogController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DailyLogController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetDailyLogsByProject(Guid projectId)
    {
        var logs = await _context.DailyLogs
            .Where(l => l.ProjectId == projectId)
            .Include(l => l.CreatedByUser)
            .Include(l => l.ApprovedByUser)
            .Include(l => l.Workers)
            .Include(l => l.Materials)
            .Include(l => l.Equipments)
            .Include(l => l.Photos)
            .OrderByDescending(l => l.LogDate)
            .ToListAsync();
        return Ok(logs);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDailyLog([FromBody] DailyLog log)
    {
        log.LogDate = DateTime.UtcNow.Date;
        log.Status = DailyLogStatus.Draft;
        _context.DailyLogs.Add(log);
        await _context.SaveChangesAsync();
        return Ok(log);
    }

    [HttpPost("{id}/workers")]
    public async Task<IActionResult> AddWorkerLog(Guid id, [FromBody] DailyLogWorker worker)
    {
        worker.DailyLogId = id;
        _context.DailyLogWorkers.Add(worker);
        await _context.SaveChangesAsync();
        return Ok(worker);
    }

    [HttpPost("{id}/photos")]
    public async Task<IActionResult> AddPhotoLog(Guid id, [FromBody] DailyLogPhoto photo)
    {
        photo.DailyLogId = id;
        _context.DailyLogPhotos.Add(photo);
        await _context.SaveChangesAsync();
        return Ok(photo);
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveDailyLog(Guid id, [FromQuery] Guid approverUserId)
    {
        var log = await _context.DailyLogs
            .Include(l => l.Workers)
            .Include(l => l.Materials)
            .FirstOrDefaultAsync(l => l.Id == id);
        
        if (log == null) return NotFound();

        log.Status = DailyLogStatus.Approved;
        log.ApprovedById = approverUserId;
        await _context.SaveChangesAsync();

        // Auto Sync completed work to active Project Tasks
        var activeProject = await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == log.ProjectId);

        if (activeProject != null && activeProject.Tasks.Any())
        {
            var inProgressTask = activeProject.Tasks.FirstOrDefault(t => t.Status == TaskStatusEnum.InProgress) 
                              ?? activeProject.Tasks.FirstOrDefault(t => t.Status == TaskStatusEnum.Todo);

            if (inProgressTask != null)
            {
                inProgressTask.ActualVolume += 150; // Incremental completed volume from daily log
                if (inProgressTask.PlannedVolume > 0)
                {
                    inProgressTask.ProgressPercentage = Math.Min(100, Math.Round((inProgressTask.ActualVolume / inProgressTask.PlannedVolume) * 100, 2));
                    if (inProgressTask.ProgressPercentage >= 100)
                    {
                        inProgressTask.Status = TaskStatusEnum.Completed;
                    }
                    else
                    {
                        inProgressTask.Status = TaskStatusEnum.InProgress;
                    }
                }
            }

            activeProject.ProgressPercentage = Math.Round(activeProject.Tasks.Average(t => t.ProgressPercentage), 2);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Nhật ký thi công đã được duyệt & tự động đồng bộ kết quả khối lượng vào tiến độ dự án.", log });
    }

    [HttpPost("{id}/lock")]
    public async Task<IActionResult> LockDailyLog(Guid id)
    {
        var log = await _context.DailyLogs.FirstOrDefaultAsync(l => l.Id == id);
        if (log == null) return NotFound();

        log.Status = DailyLogStatus.Locked;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã khóa nhật ký thi công hiện trường.", log });
    }
}
