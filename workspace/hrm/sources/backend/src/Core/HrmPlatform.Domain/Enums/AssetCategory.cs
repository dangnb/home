namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Danh mục loại hình tài sản & thiết bị
/// </summary>
public enum AssetCategory
{
    IT = 1,          // Thiết bị CNTT: Laptop, Màn hình, Máy in, Server
    MACHINERY = 2,   // Máy móc, thiết bị sản xuất, công cụ
    VEHICLE = 3,     // Phương tiện di chuyển: Ô tô, xe máy
    OFFICE = 4       // Thiết bị & nội thất văn phòng: Bàn, ghế, tủ, điều hòa
}
