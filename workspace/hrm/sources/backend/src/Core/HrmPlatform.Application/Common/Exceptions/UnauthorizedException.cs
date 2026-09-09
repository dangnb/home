namespace HrmPlatform.Application.Common.Exceptions;

/// <summary>
/// Ngoại lệ sinh ra khi yêu cầu chưa được xác thực hoặc phiên đăng nhập không hợp lệ (HTTP 401)
/// </summary>
public class UnauthorizedException : Exception
{
    public UnauthorizedException()
        : base("Yêu cầu chưa được xác thực danh tính hoặc phiên đăng nhập đã hết hạn.")
    {
    }

    public UnauthorizedException(string message)
        : base(message)
    {
    }
}
