using MediatR;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Warehouse.Commands;

public class CreateInboundTransactionCommandHandler : IRequestHandler<CreateInboundTransactionCommand, Guid>
{
    private readonly IInventoryTransactionRepository _transactionRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateInboundTransactionCommandHandler(
        IInventoryTransactionRepository transactionRepository,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork)
    {
        _transactionRepository = transactionRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateInboundTransactionCommand request, CancellationToken cancellationToken)
    {
        if (request.Lines == null || !request.Lines.Any())
            throw new ArgumentException("Transaction must have at least one line.");

        var code = await _transactionRepository.GenerateNextCodeAsync(cancellationToken);
        
        var transaction = new InventoryTransaction(
            code,
            TransactionType.Inbound,
            request.ReferenceId,
            request.CreatedBy,
            request.Notes
        );

        transaction.SetPaymentDetails(request.AmountPaid, supplierId: request.SupplierId);

        foreach (var line in request.Lines)
        {
            var product = await _productRepository.GetByIdAsync(line.ProductId, cancellationToken);
            if (product == null)
                throw new ArgumentException($"Product with ID {line.ProductId} does not exist.");

            if (line.Quantity <= 0)
                throw new ArgumentException("Inbound quantity must be > 0.");

            Guid? batchId = line.ProductBatchId;
            if (string.IsNullOrWhiteSpace(line.BatchNumber) == false && line.MfgDate.HasValue && line.ExpiryDate.HasValue)
            {
                var dbContext = _unitOfWork as TapHoa.Application.Interfaces.IApplicationDbContext;
                if (dbContext != null)
                {
                    var existingBatch = dbContext.ProductBatches.FirstOrDefault(b => b.ProductId == line.ProductId && b.BatchNumber == line.BatchNumber);
                    if (existingBatch == null)
                    {
                        existingBatch = new ProductBatch(line.ProductId, line.BatchNumber, line.MfgDate.Value, line.ExpiryDate.Value);
                        dbContext.ProductBatches.Add(existingBatch);
                    }
                    batchId = existingBatch.Id;
                }
            }

            transaction.AddLine(product.Id, line.Quantity, line.UnitCost, batchId);
        }

        // Transactions are created in Draft mode. They must be submitted/approved later.
        await _transactionRepository.AddAsync(transaction, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
