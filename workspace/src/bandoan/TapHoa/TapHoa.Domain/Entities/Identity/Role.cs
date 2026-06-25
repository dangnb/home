using System.Text.Json.Serialization;

namespace TapHoa.Domain.Entities.Identity;

public class Role
{
    public Guid Id { get; private set; } = Guid.CreateVersion7();
    public string Name { get; private set; }
    public string Description { get; private set; }
    public long Permissions { get; private set; }

    [JsonIgnore]
    public virtual ICollection<User> Users { get; private set; } = new List<User>();

    private Role() { } // For EF

    public Role(string name, string description, long permissions = 0)
    {
        Name = name;
        Description = description;
        Permissions = permissions;
    }

    public void UpdatePermissions(long permissions)
    {
        Permissions = permissions;
    }
}
