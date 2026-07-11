using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Promotions.Commands;

public class TogglePromotionStatusCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public bool IsActive { get; set; }
}

public class TogglePromotionStatusCommandHandler : IRequestHandler<TogglePromotionStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public TogglePromotionStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(TogglePromotionStatusCommand request, CancellationToken cancellationToken)
    {
        var promotion = await _context.Promotions.FindAsync(new object[] { request.Id }, cancellationToken);

        if (promotion == null)
            throw new ApplicationException("Promotion not found.");

        promotion.SetStatus(request.IsActive);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
