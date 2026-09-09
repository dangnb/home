using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Employees.Commands;

public record UpdateEmployeeCommand : IRequest
{
    public long Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public long? DepartmentId { get; init; }
    public long? ManagerId { get; init; }
    public string JobTitle { get; init; } = string.Empty;
    public Gender Gender { get; init; } = Gender.OTHER;
    public DateOnly? DateOfBirth { get; init; }
    public string? IdCardNumber { get; init; }
    public DateOnly? JoinedDate { get; init; }
}

public class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
{
    public UpdateEmployeeCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("ID hồ sơ nhân sự không hợp lệ.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Họ và tên không được để trống.")
            .MaximumLength(255).WithMessage("Họ và tên tối đa 255 ký tự.");

        RuleFor(x => x.JobTitle)
            .NotEmpty().WithMessage("Chức danh không được để trống.")
            .MaximumLength(150).WithMessage("Chức danh tối đa 150 ký tự.");
    }
}

public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateEmployeeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var profile = await _context.EmployeeProfiles
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (profile == null)
        {
            throw new NotFoundException("Hồ sơ nhân sự", request.Id);
        }

        if (request.DepartmentId.HasValue && request.DepartmentId != profile.DepartmentId)
        {
            var deptExists = await _context.Departments
                .AnyAsync(d => d.Id == request.DepartmentId.Value, cancellationToken);
            if (!deptExists)
            {
                throw new NotFoundException("Phòng ban", request.DepartmentId.Value);
            }
        }

        // Cập nhật thông tin hồ sơ
        profile.DepartmentId = request.DepartmentId;
        profile.ManagerId = request.ManagerId;
        profile.JobTitle = request.JobTitle.Trim();
        profile.Gender = request.Gender;
        profile.DateOfBirth = request.DateOfBirth;
        profile.IdCardNumber = request.IdCardNumber?.Trim();
        profile.JoinedDate = request.JoinedDate;

        // Cập nhật thông tin User liên kết
        if (profile.User != null)
        {
            profile.User.FullName = request.FullName.Trim();
            profile.User.Phone = request.Phone?.Trim();
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
