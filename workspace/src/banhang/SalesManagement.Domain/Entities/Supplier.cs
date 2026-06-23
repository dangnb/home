namespace SalesManagement.Domain.Entities;

public class Supplier
{
    public Guid Id { get; private set; }
    public string Code { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }
    public string Address { get; private set; }

    private Supplier() { }

    public Supplier(string code, string name, string email, string phone, string address)
    {
        Id = Guid.NewGuid();
        Code = code;
        Name = name;
        Email = email;
        Phone = phone;
        Address = address;
    }

    public void Update(string name, string email, string phone, string address)
    {
        Name = name;
        Email = email;
        Phone = phone;
        Address = address;
    }
}
