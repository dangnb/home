import type { ComplianceCheckResult, ComplianceRiskItem } from "@/lib/types";

export type ComplianceRisk = ComplianceRiskItem;
export type ComplianceReport = ComplianceCheckResult;

interface RuleDefinition {
  code: string;
  severity: "warning" | "high";
  message: string;
  pattern: RegExp;
  replacementRule?: (match: string) => string;
}

const complianceRules: RuleDefinition[] = [
  // --- ENGAGEMENT BAIT (Warning / Reach Penalty) ---
  {
    code: "LIKE_SHARE_BAIT",
    severity: "warning",
    message: "Kêu gọi like/share trực tiếp khiến thuật toán Facebook phạt giảm phân phối (Reach).",
    pattern: /(?:ai thấy đúng cho\s+)?(?:1\s+)?(?:like|thích)\s+(?:và\s+)?(?:share|chia sẻ)?(?:\s+bài viết này)?(?:\s+nha|\s+nhé|\s+để)?/gi,
    replacementRule: () => "Anh em có cùng góc nhìn này không? Hãy cùng để lại trải nghiệm của bạn nhé.",
  },
  {
    code: "SHARE_TO_GET_GIFT_BAIT",
    severity: "warning",
    message: "Chia sẻ bài viết để nhận quà/tài liệu bị xem là câu tương tác có thưởng (Incentivized Share).",
    pattern: /(?:share|chia sẻ)\s+(?:bài viết|post|về tường)?\s*(?:để\s+nhận|nhận ngay|nhận link)/gi,
    replacementRule: () => "Anh em quan tâm tài liệu hãy nhắn tin hoặc xem hướng dẫn chi tiết",
  },
  {
    code: "COMMENT_YES_BAIT",
    severity: "warning",
    message: "Ép người dùng gõ từ đơn điệu ('Yes', 'Tôi muốn', 'Chấm') bị Facebook phát hiện Comment Baiting.",
    pattern: /(?:comment|bình luận|còm)\s+['"“]?(?:yes|có|tôi muốn|quan tâm|1|\.)['"”]?\s*(?:để|nhận)?/gi,
    replacementRule: () => "Để lại câu hỏi hoặc góc nhìn của bạn bên dưới",
  },
  {
    code: "TAG_FRIENDS_BAIT",
    severity: "warning",
    message: "Yêu cầu tag bạn bè để tăng tương tác gượng gạo (Tag Baiting).",
    pattern: /tag\s+(?:ngay\s+)?(?:ít nhất\s+)?(?:\d+\s+)?(?:người\s+)?(?:bạn|bè|friends)/gi,
    replacementRule: () => "Chia sẻ cho bạn bè nếu thấy nội dung hữu ích",
  },

  // --- HEALTH & MEDICAL CLAIMS (High Risk / Policy Violation) ---
  {
    code: "MEDICAL_ABSOLUTE_CURE",
    severity: "high",
    message: "Tuyên bố 'trị dứt điểm', 'chữa khỏi 100%' vi phạm nghiêm trọng chính sách sức khỏe của Meta.",
    pattern: /(?:trị|chữa)\s+dứt điểm(?:\s+100%)?|(?:đặc trị|chữa khỏi hoàn toàn)/gi,
    replacementRule: () => "hỗ trợ cải thiện rõ rệt và an toàn",
  },
  {
    code: "EXCLUSIVE_DRUG_CLAIM",
    severity: "high",
    message: "Từ khóa 'thuốc đặc trị' hoặc tự xưng thần dược dễ bị kiểm duyệt khóa page/tài khoản quảng cáo.",
    pattern: /thuốc đặc trị|thần dược|liều thuốc kỳ diệu/gi,
    replacementRule: () => "giải pháp chăm sóc chuyên sâu",
  },

  // --- FINANCIAL & GET-RICH-QUICK (High Risk / Financial Policy) ---
  {
    code: "GET_RICH_QUICK",
    severity: "high",
    message: "Hứa hẹn 'kiếm tiền nhanh', 'làm giàu không khó' vi phạm chính sách kinh doanh và dịch vụ tài chính.",
    pattern: /kiếm tiền nhanh(?:\s+chóng)?|làm giàu không khó|làm giàu siêu tốc/gi,
    replacementRule: () => "xây dựng nguồn thu nhập thực tế và bền vững",
  },
  {
    code: "ABSOLUTE_PROFIT_GUARANTEE",
    severity: "high",
    message: "Cam kết lợi nhuận 100% hoặc cam kết không rủi ro bị Meta gắn cờ gian lận / lừa đảo.",
    pattern: /(?:cam kết|đảm bảo)\s+(?:lợi nhuận|lãi suất)\s*(?:100%|khủng|tuyệt đối)|không\s+(?:hề\s+)?có\s+rủi ro/gi,
    replacementRule: () => "tiềm năng tăng trưởng tối ưu với lộ trình quản trị rủi ro rõ ràng",
  },

  // --- ABSOLUTE UNVERIFIED CLAIMS ---
  {
    code: "ABSOLUTE_GUARANTEE_100",
    severity: "high",
    message: "Khẳng định cam kết 100% hiệu quả mà không có bằng chứng khoa học cụ thể.",
    pattern: /cam kết\s+(?:100%|hiệu quả\s+100%|thành công\s+100%)|đảm bảo\s+100%/gi,
    replacementRule: () => "cam kết đồng hành và đem lại kết quả tối ưu nhất",
  },
];

export function scanCompliance(text: string): ComplianceCheckResult {
  const risks: ComplianceRiskItem[] = [];
  let scoreDeduction = 0;

  for (const rule of complianceRules) {
    const matches = Array.from(text.matchAll(rule.pattern));
    for (const match of matches) {
      risks.push({
        code: rule.code,
        severity: rule.severity,
        message: rule.message,
        match: match[0],
        suggestion: rule.replacementRule ? rule.replacementRule(match[0]) : undefined,
      });

      if (rule.severity === "high") {
        scoreDeduction += 2.5;
      } else {
        scoreDeduction += 1.0;
      }
    }
  }

  // Base predicted engagement score: starts at 9.2, reduced by detected spam triggers
  // Plus heuristic bonuses for natural structure
  let predictedScore = Math.max(2.0, 9.2 - scoreDeduction);
  if (text.includes("?")) predictedScore = Math.min(10.0, predictedScore + 0.4); // Encourages open discussion
  if (text.length > 150 && text.length < 2500) predictedScore = Math.min(10.0, predictedScore + 0.3); // Good length

  const isSafe = risks.every((risk) => risk.severity !== "high");
  const autoRevised = risks.length > 0 ? autoRewriteSafeContent(text) : undefined;

  return {
    is_safe_for_facebook: isSafe,
    detected_risks: risks,
    predicted_engagement_score: Number(predictedScore.toFixed(1)),
    auto_revised_content: autoRevised,
  };
}

export function autoRewriteSafeContent(text: string): string {
  let revised = text;
  for (const rule of complianceRules) {
    if (rule.replacementRule) {
      revised = revised.replace(rule.pattern, rule.replacementRule);
    }
  }
  return revised;
}
