using FluentValidation;

namespace TapHoa.Application.Suppliers.Commands;

public class CreateSupplierCommandValidator : AbstractValidator<CreateSupplierCommand>
{
    public CreateSupplierCommandValidator()
    {
        RuleFor(v => v.FullName)
            .NotEmpty().WithMessage("Tên nhà cung cấp không được để trống.")
            .MaximumLength(200).WithMessage("Tên nhà cung cấp không được vượt quá 200 ký tự.");

        RuleFor(v => v.Email)
            .EmailAddress().WithMessage("Email không hợp lệ.")
            .When(v => !string.IsNullOrEmpty(v.Email));

        RuleFor(v => v.PhoneNumber)
            .MaximumLength(20).WithMessage("Số điện thoại không được vượt quá 20 ký tự.");

        RuleFor(v => v.BankAccountNumber)
            .MaximumLength(50).WithMessage("Số tài khoản không được vượt quá 50 ký tự.");
            
        RuleFor(v => v.BankName)
            .MaximumLength(100).WithMessage("Tên ngân hàng không được vượt quá 100 ký tự.");
    }
}

public class UpdateSupplierCommandValidator : AbstractValidator<UpdateSupplierCommand>
{
    public UpdateSupplierCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("ID không hợp lệ.");

        RuleFor(v => v.FullName)
            .NotEmpty().WithMessage("Tên nhà cung cấp không được để trống.")
            .MaximumLength(200).WithMessage("Tên nhà cung cấp không được vượt quá 200 ký tự.");

        RuleFor(v => v.Email)
            .EmailAddress().WithMessage("Email không hợp lệ.")
            .When(v => !string.IsNullOrEmpty(v.Email));

        RuleFor(v => v.PhoneNumber)
            .MaximumLength(20).WithMessage("Số điện thoại không được vượt quá 20 ký tự.");

        RuleFor(v => v.BankAccountNumber)
            .MaximumLength(50).WithMessage("Số tài khoản không được vượt quá 50 ký tự.");
            
        RuleFor(v => v.BankName)
            .MaximumLength(100).WithMessage("Tên ngân hàng không được vượt quá 100 ký tự.");
    }
}
