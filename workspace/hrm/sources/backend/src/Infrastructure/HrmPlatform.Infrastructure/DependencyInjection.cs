using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Infrastructure.Persistence;
using HrmPlatform.Infrastructure.Persistence.Interceptors;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HrmPlatform.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // 1. Đăng ký Interceptors
        services.AddScoped<AuditableEntityInterceptor>();
        services.AddScoped<AuditLogInterceptor>();

        // 2. Đăng ký ApplicationDbContext kết nối MariaDB qua Pomelo
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=localhost;Port=3306;Database=hrm_platform;User=root;Password=root;";

        // Cấu hình MariaDB ServerVersion (Mặc định 10.11 LTS nếu không thể auto-detect)
        var serverVersion = new MariaDbServerVersion(new Version(10, 11, 0));

        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            var auditableInterceptor = sp.GetRequiredService<AuditableEntityInterceptor>();
            var auditLogInterceptor = sp.GetRequiredService<AuditLogInterceptor>();

            options.UseMySql(connectionString, serverVersion, mySqlOptions =>
            {
                mySqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                mySqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(10),
                    errorNumbersToAdd: null);
            })
            .AddInterceptors(auditableInterceptor, auditLogInterceptor)
            .EnableDetailedErrors()
            .EnableSensitiveDataLogging(false);
        });

        // 3. Đăng ký Inversion of Control cho IApplicationDbContext
        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

        // 4. Đăng ký JWT Token Generator
        services.AddScoped<IJwtTokenGenerator, HrmPlatform.Infrastructure.Services.JwtTokenGenerator>();

        return services;
    }
}
