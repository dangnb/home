using MediatR;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Commands;

public record CreateAdjustmentTransactionCommand(
    Guid ProductId,
    int NewQuantityOnHand,
    string Notes,
    string CreatedBy) : IRequest<Guid>;

public class CreateAdjustmentTransactionCommandHandler : IRequestHandler<CreateAdjustmentTransactionCommand, Guid>
{
    private readonly IInventoryTransactionRepository _transactionRepository;
    private readonly IProductRepository _productRepository;
    private readonly TapHoa.Application.Interfaces.IApplicationDbContext _context;
    private readonly IUnitOfWork _unitOfWork;

    public CreateAdjustmentTransactionCommandHandler(
        IInventoryTransactionRepository transactionRepository,
        IProductRepository productRepository,
        TapHoa.Application.Interfaces.IApplicationDbContext context,
        IUnitOfWork unitOfWork)
    {
        _transactionRepository = transactionRepository;
        _productRepository = productRepository;
        _context = context;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateAdjustmentTransactionCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.ProductId, cancellationToken);
        if (product == null)
            throw new ArgumentException("Product not found");

        var stockLevel = _context.StockLevels.FirstOrDefault(s => s.ProductId == request.ProductId && s.StoreId == _context.CurrentCompanyId);
        
        int currentQty = stockLevel?.QuantityOnHand ?? 0;
        int difference = request.NewQuantityOnHand - currentQty;

        if (difference == 0)
            throw new ArgumentException("New quantity is the same as current quantity.");

        var code = await _transactionRepository.GenerateNextCodeAsync(cancellationToken);

        var transaction = new InventoryTransaction(
            code,
            TransactionType.Adjustment,
            $"ADJ-{DateTime.UtcNow:yyyyMMdd}",
            request.CreatedBy,
            request.Notes
        );

        // Positive difference (Inbound like), Negative difference (Outbound like)
        // Adjustments are recorded as absolute value, and backend dictates if it's adding or subtracting based on sign?
        // Actually, InventoryTransactionLine quantity can be absolute, and the handler knows it's an adjustment, but how does it know whether to increment or decrement?
        // Let's use the difference directly. If it's negative, quantity is negative.
        // Wait, standard WMS: if diff is negative, we create a line with negative quantity, OR we rely on standard quantity and the handler figures out?
        // Since we know the diff, we'll store the DIFF as quantity.
        transaction.AddLine(product.Id, difference, product.Price);

        await _transactionRepository.AddAsync(transaction, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Adjustments should ideally be auto-approved for simplicity, or go to Draft.
        // Let's auto-approve it!
        transaction.SubmitForApproval();
        transaction.Approve("System Auto-Approve");

        if (stockLevel == null)
        {
            stockLevel = new StockLevel(product.Id, _context.CurrentCompanyId);
            _context.StockLevels.Add(stockLevel);
            stockLevel.IncreaseStock(difference, product.Price); // diff must be > 0 here
        }
        else
        {
            if (difference > 0)
                stockLevel.IncreaseStock(difference, product.Price);
            else
                stockLevel.DecreaseStock(Math.Abs(difference));
        }

        product.UpdateStockCache(request.NewQuantityOnHand);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
