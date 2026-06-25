using TapHoa.Domain.Common;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Domain.Entities;

public class Category : BaseAuditableEntity
{
    public Guid Id { get; private set; } = Guid.CreateVersion7();
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string Icon { get; private set; }

    private Category() { }

    private Category(string name, string description, string icon)
    {
        Name = name;
        Description = description;
        Icon = icon;
    }

    public static Category Create(string name, string description, string icon)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên danh mục không được để trống.");

        return new Category(name, description, icon);
    }

    public void Update(string name, string description, string icon)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên danh mục không được để trống.");

        Name = name;
        Description = description;
        Icon = icon;
    }
}
