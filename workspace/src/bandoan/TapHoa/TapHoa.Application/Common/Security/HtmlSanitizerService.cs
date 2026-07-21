using Ganss.Xss;

namespace TapHoa.Application.Common.Security
{
    public interface IHtmlSanitizerService
    {
        string Sanitize(string html);
    }

    public class HtmlSanitizerService : IHtmlSanitizerService
    {
        private readonly HtmlSanitizer _sanitizer;

        public HtmlSanitizerService()
        {
            _sanitizer = new HtmlSanitizer();
            // Cấu hình thêm cho phép các tag cơ bản nếu cần, mặc định HtmlSanitizer đã khá an toàn.
        }

        public string Sanitize(string html)
        {
            if (string.IsNullOrWhiteSpace(html))
                return html;
                
            return _sanitizer.Sanitize(html);
        }
    }
}
