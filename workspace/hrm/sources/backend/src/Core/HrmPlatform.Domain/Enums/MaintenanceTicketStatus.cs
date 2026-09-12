namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Trạng thái phiếu báo hỏng & bảo trì sửa chữa tài sản
/// </summary>
public enum MaintenanceTicketStatus
{
    OPEN = 1,         // Phiếu mới tạo, chờ kỹ thuật viên tiếp nhận
    IN_PROGRESS = 2,  // Đang kiểm tra / sửa chữa
    RESOLVED = 3,     // Đã xử lý xong, thiết bị hoạt động lại bình thường
    CANCELLED = 4     // Hủy phiếu báo hỏng
}
