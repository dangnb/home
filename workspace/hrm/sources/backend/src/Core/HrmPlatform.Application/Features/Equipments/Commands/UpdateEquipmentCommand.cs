using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Equipments.Commands;

public class UpdateEquipmentCommand : IRequest<bool>
{
    public long Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public EquipmentCategory Category { get; set; } = EquipmentCategory.LAPTOP;
    public string? SerialNumber { get; set; }
    public string? Specifications { get; set; }
    public DateOnly? PurchaseDate { get; set; }
    public DateOnly? WarrantyEndDate { get; set; }
    public string? Note { get; set; }
}

public class UpdateEquipmentCommandValidator : AbstractValidator<UpdateEquipmentCommand>
{
    public UpdateEquipmentCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("ID trang thiết bị không hợp lệ.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã trang thiết bị không được để trống.")
            .MaximumLength(50).WithMessage("Mã trang thiết bị tối đa 50 ký tự.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên trang thiết bị không được để trống.")
            .MaximumLength(255).WithMessage("Tên trang thiết bị tối đa 255 ký tự.");
    }
}

public class UpdateEquipmentCommandHandler : IRequestHandler<UpdateEquipmentCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateEquipmentCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateEquipmentCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == request.Id && e.TenantId == tenantId, cancellationToken);

        if (equipment == null)
            throw new NotFoundException("Trang thiết bị không tồn tại trong hệ thống.");

        var codeUpper = request.Code.Trim().ToUpper();
        var codeExists = await _context.Equipments
            .AnyAsync(e => e.TenantId == tenantId && e.Code == codeUpper && e.Id != request.Id, cancellationToken);

        if (codeExists)
            throw new BadRequestException($"Mã trang thiết bị '{codeUpper}' đã được sử dụng bởi thiết bị khác.");

        equipment.UpdateDetails(
            code: codeUpper,
            name: request.Name,
            category: request.Category,
            serialNumber: request.SerialNumber,
            specifications: request.Specifications,
            purchaseDate: request.PurchaseDate,
            warrantyEndDate: request.WarrantyEndDate,
            note: request.Note
        );

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
