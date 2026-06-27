using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class Supplier : BaseAuditableEntity<Guid>
{
    public string FullName { get; private set; } = null!;
    public string? PhoneNumber { get; private set; }
    public string? Address { get; private set; }
    public string? Notes { get; private set; }

    // Constructor required by EF Core
    private Supplier() { }

    public Supplier(string fullName, string? phoneNumber, string? address, string? notes)
    {
        Id = Guid.NewGuid();
        FullName = fullName;
        PhoneNumber = phoneNumber;
        Address = address;
        Notes = notes;
    }

    public void Update(string fullName, string? phoneNumber, string? address, string? notes)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        Address = address;
        Notes = notes;
    }
}
