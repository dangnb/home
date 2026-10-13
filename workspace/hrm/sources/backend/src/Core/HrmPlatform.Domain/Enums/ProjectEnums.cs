namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Trạng thái kinh doanh của dự án (Sales Pipeline)
/// </summary>
public enum ProjectSalesStatus
{
    LEAD = 1,           // Khách hàng tiềm năng, chưa tiếp cận chính thức
    PROPOSAL_SENT = 2,  // Đã gửi báo giá / đề xuất dự án
    NEGOTIATION = 3,    // Đang thương lượng điều khoản, giá trị
    CONTRACT_SIGNED = 4,// Đã ký hợp đồng, bàn giao kỹ thuật
    CLOSED_WON = 5,     // Hoàn tất nghiệm thu, thu tiền thành công
    CLOSED_LOST = 6     // Thua thầu / Khách hàng hủy
}

/// <summary>
/// Trạng thái kỹ thuật / triển khai của dự án
/// </summary>
public enum ProjectTechStatus
{
    NOT_APPLICABLE = 0,     // Chưa cần kỹ thuật (vẫn trong pipeline KD)
    PENDING_ASSIGNMENT = 1, // Chờ phân công PM / Tech Lead
    PLANNING = 2,           // PM đang lập kế hoạch, chia hạng mục, task
    IN_PROGRESS = 3,        // Đang triển khai tích cực
    TESTING_UAT = 4,        // Đang kiểm thử, khách hàng UAT
    HANDOVER_PENDING = 5,   // Chờ ký biên bản nghiệm thu
    COMPLETED = 6,          // Đã nghiệm thu, bàn giao hoàn tất
    WARRANTY = 7            // Đang trong thời gian bảo hành
}

/// <summary>
/// Loại hợp đồng / mô hình dự án
/// </summary>
public enum ProjectType
{
    FIXED_PRICE = 1, // Hợp đồng trọn gói, giá cố định
    TIME_MATERIAL = 2, // Tính theo giờ công thực tế
    RETAINER = 3      // Thuê bao dài hạn, hỗ trợ định kỳ
}

/// <summary>
/// Mức độ ưu tiên của dự án
/// </summary>
public enum ProjectPriority
{
    LOW = 1,      // Thấp
    MEDIUM = 2,   // Trung bình
    HIGH = 3,     // Cao
    CRITICAL = 4  // Khẩn cấp / Chiến lược
}

/// <summary>
/// Trạng thái hạng mục / milestone dự án
/// </summary>
public enum ProjectMilestoneStatus
{
    PENDING = 1,    // Chưa bắt đầu
    IN_PROGRESS = 2,// Đang thực hiện
    COMPLETED = 3   // Đã hoàn thành
}

/// <summary>
/// Trạng thái công việc kỹ thuật (Task)
/// </summary>
public enum ProjectTaskStatus
{
    TODO = 1,       // Chưa bắt đầu, đã phân công
    IN_PROGRESS = 2,// Đang làm
    REVIEW = 3,     // Hoàn thành, đang chờ PM review
    COMPLETED = 4,  // Review pass, hoàn tất
    BLOCKED = 5     // Tắc nghẽn, cần hỗ trợ
}

/// <summary>
/// Mức độ ưu tiên công việc kỹ thuật
/// </summary>
public enum ProjectTaskPriority
{
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    URGENT = 4
}

/// <summary>
/// Phân loại công việc kỹ thuật
/// </summary>
public enum ProjectTaskType
{
    DESIGN = 1,     // Thiết kế UI/UX
    DEVELOPMENT = 2,// Lập trình, phát triển
    TESTING = 3,    // Kiểm thử
    DEPLOYMENT = 4, // Triển khai, cài đặt
    DOCUMENT = 5,   // Viết tài liệu, hướng dẫn
    BUGFIX = 6,     // Sửa lỗi
    MEETING = 7     // Họp, tư vấn kỹ thuật
}
