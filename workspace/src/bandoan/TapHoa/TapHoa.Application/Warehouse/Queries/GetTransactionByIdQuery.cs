using MediatR;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Queries;

public record TransactionDetailLineDto(Guid ProductId, string ProductName, int Quantity, decimal UnitCost);

public record TransactionDetailDto(
    Guid Id,
    string Code,
    TransactionType Type,
    string ReferenceId,
    string CreatedBy,
    string Notes,
    TransactionStatus Status,
    DateTime CreatedAt,
    List<TransactionDetailLineDto> Lines);

public record GetTransactionByIdQuery(Guid Id) : IRequest<TransactionDetailDto?>;
