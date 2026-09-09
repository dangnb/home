using System.Reflection;
using FluentValidation;
using HrmPlatform.Application.Common.Behaviors;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace HrmPlatform.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // 1. Đăng ký tất cả FluentValidation Validators trong Application assembly
        services.AddValidatorsFromAssembly(assembly);

        // 2. Đăng ký MediatR và gắn ValidationBehavior vào Pipeline
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        });

        return services;
    }
}
