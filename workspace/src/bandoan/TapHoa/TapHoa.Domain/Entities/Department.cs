using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class Department : BaseAuditableEntity<Guid>
{
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public Guid CompanyId { get; private set; }

    public Guid? ParentId { get; private set; }
    public Department? ParentDepartment { get; private set; }
    public ICollection<Department> SubDepartments { get; private set; } = new List<Department>();

    private Department() { }

    public Department(string name, string? description, Guid companyId, Guid? parentId = null)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        CompanyId = companyId;
        ParentId = parentId;
    }

    public void Update(string name, string? description, Guid? parentId = null)
    {
        Name = name;
        Description = description;
        ParentId = parentId;
    }
}
