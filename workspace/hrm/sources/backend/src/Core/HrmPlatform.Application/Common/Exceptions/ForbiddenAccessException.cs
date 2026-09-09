namespace HrmPlatform.Application.Common.Exceptions;

/// <summary>
/// Ngoại lệ sinh ra khi người dùng không có quyền truy cập vào tài nguyên hoặc hành động (HTTP 403)
/// </summary>
public class ForbiddenAccessException : Exception
{
    public ForbiddenAccessException()
        : base("Bạn không có quyền thực hiện thao tác hoặc truy cập vào tài nguyên này.")
    {
    }

    public ForbiddenAccessException(string message)
        : base(message)
    {
    }
}
