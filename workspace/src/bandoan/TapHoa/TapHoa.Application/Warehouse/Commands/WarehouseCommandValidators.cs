using FluentValidation;
using TapHoa.Application.Warehouse.Commands.CreateStockTake;

namespace TapHoa.Application.Warehouse.Commands;

public class CreateInboundTransactionCommandValidator : AbstractValidator<CreateInboundTransactionCommand>
{
    public CreateInboundTransactionCommandValidator()
    {
        RuleFor(v => v.ReferenceId)
            .NotEmpty().WithMessage("Mã tham chiếu không được để trống.")
            .MaximumLength(100).WithMessage("Mã tham chiếu không được vượt quá 100 ký tự.");

        RuleFor(v => v.Lines)
            .NotEmpty().WithMessage("Phiếu nhập kho phải có ít nhất một sản phẩm.");

        RuleForEach(v => v.Lines).ChildRules(line =>
        {
            line.RuleFor(l => l.ProductId).NotEmpty().WithMessage("ID sản phẩm không hợp lệ.");
            line.RuleFor(l => l.Quantity).GreaterThan(0).WithMessage("Số lượng phải lớn hơn 0.");
            line.RuleFor(l => l.UnitCost).GreaterThanOrEqualTo(0).WithMessage("Đơn giá không được âm.");
        });
    }
}

public class CreateOutboundTransactionCommandValidator : AbstractValidator<CreateOutboundTransactionCommand>
{
    public CreateOutboundTransactionCommandValidator()
    {
        RuleFor(v => v.ReferenceId)
            .NotEmpty().WithMessage("Mã tham chiếu không được để trống.")
            .MaximumLength(100).WithMessage("Mã tham chiếu không được vượt quá 100 ký tự.");

        RuleFor(v => v.Lines)
            .NotEmpty().WithMessage("Phiếu xuất kho phải có ít nhất một sản phẩm.");

        RuleForEach(v => v.Lines).ChildRules(line =>
        {
            line.RuleFor(l => l.ProductId).NotEmpty().WithMessage("ID sản phẩm không hợp lệ.");
            line.RuleFor(l => l.Quantity).GreaterThan(0).WithMessage("Số lượng xuất phải lớn hơn 0.");
            line.RuleFor(l => l.UnitPrice).GreaterThanOrEqualTo(0).WithMessage("Đơn giá không được âm.");
        });
    }
}

public class CreateStockTakeCommandValidator : AbstractValidator<CreateStockTakeCommand>
{
    public CreateStockTakeCommandValidator()
    {
        RuleFor(v => v.DocumentNo)
            .NotEmpty().WithMessage("Mã phiếu kiểm kê không được để trống.")
            .MaximumLength(100).WithMessage("Mã phiếu kiểm kê không được vượt quá 100 ký tự.");
            
        RuleFor(v => v.Notes)
            .MaximumLength(1000).WithMessage("Ghi chú không được vượt quá 1000 ký tự.");
    }
}
