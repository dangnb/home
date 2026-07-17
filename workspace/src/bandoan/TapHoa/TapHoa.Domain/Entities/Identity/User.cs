using System.Text.Json.Serialization;

namespace TapHoa.Domain.Entities.Identity;

using TapHoa.Domain.Common;

public class User : BaseEntity<Guid>
{
    public string Username { get; private set; }
    public string PasswordHash { get; private set; }
    public string FullName { get; private set; }
    public string Email { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid CompanyId { get; private set; }
    
    public string? PhoneNumber { get; private set; }
    public string? CitizenId { get; private set; }
    public string? Address { get; private set; }

    [JsonIgnore]
    public virtual ICollection<Role> Roles { get; private set; } = new List<Role>();

    private User() { } // For EF

    public User(string username, string passwordHash, string fullName, string email, Guid companyId, string? phoneNumber = null, string? citizenId = null, string? address = null)
    {
        Username = username;
        PasswordHash = passwordHash;
        FullName = fullName;
        Email = email;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        CompanyId = companyId;
        PhoneNumber = phoneNumber;
        CitizenId = citizenId;
        Address = address;
    }

    public void UpdateProfile(string fullName, string? phoneNumber, string? citizenId, string? address)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        CitizenId = citizenId;
        Address = address;
    }

    public void AssignRole(Role role)
    {
        if (!Roles.Contains(role))
        {
            Roles.Add(role);
        }
    }

    public void UpdatePassword(string passwordHash)
    {
        PasswordHash = passwordHash;
    }
}
