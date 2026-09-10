using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Equipments.Commands;

public class CreateEquipmentCommand : IRequest<long>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public EquipmentCategory Category { get; set; } = EquipmentCategory.LAPTOP;
    public string? SerialNumber { get; set; }
    public string? Specifications { get; set; }
    public DateOnly? PurchaseDate { get; set; }
    public DateOnly? WarrantyEndDate { get; set; }
    public string? Note { get; set; }
}

public class CreateEquipmentCommandValidator : AbstractValidator<CreateEquipmentCommand>
{
    public CreateEquipmentCommandValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã trang thiết bị không được để trống.")
            .MaximumLength(50).WithMessage("Mã trang thiết bị tối đa 50 ký tự.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên trang thiết bị không được để trống.")
            .MaximumLength(255).WithMessage("Tên trang thiết bị tối đa 255 ký tự.");
    }
}

public class CreateEquipmentCommandHandler : IRequestHandler<CreateEquipmentCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateEquipmentCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateEquipmentCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var codeUpper = request.Code.Trim().ToUpper();
        var exists = await _context.Equipments
            .AnyAsync(e => e.TenantId == tenantId && e.Code == codeUpper, cancellationToken);

        if (exists)
        {
            throw new BadRequestException($"Mã trang thiết bị '{codeUpper}' đã tồn tại trên hệ thống.");
        }

        var equipment = Equipment.Create(
            tenantId: tenantId,
            code: codeUpper,
            name: request.Name,
            category: request.Category,
            serialNumber: request.SerialNumber,
            specifications: request.Specifications,
            purchaseDate: request.PurchaseDate,
            warrantyEndDate: request.WarrantyEndDate,
            note: request.Note
        );

        _context.Equipments.Add(equipment);
        await _context.SaveChangesAsync(cancellationToken);

        return equipment.Id;
    }
}
