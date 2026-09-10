namespace HrmPlatform.Domain.Enums;

public enum EquipmentActionType
{
    HANDOVER = 1,        // Bàn giao cho nhân viên sử dụng
    REVOKE = 2,          // Thu hồi thiết bị về kho
    REPORT_BROKEN = 3,   // Báo hỏng sự cố
    REPAIR_COMPLETED = 4,// Đã sửa chữa xong
    DISPOSE = 5          // Thanh lý thiết bị
}
