using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using TapHoa.Infrastructure.Data;
using TapHoa.Domain.Interfaces;
using TapHoa.Infrastructure.Repositories;
using TapHoa.Application.Interfaces;

namespace TapHoa.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Nơi đăng ký toàn bộ cơ sở hạ tầng (Database, ORM, Dapper, Repositories).
    /// Đây là tầng ngoài cùng của Clean Architecture, chịu trách nhiệm lưu trữ và tương tác nền tảng.
    /// </summary>
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var dbConnectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("DefaultConnection string is not found.");

        // Do AppDbContext có Inject ICurrentUserService (Scoped) qua constructor,
        // chúng ta BUỘC PHẢI DÙNG AddDbContext (Scoped) thay vì AddDbContextPool (Singleton).
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseMySQL(dbConnectionString, builder =>
            {
                 builder.EnableRetryOnFailure(
                     maxRetryCount: 5,
                     maxRetryDelay: TimeSpan.FromSeconds(10), // Tự động thử lại 5 lần, giãn cách 10s nếu DB mất kết nối tạm thời
                     errorNumbersToAdd: null);
            });
            
            // Helpful for debugging in Dev environments
            // options.EnableDetailedErrors(true);
            // options.EnableSensitiveDataLogging(true);
            
            // Lưu ý cực quan trọng: Chúng ta CỐ TÌNH LOẠI BỎ .UseLazyLoadingProxies(true) 
            // Kiến trúc Clean Architecture CQRS hiện tại áp dụng Eager Loading và raw query Dapper rất chặt chẽ 
            // để bảo vệ hệ thống khỏi lỗi sập cấu trúc N + 1 Queries nguy hiểm.
        });

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<AppDbContext>());
        
        // Repositories Configuration
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IInventoryTransactionRepository, InventoryTransactionRepository>();
        services.AddScoped<IStockLevelRepository, StockLevelRepository>();

        // Dapper Connection Factory & Handlers
        DapperConfiguration.RegisterTypeHandlers();
        services.AddSingleton<ISqlConnectionFactory>(new SqlConnectionFactory(dbConnectionString));

        return services;
    }
}
