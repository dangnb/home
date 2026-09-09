namespace HrmPlatform.Application.Common.Interfaces;

/// <summary>
/// Hợp đồng phát sinh JWT Token cho người dùng khi xác thực thành công
/// </summary>
public interface IJwtTokenGenerator
{
    /// <summary>
    /// Tạo Access Token có chữ ký bảo mật từ danh tính người dùng và quyền hạn
    /// </summary>
    string GenerateToken(
        long userId,
        string username,
        string email,
        string fullName,
        long? tenantId,
        IEnumerable<string> roles,
        IEnumerable<string> permissions,
        bool isSuperAdmin);
}
