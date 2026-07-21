using System.Text;
using System.Text.RegularExpressions;

namespace TapHoa.Domain.Common;

public static class SlugHelper
{
    public static string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;

        var slug = text.ToLowerInvariant();
        
        // Remove Vietnamese diacritics
        slug = Regex.Replace(slug, "[áàảạãăắằẳẵặâấầẩẫậ]", "a");
        slug = Regex.Replace(slug, "[éèẻẽẹêếềểễệ]", "e");
        slug = Regex.Replace(slug, "[iíìỉĩị]", "i");
        slug = Regex.Replace(slug, "[óòỏõọôốồổỗộơớờởỡợ]", "o");
        slug = Regex.Replace(slug, "[úùủũụưứừửữự]", "u");
        slug = Regex.Replace(slug, "[ýỳỷỹỵ]", "y");
        slug = Regex.Replace(slug, "[đ]", "d");
        
        // Remove invalid chars
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        
        // Convert multiple spaces into one space
        slug = Regex.Replace(slug, @"\s+", " ").Trim();
        
        // Hyphens
        slug = Regex.Replace(slug, @"\s", "-");
        
        // Remove multiple hyphens
        slug = Regex.Replace(slug, @"-+", "-");

        return slug;
    }
}
