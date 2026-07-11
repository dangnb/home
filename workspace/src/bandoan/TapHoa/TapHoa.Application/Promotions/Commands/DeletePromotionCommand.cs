using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Promotions.Commands;

public class DeletePromotionCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeletePromotionCommandHandler : IRequestHandler<DeletePromotionCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeletePromotionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeletePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = await _context.Promotions.FindAsync(new object[] { request.Id }, cancellationToken);

        if (promotion == null)
            throw new ApplicationException("Promotion not found.");

        _context.Promotions.Remove(promotion);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
