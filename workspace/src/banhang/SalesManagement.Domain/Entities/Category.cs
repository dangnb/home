namespace SalesManagement.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }

    private Category() { } // EF Core

    public Category(string name, string description)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
    }

    public void Update(string name, string description)
    {
        Name = name;
        Description = description;
    }
}
