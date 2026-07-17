using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Roles;

public record GetRolesQuery() : IRequest<List<RoleDto>>;

public class RoleQueriesHandler : IRequestHandler<GetRolesQuery, List<RoleDto>>
{
    private readonly IApplicationDbContext _context;

    public RoleQueriesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        var roles = await _context.Roles.ToListAsync(cancellationToken);
        return roles.Select(RoleDto.FromEntity).ToList();
    }
}
