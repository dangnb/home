using System;
using MediatR;

namespace TapHoa.Application.Warehouse.Commands;

public record DeleteTransactionCommand(Guid TransactionId) : IRequest<bool>;
