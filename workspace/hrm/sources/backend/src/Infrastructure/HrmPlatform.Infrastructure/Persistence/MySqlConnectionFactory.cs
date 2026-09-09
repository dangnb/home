using System.Data;
using HrmPlatform.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using MySqlConnector;

namespace HrmPlatform.Infrastructure.Persistence;

/// <summary>
/// Khởi tạo kết nối MySqlConnection tối ưu cho Dapper truy vấn MariaDB
/// </summary>
public class MySqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string _connectionString;

    public MySqlConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chuỗi kết nối 'DefaultConnection' không được cấu hình.");
    }

    public IDbConnection CreateConnection()
    {
        return new MySqlConnection(_connectionString);
    }
}
