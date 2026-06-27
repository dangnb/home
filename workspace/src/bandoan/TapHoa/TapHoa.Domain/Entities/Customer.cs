using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class Customer : BaseAuditableEntity<Guid>
{
    public string FullName { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? Address { get; private set; }
    public string? Notes { get; private set; }

    private Customer() { } // EF Core

    public Customer(string fullName, string? phoneNumber, string? address, string? notes)
    {

        FullName = fullName;
        PhoneNumber = phoneNumber;
        Address = address;
        Notes = notes;
    }

    public static Customer Create(string fullName, string? phoneNumber, string? address, string? notes)
    {
        return new Customer(fullName, phoneNumber, address, notes);
    }

    public void Update(string fullName, string? phoneNumber, string? address, string? notes)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        Address = address;
        Notes = notes;
    }
}
