using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Orders.Commands;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Orders.Commands;

public record CreateOnlineOrderCommand(
    string CustomerName,
    string CustomerPhone,
    string? CustomerAddress,
    List<OrderItemDto> Items,
    PaymentMethod PaymentMethod,
    string? Notes,
    Guid? LoggedInCustomerId = null,
    int PointsToUse = 0
) : IRequest<Guid>;

public class CreateOnlineOrderCommandValidator : AbstractValidator<CreateOnlineOrderCommand>
{
    public CreateOnlineOrderCommandValidator()
    {
        RuleFor(x => x.CustomerName).NotEmpty().WithMessage("Vui lòng nhập họ tên.");
        RuleFor(x => x.CustomerPhone).NotEmpty().WithMessage("Vui lòng nhập số điện thoại.");
        RuleFor(x => x.Items).NotEmpty().WithMessage("Đơn hàng phải có ít nhất 1 sản phẩm.");
        RuleFor(x => x.PointsToUse).GreaterThanOrEqualTo(0).WithMessage("Số điểm sử dụng không hợp lệ.");
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.Quantity).GreaterThan(0).WithMessage("Số lượng phải lớn hơn 0.");
        });
    }
}

public class CreateOnlineOrderCommandHandler : IRequestHandler<CreateOnlineOrderCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateOnlineOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateOnlineOrderCommand request, CancellationToken cancellationToken)
    {
        Customer? customer = null;
        
        if (request.LoggedInCustomerId.HasValue && request.LoggedInCustomerId.Value != Guid.Empty)
        {
            customer = await _context.Customers.FindAsync(new object[] { request.LoggedInCustomerId.Value }, cancellationToken);
        }

        if (customer == null)
        {
            customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.PhoneNumber == request.CustomerPhone, cancellationToken);
        }
            
        if (customer == null)
        {
            customer = Customer.Create(
                request.CustomerName, 
                request.CustomerPhone, 
                request.CustomerAddress, 
                "Tạo tự động từ Đơn hàng Online");
            _context.Customers.Add(customer);
        }
        else
        {
            // Update address if missing
            if (string.IsNullOrEmpty(customer.Address) && !string.IsNullOrEmpty(request.CustomerAddress))
            {
                customer.Update(
                    customer.FullName, 
                    customer.PhoneNumber, 
                    request.CustomerAddress, 
                    customer.Notes, 
                    customer.Email, 
                    customer.BankAccountNumber, 
                    customer.BankName);
            }
        }

        // Generate OrderCode
        var orderCount = await _context.Orders.IgnoreQueryFilters().CountAsync(cancellationToken);
        var orderCode = $"WEB-{DateTime.UtcNow:yyyyMMdd}-{(orderCount + 1):D4}";

        var orderNotes = request.Notes;
        if (!string.IsNullOrEmpty(request.CustomerAddress))
        {
            orderNotes = $"[Giao hàng tới: {request.CustomerAddress}] " + (orderNotes ?? "");
        }

        if (request.PointsToUse > 0)
        {
            customer.UsePoints(request.PointsToUse);
            orderNotes = $"[Dùng {request.PointsToUse} điểm loyalty] " + (orderNotes ?? "");
        }

        var order = new Order(
            orderCode,
            customer.Id,
            request.PaymentMethod,
            "Khách hàng Online",
            orderNotes ?? ""
        );

        // Here we can apply discount based on PointsToUse (e.g. 1 point = 1000 VND)
        if (request.PointsToUse > 0)
        {
            order.ApplyPoints(request.PointsToUse, request.PointsToUse * 1000); 
        }

        foreach (var item in request.Items)
        {
            var product = await _context.Products.FindAsync(new object[] { item.ProductId }, cancellationToken);
            if (product == null) throw new DomainException($"Sản phẩm có ID {item.ProductId} không tồn tại.");
            
            order.AddDetail(item.ProductId, item.Quantity, product.Price); 
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        return order.Id;
    }
}
