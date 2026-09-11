namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Phân loại hình thức: Khen thưởng hoặc Kỷ luật
/// </summary>
public enum RewardDisciplineType
{
    REWARD = 1,     // Khen thưởng
    DISCIPLINE = 2  // Kỷ luật / Phạt
}

/// <summary>
/// Danh mục thưởng / phạt
/// </summary>
public enum RewardDisciplineCategory
{
    PERFORMANCE = 1,     // Hiệu suất xuất sắc
    EXCELLENCE = 2,      // Cống hiến / Cá nhân xuất sắc
    INNOVATION = 3,      // Sáng kiến đột phá
    LATE_VIOLATION = 4,   // Vi phạm giờ giấc (đi muộn / về sớm)
    SAFETY_VIOLATION = 5, // Vi phạm quy định an toàn
    DISCIPLINE_BREACH = 6,// Vi phạm nội quy / kỷ luật công ty
    BONUS = 7,            // Thưởng lễ tết / đột xuất
    OTHER = 99            // Khác
}

/// <summary>
/// Trạng thái của quyết định thưởng / phạt
/// </summary>
public enum RewardDisciplineStatus
{
    PENDING = 1,   // Chờ duyệt
    APPROVED = 2,  // Đã phê duyệt
    REJECTED = 3,  // Từ chối
    CANCELLED = 4  // Đã hủy
}
