using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Departments.Commands;

public record UpdateDepartmentCommand : IRequest
{
    public long Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public long? ManagerId { get; init; }
    public long? ParentId { get; init; }
    public string? Status { get; init; }
}

public class UpdateDepartmentCommandValidator : AbstractValidator<UpdateDepartmentCommand>
{
    public UpdateDepartmentCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("ID phòng ban không hợp lệ.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên phòng ban không được để trống.")
            .MaximumLength(150).WithMessage("Tên phòng ban không được vượt quá 150 ký tự.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã phòng ban không được để trống.")
            .MaximumLength(50).WithMessage("Mã phòng ban không được vượt quá 50 ký tự.");
    }
}

public class UpdateDepartmentCommandHandler : IRequestHandler<UpdateDepartmentCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateDepartmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        if (department == null)
        {
            throw new NotFoundException("Phòng ban", request.Id);
        }

        // Kiểm tra trùng lặp mã với phòng ban khác trong tenant
        var codeExists = await _context.Departments
            .AnyAsync(d => d.Code == request.Code && d.Id != request.Id, cancellationToken);

        if (codeExists)
        {
            throw new BadRequestException($"Mã phòng ban '{request.Code}' đã được sử dụng bởi phòng ban khác.");
        }

        if (request.ManagerId.HasValue && request.ManagerId != department.ManagerId)
        {
            var managerExists = await _context.Users
                .AnyAsync(u => u.Id == request.ManagerId.Value, cancellationToken);

            if (!managerExists)
            {
                throw new NotFoundException("Người dùng (Trưởng phòng)", request.ManagerId.Value);
            }
        }

        // Kiểm tra parent_id hợp lệ
        if (request.ParentId.HasValue)
        {
            if (request.ParentId.Value == request.Id)
            {
                throw new BadRequestException("Phòng ban không thể chọn chính nó làm phòng ban cấp trên.");
            }

            var parentExists = await _context.Departments
                .AnyAsync(d => d.Id == request.ParentId.Value, cancellationToken);

            if (!parentExists)
            {
                throw new NotFoundException("Phòng ban cấp trên (Cha)", request.ParentId.Value);
            }
        }

        department.Name = request.Name.Trim();
        department.Code = request.Code.Trim().ToUpperInvariant();
        department.ManagerId = request.ManagerId;
        department.ParentId = request.ParentId;

        if (!string.IsNullOrWhiteSpace(request.Status) &&
            Enum.TryParse<Domain.Enums.EntityStatus>(request.Status, true, out var parsedStatus))
        {
            department.Status = parsedStatus;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
