namespace HrmPlatform.Domain.Enums;

public enum EquipmentStatus
{
    AVAILABLE = 1,   // Sẵn sàng trong kho
    ASSIGNED = 2,    // Đang cấp phát cho nhân viên sử dụng
    BROKEN = 3,      // Đang báo hỏng / chờ kiểm tra
    MAINTENANCE = 4, // Đang mang đi sửa chữa / bảo trì
    DISPOSED = 5     // Đã thanh lý / hủy
}
