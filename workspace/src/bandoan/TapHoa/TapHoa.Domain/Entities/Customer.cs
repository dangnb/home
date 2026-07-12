using TapHoa.Domain.Common;

using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

public class Customer : BaseAuditableEntity<Guid>
{
    public string FullName { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? Address { get; private set; }
    public string? Notes { get; private set; }
    public string? Email { get; private set; }
    public string? BankAccountNumber { get; private set; }
    public string? BankName { get; private set; }
    public int LoyaltyPoints { get; private set; } = 0;
    public CustomerTier Tier { get; private set; } = CustomerTier.Standard;
    public int TotalAccumulatedPoints { get; private set; } = 0;

    private Customer() { } // EF Core

    public Customer(string fullName, string? phoneNumber, string? address, string? notes, string? email = null, string? bankAccountNumber = null, string? bankName = null)
    {

        FullName = fullName;
        PhoneNumber = phoneNumber;
        Address = address;
        Notes = notes;
        Email = email;
        BankAccountNumber = bankAccountNumber;
        BankName = bankName;
    }

    public static Customer Create(string fullName, string? phoneNumber, string? address, string? notes, string? email = null, string? bankAccountNumber = null, string? bankName = null)
    {
        return new Customer(fullName, phoneNumber, address, notes, email, bankAccountNumber, bankName);
    }

    public void Update(string fullName, string? phoneNumber, string? address, string? notes, string? email = null, string? bankAccountNumber = null, string? bankName = null)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        Address = address;
        Notes = notes;
        Email = email;
        BankAccountNumber = bankAccountNumber;
        BankName = bankName;
    }

    public void AddPoints(int points)
    {
        if (points < 0) throw new ArgumentException("Points to add must be positive", nameof(points));
        LoyaltyPoints += points;
        TotalAccumulatedPoints += points;
        EvaluateTier();
    }

    private void EvaluateTier()
    {
        if (TotalAccumulatedPoints >= 2000) Tier = CustomerTier.Platinum;
        else if (TotalAccumulatedPoints >= 500) Tier = CustomerTier.Gold;
        else if (TotalAccumulatedPoints >= 100) Tier = CustomerTier.Silver;
        else Tier = CustomerTier.Standard;
    }

    public void UsePoints(int points)
    {
        if (points < 0) throw new ArgumentException("Points to use must be positive", nameof(points));
        if (LoyaltyPoints < points) throw new InvalidOperationException("Not enough loyalty points");
        LoyaltyPoints -= points;
    }
}
