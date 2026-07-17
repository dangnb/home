using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.SalaryTemplates.Commands;

public class CreateSalaryTemplateCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Formula { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class CreateSalaryTemplateCommandHandler : IRequestHandler<CreateSalaryTemplateCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateSalaryTemplateCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateSalaryTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = new SalaryTemplate(request.Name, request.Formula, request.Notes);
        _context.SalaryTemplates.Add(template);
        await _context.SaveChangesAsync(cancellationToken);
        return template.Id;
    }
}

public class UpdateSalaryTemplateCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Formula { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
}

public class UpdateSalaryTemplateCommandHandler : IRequestHandler<UpdateSalaryTemplateCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateSalaryTemplateCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateSalaryTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = await _context.SalaryTemplates.FindAsync(new object[] { request.Id }, cancellationToken);
        if (template == null || template.IsDeleted) return false;

        template.Update(request.Name, request.Formula, request.Notes, request.IsActive);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public class DeleteSalaryTemplateCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteSalaryTemplateCommandHandler : IRequestHandler<DeleteSalaryTemplateCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteSalaryTemplateCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteSalaryTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = await _context.SalaryTemplates.FindAsync(new object[] { request.Id }, cancellationToken);
        if (template == null || template.IsDeleted) return false;

        template.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
