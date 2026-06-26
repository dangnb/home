using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Auth.Commands;

public class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RevokeTokenCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenRecord = await _context.UserTokens
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken, cancellationToken);

        if (tokenRecord == null) return false;

        tokenRecord.Revoke();
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
