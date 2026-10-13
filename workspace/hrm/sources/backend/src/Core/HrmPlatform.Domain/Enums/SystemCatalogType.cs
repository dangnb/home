namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Phân loại loại danh mục hệ thống dùng chung (System Catalog Type)
/// </summary>
public enum SystemCatalogType
{
    LEAVE_TYPE = 1,         // Loại nghỉ phép (Nghỉ phép năm, Nghỉ bệnh, Nghỉ thai sản...)
    JOB_POSITION = 2,       // Chức vụ / Chức danh (Giám đốc, Trưởng phòng, Nhân viên...)
    EDUCATION_LEVEL = 3,    // Trình độ học vấn (Đại học, Thạc sĩ, Cao đẳng...)
    ASSET_CATEGORY = 4,     // Danh mục tài sản (IT, Máy móc, Xe cộ, Văn phòng)
    CONTRACT_TYPE = 5,      // Loại hợp đồng (Thử việc, Xác định TH, Không xác định TH...)
    NATIONALITY = 6,        // Dân tộc / Quốc tịch (Kinh, Tày, Nùng... / Việt Nam, Nước ngoài)
    DEPARTMENT_TYPE = 7     // Loại phòng ban (Kỹ thuật, Kinh doanh, Hành chính...)
}
