namespace HrmPlatform.Application.Common.Exceptions;

/// <summary>
/// Ngoại lệ sinh ra khi không tìm thấy tài nguyên yêu cầu (HTTP 404)
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException()
        : base("Tài nguyên yêu cầu không tồn tại trên hệ thống.")
    {
    }

    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string name, object key)
        : base($"Không tìm thấy thực thể \"{name}\" với khóa ({key}).")
    {
    }
}
