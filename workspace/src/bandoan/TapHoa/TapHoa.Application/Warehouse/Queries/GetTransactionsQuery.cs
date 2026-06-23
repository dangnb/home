using MediatR;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Queries;

public record TransactionListDto(
    int Id,
    string Code,
    TransactionType Type,
    string CreatedBy,
    int ItemsCount,
    decimal TotalCost,
    DateTime CreatedAt,
    TransactionStatus Status);

public record GetTransactionsQuery() : IRequest<List<TransactionListDto>>;
