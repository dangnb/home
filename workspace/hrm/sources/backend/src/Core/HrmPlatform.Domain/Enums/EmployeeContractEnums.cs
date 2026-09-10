namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Loại Hợp đồng lao động
/// </summary>
public enum EmployeeContractType
{
    PROBATION = 1,        // Hợp đồng thử việc
    DEFINITE_TERM = 2,    // Hợp đồng xác định thời hạn
    INDEFINITE_TERM = 3,  // Hợp đồng không xác định thời hạn
    INTERNSHIP = 4,       // Hợp đồng học việc / thực tập
    ADDENDUM = 5          // Phụ lục hợp đồng
}

/// <summary>
/// Trạng thái Hợp đồng lao động
/// </summary>
public enum EmployeeContractStatus
{
    ACTIVE = 1,           // Đang hiệu lực
    EXPIRING_SOON = 2,    // Sắp hết hạn (trong 30 ngày)
    EXPIRED = 3,          // Đã hết hạn
    TERMINATED = 4        // Đã chấm dứt / Thanh lý
}
