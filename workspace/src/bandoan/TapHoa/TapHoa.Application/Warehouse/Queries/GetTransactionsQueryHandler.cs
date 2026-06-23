using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Warehouse.Queries;

public class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, List<TransactionListDto>>
{
    private readonly IInventoryTransactionRepository _transactionRepository;

    public GetTransactionsQueryHandler(IInventoryTransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<List<TransactionListDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        var txs = await _transactionRepository.GetAllWithLinesAsync(cancellationToken);
        
        return txs.OrderByDescending(x => x.CreatedAt).Select(tx => new TransactionListDto(
            tx.Id,
            tx.Code,
            tx.Type,
            tx.CreatedBy,
            tx.Lines?.Count ?? 0,
            tx.Lines?.Sum(l => l.Quantity * l.UnitCost) ?? 0m,
            tx.CreatedAt,
            tx.Status
        )).ToList();
    }
}
