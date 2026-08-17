using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities.Identity;

namespace TapHoa.Application.Auth.Commands;

public record CreateUserCommand(string Username, string Password, string FullName, string Email, List<string>? Roles, bool IsActive = true) : IRequest<Guid>;
public record UpdateUserCommand(Guid Id, string FullName, string Email, List<string>? Roles, bool IsActive) : IRequest<Unit>;
public record DeleteUserCommand(Guid Id) : IRequest<Unit>;

public class UserCommandsHandler :
    IRequestHandler<CreateUserCommand, Guid>,
    IRequestHandler<UpdateUserCommand, Unit>,
    IRequestHandler<DeleteUserCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UserCommandsHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);
        if (existingUser != null)
            throw new Exception("Tên đăng nhập đã tồn tại trong hệ thống");

        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        
        var user = new User(
            request.Username,
            passwordHash,
            request.FullName,
            request.Email,
            companyId
        );

        if (!request.IsActive)
        {
            user.Deactivate(); 
        }

        if (request.Roles != null && request.Roles.Any())
        {
            var roles = await _context.Roles.Where(r => request.Roles.Contains(r.Name)).ToListAsync(cancellationToken);
            foreach (var role in roles)
            {
                user.AssignRole(role);
            }
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return user.Id;
    }

    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null)
            throw new Exception("Không tìm thấy người dùng");

        user.UpdateProfile(request.FullName, user.PhoneNumber, user.CitizenId, user.Address);
        user.UpdateEmail(request.Email);
        
        if (request.IsActive)
        {
            user.Activate();
        }
        else
        {
            user.Deactivate();
        }

        // Update roles
        user.Roles.Clear();
        if (request.Roles != null && request.Roles.Any())
        {
            var roles = await _context.Roles.Where(r => request.Roles.Contains(r.Name)).ToListAsync(cancellationToken);
            foreach (var role in roles)
            {
                user.AssignRole(role);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { request.Id }, cancellationToken);
        if (user != null)
        {
            user.Deactivate();
            await _context.SaveChangesAsync(cancellationToken);
        }
        return Unit.Value;
    }
}
