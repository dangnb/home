using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Warehouse.Commands.UpdateStockTakeLine;

public class UpdateStockTakeLineCommand : IRequest
{
    public Guid StockTakeId { get; set; }
    public Guid LineId { get; set; }
    public int ActualQuantity { get; set; }
    public string? Reason { get; set; }
}

public class UpdateStockTakeLineCommandHandler : IRequestHandler<UpdateStockTakeLineCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateStockTakeLineCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateStockTakeLineCommand request, CancellationToken cancellationToken)
    {
        var stockTake = await _context.StockTakes
            .Include(x => x.Lines)
            .FirstOrDefaultAsync(x => x.Id == request.StockTakeId, cancellationToken);

        if (stockTake == null)
            throw new KeyNotFoundException($"StockTake with ID {request.StockTakeId} not found");

        var line = stockTake.Lines.FirstOrDefault(x => x.Id == request.LineId);
        if (line == null)
            throw new KeyNotFoundException($"Line with ID {request.LineId} not found");

        if (stockTake.Status != Domain.Enums.StockTakeStatus.Draft && stockTake.Status != Domain.Enums.StockTakeStatus.InProgress)
        {
            throw new DomainException("Chỉ có thể cập nhật số lượng khi phiếu ở trạng thái Nháp hoặc Đang kiểm kê.");
        }

        if (stockTake.Status == Domain.Enums.StockTakeStatus.Draft)
        {
            stockTake.Start();
        }

        line.UpdateActualQuantity(request.ActualQuantity, request.Reason);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
