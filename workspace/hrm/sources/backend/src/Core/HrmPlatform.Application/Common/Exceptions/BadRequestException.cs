namespace HrmPlatform.Application.Common.Exceptions;

/// <summary>
/// Ngoại lệ sinh ra khi logic nghiệp vụ không hợp lệ (HTTP 400)
/// </summary>
public class BadRequestException : Exception
{
    public BadRequestException(string message)
        : base(message)
    {
    }

    public BadRequestException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
