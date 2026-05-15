namespace SalesManagement.Domain.Entities;

public class Warehouse
{
    public Guid Id { get; private set; }
    public string Code { get; private set; }
    public string Name { get; private set; }
    public string Address { get; private set; }
    public string Status { get; private set; } // ACTIVE, INACTIVE

    private Warehouse() { }

    public Warehouse(string code, string name, string address)
    {
        Id = Guid.NewGuid();
        Code = code;
        Name = name;
        Address = address;
        Status = "ACTIVE";
    }

    public void Update(string code, string name, string address, string status)
    {
        Code = code;
        Name = name;
        Address = address;
        Status = status;
    }
}
