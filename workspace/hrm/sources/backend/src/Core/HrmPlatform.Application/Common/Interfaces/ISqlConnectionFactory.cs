using System.Data;

namespace HrmPlatform.Application.Common.Interfaces;

/// <summary>
/// Factory cung cấp kết nối IDbConnection mở cho các tác vụ truy vấn đọc bằng Dapper (CQRS Read)
/// </summary>
public interface ISqlConnectionFactory
{
    IDbConnection CreateConnection();
}
