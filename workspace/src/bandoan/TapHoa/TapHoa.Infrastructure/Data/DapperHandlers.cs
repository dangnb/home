using System;
using System.Collections.Generic;
using Dapper;

namespace TapHoa.Infrastructure.Data;

/// <summary>
/// Quản lý đăng ký các bộ chuyển đổi kiểu dữ liệu (Type Handlers) cho Dapper SqlMapper.
/// Giúp Dapper tự động Parse Guid, List<string> (như hình ảnh phụ), và GUID chuỗi về đúng chuẩn dữ liệu MySQL.
/// </summary>
public static class DapperConfiguration
{
    public static void RegisterTypeHandlers()
    {
        SqlMapper.AddTypeHandler(new JsonStringListTypeHandler());
        SqlMapper.AddTypeHandler(new GuidTypeHandler());
        SqlMapper.AddTypeHandler(new NullableGuidTypeHandler());
    }
}

public class JsonStringListTypeHandler : SqlMapper.TypeHandler<List<string>>
{
    public override void SetValue(System.Data.IDbDataParameter parameter, List<string> value)
    {
        parameter.Value = System.Text.Json.JsonSerializer.Serialize(value ?? new List<string>());
    }

    public override List<string> Parse(object value)
    {
        if (value is string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return new List<string>();
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        return new List<string>();
    }
}

public class GuidTypeHandler : SqlMapper.TypeHandler<Guid>
{
    public override void SetValue(System.Data.IDbDataParameter parameter, Guid value)
    {
        parameter.Value = value.ToString();
    }

    public override Guid Parse(object value)
    {
        if (value is string s && Guid.TryParse(s, out var guid))
            return guid;
        if (value is byte[] bytes)
            return new Guid(bytes);
            
        return Guid.Empty;
    }
}

public class NullableGuidTypeHandler : SqlMapper.TypeHandler<Guid?>
{
    public override void SetValue(System.Data.IDbDataParameter parameter, Guid? value)
    {
        if (value.HasValue) parameter.Value = value.Value.ToString();
        else parameter.Value = DBNull.Value;
    }

    public override Guid? Parse(object value)
    {
        if (value is string s && Guid.TryParse(s, out var guid))
            return guid;
        if (value is byte[] bytes)
            return new Guid(bytes);
            
        return null;
    }
}
