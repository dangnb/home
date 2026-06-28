namespace TapHoa.Application.Suppliers.DTOs;

public class SupplierDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
    public string? Email { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? BankName { get; set; }
}
