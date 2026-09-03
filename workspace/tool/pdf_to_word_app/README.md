# PDF to Word Pro 🚀
**Chuyển đổi PDF sang Word — Giữ nguyên 100% layout, bảng biểu, hình ảnh, phụ lục**

---

## ⚡ Cài Đặt & Khởi Động

### Lần đầu sử dụng
1. Cài **Node.js** (nếu chưa có): https://nodejs.org → tải bản LTS
2. Chạy **`Cai_dat.bat`** → tự động cài tất cả thư viện cần thiết
3. Chạy **`Start.bat`** → mở trình duyệt tự động

### Từ lần 2 trở đi
- Chỉ cần chạy **`Start.bat`** → xong!

---

## 🖥️ Hướng Dẫn Sử Dụng

1. Mở **`Start.bat`** → trình duyệt tự mở `http://localhost:3030`
2. Kéo thả file PDF vào ô upload (hoặc nhấn chọn file)
3. Nhấn **"Bắt Đầu Chuyển Đổi"**
4. Đợi xử lý (tùy kích thước file, ~1-5 phút)
5. Tải file Word về hoặc nhấn "Mở trong Word"

---

## 🔧 Yêu Cầu Hệ Thống

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| **Node.js** | ≥ 18.x | https://nodejs.org |
| **Python** | ≥ 3.10 | Tự động cài qua `Cai_dat.bat` |
| **RAM** | ≥ 4 GB | Khuyến nghị 8 GB cho file lớn |
| **OS** | Windows 10/11 | 64-bit |

---

## ⚙️ Engine Chuyển Đổi

| Engine | Khi nào dùng | Chất lượng |
|---|---|---|
| **pdf2docx (Python)** | Mặc định — khi Python đã cài | ⭐⭐⭐⭐⭐ |
| **pdfjs (Node.js)** | Fallback — khi Python chưa cài | ⭐⭐⭐ |

---

## 📁 Cấu Trúc File

```
PDF_to_Word_Pro/
├── Start.bat          ← Chạy ứng dụng (click đúp)
├── Cai_dat.bat        ← Cài đặt lần đầu
├── server.js          ← Server Node.js
├── pdf2word.py        ← Engine Python (pdf2docx)
├── converter_core.js  ← Engine fallback (Node.js)
├── public/            ← Giao diện web
└── package.json       ← Cấu hình npm
```

---

## 🔍 Lỗi Thường Gặp

**"Cannot find module"** → Chạy lại `Cai_dat.bat`

**"Python not found"** → Cài Python tại https://python.org/downloads, tick chọn "Add to PATH"

**Convert chậm** → Bình thường với file lớn (100+ trang ~2-5 phút). Máy nhiều CPU core sẽ nhanh hơn.

**Bảng bị mất border** → Đã được fix tự động trong post-processing

---

*PDF to Word Pro — Developed 2026*
