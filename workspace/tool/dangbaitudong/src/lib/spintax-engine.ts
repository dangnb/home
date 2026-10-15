import type { BestTimeToPostSpec, SpintaxVariation } from "@/lib/types";

// Tokenize text into frequency map
function getTermFrequencies(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return freq;
}

// Calculate Cosine Similarity between two texts (0.0 to 1.0)
export function calculateCosineSimilarity(textA: string, textB: string): number {
  const freqA = getTermFrequencies(textA);
  const freqB = getTermFrequencies(textB);

  const uniqueTerms = new Set([...freqA.keys(), ...freqB.keys()]);
  if (uniqueTerms.size === 0) return 1.0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const term of uniqueTerms) {
    const valA = freqA.get(term) ?? 0;
    const valB = freqB.get(term) ?? 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return Number((dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(2));
}

export type TargetChannelConfig = {
  name: string;
  audienceSegment: string;
  tone: "casual_community" | "executive_b2b" | "action_oriented";
};

export const defaultTargetChannels: TargetChannelConfig[] = [
  {
    name: "Group Cộng Đồng Kinh Doanh & Khởi Nghiệp",
    audienceSegment: "Chủ shop & người kinh doanh thực chiến",
    tone: "action_oriented",
  },
  {
    name: "Fanpage Vệ Tinh Chia Sẻ Mẹo Hàng Ngày",
    audienceSegment: "Khách hàng đại chúng, lướt nhanh",
    tone: "casual_community",
  },
  {
    name: "Group Chuyên Môn & Trao Đổi B2B",
    audienceSegment: "Quản lý, chủ doanh nghiệp vừa và nhỏ",
    tone: "executive_b2b",
  },
];

export function generateLocalContextualSpintax(
  originalTitle: string,
  originalBody: string,
  originalFirstComment: string,
  channels: TargetChannelConfig[] = defaultTargetChannels,
): SpintaxVariation[] {
  return channels.map((channel, index) => {
    let rewrittenBody = "";
    let rewrittenComment = originalFirstComment;

    if (channel.tone === "action_oriented") {
      rewrittenBody = `🔥 Góc chia sẻ thực chiến cho anh em trong ${channel.name}!\n\n` +
        originalBody
          .replace(/Nhiều người đang tìm cách/g, "Kinh nghiệm thực tế khi triển khai")
          .replace(/Hãy chọn một vấn đề/g, "Cách làm nhanh nhất là khoanh vùng đúng điểm nghẽn") +
        `\n\n📌 Anh em nào đang vướng ca này, cmt thảo luận cùng tìm hướng tối ưu nhé!`;
      rewrittenComment = `👉 Tổng hợp tài liệu hướng dẫn cụ thể mình ghim tại đây: ${originalFirstComment}`;
    } else if (channel.tone === "executive_b2b") {
      rewrittenBody = `[Góc nhìn chuyên sâu - ${channel.name}]\n\n` +
        `Vấn đề tối ưu hóa quy trình thường gặp trở ngại ở khâu bắt đầu. Thay vì dàn trải nguồn lực, việc đo lường dữ liệu theo chu kỳ 14 ngày mang lại hiệu suất bền vững.\n\n` +
        `Chi tiết đúc kết:\n` +
        originalBody.slice(0, 300) +
        `\n\nQuý anh chị có chiến lược nào tương tự trong tổ chức của mình?`;
      rewrittenComment = `Tài liệu benchmark và checklist triển khai tham khảo: ${originalFirstComment}`;
    } else {
      rewrittenBody = `Có bạn nào trong nhóm từng rơi vào tình huống này chưa?\n\n` +
        originalBody
          .replace(/Hãy chọn/g, "Mẹo nhỏ là nên thử")
          .replace(/Nhiều người/g, "Đa phần chúng ta") +
        `\n\nThử áp dụng tuần này xem kết quả thay đổi thế nào nha cả nhà!`;
      rewrittenComment = `Link chi tiết và lưu ý thêm mình để dưới này cho ai cần nhé: ${originalFirstComment}`;
    }

    const similarity = calculateCosineSimilarity(originalBody, rewrittenBody);

    return {
      id: `spintax-var-${index + 1}`,
      targetChannelOrPage: channel.name,
      targetAudienceSegment: channel.audienceSegment,
      mainContent: rewrittenBody,
      firstComment: rewrittenComment,
      cosineSimilarityWithOriginal: similarity,
    };
  });
}

// Module 3: Predictive Best-Time-To-Post Algorithm
export function calculateBestTimeToPost(
  contentType: "viral_entertainment" | "b2b_sales_knowledge",
  baseDate: Date = new Date(),
): BestTimeToPostSpec {
  const targetDate = new Date(baseDate.getTime() + 4 * 3600 * 1000); // look at upcoming hours
  const currentHour = targetDate.getHours();

  if (contentType === "viral_entertainment") {
    // Viral/Entertainment: 11:30 - 12:30 (Lunch break) or 21:00 - 22:30 (Late evening relaxation)
    let selectedHour = 11;
    let selectedMinute = 45;
    let slotName = "Nghỉ trưa (11:30 - 12:30)";

    if (currentHour >= 12 && currentHour < 21) {
      selectedHour = 21;
      selectedMinute = 15;
      slotName = "Buổi tối giải trí (21:00 - 22:30)";
    } else if (currentHour >= 21) {
      // Schedule for next day lunch
      targetDate.setDate(targetDate.getDate() + 1);
      selectedHour = 11;
      selectedMinute = 45;
      slotName = "Nghỉ trưa hôm sau (11:30 - 12:30)";
    }

    targetDate.setHours(selectedHour, selectedMinute, 0, 0);

    return {
      contentType: "viral_entertainment",
      suggestedTimeSlot: slotName,
      optimalHourRange: "11:30 - 12:30 hoặc 21:00 - 22:30",
      recommendedDateTime: targetDate.toISOString(),
      rationale:
        "Nội dung giải trí/viral đạt CTR và lượt share cao nhất khi người dùng rảnh tay nghỉ trưa hoặc thư giãn trước khi ngủ.",
    };
  }

  // B2B / Sales / Deep Knowledge: 07:30 - 08:30 (Early morning work focus) or 19:30 - 20:30 (Post-dinner prime reading)
  let selectedHour = 7;
  let selectedMinute = 45;
  let slotName = "Đầu giờ sáng (07:30 - 08:30)";

  if (currentHour >= 8 && currentHour < 19) {
    selectedHour = 19;
    selectedMinute = 45;
    slotName = "Đầu giờ tối (19:30 - 20:30)";
  } else if (currentHour >= 19) {
    targetDate.setDate(targetDate.getDate() + 1);
    selectedHour = 7;
    selectedMinute = 45;
    slotName = "Đầu giờ sáng hôm sau (07:30 - 08:30)";
  }

  targetDate.setHours(selectedHour, selectedMinute, 0, 0);

  return {
    contentType: "b2b_sales_knowledge",
    suggestedTimeSlot: slotName,
    optimalHourRange: "07:30 - 08:30 hoặc 19:30 - 20:30",
    recommendedDateTime: targetDate.toISOString(),
    rationale:
      "Nội dung kiến thức, B2B và bán hàng giá trị cao cần tâm lý tập trung, tiếp nhận tốt nhất khi bắt đầu ngày làm việc hoặc vừa ăn tối xong.",
  };
}
