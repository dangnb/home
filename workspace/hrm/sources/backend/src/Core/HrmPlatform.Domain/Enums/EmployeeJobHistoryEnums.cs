namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Loại biến động / điều động công tác
/// </summary>
public enum TransferChangeType
{
    DEPARTMENT_TRANSFER = 1, // Điều chuyển phòng ban
    PROMOTION = 2,           // Bổ nhiệm / Thăng chức
    DEMOTION = 3,            // Giáng chức
    MANAGER_CHANGE = 4,      // Thay đổi Quản lý
    RELOCATION = 5           // Chuyển địa điểm / Chi nhánh
}
