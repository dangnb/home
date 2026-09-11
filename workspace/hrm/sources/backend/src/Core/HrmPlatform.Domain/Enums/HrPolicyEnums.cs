namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Danh mục Chính sách & Quy định HR
/// </summary>
public enum HrPolicyCategory
{
    BENEFITS = 1,          // Chế độ đãi ngộ, Phụ cấp & Thưởng
    WORKING_HOURS = 2,     // Thời giờ làm việc, OT & Nghỉ ngơi
    INSURANCE_WELFARE = 3, // Bảo hiểm, Khám sức khỏe & Phúc lợi
    CODE_OF_CONDUCT = 4,   // Quy tắc ứng xử & Văn hóa doanh nghiệp
    SAFETY_HEALTH = 5,     // An toàn & Sức khỏe lao động
    OTHER = 6              // Quy định khác
}

/// <summary>
/// Trạng thái Chính sách Công ty
/// </summary>
public enum HrPolicyStatus
{
    DRAFT = 1,     // Bản nháp
    PUBLISHED = 2, // Đã ban hành
    ARCHIVED = 3   // Đã lưu trữ / Hết hiệu lực
}
