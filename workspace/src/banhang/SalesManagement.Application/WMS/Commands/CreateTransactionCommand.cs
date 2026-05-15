using MediatR;
using SalesManagement.Infrastructure.Data;
using SalesManagement.Domain.Entities;
using SalesManagement.Domain.Enums;

namespace SalesManagement.Application.WMS.Commands;

public record TransactionDetailDto(Guid ProductId, int Quantity, decimal UnitPrice);
public record CreateTransactionDto(string Code, string Type, Guid WarehouseId, string Note, List<TransactionDetailDto> Details);

public record CreateTransactionCommand(CreateTransactionDto Dto) : IRequest<Guid>;

public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, Guid>
{
    private readonly ApplicationDbContext _db;

    public CreateTransactionCommandHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var type = request.Dto.Type.ToUpper() == "IN" ? TransactionType.IN : TransactionType.OUT;
        
        var transaction = new InventoryTransaction
        {
            Id = Guid.NewGuid(),
            Code = request.Dto.Code,
            Type = type,
            WarehouseId = request.Dto.WarehouseId,
            Note = request.Dto.Note,
            Status = TransactionStatus.DRAFT,
            CreatedBy = Guid.Empty, // Replace with User Context
            CreatedAt = DateTime.UtcNow,
            Details = request.Dto.Details.Select(d => new TransactionDetail
            {
                Id = Guid.NewGuid(),
                ProductId = d.ProductId,
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice
            }).ToList()
        };

        await _db.InventoryTransactions.AddAsync(transaction, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
