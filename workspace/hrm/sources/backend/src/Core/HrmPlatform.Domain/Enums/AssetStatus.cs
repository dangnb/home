namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Trạng thái vòng đời của tài sản (State Machine Constraints)
/// DRAFT -> AVAILABLE -> IN_USE -> MAINTENANCE -> BROKEN -> DISPOSED
/// </summary>
public enum AssetStatus
{
    DRAFT = 1,        // Mới khởi tạo nháp
    AVAILABLE = 2,    // Sẵn sàng trong kho, chưa gán cho ai
    IN_USE = 3,       // Đang cấp phát / Đang được sử dụng
    MAINTENANCE = 4,  // Đang trong quá trình bảo trì / bảo dưỡng
    BROKEN = 5,       // Báo hỏng, chờ phương án xử lý
    DISPOSED = 6      // Đã thanh lý / hủy bỏ
}
