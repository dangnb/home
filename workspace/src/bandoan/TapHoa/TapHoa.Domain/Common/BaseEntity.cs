using System;

namespace TapHoa.Domain.Common;

/// <summary>
/// Lớp nền hạt nhân cho tất cả các Thực thể (Entities).
/// Tự động khởi tạo khóa chính Id phù hợp theo kiểu dữ liệu.
/// Nếu kiểu truyền vào là Guid, tự động sinh UUID v7 tối ưu cho tốc độ Sort/Index của database.
/// Tránh việc khai báo lặp đi lặp lại trường Id ở từng Table riêng lẻ.
/// </summary>
public abstract class BaseEntity<TId>
{
    public TId Id { get; protected set; } = default!;

    protected BaseEntity()
    {
        if (typeof(TId) == typeof(Guid))
        {
            Id = (TId)(object)Guid.CreateVersion7();
        }
        else if (typeof(TId) == typeof(string))
        {
            Id = (TId)(object)Guid.CreateVersion7().ToString();
        }
    }
}
