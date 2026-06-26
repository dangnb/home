using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using MediatR;
using TapHoa.Application.Behaviors;
using TapHoa.Application.Products.Commands.CreateProduct;

namespace TapHoa.Application;

/// <summary>
/// Nơi đăng ký lõi trung tâm (Application Core) thuộc mô hình Use-Case của Clean Architecture.
/// Tận dụng tối đa sức mạnh của pipeline MediatR (áp dụng Pattern CQRS) và Validate tự động bằng FluentValidation 
/// để bảo vệ các logic nghiệp vụ một cách tuyệt đối an toàn và tách biệt.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var assembly = typeof(CreateProductCommand).Assembly;

        services.AddValidatorsFromAssembly(assembly);

        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(assembly);
            
            // Khai báo tập hợp các Pipeline Behavior sẽ chèn ngang vào giữa mỗi luồng thực thi CQRS
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuditBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
        });

        return services;
    }
}
