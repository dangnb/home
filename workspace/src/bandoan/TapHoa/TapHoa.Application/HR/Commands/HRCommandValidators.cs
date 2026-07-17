using FluentValidation;

namespace TapHoa.Application.HR.Commands;

public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Tên phòng ban không được để trống.")
            .MaximumLength(200).WithMessage("Tên phòng ban không được vượt quá 200 ký tự.");
            
        RuleFor(v => v.Description)
            .MaximumLength(1000).WithMessage("Mô tả không được vượt quá 1000 ký tự.");
    }
}

public class UpdateDepartmentCommandValidator : AbstractValidator<UpdateDepartmentCommand>
{
    public UpdateDepartmentCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("ID không hợp lệ.");
        
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Tên phòng ban không được để trống.")
            .MaximumLength(200).WithMessage("Tên phòng ban không được vượt quá 200 ký tự.");
            
        RuleFor(v => v.Description)
            .MaximumLength(1000).WithMessage("Mô tả không được vượt quá 1000 ký tự.");
    }
}

public class CreatePositionCommandValidator : AbstractValidator<CreatePositionCommand>
{
    public CreatePositionCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Tên chức vụ không được để trống.")
            .MaximumLength(200).WithMessage("Tên chức vụ không được vượt quá 200 ký tự.");
            
        RuleFor(v => v.Description)
            .MaximumLength(1000).WithMessage("Mô tả không được vượt quá 1000 ký tự.");
    }
}

public class UpdatePositionCommandValidator : AbstractValidator<UpdatePositionCommand>
{
    public UpdatePositionCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("ID không hợp lệ.");
        
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Tên chức vụ không được để trống.")
            .MaximumLength(200).WithMessage("Tên chức vụ không được vượt quá 200 ký tự.");
            
        RuleFor(v => v.Description)
            .MaximumLength(1000).WithMessage("Mô tả không được vượt quá 1000 ký tự.");
    }
}

public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    public CreateEmployeeCommandValidator()
    {
        RuleFor(v => v.EmployeeCode)
            .NotEmpty().WithMessage("Mã nhân viên không được để trống.")
            .MaximumLength(50).WithMessage("Mã nhân viên không được vượt quá 50 ký tự.");
            
        RuleFor(v => v.FullName)
            .NotEmpty().WithMessage("Họ tên không được để trống.")
            .MaximumLength(200).WithMessage("Họ tên không được vượt quá 200 ký tự.");

        RuleFor(v => v.Email)
            .EmailAddress().WithMessage("Email không hợp lệ.")
            .When(v => !string.IsNullOrEmpty(v.Email));

        RuleFor(v => v.BaseSalary)
            .GreaterThanOrEqualTo(0).WithMessage("Lương cơ bản không được âm.");
    }
}

public class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
{
    public UpdateEmployeeCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("ID không hợp lệ.");
        
        RuleFor(v => v.EmployeeCode)
            .NotEmpty().WithMessage("Mã nhân viên không được để trống.")
            .MaximumLength(50).WithMessage("Mã nhân viên không được vượt quá 50 ký tự.");
            
        RuleFor(v => v.FullName)
            .NotEmpty().WithMessage("Họ tên không được để trống.")
            .MaximumLength(200).WithMessage("Họ tên không được vượt quá 200 ký tự.");

        RuleFor(v => v.Email)
            .EmailAddress().WithMessage("Email không hợp lệ.")
            .When(v => !string.IsNullOrEmpty(v.Email));

        RuleFor(v => v.BaseSalary)
            .GreaterThanOrEqualTo(0).WithMessage("Lương cơ bản không được âm.");
    }
}
