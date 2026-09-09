namespace HrmPlatform.Domain.Exceptions;

/// <summary>
/// Ngoại lệ đại diện cho vi phạm quy tắc miền nghiệp vụ (Domain Business Invariant)
/// </summary>
public class DomainException : Exception
{
    public DomainException(string message) : base(message)
    {
    }

    public DomainException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
