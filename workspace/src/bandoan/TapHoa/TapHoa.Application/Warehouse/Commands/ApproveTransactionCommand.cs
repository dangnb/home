using MediatR;

namespace TapHoa.Application.Warehouse.Commands;

public record ApproveTransactionCommand(Guid TransactionId, string ApprovedBy) : IRequest<bool>;
