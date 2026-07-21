using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.PurchaseOrders.Commands;

public record AutoDraftPurchaseOrderCommand : IRequest<List<Guid>>;

public class AutoDraftPurchaseOrderCommandHandler : IRequestHandler<AutoDraftPurchaseOrderCommand, List<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AutoDraftPurchaseOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<Guid>> Handle(AutoDraftPurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        // 1. Lấy tất cả sản phẩm sắp hết hàng
        var lowStockProducts = await _context.Products
            .Where(p => p.MinStockLevel > 0 && p.StockQuantity <= p.MinStockLevel)
            .ToListAsync(cancellationToken);

        if (!lowStockProducts.Any())
        {
            return new List<Guid>();
        }

        // 2. Nhóm theo Nhà cung cấp
        var groupedBySupplier = lowStockProducts.GroupBy(p => p.SupplierId);
        var createdPoIds = new List<Guid>();

        foreach (var group in groupedBySupplier)
        {
            var supplierId = group.Key;
            
            // Nếu không có supplier thì bỏ qua hoặc gán cho NCC "Chưa xác định"
            if (!supplierId.HasValue) continue;

            var orderCode = $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";
            
            var po = new PurchaseOrder(
                orderCode,
                supplierId.Value,
                DateTime.UtcNow.AddDays(3), // Dự kiến giao hàng sau 3 ngày
                "Tự động tạo từ cảnh báo tồn kho thấp"
            );

            foreach (var product in group)
            {
                // Tính số lượng cần đặt = MaxStockLevel - StockQuantity
                // Nếu MaxStockLevel = 0 thì tự đặt mặc định là MinStockLevel * 2
                var targetQuantity = product.MaxStockLevel > 0 ? product.MaxStockLevel : product.MinStockLevel * 2;
                var orderQuantity = targetQuantity - product.StockQuantity;
                if (orderQuantity <= 0) orderQuantity = product.MinStockLevel;

                po.AddDetail(product.Id, orderQuantity, product.CostPrice);
            }

            _context.PurchaseOrders.Add(po);
            createdPoIds.Add(po.Id);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return createdPoIds;
    }
}
