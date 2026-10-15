# DangBaiTuDong AI — Nền Tảng Marketing Đa Tác Tử (Multi-Agent System)

Hệ thống tự động hóa sáng tạo nội dung, kiểm duyệt chính sách Facebook, điều phối đăng bài thông minh và tự động tối ưu tăng trưởng theo kiến trúc **5 AI Agents chuyên biệt** xuyên suốt **4 Module nghiệp vụ**.

---

## 1. Kiến Trúc 5 AI Agents ("Phòng Marketing Ảo")

Thay vì các hàm xử lý cứng nhắc, hệ thống kết nối 5 Agents giao tiếp qua **Structured Outputs (JSON Schema)**:

```text
[Dữ liệu thô: Trend / Viral Posts / RSS Feeds]
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ 1. TREND SCOUT AGENT (Chuyên gia giải mã Viral)          │
│    - Multimodal LLM (Đọc cả ảnh/video & text đối thủ)    │
│    - Semantic Clustering gom cụm ngữ nghĩa bằng Vector   │
│    - Root-Cause Sentiment Analysis 50 bình luận nhiều like│
└───────────────────────────┬──────────────────────────────┘
                            │ (JSON: Viral DNA + Content Angles)
                            ▼
┌──────────────────────────────────────────────────────────┐
│ 2. COPYWRITER AGENT + RAG (Chuyên gia viết bài)          │
│    - RAG Kho 1: Product Knowledge Base (Chống ảo giác)   │
│    - RAG Kho 2: Few-Shot Winning Posts (Top tương tác)   │
│    - Viết bài chính + First Comment theo công thức PAS   │
└───────────────────────────┬──────────────────────────────┘
                            │ (Draft Content)
                            ▼
┌──────────────────────────────────────────────────────────┐
│ 3. ART DIRECTOR AGENT (Giám đốc hình ảnh)                │
│    - Sinh Prompt tạo ảnh concept không chữ (Flux/DALL-E) │
│    - Backend Sharp tự động ghép Hook Text tiếng Việt     │
│    - Tự động đóng dấu Logo / Badge Fanpage lên ảnh       │
└───────────────────────────┬──────────────────────────────┘
                            │ (Content + Rendered Media)
                            ▼
┌──────────────────────────────────────────────────────────┐
│ 4. META COMPLIANCE GUARD AGENT (Kiểm duyệt viên AI)      │
│    - Quét Engagement Bait (chống tụt Reach)              │
│    - Quét từ cấm y tế, tài chính, cam kết 100%           │
│    - Tự động viết lại (Auto-fix) câu thảo luận an toàn   │
│    - Đóng vai trò Pre-Approver trước khi tới tay người   │
└───────────────────────────┬──────────────────────────────┘
                            │ (Approved & Scheduled)
                            ▼
┌──────────────────────────────────────────────────────────┐
│ MODULE 3: PUBLISHING WORKER & SPINTAX                    │
│    - Contextual Spintax (Cosine Similarity < 30%)        │
│    - Predictive Best-Time-To-Post (Dự đoán giờ vàng)     │
│    - Đăng bài tự động lên Facebook Graph API             │
└───────────────────────────┬──────────────────────────────┘
                            │ (Sau 24h - 7 ngày: Lấy Facebook Metrics)
                            ▼
┌──────────────────────────────────────────────────────────┐
│ 5. GROWTH ANALYST AGENT (Chuyên gia tối ưu - Module 4)   │
│    - So sánh A/B tuần (Top 10 thắng vs 10 bài thua)      │
│    - Pattern Recognition (Nhận diện công thức x3.2 CTR)  │
│    - Auto-Tuning: Tự nâng cấp System Prompt Brand Voice  │
│    - Tự động nạp bài thắng cuộc vào Vector DB            │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Chi Tiết 4 Module Nghiệp Vụ

### Module 1: Trend Intelligence
- **Semantic Clustering**: Sử dụng Vector Embedding để gom các cụm từ khóa có ngữ nghĩa tương đồng (VD: *"bão Yagi"*, *"siêu bão số 3"*, *"cơn bão lịch sử"*) thành một Chủ đề duy nhất.
- **Multimodal Viral Deconstruction**: Đọc ảnh/video đối thủ để phân tích: text trên ảnh, màu sắc chủ đạo, và *Thumb-stopping factor* khiến người dùng dừng ngón tay lại.
- **Root-Cause Sentiment Analysis**: Quét 50 bình luận nhiều like nhất dưới bài viral: *"Khách đang khen gì, chê gì, hay hỏi mua gì?"* -> Sinh Content Angle đánh trúng nỗi đau mà đối thủ chưa giải quyết.

### Module 2: RAG + Multi-Step Copywriting + Art Direction
- **Tích hợp Vector Database (Kho 1 & Kho 2)**:
  - *Kho 1 (Product Knowledge Base)*: Lưu thông tin sản phẩm, bảng giá, USP, FAQ để AI viết đúng sự thật 100%, không bị ảo giác (*Hallucination*).
  - *Kho 2 (Few-Shot Winning Posts)*: Lưu trữ Top bài viết có tương tác cao nhất lịch sử Fanpage. Tự động đưa bài tương đồng vào làm mẫu để AI bắt chước chính xác cách ngắt câu, từ lóng và cách hỏi của Page.
- **AI Meta-Policy Guardrail**:
  - Tự động phát hiện Engagement Bait (*"Like/Share bài này để..."*, *"Comment Yes"*) và viết lại thành câu thảo luận mở tự nhiên.
  - Quét từ cấm y tế (*"trị dứt điểm"*, *"thuốc đặc trị"*), tài chính (*"kiếm tiền nhanh"*), cam kết tuyệt đối (*"100% hiệu quả"*).
- **Tự động hóa Hình ảnh (Programmatic Image Engine)**:
  - AI sinh concept prompt tiếng Anh không chứa chữ + Hook Text ngắn tiếng Việt (< 8 chữ).
  - Backend sử dụng **Sharp** để ghép Hook Text chuẩn font tiếng Việt (100% không lỗi font/dấu Unicode) và đóng dấu Logo Fanpage lên ảnh.

### Module 3: Smart Orchestration & Spintax
- **Contextual Spintax**: Gọi model nhẹ viết lại cấu trúc câu cho từng Page vệ tinh hoặc Group theo đúng tệp độc giả, đảm bảo độ trùng lặp văn bản (**Cosine Similarity**) dưới 30% để chống spam Facebook.
- **Predictive Best-Time-To-Post**:
  - *Nội dung Hài hước / Viral*: Đẩy vào khung giờ nghỉ trưa (11:30 - 12:30) hoặc tối muộn (21:00 - 22:30).
  - *Nội dung B2B / Bán hàng / Kiến thức*: Đẩy vào đầu giờ sáng (07:30 - 08:30) hoặc đầu giờ tối (19:30 - 20:30).

### Module 4: Tự Động Tối Ưu Bằng AI (Self-Improving Feedback Loop)
- **So sánh A/B tự động**: Lấy ra 10 bài tương tác cao nhất và 10 bài thấp nhất trong tuần.
- **Pattern Recognition**: Khám phá quy luật: *"Bài viết công thức PAS mở đầu bằng số liệu cụ thể + infographic có tỷ lệ click First Comment cao gấp 3.2 lần"*.
- **Auto-Tuning**: Tự động gợi ý bản nâng cấp System Prompt cho Brand Voice và cập nhật bài thắng cuộc vào Vector DB.

---

## 3. Thiết Kế Kỹ Thuật (Database & Routing)

### A. Database Schema
1. **`marketing_posts`**: Lưu trữ nội dung bài viết, formula, hook type, `media_generation`, `compliance_check`, trạng thái duyệt và metrics.
2. **`product_knowledge`** *(Kho 1)*: Lưu USP, bảng giá, FAQ, tính năng sản phẩm chống ảo giác.
3. **`brand_voices`**: Lưu System Prompt theo từng Fanpage/Thương hiệu kèm lịch sử Auto-Tuning.
4. **`winning_post_embeddings`** *(Kho 2)*: Vector DB (Qdrant / PostgreSQL pgvector) lưu trữ bài thắng điểm cao.
5. **`ai_token_usage`**: Quản lý chi phí AI Token theo từng module (`ModuleType`, `ModelName`, `PromptTokens`, `CompletionTokens`, `EstimatedCostUsd`).
6. **`growth_reports`**: Lưu trữ kết quả phân tích A/B tuần, quy luật phát hiện và đề xuất prompt.

### B. Mẫu JSON Structured Output Chuẩn (Module 2)
```json
{
  "post_title_internal": "Cảnh báo sai lầm khi chạy bộ mùa đông",
  "copywriting_formula_used": "PAS",
  "hook_type": "Fear-based / Warning",
  "main_content": "🥶 80% người chạy bộ vào sáng sớm mùa đông đang vô tình làm hại khớp gối chỉ vì bỏ qua 3 phút này!...",
  "hashtags": ["#ChayBo", "#MarathonVN", "#ChayBoMuaDong", "#SucKhoe"],
  "first_comment": "🔥 Link chi tiết bài tập làm nóng khớp gối và ưu đãi bó gối thể thao giảm 30% duy nhất hôm nay tại đây: https://example.com/bo-goi",
  "media_generation": {
    "recommended_format": "SingleImage",
    "ai_image_prompt_en": "A cinematic close-up photo of an Asian runner tying running shoes on a foggy winter morning in Hanoi...",
    "overlay_text_vi": "ĐỪNG CHẠY NGAY KHI TRỜI LẠNH!"
  },
  "compliance_check": {
    "is_safe_for_facebook": true,
    "detected_risks": [],
    "predicted_engagement_score": 8.5
  }
}
```

### C. Chiến Lược Phân Tầng Model (Model Routing Strategy)
- **Tầng 1 (Rẻ & Dưới 1s)**: GPT-4o-mini hoặc Gemini 1.5 Flash (lọc thô, cảm xúc, kiểm duyệt, Spintax).
- **Tầng 2 (Sâu sắc & Giàu cảm xúc)**: Claude 3.5 Sonnet hoặc GPT-4o (chiến lược góc tiếp cận và viết bài tiếng Việt).
- **Tầng 3 (Tạo ảnh & Đồ họa)**: Flux.1 / DALL-E + **Sharp** (ghép Hook Text tiếng Việt và đóng dấu Logo).

---

## 4. API Endpoints

| Endpoint | Method | Chức năng |
|---|---|---|
| `/api/ai/generate` | POST | Sinh bài viết đa tác tử (RAG + Copywriter + Art Director + Compliance) |
| `/api/ai/trend-deconstruct` | POST | Agent 1: Giải mã Viral DNA & Root-Cause Sentiment bình luận |
| `/api/ai/spintax` | POST | Module 3: Sinh Contextual Spintax & Tính độ tương đồng Cosine < 30% |
| `/api/ai/growth-analysis` | GET/POST | Module 4: Chạy Growth Analyst so sánh A/B & Auto-Tune System Prompt |
| `/api/ai/image` | POST | Agent 3: Render ảnh Programmatic với Sharp typographic banner |
| `/api/knowledge` | GET/POST | Quản lý Kho Tri Thức Sản Phẩm (Kho 1) |
| `/api/brand-voices` | GET/POST | Quản lý Brand Voice & Lịch sử Auto-Tuning |
| `/api/posts` | GET | Lấy danh sách bài viết trong hệ thống |
| `/api/posts/[id]` | PATCH | Cập nhật, chỉnh sửa, duyệt (approve) bài viết |
| `/api/posts/[id]/publish` | POST | Đăng bài trực tiếp lên Facebook Graph API |
| `/api/cron/publish` | POST | Worker tự động đăng bài theo lịch hẹn |
| `/api/cron/analytics` | POST | Worker tự động đồng bộ insights và nạp bài thắng vào Qdrant |
| `/api/health` | GET | Kiểm tra tình trạng hoạt động dịch vụ |

---

## 5. Hướng Dẫn Khởi Chạy Local

### Cài đặt dependencies:
```bash
npm install
```

### Cấu hình biến môi trường:
Tạo file `.env.local` từ `.env.example`:
```bash
cp .env.example .env.local
```

### Chạy development server:
```bash
npm run dev
```

Truy cập:
- Landing Page: `http://localhost:3000`
- Studio Dashboard: `http://localhost:3000/dashboard`
- Health check: `http://localhost:3000/api/health`
