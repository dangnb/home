using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class SalaryTemplate : BaseAuditableEntity<Guid>
{
    public string Name { get; private set; } = string.Empty;
    public string Formula { get; private set; } = string.Empty;
    public string? Notes { get; private set; }
    public bool IsActive { get; private set; }

    private SalaryTemplate() { } // EF Core

    public SalaryTemplate(string name, string formula, string? notes = null)
    {
        Id = Guid.NewGuid();
        Name = name;
        Formula = formula;
        Notes = notes;
        IsActive = true;
    }

    public void Update(string name, string formula, string? notes, bool isActive)
    {
        Name = name;
        Formula = formula;
        Notes = notes;
        IsActive = isActive;
    }
}
