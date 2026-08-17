namespace EduProCRM.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string StaffCode { get; private set; } = string.Empty;
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Department { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public List<string> Permissions { get; private set; } = new();
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public string CreatedBy { get; private set; } = string.Empty;
    public DateTime? UpdatedAt { get; private set; }
    public string? UpdatedBy { get; private set; }

    public User() { }

    public static User Create(
        string staffCode,
        string fullName,
        string email,
        string department,
        string role,
        List<string> permissions,
        string createdBy)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            StaffCode = staffCode,
            FullName = fullName,
            Email = email,
            Department = department,
            Role = role,
            Permissions = permissions,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };
    }

    public void UpdatePermissions(List<string> newPermissions, string updatedBy)
    {
        Permissions = newPermissions;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = updatedBy;
    }

    public void ToggleActiveStatus(string updatedBy)
    {
        IsActive = !IsActive;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = updatedBy;
    }
}
