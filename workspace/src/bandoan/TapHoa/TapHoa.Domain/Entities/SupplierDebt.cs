using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class SupplierDebt : BaseAuditableEntity<Guid>
{
    public Guid SupplierId { get; private set; }
    public virtual Supplier? Supplier { get; private set; }
    
    public string SupplierName { get; private set; }
    public string? PhoneNumber { get; private set; }
    
    public decimal TotalDebt { get; private set; }

    private SupplierDebt() { }

    public SupplierDebt(Guid supplierId, string supplierName, string? phoneNumber)
    {
        Id = Guid.NewGuid();
        SupplierId = supplierId;
        SupplierName = supplierName;
        PhoneNumber = phoneNumber;
        TotalDebt = 0;
    }

    public static SupplierDebt Create(Guid supplierId, string supplierName, string? phoneNumber)
    {
        return new SupplierDebt(supplierId, supplierName, phoneNumber);
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
