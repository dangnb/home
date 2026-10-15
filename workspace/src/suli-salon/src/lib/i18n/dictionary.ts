import "server-only";
import type { Locale } from "./config";
import type { TranslationDictionary } from "./types";

const dictionaries: Record<Locale, TranslationDictionary> = {
  vi: {
    meta: {
      homeTitle: "Mộc Salon | Nghệ thuật móng tinh tế",
      homeDescription: "Chăm sóc móng cao cấp với đội ngũ tận tâm và kỹ thuật tỉ mỉ. Khám phá vẻ đẹp mang dấu ấn riêng của bạn tại Mộc Salon.",
      servicesTitle: "Dịch vụ | Mộc Salon",
      servicesDescription: "Khám phá các dịch vụ chăm sóc móng chuyên nghiệp tại Mộc Salon.",
      galleryTitle: "Bộ sưu tập | Mộc Salon",
      galleryDescription: "Khám phá bộ sưu tập các mẫu móng nghệ thuật tại Mộc Salon.",
      aboutTitle: "Giới thiệu | Mộc Salon",
      aboutDescription: "Khám phá câu chuyện và giá trị của Mộc Salon.",
      contactTitle: "Liên hệ | Mộc Salon",
      contactDescription: "Liên hệ Mộc Salon để được tư vấn và đặt lịch.",
      bookingTitle: "Đặt lịch | Mộc Salon",
      bookingDescription: "Đặt lịch chăm sóc móng tại Mộc Salon một cách nhanh chóng và thuận tiện.",
      postsTitle: "Góc chia sẻ | Mộc Salon",
      postsDescription: "Cập nhật xu hướng và bí quyết chăm sóc móng từ Mộc Salon.",
      postNotFound: "Không tìm thấy bài viết | Mộc Salon",
      postFallbackDescription: "Chia sẻ từ Mộc Salon.",
    },
    nav: { home: "Trang chủ", services: "Dịch vụ", about: "Giới thiệu", gallery: "Bộ sưu tập", posts: "Bài viết", contact: "Liên hệ", booking: "Đặt lịch ngay", openMenu: "Mở menu điều hướng", closeMenu: "Đóng menu điều hướng", desktop: "Điều hướng chính", mobile: "Điều hướng trên thiết bị di động", language: "Ngôn ngữ" },
    footer: { description: "Nơi mỗi bộ móng được chăm chút tỉ mỉ, để bạn tự tin tỏa sáng theo cách riêng của mình. Không gian thư giãn, phong cách mộc tự nhiên.", quickLinks: "Liên kết nhanh", services: "Dịch vụ móng", gallery: "Bộ sưu tập Nail Art", journal: "Cẩm nang làm đẹp", about: "Về Mộc Salon", booking: "Đặt lịch hẹn", contact: "Liên hệ & Vị trí", contactInfo: "Thông tin liên hệ", hotline: "Hotline đặt lịch", address: "Địa chỉ salon", email: "Email hỗ trợ", hours: "Giờ mở cửa", bookingTip: "Quý khách nên đặt lịch trước để được chuẩn bị chu đáo và không phải chờ đợi.", privacy: "Chính sách bảo mật", terms: "Điều khoản sử dụng", safety: "Quy chuẩn an toàn" },
    common: { home: "Trang chủ", bookNow: "Đặt lịch ngay", bookAppointment: "Đặt lịch hẹn", submit: "Gửi yêu cầu", sending: "Đang gửi...", close: "Đóng", viewImage: "Xem ảnh", all: "Tất cả", select: "Chọn...", requiredFields: "Vui lòng điền đầy đủ các thông tin bắt buộc.", error: "Đã xảy ra sự cố khi xử lý yêu cầu. Quý khách vui lòng thử lại hoặc liên hệ hotline để được hỗ trợ.", success: "Gửi yêu cầu thành công!", successMessage: "Cảm ơn quý khách! Mộc Salon đã tiếp nhận thông tin và sẽ liên hệ xác nhận trong thời gian sớm nhất." },
  },
  en: {
    meta: {
      homeTitle: "Mộc Salon | Refined nail artistry",
      homeDescription: "Premium nail care by a caring team with meticulous technique. Discover a look that feels uniquely yours at Mộc Salon.",
      servicesTitle: "Services | Mộc Salon",
      servicesDescription: "Explore professional nail-care services at Mộc Salon.",
      galleryTitle: "Gallery | Mộc Salon",
      galleryDescription: "Explore Mộc Salon's collection of nail art designs.",
      aboutTitle: "About | Mộc Salon",
      aboutDescription: "Discover Mộc Salon's story and values.",
      contactTitle: "Contact | Mộc Salon",
      contactDescription: "Contact Mộc Salon for advice or to book an appointment.",
      bookingTitle: "Book an appointment | Mộc Salon",
      bookingDescription: "Book your nail-care appointment at Mộc Salon quickly and conveniently.",
      postsTitle: "Journal | Mộc Salon",
      postsDescription: "Nail-care tips, trends, and stories from Mộc Salon.",
      postNotFound: "Article not found | Mộc Salon",
      postFallbackDescription: "A story from Mộc Salon.",
    },
    nav: { home: "Home", services: "Services", about: "About", gallery: "Gallery", posts: "Journal", contact: "Contact", booking: "Book now", openMenu: "Open navigation menu", closeMenu: "Close navigation menu", desktop: "Primary navigation", mobile: "Mobile navigation", language: "Language" },
    footer: { description: "Every set of nails is crafted with care, so you can shine confidently in your own way. A relaxing space with a naturally understated spirit.", quickLinks: "Quick links", services: "Nail services", gallery: "Nail art gallery", journal: "Beauty journal", about: "About Mộc Salon", booking: "Book an appointment", contact: "Contact & location", contactInfo: "Contact information", hotline: "Booking hotline", address: "Salon address", email: "Support email", hours: "Opening hours", bookingTip: "We recommend booking ahead so we can prepare for you and keep your visit wait-free.", privacy: "Privacy policy", terms: "Terms of use", safety: "Safety standards" },
    common: { home: "Home", bookNow: "Book now", bookAppointment: "Book an appointment", submit: "Send request", sending: "Sending...", close: "Close", viewImage: "View image", all: "All", select: "Select...", requiredFields: "Please fill in all required fields.", error: "An error occurred while processing your request. Please try again or call our hotline for assistance.", success: "Request Submitted Successfully!", successMessage: "Thank you! Mộc Salon has received your request and will contact you shortly to confirm." },
  },
};

export type Dictionary = TranslationDictionary;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}
