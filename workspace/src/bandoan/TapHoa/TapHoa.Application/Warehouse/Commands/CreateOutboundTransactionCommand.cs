using MediatR;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Commands;

public record CreateOutboundTransactionCommand(
    string ReferenceId,
    string Notes,
    string CreatedBy,
    List<OutboundTransactionLineDto> Lines,
    decimal AmountPaid = 0,
    Guid? CustomerId = null) : IRequest<Guid>;

public record OutboundTransactionLineDto(
    Guid ProductId,
    int Quantity,
    decimal UnitPrice,
    string? LocationCode = null,
    string? BatchNumber = null,
    Guid? ProductBatchId = null);

public class CreateOutboundTransactionCommandHandler : IRequestHandler<CreateOutboundTransactionCommand, Guid>
{
    private readonly IInventoryTransactionRepository _transactionRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateOutboundTransactionCommandHandler(IInventoryTransactionRepository transactionRepository, IProductRepository productRepository, IUnitOfWork unitOfWork)
    {
        _transactionRepository = transactionRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateOutboundTransactionCommand request, CancellationToken cancellationToken)
    {
        if (request.Lines == null || !request.Lines.Any())
            throw new ArgumentException("Transaction must have at least one line.");

        var code = await _transactionRepository.GenerateNextCodeAsync(cancellationToken);

        var transaction = new InventoryTransaction(
            code,
            TransactionType.Outbound,
            request.ReferenceId,
            request.CreatedBy,
            request.Notes
        );

        transaction.SetPaymentDetails(request.AmountPaid, customerId: request.CustomerId);

        foreach (var line in request.Lines)
        {
            var product = await _productRepository.GetByIdAsync(line.ProductId, cancellationToken);
            if (product == null)
                throw new ArgumentException($"Product with ID {line.ProductId} does not exist.");

            if (line.Quantity <= 0)
                throw new ArgumentException("Outbound quantity must be > 0.");

            Guid? batchId = line.ProductBatchId;
            if (batchId == null && !string.IsNullOrWhiteSpace(line.BatchNumber))
            {
                var dbContext = _unitOfWork as TapHoa.Application.Interfaces.IApplicationDbContext;
                if (dbContext != null)
                {
                    var existingBatch = dbContext.ProductBatches.FirstOrDefault(b => b.ProductId == line.ProductId && b.BatchNumber == line.BatchNumber);
                    if (existingBatch != null) batchId = existingBatch.Id;
                }
            }

            transaction.AddLine(product.Id, line.Quantity, line.UnitPrice, batchId);
        }

        await _transactionRepository.AddAsync(transaction, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
