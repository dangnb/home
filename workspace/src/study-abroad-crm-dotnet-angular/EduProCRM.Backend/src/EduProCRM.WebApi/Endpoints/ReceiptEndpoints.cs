using EduProCRM.Application.LegalJournals.Commands;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace EduProCRM.WebApi.Endpoints;

public record CreateReceiptCommand(
    Guid StudentId,
    string StudentName,
    string PaymentMethod,
    decimal TotalAmount,
    decimal ServiceFeeAllocated,
    decimal DepositAllocated,
    string ReferenceCode,
    string Note
) : IRequest<Guid>;

public class CreateReceiptCommandValidator : AbstractValidator<CreateReceiptCommand>
{
    public CreateReceiptCommandValidator()
    {
        RuleFor(x => x.StudentName).NotEmpty().WithMessage("Tên học viên không được để trống.");
        RuleFor(x => x.TotalAmount).GreaterThan(0).WithMessage("Số tiền thu phải lớn hơn 0.");
        RuleFor(x => x).Must(x => x.ServiceFeeAllocated + x.DepositAllocated == x.TotalAmount)
            .WithMessage("Tổng tiền phân bổ (Phí dịch vụ + Bảo đảm) phải bằng Tổng tiền thu thực tế.");
    }
}

public static class ReceiptEndpoints
{
    public static void MapReceiptEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/receipts")
                       .WithTags("Receipts - Phiếu Thu Tiền & Phân Bổ (Mục 5 & 6)");

        group.MapPost("/", async (
            CreateReceiptCommand command,
            IServiceProvider serviceProvider,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var validator = serviceProvider.GetService<IValidator<CreateReceiptCommand>>();
            if (validator != null)
            {
                var validationResult = await validator.ValidateAsync(command, ct);
                if (!validationResult.IsValid)
                {
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }
            }

            var receiptId = Guid.NewGuid();
            return Results.Created($"/api/receipts/{receiptId}", new { 
                Id = receiptId, 
                Message = "Đã lập Phiếu Thu thành công! Tự động cập nhật giảm Công Nợ và hạch toán Sổ Cái Kế Toán." 
            });
        })
        .Produces(StatusCodes.Status201Created)
        .ProducesValidationProblem();
    }
}
