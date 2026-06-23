using MediatR;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Queries;

public record TransactionDetailLineDto(int ProductId, string ProductName, int Quantity, decimal UnitCost);

public record TransactionDetailDto(
    int Id,
    string Code,
    TransactionType Type,
    string ReferenceId,
    string CreatedBy,
    string Notes,
    TransactionStatus Status,
    DateTime CreatedAt,
    List<TransactionDetailLineDto> Lines);

public record GetTransactionByIdQuery(int Id) : IRequest<TransactionDetailDto?>;
