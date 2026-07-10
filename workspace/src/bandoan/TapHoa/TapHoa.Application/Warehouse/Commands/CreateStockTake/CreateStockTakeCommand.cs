using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities.Warehouse;

namespace TapHoa.Application.Warehouse.Commands.CreateStockTake;

public class CreateStockTakeCommand : IRequest<Guid>
{
    public string DocumentNo { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public Guid? CategoryId { get; set; }
    public List<Guid>? ProductIds { get; set; }
}

public class CreateStockTakeCommandHandler : IRequestHandler<CreateStockTakeCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateStockTakeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateStockTakeCommand request, CancellationToken cancellationToken)
    {
        var stockTake = new StockTake(request.DocumentNo, request.Notes);

        var query = _context.Products.AsQueryable();

        if (request.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == request.CategoryId.Value);
        }
        else if (request.ProductIds != null && request.ProductIds.Any())
        {
            query = query.Where(p => request.ProductIds.Contains(p.Id));
        }

        var products = await query.ToListAsync(cancellationToken);

        foreach (var product in products)
        {
            stockTake.AddLine(product.Id, product.StockQuantity);
        }

        _context.StockTakes.Add(stockTake);
        await _context.SaveChangesAsync(cancellationToken);

        return stockTake.Id;
    }
}
