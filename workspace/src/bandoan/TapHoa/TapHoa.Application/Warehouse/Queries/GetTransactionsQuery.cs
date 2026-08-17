using MediatR;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Queries;

public class TransactionListDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public int ItemsCount { get; set; }
    public decimal TotalCost { get; set; }
    public DateTime CreatedAt { get; set; }
    public TransactionStatus Status { get; set; }
}

public record GetTransactionsQuery() : IRequest<List<TransactionListDto>>;
