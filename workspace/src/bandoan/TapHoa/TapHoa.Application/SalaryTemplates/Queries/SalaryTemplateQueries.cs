using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.SalaryTemplates.Queries;

public class SalaryTemplateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Formula { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
}

public class GetSalaryTemplatesQuery : IRequest<List<SalaryTemplateDto>> { }

public class GetSalaryTemplatesQueryHandler : IRequestHandler<GetSalaryTemplatesQuery, List<SalaryTemplateDto>>
{
    private readonly IApplicationDbContext _context;

    public GetSalaryTemplatesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SalaryTemplateDto>> Handle(GetSalaryTemplatesQuery request, CancellationToken cancellationToken)
    {
        return await _context.SalaryTemplates
            .Where(t => !t.IsDeleted)
            .Select(t => new SalaryTemplateDto
            {
                Id = t.Id,
                Name = t.Name,
                Formula = t.Formula,
                Notes = t.Notes,
                IsActive = t.IsActive
            })
            .ToListAsync(cancellationToken);
    }
}
