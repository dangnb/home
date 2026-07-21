using TapHoa.Domain.Common;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Domain.Entities;

public class Category : BaseAuditableEntity<Guid>
{
    public string Name { get; private set; }
    public string Slug { get; private set; }
    public string Description { get; private set; }
    public string Icon { get; private set; }
    
    // Thuộc tính cha/con
    public Guid? ParentId { get; private set; }
    public virtual Category? ParentCategory { get; private set; }
    public virtual ICollection<Category> SubCategories { get; private set; } = new List<Category>();

    private Category() { }

    private Category(string name, string description, string icon, Guid? parentId = null)
    {
        Name = name;
        Slug = SlugHelper.GenerateSlug(name);
        Description = description;
        Icon = icon;
        ParentId = parentId;
    }

    public static Category Create(string name, string description, string icon, Guid? parentId = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên danh mục không được để trống.");

        return new Category(name, description, icon, parentId);
    }

    public void Update(string name, string description, string icon, Guid? parentId = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên danh mục không được để trống.");

        Name = name;
        Slug = SlugHelper.GenerateSlug(name);
        Description = description;
        Icon = icon;
        
        // Không cho phép cha là chính nó
        if (parentId.HasValue && parentId.Value == Id)
            throw new DomainException("Danh mục không thể là cha của chính nó.");
            
        ParentId = parentId;
    }
}
