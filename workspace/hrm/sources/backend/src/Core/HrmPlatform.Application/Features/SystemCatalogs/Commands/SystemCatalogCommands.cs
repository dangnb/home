using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Config;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.SystemCatalogs.Commands;

// ============================================================
// CREATE
// ============================================================
public record CreateSystemCatalogCommand : IRequest<long>
{
    public string CatalogType { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int SortOrder { get; init; } = 0;
}

public class CreateSystemCatalogCommandValidator : AbstractValidator<CreateSystemCatalogCommand>
{
    public CreateSystemCatalogCommandValidator()
    {
        RuleFor(x => x.CatalogType)
            .NotEmpty().WithMessage("Loại danh mục (CatalogType) không được để trống.")
            .Must(v => Enum.TryParse<SystemCatalogType>(v, ignoreCase: true, out _))
            .WithMessage("Loại danh mục không hợp lệ.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã danh mục (Code) không được để trống.")
            .MaximumLength(100).WithMessage("Mã danh mục không vượt quá 100 ký tự.")
            .Matches("^[A-Za-z0-9_]+$").WithMessage("Mã danh mục chỉ được phép chứa chữ cái, số và dấu gạch dưới.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên danh mục không được để trống.")
            .MaximumLength(255).WithMessage("Tên danh mục không vượt quá 255 ký tự.");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Thứ tự không hợp lệ (>= 0).");
    }
}

public class CreateSystemCatalogCommandHandler : IRequestHandler<CreateSystemCatalogCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateSystemCatalogCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateSystemCatalogCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId
            ?? throw new UnauthorizedAccessException("Không xác định được Tenant hiện tại.");

        var catalogType = Enum.Parse<SystemCatalogType>(request.CatalogType, ignoreCase: true);

        // Kiểm tra trùng code trong cùng tenant + loại danh mục
        var codeExists = await _context.SystemCatalogs
            .AnyAsync(c => c.TenantId == tenantId
                        && c.CatalogType == catalogType
                        && c.Code == request.Code.Trim().ToUpperInvariant(),
                      cancellationToken);

        if (codeExists)
            throw new BadRequestException($"Mã danh mục '{request.Code}' đã tồn tại trong loại '{request.CatalogType}'.");

        var catalog = SystemCatalog.Create(
            tenantId: tenantId,
            catalogType: catalogType,
            code: request.Code,
            name: request.Name,
            description: request.Description,
            sortOrder: request.SortOrder
        );
        catalog.CreatedBy = _currentUserService.UserId;

        _context.SystemCatalogs.Add(catalog);
        await _context.SaveChangesAsync(cancellationToken);

        return catalog.Id;
    }
}

// ============================================================
// UPDATE
// ============================================================
public record UpdateSystemCatalogCommand : IRequest
{
    public long Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int SortOrder { get; init; } = 0;
}

public class UpdateSystemCatalogCommandValidator : AbstractValidator<UpdateSystemCatalogCommand>
{
    public UpdateSystemCatalogCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("ID danh mục không hợp lệ.");
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên danh mục không được để trống.")
            .MaximumLength(255).WithMessage("Tên danh mục không vượt quá 255 ký tự.");
        RuleFor(x => x.SortOrder).GreaterThanOrEqualTo(0);
    }
}

public class UpdateSystemCatalogCommandHandler : IRequestHandler<UpdateSystemCatalogCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateSystemCatalogCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(UpdateSystemCatalogCommand request, CancellationToken cancellationToken)
    {
        var catalog = await _context.SystemCatalogs.FindAsync([request.Id], cancellationToken)
            ?? throw new NotFoundException("Danh mục hệ thống", request.Id);

        catalog.Update(request.Name, request.Description, request.SortOrder);
        catalog.UpdatedBy = _currentUserService.UserId;

        await _context.SaveChangesAsync(cancellationToken);
    }
}

// ============================================================
// TOGGLE STATUS (Activate / Deactivate)
// ============================================================
public record ToggleSystemCatalogStatusCommand(long Id, bool Activate) : IRequest;

public class ToggleSystemCatalogStatusCommandHandler : IRequestHandler<ToggleSystemCatalogStatusCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ToggleSystemCatalogStatusCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(ToggleSystemCatalogStatusCommand request, CancellationToken cancellationToken)
    {
        var catalog = await _context.SystemCatalogs.FindAsync([request.Id], cancellationToken)
            ?? throw new NotFoundException("Danh mục hệ thống", request.Id);

        if (request.Activate)
            catalog.Activate();
        else
            catalog.Deactivate();

        catalog.UpdatedBy = _currentUserService.UserId;

        await _context.SaveChangesAsync(cancellationToken);
    }
}

// ============================================================
// DELETE (Soft Delete)
// ============================================================
public record DeleteSystemCatalogCommand(long Id) : IRequest;

public class DeleteSystemCatalogCommandHandler : IRequestHandler<DeleteSystemCatalogCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteSystemCatalogCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(DeleteSystemCatalogCommand request, CancellationToken cancellationToken)
    {
        var catalog = await _context.SystemCatalogs.FindAsync([request.Id], cancellationToken)
            ?? throw new NotFoundException("Danh mục hệ thống", request.Id);

        if (catalog.IsSystemDefault)
            throw new BadRequestException("Không thể xóa danh mục hệ thống mặc định.");

        catalog.Status = EntityStatus.DELETED;
        catalog.UpdatedBy = _currentUserService.UserId;
        catalog.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
