using System;
using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities.Identity;

public class UserToken : BaseEntity<Guid>
{
    public Guid UserId { get; private set; }
    public string Token { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public bool IsRevoked { get; private set; }
    public DateTime CreatedAt { get; private set; }
    
    public virtual User User { get; private set; }

    private UserToken() { } // Constructor for EF Core

    public UserToken(Guid userId, string token, DateTime expiresAt)
    {
        UserId = userId;
        Token = token;
        ExpiresAt = expiresAt;
        IsRevoked = false;
        CreatedAt = DateTime.UtcNow;
    }

    public void Revoke()
    {
        IsRevoked = true;
    }
}
