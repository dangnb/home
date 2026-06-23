using System.Text.Json.Serialization;

namespace TapHoa.Domain.Entities.Identity;

public class User
{
    public int Id { get; private set; }
    public string Username { get; private set; }
    public string PasswordHash { get; private set; }
    public string FullName { get; private set; }
    public string Email { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }

    [JsonIgnore]
    public virtual ICollection<Role> Roles { get; private set; } = new List<Role>();

    private User() { } // For EF

    public User(string username, string passwordHash, string fullName, string email)
    {
        Username = username;
        PasswordHash = passwordHash;
        FullName = fullName;
        Email = email;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
    }

    public void AssignRole(Role role)
    {
        if (!Roles.Contains(role))
        {
            Roles.Add(role);
        }
    }
}
