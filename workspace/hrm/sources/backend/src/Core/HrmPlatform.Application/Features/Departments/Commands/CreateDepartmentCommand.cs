using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Departments.Commands;

public record CreateDepartmentCommand : IRequest<long>
{
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public long? ManagerId { get; init; }
    public long? ParentId { get; init; }
}

public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên phòng ban không được để trống.")
            .MaximumLength(150).WithMessage("Tên phòng ban không được vượt quá 150 ký tự.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã phòng ban không được để trống.")
            .MaximumLength(50).WithMessage("Mã phòng ban không được vượt quá 50 ký tự.");
    }
}

public class CreateDepartmentCommandHandler : IRequestHandler<CreateDepartmentCommand, long>
{
    private readonly IApplicationDbContext _context;

    public CreateDepartmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<long> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        // Kiểm tra trùng lặp mã phòng ban trong phạm vi Tenant
        var codeExists = await _context.Departments
            .AnyAsync(d => d.Code == request.Code, cancellationToken);

        if (codeExists)
        {
            throw new BadRequestException($"Mã phòng ban '{request.Code}' đã tồn tại trong doanh nghiệp.");
        }

        // Kiểm tra manager_id hợp lệ nếu có truyền
        if (request.ManagerId.HasValue)
        {
            var managerExists = await _context.Users
                .AnyAsync(u => u.Id == request.ManagerId.Value, cancellationToken);

            if (!managerExists)
            {
                throw new NotFoundException("Người dùng (Trưởng phòng)", request.ManagerId.Value);
            }
        }

        // Kiểm tra parent_id hợp lệ nếu có truyền
        if (request.ParentId.HasValue)
        {
            var parentExists = await _context.Departments
                .AnyAsync(d => d.Id == request.ParentId.Value, cancellationToken);

            if (!parentExists)
            {
                throw new NotFoundException("Phòng ban cấp trên (Cha)", request.ParentId.Value);
            }
        }

        var department = new Department
        {
            Name = request.Name.Trim(),
            Code = request.Code.Trim().ToUpperInvariant(),
            ManagerId = request.ManagerId,
            ParentId = request.ParentId
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync(cancellationToken);

        return department.Id;
    }
}
