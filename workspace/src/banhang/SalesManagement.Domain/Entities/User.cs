namespace SalesManagement.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    
    public Role Role { get; private set; } = null!;
    public Guid RoleId { get; private set; }

    protected User() { } // For EF Core

    public User(string username, string passwordHash, Guid roleId)
    {
        Id = Guid.NewGuid();
        Username = username;
        PasswordHash = passwordHash;
        RoleId = roleId;
    }
}
