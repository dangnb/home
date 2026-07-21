using System.Reflection;
using MediatR;
using TapHoa.Application.Common.Security;

namespace TapHoa.Application.Behaviors;

public class AntiXssBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IHtmlSanitizerService _sanitizer;

    public AntiXssBehavior(IHtmlSanitizerService sanitizer)
    {
        _sanitizer = sanitizer;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        // Sanitize all string properties in the request
        var properties = request.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Where(p => p.PropertyType == typeof(string) && p.CanRead && p.CanWrite);

        foreach (var property in properties)
        {
            // Bỏ qua các trường mật khẩu vì ký tự đặc biệt (<, >) là hợp lệ trong mật khẩu
            if (property.Name.Contains("Password", StringComparison.OrdinalIgnoreCase))
                continue;

            var currentValue = property.GetValue(request) as string;
            if (!string.IsNullOrEmpty(currentValue))
            {
                var sanitizedValue = _sanitizer.Sanitize(currentValue);
                // If it was changed by sanitizer (meaning XSS found), update it
                if (currentValue != sanitizedValue)
                {
                    property.SetValue(request, sanitizedValue);
                }
            }
        }

        return await next();
    }
}
