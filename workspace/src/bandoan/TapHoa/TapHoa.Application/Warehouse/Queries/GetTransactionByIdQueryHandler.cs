using MediatR;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Warehouse.Queries;

public class GetTransactionByIdQueryHandler : IRequestHandler<GetTransactionByIdQuery, TransactionDetailDto?>
{
    private readonly IInventoryTransactionRepository _transactionRepository;

    public GetTransactionByIdQueryHandler(IInventoryTransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<TransactionDetailDto?> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
    {
        var tx = await _transactionRepository.GetWithLinesAsync(request.Id, cancellationToken);
        if (tx == null) return null;

        return new TransactionDetailDto(
            tx.Id,
            tx.Code,
            tx.Type,
            tx.ReferenceId,
            tx.CreatedBy,
            tx.Notes,
            tx.Status,
            tx.CreatedAt,
            tx.Lines.Select(l => new TransactionDetailLineDto(
                l.ProductId,
                l.Product?.Name ?? $"Product #{l.ProductId}", 
                l.Quantity,
                l.UnitCost)).ToList()
        );
    }
}
