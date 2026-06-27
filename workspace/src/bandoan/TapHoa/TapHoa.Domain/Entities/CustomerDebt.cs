using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class CustomerDebt : BaseAuditableEntity<Guid>
{
    public Guid CustomerId { get; private set; }
    // In a real system, we might have a Customer entity. For now, we can link it or just keep it simple.
    // If Customer doesn't exist, we can use a string CustomerName/PhoneNumber or create a Customer entity.
    public string CustomerName { get; private set; }
    public string? PhoneNumber { get; private set; }
    
    public decimal TotalDebt { get; private set; }

    private CustomerDebt() { }

    public CustomerDebt(Guid customerId, string customerName, string? phoneNumber)
    {
        CustomerId = customerId;
        CustomerName = customerName;
        PhoneNumber = phoneNumber;
        TotalDebt = 0;
    }

    public static CustomerDebt Create(Guid customerId, string customerName, string? phoneNumber)
    {
        return new CustomerDebt(customerId, customerName, phoneNumber);
    }

    public void AddDebt(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be greater than zero.");
        TotalDebt += amount;
    }

    public void PayDebt(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be greater than zero.");
        if (amount > TotalDebt) throw new InvalidOperationException("Payment amount exceeds total debt.");
        TotalDebt -= amount;
    }
}
