using MediatR;

namespace TapHoa.Application.Warehouse.Commands;

public record TransactionLineDto(Guid ProductId, int Quantity, decimal UnitCost, string? BatchNumber = null, DateTime? MfgDate = null, DateTime? ExpiryDate = null, Guid? ProductBatchId = null);

public record CreateInboundTransactionCommand(
    string ReferenceId, 
    string Notes, 
    List<TransactionLineDto> Lines,
    string CreatedBy = "System"
) : IRequest<Guid>;
