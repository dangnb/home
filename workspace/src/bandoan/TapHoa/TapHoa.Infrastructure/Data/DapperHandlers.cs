using System;
using System.Collections.Generic;
using Dapper;
using TapHoa.Domain.Enums;

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
        SqlMapper.RemoveTypeMap(typeof(Guid));
        SqlMapper.RemoveTypeMap(typeof(Guid?));
        SqlMapper.AddTypeHandler(new GuidTypeHandler());
        SqlMapper.AddTypeHandler(new NullableGuidTypeHandler());
        SqlMapper.AddTypeHandler(new ProductStatusHandler());
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
        if (value == null || value is DBNull) return Guid.Empty;
        if (value is Guid g) return g;
        if (value is string s && Guid.TryParse(s, out var guid))
            return guid;
        if (value is byte[] bytes && bytes.Length == 16)
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
        if (value == null || value is DBNull) return null;
        if (value is Guid g) return g;
        if (value is string s && Guid.TryParse(s, out var guid))
            return guid;
        if (value is byte[] bytes && bytes.Length == 16)
            return new Guid(bytes);
            
        return null;
    }
}

public class ProductStatusHandler : SqlMapper.TypeHandler<ProductStatus>
{
    public override void SetValue(System.Data.IDbDataParameter parameter, ProductStatus value)
    {
        parameter.Value = (int)value;
    }

    public override ProductStatus Parse(object value)
    {
        if (value == null || value is DBNull) return ProductStatus.Draft;
        
        if (value is int intValue && Enum.IsDefined(typeof(ProductStatus), intValue))
        {
            return (ProductStatus)intValue;
        }

        if (value is string strValue)
        {
            return strValue switch
            {
                "Đang bán" => ProductStatus.Active,
                "Ngừng bán" => ProductStatus.Discontinued,
                "Sắp hết" => ProductStatus.OutOfStock,
                "Lưu nháp" => ProductStatus.Draft,
                "Chờ duyệt" => ProductStatus.Pending,
                _ => Enum.TryParse<ProductStatus>(strValue, true, out var parsedStatus) ? parsedStatus : ProductStatus.Draft
            };
        }

        if (value is short shortValue && Enum.IsDefined(typeof(ProductStatus), (int)shortValue))
        {
            return (ProductStatus)shortValue;
        }
        
        if (value is byte byteValue && Enum.IsDefined(typeof(ProductStatus), (int)byteValue))
        {
            return (ProductStatus)byteValue;
        }

        return ProductStatus.Draft;
    }
}
