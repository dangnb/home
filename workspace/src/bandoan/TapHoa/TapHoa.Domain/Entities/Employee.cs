using TapHoa.Domain.Common;
using TapHoa.Domain.Entities.Identity;

namespace TapHoa.Domain.Entities;

public class Employee : BaseAuditableEntity<Guid>
{
    public string EmployeeCode { get; private set; }
    public string FullName { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? CitizenId { get; private set; }
    public string? Address { get; private set; }
    public DateTime? DateOfBirth { get; private set; }
    public string? Gender { get; private set; }
    public string? Email { get; private set; }

    public decimal BaseSalary { get; private set; }
    public Guid? SalaryTemplateId { get; private set; }
    public virtual SalaryTemplate? SalaryTemplate { get; private set; }

    public Guid? DepartmentId { get; private set; }
    public virtual Department? Department { get; private set; }

    public Guid? PositionId { get; private set; }
    public virtual Position? Position { get; private set; }

    public Guid? UserId { get; private set; }
    public virtual User? User { get; private set; }

    public Guid CompanyId { get; private set; }

    private Employee() { }

    public Employee(string employeeCode, string fullName, Guid companyId, string? phoneNumber = null, string? citizenId = null, string? address = null, DateTime? dateOfBirth = null, string? gender = null, string? email = null, decimal baseSalary = 0)
    {
        Id = Guid.NewGuid();
        EmployeeCode = employeeCode;
        FullName = fullName;
        CompanyId = companyId;
        PhoneNumber = phoneNumber;
        CitizenId = citizenId;
        Address = address;
        DateOfBirth = dateOfBirth;
        Gender = gender;
        Email = email;
        BaseSalary = baseSalary;
    }

    public void UpdateProfile(string fullName, string? phoneNumber, string? citizenId, string? address, DateTime? dateOfBirth, string? gender, string? email)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        CitizenId = citizenId;
        Address = address;
        DateOfBirth = dateOfBirth;
        Gender = gender;
        Email = email;
    }

    public void AssignToDepartment(Guid? departmentId, Guid? positionId)
    {
        DepartmentId = departmentId;
        PositionId = positionId;
    }

    public void AssignSalary(decimal baseSalary, Guid? salaryTemplateId)
    {
        BaseSalary = baseSalary;
        SalaryTemplateId = salaryTemplateId;
    }

    public void LinkUserAccount(Guid? userId)
    {
        UserId = userId;
    }
}
