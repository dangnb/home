using FluentValidation.Results;

namespace HrmPlatform.Application.Common.Exceptions;

/// <summary>
/// Ngoại lệ sinh ra khi dữ liệu đầu vào không vượt qua bộ quy tắc kiểm tra (FluentValidation)
/// </summary>
public class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException()
        : base("Một hoặc nhiều lỗi xác thực dữ liệu đã xảy ra.")
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }
}
