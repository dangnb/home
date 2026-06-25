using MediatR;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Interfaces;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Warehouse.Commands;

public class CheckoutRetailOrderCommandHandler : IRequestHandler<CheckoutRetailOrderCommand, bool>
{
    private readonly IInventoryTransactionRepository _txRepo;
    private readonly IStockLevelRepository _stockRepo;
    private readonly IProductRepository _productRepo;
    private readonly ICurrentUserService _currentUser;
    private readonly IUnitOfWork _uow;

    public CheckoutRetailOrderCommandHandler(
        IInventoryTransactionRepository txRepo,
        IStockLevelRepository stockRepo,
        IProductRepository productRepo,
        ICurrentUserService currentUser,
        IUnitOfWork uow)
    {
        _txRepo = txRepo;
        _stockRepo = stockRepo;
        _productRepo = productRepo;
        _currentUser = currentUser;
        _uow = uow;
    }

    public async Task<bool> Handle(CheckoutRetailOrderCommand request, CancellationToken cancellationToken)
    {
        var userName = _currentUser.UserName ?? "System";
        var transaction = new InventoryTransaction(
            code: request.OrderReference,
            type: TransactionType.Outbound,
            referenceId: request.OrderReference,
            createdBy: userName,
            notes: "Retail POS Checkout"
        );

        foreach (var item in request.Items)
        {
            var stock = await _stockRepo.GetByProductIdAndStoreIdAsync(item.ProductId, request.StoreId, cancellationToken);
            
            if (stock == null) 
            {
                // Auto create stock wrapper if it does not exist
                stock = new StockLevel(item.ProductId, request.StoreId);
                await _stockRepo.AddAsync(stock, cancellationToken);
                await _uow.SaveChangesAsync(cancellationToken); 
            }

            // Record transaction line with the Moving Average Cost (Giá vốn)
            transaction.AddLine(item.ProductId, item.Quantity, stock.MovingAverageCost);

            // Deduct physically and available since it's a completed instant checkout
            stock.DecreaseStock(item.Quantity);
            
            // Sync cache to product
            var product = await _productRepo.GetByIdAsync(item.ProductId, cancellationToken);
            if (product != null)
            {
                product.UpdateStockCache(stock.QuantityOnHand);
                if (stock.IsLowStock()) product.UpdateStatus("Sắp hết");
                else if (stock.QuantityOnHand == 0) product.UpdateStatus("Hết hàng");
                else product.UpdateStatus("Đang bán");
            }
        }

        // Auto approve and complete
        transaction.SubmitForApproval();
        transaction.Approve(userName);

        await _txRepo.AddAsync(transaction, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);

        return true;
    }
}
