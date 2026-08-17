using EduProCRM.Domain.Entities;
using FluentValidation;
using MediatR;

namespace EduProCRM.Application.Users.Commands;

public record CreateUserCommand(
    string StaffCode,
    string FullName,
    string Email,
    string Department,
    string Role,
    List<string> Permissions,
    string CreatedBy
) : IRequest<Guid>;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.StaffCode).NotEmpty().WithMessage("Mã nhân viên không được để trống.");
        RuleFor(x => x.FullName).NotEmpty().WithMessage("Họ tên nhân viên không được để trống.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Email không hợp lệ.");
        RuleFor(x => x.Role).NotEmpty().WithMessage("Vui lòng chọn vai trò phân quyền.");
    }
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly IUserRepository _repository;

    public CreateUserCommandHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var user = User.Create(
            request.StaffCode,
            request.FullName,
            request.Email,
            request.Department,
            request.Role,
            request.Permissions,
            request.CreatedBy
        );

        await _repository.AddAsync(user, ct);
        return user.Id;
    }
}

public interface IUserRepository
{
    Task AddAsync(User user, CancellationToken ct);
    Task<IEnumerable<UserDto>> GetUsersAsync(CancellationToken ct);
    Task<IEnumerable<AuditLogDto>> GetAuditLogsAsync(CancellationToken ct);
}

public record UserDto(
    Guid Id,
    string StaffCode,
    string FullName,
    string Email,
    string Department,
    string Role,
    List<string> Permissions,
    bool IsActive,
    DateTime CreatedAt,
    string CreatedBy
);

public record AuditLogDto(
    Guid Id,
    DateTime Timestamp,
    string OperatorName,
    string Action,
    string Module,
    string Description,
    string IpAddress
);
