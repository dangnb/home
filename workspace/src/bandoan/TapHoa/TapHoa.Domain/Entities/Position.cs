using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class Position : BaseAuditableEntity<Guid>
{
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public Guid CompanyId { get; private set; }

    private Position() { }

    public Position(string name, string? description, Guid companyId)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        CompanyId = companyId;
    }

    public void Update(string name, string? description)
    {
        Name = name;
        Description = description;
    }
}
