using FluentValidation;

namespace TapHoa.Application.SalaryTemplates.Commands;

public class CreateSalaryTemplateCommandValidator : AbstractValidator<CreateSalaryTemplateCommand>
{
    public CreateSalaryTemplateCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Tên mẫu lương không được để trống.")
            .MaximumLength(200).WithMessage("Tên mẫu lương không được vượt quá 200 ký tự.");
            
        RuleFor(v => v.Formula)
            .NotEmpty().WithMessage("Công thức tính lương không được để trống.");

        RuleFor(v => v.Notes)
            .MaximumLength(1000).WithMessage("Ghi chú không được vượt quá 1000 ký tự.");
    }
}

public class UpdateSalaryTemplateCommandValidator : AbstractValidator<UpdateSalaryTemplateCommand>
{
    public UpdateSalaryTemplateCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("ID không hợp lệ.");
        
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Tên mẫu lương không được để trống.")
            .MaximumLength(200).WithMessage("Tên mẫu lương không được vượt quá 200 ký tự.");
            
        RuleFor(v => v.Formula)
            .NotEmpty().WithMessage("Công thức tính lương không được để trống.");

        RuleFor(v => v.Notes)
            .MaximumLength(1000).WithMessage("Ghi chú không được vượt quá 1000 ký tự.");
    }
}
