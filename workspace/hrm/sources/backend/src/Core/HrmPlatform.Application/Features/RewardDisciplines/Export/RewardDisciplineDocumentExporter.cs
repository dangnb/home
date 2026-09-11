using System;
using System.Globalization;
using System.Text;
using HrmPlatform.Application.Features.RewardDisciplines.Queries;

namespace HrmPlatform.Application.Features.RewardDisciplines.Export;

public static class RewardDisciplineDocumentExporter
{
    public static string GenerateHtmlDocument(RewardDisciplineDto dto)
    {
        var isReward = dto.Type == "REWARD";
        var typeTitle = isReward ? "KHEN THƯỞNG" : "KỶ LUẬT";
        var verb = isReward ? "Khen thưởng" : "Xử phạt kỷ luật";
        var dateParts = parseDate(dto.DecisionDate);

        var amountFormatted = new IntlNumberFormat().FormatVnd(dto.Amount);

        var sb = new StringBuilder();
        sb.AppendLine("<!DOCTYPE html>");
        sb.AppendLine("<html>");
        sb.AppendLine("<head>");
        sb.AppendLine("<meta charset='utf-8'>");
        sb.AppendLine($"<title>Quyết Định {typeTitle} - {dto.DecisionNumber}</title>");
        sb.AppendLine("<style>");
        sb.AppendLine("  @page { size: A4; margin: 20mm 20mm 20mm 20mm; }");
        sb.AppendLine("  body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.5; color: #000; margin: 0; padding: 20px; }");
        sb.AppendLine("  .header-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }");
        sb.AppendLine("  .header-table td { vertical-align: top; text-align: center; }");
        sb.AppendLine("  .company-name { font-weight: bold; font-size: 11pt; text-transform: uppercase; }");
        sb.AppendLine("  .nation-title { font-weight: bold; font-size: 12pt; text-transform: uppercase; }");
        sb.AppendLine("  .nation-subtitle { font-weight: bold; font-size: 11pt; margin-bottom: 5px; }");
        sb.AppendLine("  .title-block { text-align: center; margin: 30px 0 20px 0; }");
        sb.AppendLine("  .main-title { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }");
        sb.AppendLine("  .sub-title { font-size: 13pt; font-weight: bold; font-style: italic; }");
        sb.AppendLine("  .section-body { text-align: justify; text-indent: 1.25cm; margin-bottom: 15px; }");
        sb.AppendLine("  .decision-clause { margin-bottom: 15px; text-align: justify; }");
        sb.AppendLine("  .clause-title { font-weight: bold; }");
        sb.AppendLine("  .footer-table { width: 100%; margin-top: 40px; border-collapse: collapse; page-break-inside: avoid; }");
        sb.AppendLine("  .footer-table td { vertical-align: top; }");
        sb.AppendLine("  @media print {");
        sb.AppendLine("    .no-print { display: none !important; }");
        sb.AppendLine("  }");
        sb.AppendLine("</style>");
        sb.AppendLine("</head>");
        sb.AppendLine("<body>");

        // Print Control Toolbar
        sb.AppendLine("<div class='no-print' style='background: #f8f9fa; padding: 12px; text-align: center; border-bottom: 1px solid #ddd; margin-bottom: 20px; font-family: sans-serif;'>");
        sb.AppendLine("  <button onclick='window.print()' style='background: #007bff; color: #fff; border: none; padding: 8px 16px; font-size: 14px; border-radius: 4px; cursor: pointer; font-weight: bold;'>");
        sb.AppendLine("    🖨️ In Quyết Định / Lấy File PDF");
        sb.AppendLine("  </button>");
        sb.AppendLine("  <span style='margin: 0 10px; color: #666;'>|</span>");
        sb.AppendLine($"  <a href='/api/v1/reward-disciplines/{dto.Id}/export/word' style='background: #28a745; color: #fff; text-decoration: none; padding: 8px 16px; font-size: 14px; border-radius: 4px; font-weight: bold;'>");
        sb.AppendLine("    📄 Tải File Word (.doc)");
        sb.AppendLine("  </a>");
        sb.AppendLine("</div>");

        // Header Table
        sb.AppendLine("<table class='header-table'>");
        sb.AppendLine("  <tr>");
        sb.AppendLine("    <td style='width: 45%;'>");
        sb.AppendLine("      <div class='company-name'>CÔNG TY CỔ PHẦN CÔNG NGHỆ HRM</div>");
        sb.AppendLine("      <div style='font-size: 11pt;'>Số: <strong>" + (string.IsNullOrWhiteSpace(dto.DecisionNumber) ? $"QĐ-{dto.Id}" : dto.DecisionNumber) + "</strong></div>");
        sb.AppendLine("    </td>");
        sb.AppendLine("    <td style='width: 55%;'>");
        sb.AppendLine("      <div class='nation-title'>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>");
        sb.AppendLine("      <div class='nation-subtitle'>Độc lập - Tự do - Hạnh phúc</div>");
        sb.AppendLine("      <div style='font-size: 11pt; font-style: italic;'>TP. Hồ Chí Minh, ngày " + dateParts.day + " tháng " + dateParts.month + " năm " + dateParts.year + "</div>");
        sb.AppendLine("    </td>");
        sb.AppendLine("  </tr>");
        sb.AppendLine("</table>");

        // Main Title
        sb.AppendLine("<div class='title-block'>");
        sb.AppendLine($"  <div class='main-title'>QUYẾT ĐỊNH</div>");
        sb.AppendLine($"  <div class='sub-title'>V/v: {dto.Title}</div>");
        sb.AppendLine("</div>");

        // Preamble
        sb.AppendLine("<div style='text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 20px;'>BAN GIÁM ĐỐC CÔNG TY</div>");
        sb.AppendLine("<div class='section-body'>- Căn cứ Điều lệ hoạt động và Quy chế quản lý nhân sự của Công ty;</div>");
        sb.AppendLine("<div class='section-body'>- Căn cứ vào quy định về thi đua khen thưởng và kỷ luật lao động;</div>");
        sb.AppendLine("<div class='section-body'>- Xét đề nghị của Trưởng phòng Nhân sự và Ban Kiểm soát chất lượng,</div>");

        sb.AppendLine("<div style='text-align: center; font-weight: bold; font-size: 14pt; margin: 20px 0;'>QUYẾT ĐỊNH:</div>");

        // Clauses
        sb.AppendLine("<div class='decision-clause'>");
        sb.AppendLine($"  <span class='clause-title'>Điều 1.</span> {verb} đối với:");
        sb.AppendLine("  <ul style='list-style-type: none; padding-left: 20px; margin: 8px 0;'>");
        sb.AppendLine($"    <li>• <strong>Họ và tên:</strong> {dto.EmployeeName}</li>");
        sb.AppendLine($"    <li>• <strong>Chức danh:</strong> {dto.JobTitle}</li>");
        sb.AppendLine($"    <li>• <strong>Phòng ban:</strong> {dto.DepartmentName ?? "Bộ phận nghiệp vụ"}</li>");
        sb.AppendLine($"    <li>• <strong>Hình thức:</strong> {getCategoryName(dto.Category)}</li>");
        sb.AppendLine($"    <li>• <strong>Số tiền {typeTitle.ToLower()}:</strong> <strong style='font-size: 14pt; color: " + (isReward ? "#28a745" : "#dc3545") + ";'>" + amountFormatted + " VNĐ</strong></li>");
        sb.AppendLine("  </ul>");
        sb.AppendLine("</div>");

        sb.AppendLine("<div class='decision-clause'>");
        sb.AppendLine("  <span class='clause-title'>Điều 2. Lý do / Trích yếu nội dung:</span>");
        sb.AppendLine($"  <div style='padding-left: 20px; font-style: italic; margin-top: 5px;'>\"{dto.Reason ?? "Theo biên bản đánh giá công tác nhân sự."}\"</div>");
        sb.AppendLine("</div>");

        sb.AppendLine("<div class='decision-clause'>");
        sb.AppendLine($"  <span class='clause-title'>Điều 3.</span> Quyết định này có hiệu lực thi hành kể từ ngày <strong>{dto.EffectiveDate}</strong>. Các phòng ban liên quan và Ông/Bà <strong>{dto.EmployeeName}</strong> chịu trách nhiệm thi hành Quyết định này.");
        sb.AppendLine("</div>");

        // Footer Signatures
        sb.AppendLine("<table class='footer-table'>");
        sb.AppendLine("  <tr>");
        sb.AppendLine("    <td style='width: 50%; font-size: 10.5pt;'>");
        sb.AppendLine("      <strong><i>Nơi nhận:</i></strong><br/>");
        sb.AppendLine("      - Như Điều 3;<br/>");
        sb.AppendLine("      - Phòng HR & Kế toán;<br/>");
        sb.AppendLine("      - Lưu: VT, TCCS.<br/>");
        sb.AppendLine("    </td>");
        sb.AppendLine("    <td style='width: 50%; text-align: center;'>");
        sb.AppendLine("      <strong>TM. BAN GIÁM ĐỐC</strong><br/>");
        sb.AppendLine("      <strong>GIÁM ĐỐC</strong><br/>");
        sb.AppendLine("      <div style='height: 80px;'></div>");
        sb.AppendLine("      <strong>(Ký, ghi rõ họ tên và đóng dấu)</strong>");
        sb.AppendLine("    </td>");
        sb.AppendLine("  </tr>");
        sb.AppendLine("</table>");

        sb.AppendLine("</body>");
        sb.AppendLine("</html>");

        return sb.ToString();
    }

    private static (string day, string month, string year) parseDate(string dateStr)
    {
        if (DateTime.TryParse(dateStr, out DateTime dt))
        {
            return (dt.Day.ToString("D2"), dt.Month.ToString("D2"), dt.Year.ToString());
        }
        var now = DateTime.UtcNow;
        return (now.Day.ToString("D2"), now.Month.ToString("D2"), now.Year.ToString());
    }

    private static string getCategoryName(string cat)
    {
        return cat switch
        {
            "PERFORMANCE" => "Hiệu suất xuất sắc",
            "EXCELLENCE" => "Cá nhân xuất sắc",
            "INNOVATION" => "Sáng kiến đột phá",
            "LATE_VIOLATION" => "Vi phạm giờ giấc làm việc",
            "SAFETY_VIOLATION" => "Vi phạm quy định an toàn",
            "DISCIPLINE_BREACH" => "Vi phạm kỷ luật lao động",
            "BONUS" => "Thưởng đột xuất",
            _ => "Khác"
        };
    }
}

public class IntlNumberFormat
{
    public string FormatVnd(decimal val)
    {
        return string.Format(new CultureInfo("vi-VN"), "{0:N0}", val);
    }
}
