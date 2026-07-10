using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Exceptions;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Warehouse.Commands.CompleteStockTake;

public class CompleteStockTakeCommand : IRequest
{
    public Guid StockTakeId { get; set; }
    public string CompletedBy { get; set; } = string.Empty;
}

public class CompleteStockTakeCommandHandler : IRequestHandler<CompleteStockTakeCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IInventoryTransactionRepository _transactionRepository;
    private readonly IMediator _mediator;

    public CompleteStockTakeCommandHandler(IApplicationDbContext context, IInventoryTransactionRepository transactionRepository, IMediator mediator)
    {
        _context = context;
        _transactionRepository = transactionRepository;
        _mediator = mediator;
    }

    public async Task Handle(CompleteStockTakeCommand request, CancellationToken cancellationToken)
    {
        var stockTake = await _context.StockTakes
            .Include(x => x.Lines)
            .FirstOrDefaultAsync(x => x.Id == request.StockTakeId, cancellationToken);

        if (stockTake == null)
            throw new KeyNotFoundException($"StockTake with ID {request.StockTakeId} not found");

        stockTake.Complete();

        var differences = stockTake.Lines.Where(x => x.Difference != 0).ToList();

        if (differences.Any())
        {
            var code = await _transactionRepository.GenerateNextCodeAsync(cancellationToken);
            var transaction = new InventoryTransaction(
                code,
                TapHoa.Domain.Enums.TransactionType.Adjustment,
                stockTake.DocumentNo,
                request.CompletedBy,
                $"Phiếu điều chỉnh tự động từ kiểm kê {stockTake.DocumentNo}"
            );

            foreach (var diff in differences)
            {
                var product = await _context.Products.FindAsync(new object[] { diff.ProductId }, cancellationToken);
                var unitCost = product?.CostPrice ?? 0;
                
                // Difference = ActualQuantity - ExpectedQuantity
                // If Difference > 0 (Dư kho), Quantity is positive.
                // If Difference < 0 (Thiếu kho), Quantity is negative.
                transaction.AddLine(diff.ProductId, diff.Difference, unitCost, null);
            }

            await _transactionRepository.AddAsync(transaction, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // Directly approve the transaction to apply stock movements
            await _mediator.Send(new ApproveTransactionCommand(transaction.Id, request.CompletedBy), cancellationToken);
        }
        else
        {
            // No differences, just save the StockTake status
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
