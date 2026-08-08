using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsBase.Domain.Entities;
using ConsBase.Domain.Enums;
using ConsBase.Infrastructure.Persistence;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _context.Projects
            .Include(p => p.Customer)
            .Include(p => p.ProjectManager)
            .Include(p => p.Tasks)
            .ToListAsync();
        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProjectById(Guid id)
    {
        var project = await _context.Projects
            .Include(p => p.Customer)
            .Include(p => p.Contract)
            .Include(p => p.ProjectManager)
            .Include(p => p.Tasks)
            .Include(p => p.Members).ThenInclude(m => m.User)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return NotFound();
        return Ok(project);
    }

    [HttpPost("tasks")]
    public async Task<IActionResult> CreateTask([FromBody] ProjectTask task)
    {
        _context.ProjectTasks.Add(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }

    [HttpPut("tasks/{taskId}/status")]
    public async Task<IActionResult> UpdateTaskStatus(Guid taskId, [FromBody] TaskStatusEnum newStatus)
    {
        var task = await _context.ProjectTasks.FindAsync(taskId);
        if (task == null) return NotFound();

        task.Status = newStatus;
        if (newStatus == TaskStatusEnum.Completed)
        {
            task.ProgressPercentage = 100;
        }

        await _context.SaveChangesAsync();

        // Auto update project overall progress
        var project = await _context.Projects.Include(p => p.Tasks).FirstOrDefaultAsync(p => p.Id == task.ProjectId);
        if (project != null && project.Tasks.Any())
        {
            project.ProgressPercentage = Math.Round(project.Tasks.Average(t => t.ProgressPercentage), 2);
            await _context.SaveChangesAsync();
        }

        return Ok(task);
    }
}
