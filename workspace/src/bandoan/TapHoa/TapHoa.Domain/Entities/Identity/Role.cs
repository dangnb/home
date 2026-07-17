using System.Text.Json.Serialization;

namespace TapHoa.Domain.Entities.Identity;

using TapHoa.Domain.Common;

public class Role : BaseEntity<Guid>
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string Permissions { get; private set; }

    [JsonIgnore]
    public virtual ICollection<User> Users { get; private set; } = new List<User>();

    private Role() { } // For EF

    public Role(string name, string description, string permissions = "[]")
    {
        Name = name;
        Description = description;
        Permissions = permissions;
    }

    public void UpdatePermissions(string permissions)
    {
        Permissions = permissions;
    }
}
