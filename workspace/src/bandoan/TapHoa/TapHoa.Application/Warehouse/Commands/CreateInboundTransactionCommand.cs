using MediatR;

namespace TapHoa.Application.Warehouse.Commands;

public record TransactionLineDto(Guid ProductId, int Quantity, decimal UnitCost);

public record CreateInboundTransactionCommand(
    string ReferenceId, 
    string Notes, 
    List<TransactionLineDto> Lines,
    string CreatedBy = "System"
) : IRequest<Guid>;
