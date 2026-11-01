"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import type {
  DestinationPhoto,
  HeroScene,
  JournalArticle,
  PostcardItem,
  SiteMedia,
  SiteSettings,
  Tour,
} from "@/types";
import styles from "./admin.module.css";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiCheck,
  FiCompass,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiGrid,
  FiImage,
  FiLock,
  FiLogOut,
  FiMail,
  FiMenu,
  FiPhone,
  FiPlus,
  FiSettings,
  FiShield,
  FiStar,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";

interface BookingRecord {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  tourId?: string | null;
  tourTitle?: string | null;
  departureDate?: string | null;
  guestsCount: number;
  notes?: string;
  totalEstimatedPrice?: string;
  createdAt: string;
  status: "new" | "consulting" | "confirmed" | "cancelled";
}

interface ContactRecord {
  id: string;
  email: string;
  createdAt: string;
}

type AdminTab =
  | "overview"
  | "tours"
  | "bookings"
  | "journal"
  | "media"
  | "settings"
  | "security";

const STATUS_LABELS: Record<BookingRecord["status"], string> = {
  new: "Mới tiếp nhận",
  consulting: "Đang tư vấn",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
};

const REGION_NAMES: Record<string, string> = {
  bac: "Miền Bắc",
  trung: "Miền Trung",
  nam: "Miền Nam & Đảo",
};

const EMPTY_TOUR: Tour = {
  id: "",
  slug: "",
  region: "bac",
  regionLabel: "Miền Bắc",
  regionLabelEn: "Northern Vietnam",
  location: "",
  duration: "4 Ngày 3 Đêm",
  durationEn: "4 Days 3 Nights",
  title: "",
  titleEn: "",
  subtitle: "",
  subtitleEn: "",
  badge: "Khởi hành riêng",
  badgeEn: "Private Departure",
  isFeatured: false,
  price: "12.500.000₫",
  priceNumeric: 12500000,
  groupSize: "Tối đa 8 khách",
  groupSizeEn: "Max 8 guests",
  transport: "Limousine riêng",
  transportEn: "Private Limousine",
  image:
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=85",
  gallery: [],
  highlights: ["Trải nghiệm bản địa chuyên sâu", "Lưu trú boutique tuyển chọn"],
  highlightsEn: ["In-depth local immersion", "Curated boutique stays"],
  itinerary: [
    { day: 1, title: "Khởi hành & chạm ngõ vùng di sản", titleEn: "Arrival & heritage welcome" },
    { day: 2, title: "Đi sâu vào nhịp sống làng nghề", titleEn: "Deep dive into artisan village life" },
    { day: 3, title: "Thưởng thức ẩm thực mùa vụ & trở về", titleEn: "Seasonal dining & return" },
  ],
};

const EMPTY_ARTICLE: JournalArticle = {
  id: "",
  slug: "",
  title: "",
  titleEn: "",
  readTime: "6 phút đọc",
  readTimeEn: "6 min read",
  tag: "Di sản & Làng nghề",
  tagEn: "Heritage & Craft",
  date: "Tháng 11, 2026",
  dateEn: "November 2026",
  excerpt: "",
  excerptEn: "",
  image:
    "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=85",
  author: "Ban biên tập Nếp",
  authorEn: "Nếp Editorial",
  location: "Việt Nam",
  locationEn: "Vietnam",
  pullQuote: "",
  pullQuoteEn: "",
  content: [],
  contentEn: [],
};

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState("admin");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Change password state
  const [secUsername, setSecUsername] = useState("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [journal, setJournal] = useState<JournalArticle[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [media, setMedia] = useState<SiteMedia>({
    heroSlides: [],
    destinations: [],
    postcards: [],
  });
  const [settings, setSettings] = useState<SiteSettings>({
    brandName: "NẾP JOURNEYS",
    slogan: "Chạm vào nếp sống Việt",
    sloganEn: "Touches of Authentic Vietnamese Living",
    hotline: "0988 123 456",
    hotlineDisplay: "0988 123 456",
    zalo: "https://zalo.me/0988123456",
    messenger: "https://m.me/nepjourneys.vn",
    email: "xin-chao@nepjourneys.vn",
    address: "Tầng 5, Toà nhà Heritage, 12 Tràng Thi, Hoàn Kiếm, Hà Nội",
    addressEn: "5th Floor, Heritage Building, 12 Trang Thi, Hoan Kiem, Hanoi",
    socials: {
      facebook: "https://facebook.com/nepjourneys",
      instagram: "https://instagram.com/nepjourneys",
    },
  });

  // Filters
  const [tourRegionFilter, setTourRegionFilter] = useState<string>("all");
  const [tourSearch, setTourSearch] = useState<string>("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");

  // Modals
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isNewTour, setIsNewTour] = useState(false);
  const [highlightsText, setHighlightsText] = useState("");
  const [itineraryText, setItineraryText] = useState("");

  const [editingArticle, setEditingArticle] = useState<JournalArticle | null>(
    null
  );
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [articleParagraphs, setArticleParagraphs] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTours(Array.isArray(data.tours) ? data.tours : []);
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        setJournal(Array.isArray(data.journal) ? data.journal : []);
        setContacts(Array.isArray(data.contacts) ? data.contacts : []);
        if (data.settings && data.settings.brandName) {
          setSettings(data.settings);
        }
        if (data.media) {
          setMedia({
            heroSlides: Array.isArray(data.media.heroSlides)
              ? data.media.heroSlides
              : [],
            destinations: Array.isArray(data.media.destinations)
              ? data.media.destinations
              : [],
            postcards: Array.isArray(data.media.postcards)
              ? data.media.postcards
              : [],
          });
        }
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function verifySessionAndLoad() {
      try {
        const authRes = await fetch("/api/admin/auth", { cache: "no-store" });
        if (authRes.ok) {
          const authData = await authRes.json();
          setIsAuthenticated(true);
          const u = authData.username || "admin";
          setAdminUser(u);
          setSecUsername(u);
          await loadWorkspaceData();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch {
        setIsAuthenticated(false);
        setLoading(false);
      } finally {
        setAuthChecked(true);
      }
    }
    verifySessionAndLoad();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username: loginUsername,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Đăng nhập không thành công.");
        return;
      }
      setIsAuthenticated(true);
      setAdminUser(data.username || "admin");
      setSecUsername(data.username || "admin");
      setLoginPassword("");
      await loadWorkspaceData();
    } catch {
      setLoginError("Không thể kết nối tới máy chủ xác thực.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-password",
          currentPassword,
          newUsername: secUsername,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Không thể đổi mật khẩu.");
        return;
      }
      setAdminUser(data.username || secUsername);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast(data.message || "Đã cập nhật mật khẩu thành công.");
    } catch {
      showToast("Lỗi kết nối khi cập nhật bảo mật.");
    } finally {
      setSaving(false);
    }
  };

  const persistEntity = async (
    entity:
      | "tours"
      | "journal"
      | "bookings"
      | "contacts"
      | "settings"
      | "media",
    data: unknown,
    successMessage: string
  ) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, data }),
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoginError("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }
      if (res.ok) {
        showToast(successMessage);
      } else {
        showToast("Không thể lưu thay đổi. Vui lòng thử lại.");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ khi lưu.");
    } finally {
      setSaving(false);
    }
  };

  // Computed metrics
  const newBookingsCount = useMemo(
    () => bookings.filter((b) => b.status === "new").length,
    [bookings]
  );

  const estimatedRevenue = useMemo(() => {
    return bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((acc, b) => {
        const numeric = parseInt(
          (b.totalEstimatedPrice || "").replace(/\D/g, ""),
          10
        );
        return acc + (Number.isNaN(numeric) ? 0 : numeric);
      }, 0);
  }, [bookings]);

  const filteredTours = useMemo(() => {
    return tours.filter((t) => {
      const matchRegion =
        tourRegionFilter === "all" || t.region === tourRegionFilter;
      const q = tourSearch.trim().toLowerCase();
      const matchQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q);
      return matchRegion && matchQuery;
    });
  }, [tours, tourRegionFilter, tourSearch]);

  const filteredBookings = useMemo(() => {
    if (bookingStatusFilter === "all") return bookings;
    return bookings.filter((b) => b.status === bookingStatusFilter);
  }, [bookings, bookingStatusFilter]);

  // Handlers for Bookings
  const handleStatusChange = async (
    bookingId: string,
    newStatus: BookingRecord["status"]
  ) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookings(updated);
    await persistEntity(
      "bookings",
      updated,
      `Đã cập nhật trạng thái đơn: ${STATUS_LABELS[newStatus]}`
    );
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const updated = bookings.filter((b) => b.id !== bookingId);
    setBookings(updated);
    await persistEntity("bookings", updated, "Đã xóa yêu cầu đặt chỗ.");
  };

  // Handlers for Tours
  const handleToggleFeatured = async (tourId: string) => {
    const updated = tours.map((t) =>
      t.id === tourId ? { ...t, isFeatured: !t.isFeatured } : t
    );
    setTours(updated);
    await persistEntity(
      "tours",
      updated,
      "Đã cập nhật trạng thái Hành trình tâm điểm."
    );
  };

  const handleOpenTourModal = (tour?: Tour) => {
    if (tour) {
      setIsNewTour(false);
      setEditingTour({ ...tour });
      setHighlightsText((tour.highlights || []).join("\n"));
      setItineraryText(
        (tour.itinerary || [])
          .map((item) => `${item.day}. ${item.title}`)
          .join("\n")
      );
    } else {
      setIsNewTour(true);
      const freshId = `tour-${Date.now()}`;
      setEditingTour({ ...EMPTY_TOUR, id: freshId, slug: freshId });
      setHighlightsText(EMPTY_TOUR.highlights.join("\n"));
      setItineraryText(
        EMPTY_TOUR.itinerary
          .map((item) => `${item.day}. ${item.title}`)
          .join("\n")
      );
    }
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;

    const regionLabel = REGION_NAMES[editingTour.region] || "Miền Bắc";
    const regionLabelEn =
      editingTour.region === "trung"
        ? "Central Vietnam"
        : editingTour.region === "nam"
          ? "Southern & Islands"
          : "Northern Vietnam";

    const parsedHighlights = highlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedItinerary = itineraryText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const clean = line.replace(/^\d+[\.\)\-\s]+/, "").trim();
        return {
          day: idx + 1,
          title: clean,
          titleEn: clean,
        };
      });

    const slug =
      editingTour.slug ||
      editingTour.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const normalizedTour: Tour = {
      ...editingTour,
      slug,
      titleEn: editingTour.titleEn || editingTour.title,
      subtitleEn: editingTour.subtitleEn || editingTour.subtitle,
      regionLabel,
      regionLabelEn,
      highlights: parsedHighlights,
      highlightsEn:
        editingTour.highlightsEn?.length === parsedHighlights.length
          ? editingTour.highlightsEn
          : parsedHighlights,
      itinerary: parsedItinerary,
      gallery:
        editingTour.gallery && editingTour.gallery.length > 0
          ? editingTour.gallery
          : [editingTour.image],
    };

    const updated = isNewTour
      ? [normalizedTour, ...tours]
      : tours.map((t) => (t.id === normalizedTour.id ? normalizedTour : t));

    setTours(updated);
    setEditingTour(null);
    await persistEntity(
      "tours",
      updated,
      isNewTour
        ? "Đã thêm tuyến hành trình mới."
        : "Đã lưu thông tin tuyến hành trình."
    );
  };

  const handleDeleteTour = async (tourId: string) => {
    const updated = tours.filter((t) => t.id !== tourId);
    setTours(updated);
    await persistEntity("tours", updated, "Đã xóa tuyến hành trình.");
  };

  // Handlers for Journal
  const handleOpenArticleModal = (article?: JournalArticle) => {
    if (article) {
      setIsNewArticle(false);
      setEditingArticle({ ...article });
      setArticleParagraphs((article.content || []).join("\n\n"));
    } else {
      setIsNewArticle(true);
      const id = `journal-${Date.now()}`;
      setEditingArticle({ ...EMPTY_ARTICLE, id, slug: id });
      setArticleParagraphs(
        "Mỗi chuyến đi của Nếp bắt đầu từ sự lắng nghe nhịp điệu tự nhiên của vùng đất.\n\nChúng tôi dành thời gian ngồi lại cùng những nghệ nhân giữ lửa làng nghề truyền thống."
      );
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    const paragraphs = articleParagraphs
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const normalized: JournalArticle = {
      ...editingArticle,
      titleEn: editingArticle.titleEn || editingArticle.title,
      excerptEn: editingArticle.excerptEn || editingArticle.excerpt,
      pullQuoteEn: editingArticle.pullQuoteEn || editingArticle.pullQuote,
      content: paragraphs,
      contentEn: paragraphs,
    };

    const updated = isNewArticle
      ? [normalized, ...journal]
      : journal.map((a) => (a.id === normalized.id ? normalized : a));

    setJournal(updated);
    setEditingArticle(null);
    await persistEntity(
      "journal",
      updated,
      isNewArticle ? "Đã xuất bản bài viết mới." : "Đã cập nhật bài viết."
    );
  };

  const handleDeleteArticle = async (articleId: string) => {
    const updated = journal.filter((a) => a.id !== articleId);
    setJournal(updated);
    await persistEntity("journal", updated, "Đã xóa bài viết nhật ký.");
  };

  // Handlers for Contacts & Settings
  const handleDeleteContact = async (contactId: string) => {
    const updated = contacts.filter((c) => c.id !== contactId);
    setContacts(updated);
    await persistEntity("contacts", updated, "Đã xóa địa chỉ liên hệ.");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistEntity(
      "settings",
      settings,
      "Đã lưu cấu hình thương hiệu & liên hệ."
    );
  };

  const tabMeta: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: "Bảng điều khiển Concierge",
      subtitle:
        "Tổng quan các tuyến hành trình, lịch khởi hành và yêu cầu tư vấn từ lữ khách.",
    },
    tours: {
      title: "Quản lý Tuyến hành trình",
      subtitle:
        "Thiết lập lịch trình, chi phí, quy mô đoàn và trạng thái hiển thị trên trang chủ.",
    },
    bookings: {
      title: "Yêu cầu Đặt chỗ & Tư vấn",
      subtitle:
        "Theo dõi và phản hồi các yêu cầu thiết kế hành trình riêng từ khách hàng.",
    },
    journal: {
      title: "Nhật ký & Cẩm nang du khảo",
      subtitle:
        "Biên tập các bài viết chuyên sâu về văn hóa, kiến trúc và làng nghề ba miền.",
    },
    media: {
      title: "Quản lý Slider, Thư viện Điểm đến & Lưu bút",
      subtitle:
        "Đồng bộ trực tiếp ảnh Hero Slider toàn màn hình, Thư viện ảnh 3 miền và Lưu bút lữ khách trên trang chủ.",
    },
    settings: {
      title: "Cấu hình Thương hiệu & Bản tin",
      subtitle:
        "Quản lý thông tin liên hệ Hotline, Zalo, Facebook và danh sách độc giả đăng ký.",
    },
    security: {
      title: "Bảo mật & Tài khoản Quản trị",
      subtitle:
        "Quản lý thông tin đăng nhập, đổi mật khẩu mã hóa scrypt và kiểm soát phiên làm việc.",
    },
  };

  if (!authChecked) {
    return (
      <div className={styles.loginScreen}>
        <div className={styles.loginMain} style={{ gridColumn: "1 / -1" }}>
          <p className={styles.pageSub}>
            Đang kiểm tra chứng chỉ bảo mật Nếp Journeys...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginScreen}>
        <div className={styles.loginVisual}>
          <img
            src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85"
            alt="Nếp Journeys Heritage"
            className={styles.loginBgImg}
          />
          <div className={styles.loginScrim} />

          <div className={styles.loginVisualTop}>
            <BrandLogo href="/" size="md" showTagline />
          </div>

          <div className={styles.loginVisualBottom}>
            <h2 className={styles.loginQuote}>
              Không gian điều hành hành trình văn hóa &amp; tư vấn lữ khách
              riêng tư.
            </h2>
            <ul className={styles.loginSecurityList}>
              <li className={styles.loginSecurityItem}>
                <FiShield size={14} />
                <span>
                  Phiên làm việc ký số HMAC-SHA256 &amp; Cookie HttpOnly
                </span>
              </li>
              <li className={styles.loginSecurityItem}>
                <FiLock size={14} />
                <span>
                  Mật khẩu băm một chiều (scrypt + salt) &amp; khóa tạm thời khi
                  nhập sai 5 lần
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.loginMain}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <span className={styles.loginEyebrow}>
                <FiLock size={12} />
                <span>Cổng Quản trị Bảo mật</span>
              </span>
              <h1 className={styles.loginTitle}>Đăng nhập Hệ thống</h1>
              <p className={styles.loginSub}>
                Vui lòng xác thực tài khoản điều hành để truy cập dữ liệu hành
                trình và hồ sơ khách hàng.
              </p>
            </div>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              {loginError && (
                <div className={styles.loginError} role="alert">
                  {loginError}
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="admin-username">Tên đăng nhập</label>
                <input
                  id="admin-username"
                  required
                  autoComplete="username"
                  className={styles.input}
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="admin-password">Mật khẩu quản trị</label>
                <div className={styles.passwordWrap}>
                  <input
                    id="admin-password"
                    type={showLoginPass ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className={styles.input}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowLoginPass((prev) => !prev)}
                    aria-label={
                      showLoginPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                  >
                    {showLoginPass ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.primaryBtn}
                style={{ width: "100%", justifyContent: "center" }}
                disabled={loggingIn}
              >
                <FiLock size={14} />
                <span>
                  {loggingIn
                    ? "Đang xác thực..."
                    : "Đăng nhập Không gian Quản trị"}
                </span>
              </button>
            </form>

            <div className={styles.demoHintBox}>
              <div>
                <strong>Mặc định:</strong> <code>admin</code> /{" "}
                <code>nep2026</code>
              </div>
              <button
                type="button"
                className={styles.demoFillBtn}
                onClick={() => {
                  setLoginUsername("admin");
                  setLoginPassword("nep2026");
                }}
              >
                Điền nhanh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminShell}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.sidebarTop}>
          <div className={styles.brandRow}>
            <BrandLogo href="/" size="sm" showTagline={false} />
            <span className={styles.adminBadge}>CMS</span>
          </div>

          <nav className={styles.navGroup} aria-label="Điều hướng quản trị">
            <p className={styles.navSectionLabel}>Không gian quản trị</p>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === "overview" ? styles.navItemActive : ""
              }`}
              onClick={() => {
                setActiveTab("overview");
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navItemLeft}>
                <FiGrid size={16} />
                <span>Tổng quan</span>
              </span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === "tours" ? styles.navItemActive : ""
              }`}
              onClick={() => {
                setActiveTab("tours");
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navItemLeft}>
                <FiCompass size={16} />
                <span>Tuyến hành trình</span>
              </span>
              <span className={styles.navCount}>{tours.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === "bookings" ? styles.navItemActive : ""
              }`}
              onClick={() => {
                setActiveTab("bookings");
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navItemLeft}>
                <FiCalendar size={16} />
                <span>Đặt chỗ & Tư vấn</span>
              </span>
              <span
                className={`${styles.navCount} ${
                  newBookingsCount > 0 ? styles.navCountAlert : ""
                }`}
              >
                {bookings.length}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === "journal" ? styles.navItemActive : ""
              }`}
              onClick={() => {
                setActiveTab("journal");
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navItemLeft}>
                <FiBookOpen size={16} />
                <span>Nhật ký & Bài viết</span>
              </span>
              <span className={styles.navCount}>{journal.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === "media" ? styles.navItemActive : ""
              }`}
              onClick={() => {
                setActiveTab("media");
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navItemLeft}>
                <FiImage size={16} />
                <span>Slider & Thư viện</span>
              </span>
              <span className={styles.navCount}>
                {media.heroSlides.length + media.destinations.length}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === "settings" ? styles.navItemActive : ""
              }`}
              onClick={() => {
                setActiveTab("settings");
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navItemLeft}>
                <FiSettings size={16} />
                <span>Cấu hình & Bản tin</span>
              </span>
              <span className={styles.navCount}>{contacts.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === "security" ? styles.navItemActive : ""
              }`}
              onClick={() => {
                setActiveTab("security");
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navItemLeft}>
                <FiShield size={16} />
                <span>Bảo mật & Mật khẩu</span>
              </span>
            </button>
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <Link href="/reels" className={styles.viewSiteLink}>
            <span>🎬 Xuất Video Reels FB (9:16)</span>
            <FiArrowUpRight size={15} />
          </Link>
          <Link href="/" className={styles.viewSiteLink}>
            <span>Mở trang chủ Nếp Journeys</span>
            <FiArrowUpRight size={15} />
          </Link>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            <span>Đăng xuất ({adminUser})</span>
            <FiLogOut size={15} />
          </button>
          <p className={styles.conciergeNote}>
            Hotline trực điều hành: {settings.hotlineDisplay || settings.hotline}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainArea}>
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Mở menu quản trị"
            >
              <FiMenu size={18} />
            </button>
            <div>
              <h1 className={styles.pageHeading}>
                {tabMeta[activeTab].title}
              </h1>
              <p className={styles.pageSub}>{tabMeta[activeTab].subtitle}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {toast && (
              <div className={styles.toastBanner} role="status">
                <FiCheck size={15} />
                <span>{toast}</span>
              </div>
            )}
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                setActiveTab("journal");
                handleOpenArticleModal();
              }}
            >
              <FiPlus size={15} />
              <span>Viết Nhật ký</span>
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => {
                setActiveTab("tours");
                handleOpenTourModal();
              }}
            >
              <FiPlus size={15} />
              <span>Thêm Hành trình</span>
            </button>
          </div>
        </header>

        <main className={styles.contentWrap}>
          {loading ? (
            <div className={styles.panel}>
              <div className={styles.emptyState}>
                Đang tải dữ liệu điều hành Nếp Journeys...
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <>
                  <section className={styles.kpiGrid}>
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiTop}>
                        <span className={styles.kpiLabel}>
                          Tổng giá trị đặt chỗ dự kiến
                        </span>
                        <span className={styles.kpiIcon}>
                          <FiCalendar size={16} />
                        </span>
                      </div>
                      <div className={styles.kpiValue}>
                        {estimatedRevenue.toLocaleString("vi-VN")}₫
                      </div>
                      <span className={styles.kpiMeta}>
                        Tính trên các yêu cầu đang hoạt động
                      </span>
                    </div>

                    <div className={styles.kpiCard}>
                      <div className={styles.kpiTop}>
                        <span className={styles.kpiLabel}>
                          Yêu cầu Đặt chỗ & Tư vấn
                        </span>
                        <span className={styles.kpiIcon}>
                          <FiUsers size={16} />
                        </span>
                      </div>
                      <div className={styles.kpiValue}>{bookings.length}</div>
                      <span className={styles.kpiMeta}>
                        {newBookingsCount} yêu cầu mới chờ liên hệ
                      </span>
                    </div>

                    <div className={styles.kpiCard}>
                      <div className={styles.kpiTop}>
                        <span className={styles.kpiLabel}>
                          Tuyến Hành trình đang mở
                        </span>
                        <span className={styles.kpiIcon}>
                          <FiCompass size={16} />
                        </span>
                      </div>
                      <div className={styles.kpiValue}>{tours.length}</div>
                      <span className={styles.kpiMeta}>
                        {tours.filter((t) => t.isFeatured).length} tuyến tâm
                        điểm trên trang chủ
                      </span>
                    </div>

                    <div className={styles.kpiCard}>
                      <div className={styles.kpiTop}>
                        <span className={styles.kpiLabel}>
                          Nhật ký & Độc giả bản tin
                        </span>
                        <span className={styles.kpiIcon}>
                          <FiBookOpen size={16} />
                        </span>
                      </div>
                      <div className={styles.kpiValue}>
                        {journal.length} bài · {contacts.length} độc giả
                      </div>
                      <span className={styles.kpiMeta}>
                        Cẩm nang văn hóa & đăng ký email
                      </span>
                    </div>
                  </section>

                  <div className={styles.panelGrid}>
                    {/* Recent Bookings */}
                    <section className={styles.panel}>
                      <div className={styles.panelHeader}>
                        <div className={styles.panelTitleGroup}>
                          <h2 className={styles.panelTitle}>
                            Yêu cầu Đặt chỗ gần đây
                          </h2>
                          <p className={styles.panelSub}>
                            Cập nhật trạng thái tư vấn trực tiếp cho từng đoàn
                            khách
                          </p>
                        </div>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setActiveTab("bookings")}
                        >
                          <span>Xem tất cả ({bookings.length})</span>
                          <FiArrowUpRight size={14} />
                        </button>
                      </div>

                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Khách hàng</th>
                              <th>Hành trình</th>
                              <th>Khởi hành</th>
                              <th>Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.slice(0, 5).map((b) => (
                              <tr key={b.id}>
                                <td>
                                  <span className={styles.tourTitleText}>
                                    {b.customerName}
                                  </span>
                                  <span className={styles.tourSubText}>
                                    {b.phone} · {b.guestsCount} khách
                                  </span>
                                </td>
                                <td>
                                  <span className={styles.tourTitleText}>
                                    {b.tourTitle || "Tư vấn theo yêu cầu"}
                                  </span>
                                  {b.totalEstimatedPrice && (
                                    <span className={styles.tourSubText}>
                                      Dự kiến: {b.totalEstimatedPrice}
                                    </span>
                                  )}
                                </td>
                                <td>{b.departureDate || "Linh hoạt"}</td>
                                <td>
                                  <select
                                    className={`${styles.statusSelect} ${
                                      styles[`status_${b.status}`]
                                    }`}
                                    value={b.status}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        b.id,
                                        e.target.value as BookingRecord["status"]
                                      )
                                    }
                                  >
                                    <option value="new">Mới tiếp nhận</option>
                                    <option value="consulting">
                                      Đang tư vấn
                                    </option>
                                    <option value="confirmed">
                                      Đã xác nhận
                                    </option>
                                    <option value="cancelled">Đã hủy</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                            {bookings.length === 0 && (
                              <tr>
                                <td colSpan={4} className={styles.emptyState}>
                                  Chưa có yêu cầu đặt chỗ nào.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Quick Tours Summary */}
                    <section className={styles.panel}>
                      <div className={styles.panelHeader}>
                        <div className={styles.panelTitleGroup}>
                          <h2 className={styles.panelTitle}>
                            Danh mục Tuyến hành trình
                          </h2>
                          <p className={styles.panelSub}>
                            Nhấn vào ngôi sao để chọn làm Hành trình Tâm điểm
                          </p>
                        </div>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setActiveTab("tours")}
                        >
                          <span>Quản lý</span>
                          <FiArrowUpRight size={14} />
                        </button>
                      </div>

                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Tuyến</th>
                              <th>Chi phí</th>
                              <th>Tâm điểm</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tours.map((t) => (
                              <tr key={t.id}>
                                <td>
                                  <span className={styles.tourTitleText}>
                                    {t.title}
                                  </span>
                                  <span className={styles.tourSubText}>
                                    {t.regionLabel} · {t.duration}
                                  </span>
                                </td>
                                <td className={styles.priceCell}>{t.price}</td>
                                <td>
                                  <button
                                    type="button"
                                    className={`${styles.featuredToggle} ${
                                      t.isFeatured
                                        ? styles.featuredToggleActive
                                        : ""
                                    }`}
                                    onClick={() => handleToggleFeatured(t.id)}
                                  >
                                    <FiStar size={13} />
                                    <span>
                                      {t.isFeatured ? "Tâm điểm" : "Thường"}
                                    </span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                </>
              )}

              {/* TAB 2: TOURS MANAGEMENT */}
              {activeTab === "tours" && (
                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div className={styles.panelTitleGroup}>
                      <h2 className={styles.panelTitle}>
                        Tất cả Tuyến hành trình ({filteredTours.length})
                      </h2>
                      <p className={styles.panelSub}>
                        Dữ liệu được đồng bộ trực tiếp với trang chủ và bộ lọc
                        3 miền
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={() => handleOpenTourModal()}
                    >
                      <FiPlus size={15} />
                      <span>Thêm tuyến mới</span>
                    </button>
                  </div>

                  <div className={styles.toolbar}>
                    <div className={styles.filterTabs}>
                      {[
                        { id: "all", label: "Tất cả miền" },
                        { id: "bac", label: "Miền Bắc" },
                        { id: "trung", label: "Miền Trung" },
                        { id: "nam", label: "Miền Nam & Đảo" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          className={`${styles.filterTab} ${
                            tourRegionFilter === tab.id
                              ? styles.filterTabActive
                              : ""
                          }`}
                          onClick={() => setTourRegionFilter(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="search"
                      className={styles.searchInput}
                      placeholder="Tìm theo tên hành trình, địa danh..."
                      value={tourSearch}
                      onChange={(e) => setTourSearch(e.target.value)}
                    />
                  </div>

                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Hành trình</th>
                          <th>Vùng miền</th>
                          <th>Thời lượng & Đoàn</th>
                          <th>Giá niêm yết</th>
                          <th>Hiển thị</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTours.map((tour) => (
                          <tr key={tour.id}>
                            <td>
                              <div className={styles.tourCell}>
                                <img
                                  src={tour.image}
                                  alt={tour.title}
                                  className={styles.tourThumb}
                                />
                                <div>
                                  <span className={styles.tourTitleText}>
                                    {tour.title}
                                  </span>
                                  <span className={styles.tourSubText}>
                                    {tour.location} ·{" "}
                                    {tour.badge || "Khởi hành riêng"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={styles.regionTag}>
                                {tour.regionLabel}
                              </span>
                            </td>
                            <td>
                              <span className={styles.tourTitleText}>
                                {tour.duration}
                              </span>
                              <span className={styles.tourSubText}>
                                {tour.groupSize} · {tour.transport}
                              </span>
                            </td>
                            <td className={styles.priceCell}>{tour.price}</td>
                            <td>
                              <button
                                type="button"
                                className={`${styles.featuredToggle} ${
                                  tour.isFeatured
                                    ? styles.featuredToggleActive
                                    : ""
                                }`}
                                onClick={() => handleToggleFeatured(tour.id)}
                              >
                                <FiStar size={13} />
                                <span>
                                  {tour.isFeatured ? "Tâm điểm" : "Tiêu chuẩn"}
                                </span>
                              </button>
                            </td>
                            <td>
                              <div className={styles.rowActions}>
                                <button
                                  type="button"
                                  className={styles.actionBtn}
                                  onClick={() => handleOpenTourModal(tour)}
                                >
                                  <FiEdit2 size={13} />
                                  <span>Sửa</span>
                                </button>
                                <button
                                  type="button"
                                  className={styles.dangerBtn}
                                  onClick={() => handleDeleteTour(tour.id)}
                                >
                                  <FiTrash2 size={13} />
                                  <span>Xóa</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredTours.length === 0 && (
                          <tr>
                            <td colSpan={6} className={styles.emptyState}>
                              Không tìm thấy tuyến hành trình phù hợp.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* TAB 3: BOOKINGS CRM */}
              {activeTab === "bookings" && (
                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div className={styles.panelTitleGroup}>
                      <h2 className={styles.panelTitle}>
                        Danh sách Đặt chỗ & Yêu cầu Tư vấn (
                        {filteredBookings.length})
                      </h2>
                      <p className={styles.panelSub}>
                        Liên hệ trực tiếp qua điện thoại hoặc Zalo và cập nhật
                        tiến độ xử lý hồ sơ
                      </p>
                    </div>
                  </div>

                  <div className={styles.toolbar}>
                    <div className={styles.filterTabs}>
                      {[
                        { id: "all", label: `Tất cả (${bookings.length})` },
                        {
                          id: "new",
                          label: `Mới tiếp nhận (${
                            bookings.filter((b) => b.status === "new").length
                          })`,
                        },
                        {
                          id: "consulting",
                          label: `Đang tư vấn (${
                            bookings.filter((b) => b.status === "consulting")
                              .length
                          })`,
                        },
                        {
                          id: "confirmed",
                          label: `Đã xác nhận (${
                            bookings.filter((b) => b.status === "confirmed")
                              .length
                          })`,
                        },
                        {
                          id: "cancelled",
                          label: `Đã hủy (${
                            bookings.filter((b) => b.status === "cancelled")
                              .length
                          })`,
                        },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          className={`${styles.filterTab} ${
                            bookingStatusFilter === tab.id
                              ? styles.filterTabActive
                              : ""
                          }`}
                          onClick={() => setBookingStatusFilter(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Khách hàng & Liên hệ</th>
                          <th>Hành trình đăng ký</th>
                          <th>Ngày khởi hành & Đoàn</th>
                          <th>Ghi chú từ khách</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => {
                          const cleanPhone = b.phone.replace(/\s+/g, "");
                          return (
                            <tr key={b.id}>
                              <td>
                                <span className={styles.tourTitleText}>
                                  {b.customerName}
                                </span>
                                <span className={styles.tourSubText}>
                                  {b.phone}
                                  {b.email ? ` · ${b.email}` : ""}
                                </span>
                              </td>
                              <td>
                                <span className={styles.tourTitleText}>
                                  {b.tourTitle || "Tư vấn lộ trình riêng"}
                                </span>
                                <span className={styles.tourSubText}>
                                  Dự kiến:{" "}
                                  {b.totalEstimatedPrice || "Đang báo giá"}
                                </span>
                              </td>
                              <td>
                                <span className={styles.tourTitleText}>
                                  {b.departureDate || "Chưa ấn định"}
                                </span>
                                <span className={styles.tourSubText}>
                                  {b.guestsCount} khách
                                </span>
                              </td>
                              <td style={{ maxWidth: "280px" }}>
                                {b.notes || (
                                  <span className={styles.tourSubText}>
                                    Không có ghi chú thêm
                                  </span>
                                )}
                              </td>
                              <td>
                                <select
                                  className={`${styles.statusSelect} ${
                                    styles[`status_${b.status}`]
                                  }`}
                                  value={b.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      b.id,
                                      e.target.value as BookingRecord["status"]
                                    )
                                  }
                                >
                                  <option value="new">Mới tiếp nhận</option>
                                  <option value="consulting">
                                    Đang tư vấn
                                  </option>
                                  <option value="confirmed">Đã xác nhận</option>
                                  <option value="cancelled">Đã hủy</option>
                                </select>
                              </td>
                              <td>
                                <div className={styles.rowActions}>
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    className={styles.actionBtn}
                                    title="Gọi điện"
                                  >
                                    <FiPhone size={13} />
                                    <span>Gọi</span>
                                  </a>
                                  <a
                                    href={`https://zalo.me/${cleanPhone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.actionBtn}
                                  >
                                    <span>Zalo</span>
                                  </a>
                                  <button
                                    type="button"
                                    className={styles.dangerBtn}
                                    onClick={() => handleDeleteBooking(b.id)}
                                  >
                                    <FiTrash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredBookings.length === 0 && (
                          <tr>
                            <td colSpan={6} className={styles.emptyState}>
                              Không có yêu cầu đặt chỗ nào trong trạng thái này.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* TAB 4: JOURNAL MANAGEMENT */}
              {activeTab === "journal" && (
                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div className={styles.panelTitleGroup}>
                      <h2 className={styles.panelTitle}>
                        Nhật ký & Cẩm nang du khảo ({journal.length})
                      </h2>
                      <p className={styles.panelSub}>
                        Các bài ký sự văn hóa hiển thị tại chuyên mục Nhật ký
                        trên trang chủ
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={() => handleOpenArticleModal()}
                    >
                      <FiPlus size={15} />
                      <span>Viết bài mới</span>
                    </button>
                  </div>

                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Bài viết</th>
                          <th>Chuyên mục</th>
                          <th>Tác giả & Thời gian đọc</th>
                          <th>Ngày đăng</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journal.map((art) => (
                          <tr key={art.id}>
                            <td>
                              <div className={styles.tourCell}>
                                <img
                                  src={art.image}
                                  alt={art.title}
                                  className={styles.tourThumb}
                                />
                                <div>
                                  <span className={styles.tourTitleText}>
                                    {art.title}
                                  </span>
                                  <span className={styles.tourSubText}>
                                    {art.location || "Việt Nam"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={styles.regionTag}>
                                {art.tag}
                              </span>
                            </td>
                            <td>
                              <span className={styles.tourTitleText}>
                                {art.author}
                              </span>
                              <span className={styles.tourSubText}>
                                {art.readTime}
                              </span>
                            </td>
                            <td>{art.date}</td>
                            <td>
                              <div className={styles.rowActions}>
                                <button
                                  type="button"
                                  className={styles.actionBtn}
                                  onClick={() => handleOpenArticleModal(art)}
                                >
                                  <FiEdit2 size={13} />
                                  <span>Biên tập</span>
                                </button>
                                <button
                                  type="button"
                                  className={styles.dangerBtn}
                                  onClick={() => handleDeleteArticle(art.id)}
                                >
                                  <FiTrash2 size={13} />
                                  <span>Xóa</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* TAB 4B: MEDIA (HERO SLIDES, DESTINATION GALLERY, POSTCARDS) */}
              {activeTab === "media" && (
                <>
                  {/* Hero Slider */}
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div className={styles.panelTitleGroup}>
                        <h2 className={styles.panelTitle}>
                          1. Ảnh Hero Slider Toàn Màn Hình (
                          {media.heroSlides.length})
                        </h2>
                        <p className={styles.panelSub}>
                          Hiển thị tại phần mở đầu 100vh trên trang chủ Nếp
                          Journeys
                        </p>
                      </div>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.secondaryBtn}
                          onClick={() => {
                            const newSlide: HeroScene = {
                              id: `slide-${Date.now()}`,
                              placeVi: "Điểm đến mới",
                              placeEn: "New Destination",
                              captionVi:
                                "Vùng di sản · Khoảnh khắc bình minh tĩnh lặng",
                              captionEn:
                                "Heritage region · Quiet morning light",
                              image:
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2000&q=85",
                            };
                            setMedia({
                              ...media,
                              heroSlides: [...media.heroSlides, newSlide],
                            });
                          }}
                        >
                          <FiPlus size={14} />
                          <span>Thêm Slide</span>
                        </button>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          disabled={saving}
                          onClick={() =>
                            persistEntity(
                              "media",
                              media,
                              "Đã đồng bộ Hero Slider & Thư viện lên trang chủ."
                            )
                          }
                        >
                          <FiCheck size={14} />
                          <span>Lưu & Đồng bộ Web</span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Ảnh xem trước</th>
                            <th>Địa danh (VI / EN)</th>
                            <th>Chú thích cảnh sắc</th>
                            <th>Đường dẫn ảnh (URL)</th>
                            <th>Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {media.heroSlides.map((slide, idx) => (
                            <tr key={slide.id}>
                              <td>
                                <img
                                  src={slide.image}
                                  alt={slide.placeVi}
                                  className={styles.tourThumb}
                                />
                              </td>
                              <td>
                                <input
                                  className={styles.input}
                                  value={slide.placeVi}
                                  placeholder="Tên địa danh (VI)"
                                  onChange={(e) => {
                                    const next = [...media.heroSlides];
                                    next[idx] = {
                                      ...slide,
                                      placeVi: e.target.value,
                                      placeEn: slide.placeEn || e.target.value,
                                    };
                                    setMedia({ ...media, heroSlides: next });
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  className={styles.input}
                                  value={slide.captionVi}
                                  placeholder="Chú thích (VI)"
                                  onChange={(e) => {
                                    const next = [...media.heroSlides];
                                    next[idx] = {
                                      ...slide,
                                      captionVi: e.target.value,
                                    };
                                    setMedia({ ...media, heroSlides: next });
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  className={styles.input}
                                  value={slide.image}
                                  placeholder="https://..."
                                  onChange={(e) => {
                                    const next = [...media.heroSlides];
                                    next[idx] = {
                                      ...slide,
                                      image: e.target.value,
                                    };
                                    setMedia({ ...media, heroSlides: next });
                                  }}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.dangerBtn}
                                  onClick={() => {
                                    const next = media.heroSlides.filter(
                                      (s) => s.id !== slide.id
                                    );
                                    setMedia({ ...media, heroSlides: next });
                                  }}
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Destination Gallery */}
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div className={styles.panelTitleGroup}>
                        <h2 className={styles.panelTitle}>
                          2. Thư viện ảnh Miền Di sản (
                          {media.destinations.length})
                        </h2>
                        <p className={styles.panelSub}>
                          Hiển thị tại mục #thu-vien-anh với bộ lọc Bắc · Trung
                          · Nam và Lightbox phóng to
                        </p>
                      </div>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.secondaryBtn}
                          onClick={() => {
                            const newDest: DestinationPhoto = {
                              id: `dest-${Date.now()}`,
                              region: "bac",
                              regionLabelVi: "Miền Bắc",
                              regionLabelEn: "Northern Vietnam",
                              nameVi: "Điểm đến di sản mới",
                              nameEn: "New Heritage Destination",
                              provinceVi: "Việt Nam",
                              provinceEn: "Vietnam",
                              seasonVi: "Mùa đẹp nhất: Quanh năm",
                              seasonEn: "Best season: Year-round",
                              timeOfDayVi: "Bình minh · 06:00",
                              timeOfDayEn: "Dawn · 06:00",
                              storyVi:
                                "Ghi chú thực địa về cảnh sắc và nhịp sống bản địa tĩnh lặng.",
                              storyEn:
                                "Field notes on local scenery and unhurried heritage life.",
                              image:
                                "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=85",
                            };
                            setMedia({
                              ...media,
                              destinations: [newDest, ...media.destinations],
                            });
                          }}
                        >
                          <FiPlus size={14} />
                          <span>Thêm Điểm đến</span>
                        </button>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          disabled={saving}
                          onClick={() =>
                            persistEntity(
                              "media",
                              media,
                              "Đã lưu Thư viện ảnh Điểm đến."
                            )
                          }
                        >
                          <FiCheck size={14} />
                          <span>Lưu Thư viện</span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Ảnh</th>
                            <th>Tên địa danh & Tỉnh</th>
                            <th>Miền</th>
                            <th>Câu chuyện thực địa</th>
                            <th>URL Ảnh</th>
                            <th>Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {media.destinations.map((dest, idx) => (
                            <tr key={dest.id}>
                              <td>
                                <img
                                  src={dest.image}
                                  alt={dest.nameVi}
                                  className={styles.tourThumb}
                                />
                              </td>
                              <td>
                                <input
                                  className={styles.input}
                                  value={dest.nameVi}
                                  placeholder="Tên điểm đến"
                                  onChange={(e) => {
                                    const next = [...media.destinations];
                                    next[idx] = {
                                      ...dest,
                                      nameVi: e.target.value,
                                      nameEn: e.target.value,
                                    };
                                    setMedia({ ...media, destinations: next });
                                  }}
                                />
                                <input
                                  className={styles.input}
                                  style={{ marginTop: "6px" }}
                                  value={dest.provinceVi}
                                  placeholder="Tỉnh / Thành phố"
                                  onChange={(e) => {
                                    const next = [...media.destinations];
                                    next[idx] = {
                                      ...dest,
                                      provinceVi: e.target.value,
                                      provinceEn: e.target.value,
                                    };
                                    setMedia({ ...media, destinations: next });
                                  }}
                                />
                              </td>
                              <td>
                                <select
                                  className={styles.select}
                                  value={dest.region}
                                  onChange={(e) => {
                                    const reg = e.target.value;
                                    const next = [...media.destinations];
                                    next[idx] = {
                                      ...dest,
                                      region: reg,
                                      regionLabelVi:
                                        REGION_NAMES[reg] || "Miền Bắc",
                                    };
                                    setMedia({ ...media, destinations: next });
                                  }}
                                >
                                  <option value="bac">Miền Bắc</option>
                                  <option value="trung">Miền Trung</option>
                                  <option value="nam">Tây Nguyên & Nam</option>
                                </select>
                              </td>
                              <td>
                                <textarea
                                  className={styles.textarea}
                                  style={{ minHeight: "68px" }}
                                  value={dest.storyVi}
                                  onChange={(e) => {
                                    const next = [...media.destinations];
                                    next[idx] = {
                                      ...dest,
                                      storyVi: e.target.value,
                                      storyEn: e.target.value,
                                    };
                                    setMedia({ ...media, destinations: next });
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  className={styles.input}
                                  value={dest.image}
                                  onChange={(e) => {
                                    const next = [...media.destinations];
                                    next[idx] = {
                                      ...dest,
                                      image: e.target.value,
                                    };
                                    setMedia({ ...media, destinations: next });
                                  }}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.dangerBtn}
                                  onClick={() => {
                                    const next = media.destinations.filter(
                                      (d) => d.id !== dest.id
                                    );
                                    setMedia({ ...media, destinations: next });
                                  }}
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Traveler Postcards */}
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div className={styles.panelTitleGroup}>
                        <h2 className={styles.panelTitle}>
                          3. Lưu bút từ Người đồng hành (
                          {media.postcards.length})
                        </h2>
                        <p className={styles.panelSub}>
                          Cảm nhận thực tế của khách hàng hiển thị tại mục
                          #luu-but
                        </p>
                      </div>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.secondaryBtn}
                          onClick={() => {
                            const newCard: PostcardItem = {
                              id: `postcard-${Date.now()}`,
                              stampVi: "Đoàn 06 khách · Hà Giang",
                              stampEn: "Group of 06 · Ha Giang",
                              quoteTitleVi:
                                "“Một hành trình chạm vào chiều sâu văn hóa bản địa.”",
                              quoteTitleEn:
                                "“A journey that touches the depth of local culture.”",
                              bodyVi:
                                "Chia sẻ cảm nhận của lữ khách sau chuyến đi cùng Nếp Journeys.",
                              bodyEn:
                                "Reflections from a traveler after exploring with Nep Journeys.",
                              guestName: "Nguyễn Minh Anh",
                              guestRoleVi: "Lữ khách · Hà Nội",
                              guestRoleEn: "Traveler · Hanoi",
                            };
                            setMedia({
                              ...media,
                              postcards: [...media.postcards, newCard],
                            });
                          }}
                        >
                          <FiPlus size={14} />
                          <span>Thêm Lưu bút</span>
                        </button>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          disabled={saving}
                          onClick={() =>
                            persistEntity(
                              "media",
                              media,
                              "Đã lưu Lưu bút lữ khách."
                            )
                          }
                        >
                          <FiCheck size={14} />
                          <span>Lưu Lưu bút</span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Khách hàng & Vai trò</th>
                            <th>Tem hành trình</th>
                            <th>Trích dẫn nổi bật</th>
                            <th>Nội dung cảm nhận</th>
                            <th>Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {media.postcards.map((card, idx) => (
                            <tr key={card.id}>
                              <td>
                                <input
                                  className={styles.input}
                                  value={card.guestName}
                                  placeholder="Tên khách"
                                  onChange={(e) => {
                                    const next = [...media.postcards];
                                    next[idx] = {
                                      ...card,
                                      guestName: e.target.value,
                                    };
                                    setMedia({ ...media, postcards: next });
                                  }}
                                />
                                <input
                                  className={styles.input}
                                  style={{ marginTop: "6px" }}
                                  value={card.guestRoleVi}
                                  placeholder="Nghề nghiệp · Thành phố"
                                  onChange={(e) => {
                                    const next = [...media.postcards];
                                    next[idx] = {
                                      ...card,
                                      guestRoleVi: e.target.value,
                                      guestRoleEn: e.target.value,
                                    };
                                    setMedia({ ...media, postcards: next });
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  className={styles.input}
                                  value={card.stampVi}
                                  onChange={(e) => {
                                    const next = [...media.postcards];
                                    next[idx] = {
                                      ...card,
                                      stampVi: e.target.value,
                                      stampEn: e.target.value,
                                    };
                                    setMedia({ ...media, postcards: next });
                                  }}
                                />
                              </td>
                              <td>
                                <textarea
                                  className={styles.textarea}
                                  style={{ minHeight: "68px" }}
                                  value={card.quoteTitleVi}
                                  onChange={(e) => {
                                    const next = [...media.postcards];
                                    next[idx] = {
                                      ...card,
                                      quoteTitleVi: e.target.value,
                                      quoteTitleEn: e.target.value,
                                    };
                                    setMedia({ ...media, postcards: next });
                                  }}
                                />
                              </td>
                              <td>
                                <textarea
                                  className={styles.textarea}
                                  style={{ minHeight: "68px" }}
                                  value={card.bodyVi}
                                  onChange={(e) => {
                                    const next = [...media.postcards];
                                    next[idx] = {
                                      ...card,
                                      bodyVi: e.target.value,
                                      bodyEn: e.target.value,
                                    };
                                    setMedia({ ...media, postcards: next });
                                  }}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.dangerBtn}
                                  onClick={() => {
                                    const next = media.postcards.filter(
                                      (p) => p.id !== card.id
                                    );
                                    setMedia({ ...media, postcards: next });
                                  }}
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              )}

              {/* TAB 5: SETTINGS & SUBSCRIBERS */}
              {activeTab === "settings" && (
                <div className={styles.panelGrid}>
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div className={styles.panelTitleGroup}>
                        <h2 className={styles.panelTitle}>
                          Thông tin Thương hiệu & Liên hệ
                        </h2>
                        <p className={styles.panelSub}>
                          Áp dụng cho Footer, cụm nút nổi góc phải (Zalo,
                          Facebook, Hotline) và toàn trang
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSaveSettings}
                      className={styles.formGrid}
                    >
                      <div className={styles.field}>
                        <label htmlFor="brandName">Tên thương hiệu</label>
                        <input
                          id="brandName"
                          className={styles.input}
                          value={settings.brandName}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              brandName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="hotline">Số Hotline điều hành</label>
                        <input
                          id="hotline"
                          className={styles.input}
                          value={settings.hotline}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              hotline: e.target.value,
                              hotlineDisplay: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="slogan">Thông điệp (Tiếng Việt)</label>
                        <input
                          id="slogan"
                          className={styles.input}
                          value={settings.slogan}
                          onChange={(e) =>
                            setSettings({ ...settings, slogan: e.target.value })
                          }
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="sloganEn">Thông điệp (Tiếng Anh)</label>
                        <input
                          id="sloganEn"
                          className={styles.input}
                          value={settings.sloganEn}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              sloganEn: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="email">Email Concierge</label>
                        <input
                          id="email"
                          type="email"
                          className={styles.input}
                          value={settings.email}
                          onChange={(e) =>
                            setSettings({ ...settings, email: e.target.value })
                          }
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="zalo">Đường dẫn Zalo</label>
                        <input
                          id="zalo"
                          className={styles.input}
                          value={settings.zalo}
                          onChange={(e) =>
                            setSettings({ ...settings, zalo: e.target.value })
                          }
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="facebook">Trang Facebook</label>
                        <input
                          id="facebook"
                          className={styles.input}
                          value={settings.socials?.facebook || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socials: {
                                ...settings.socials,
                                facebook: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="instagram">Trang Instagram</label>
                        <input
                          id="instagram"
                          className={styles.input}
                          value={settings.socials?.instagram || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socials: {
                                ...settings.socials,
                                instagram: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label htmlFor="address">Địa chỉ văn phòng</label>
                        <input
                          id="address"
                          className={styles.input}
                          value={settings.address}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className={styles.fieldFull}>
                        <button
                          type="submit"
                          className={styles.primaryBtn}
                          disabled={saving}
                        >
                          <FiCheck size={15} />
                          <span>
                            {saving ? "Đang lưu..." : "Lưu cấu hình hệ thống"}
                          </span>
                        </button>
                      </div>
                    </form>
                  </section>

                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div className={styles.panelTitleGroup}>
                        <h2 className={styles.panelTitle}>
                          Độc giả đăng ký Bản tin ({contacts.length})
                        </h2>
                        <p className={styles.panelSub}>
                          Danh sách email nhận ấn phẩm du khảo theo mùa
                        </p>
                      </div>
                    </div>

                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Email độc giả</th>
                            <th>Ngày đăng ký</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((c) => (
                            <tr key={c.id}>
                              <td>
                                <span className={styles.tourTitleText}>
                                  {c.email}
                                </span>
                              </td>
                              <td>
                                {new Date(c.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </td>
                              <td>
                                <div className={styles.rowActions}>
                                  <a
                                    href={`mailto:${c.email}`}
                                    className={styles.actionBtn}
                                  >
                                    <FiMail size={13} />
                                    <span>Gửi thư</span>
                                  </a>
                                  <button
                                    type="button"
                                    className={styles.dangerBtn}
                                    onClick={() => handleDeleteContact(c.id)}
                                  >
                                    <FiTrash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {contacts.length === 0 && (
                            <tr>
                              <td colSpan={3} className={styles.emptyState}>
                                Chưa có email đăng ký nào.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 6: SECURITY & PASSWORD */}
              {activeTab === "security" && (
                <div className={styles.panelGrid}>
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div className={styles.panelTitleGroup}>
                        <h2 className={styles.panelTitle}>
                          Đổi Mật khẩu &amp; Tên đăng nhập Quản trị
                        </h2>
                        <p className={styles.panelSub}>
                          Mật khẩu được băm một chiều bằng thuật toán scrypt kèm
                          khóa ngẫu nhiên (Salt)
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleChangePassword}
                      className={styles.formGrid}
                    >
                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label htmlFor="sec-username">
                          Tên đăng nhập Quản trị
                        </label>
                        <input
                          id="sec-username"
                          required
                          className={styles.input}
                          value={secUsername}
                          onChange={(e) => setSecUsername(e.target.value)}
                        />
                      </div>

                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label htmlFor="sec-current-pass">
                          Mật khẩu hiện tại *
                        </label>
                        <input
                          id="sec-current-pass"
                          type="password"
                          required
                          className={styles.input}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Nhập mật khẩu hiện tại để xác minh..."
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="sec-new-pass">
                          Mật khẩu mới (tối thiểu 6 ký tự) *
                        </label>
                        <input
                          id="sec-new-pass"
                          type="password"
                          required
                          minLength={6}
                          className={styles.input}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mật khẩu mới..."
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="sec-confirm-pass">
                          Xác nhận mật khẩu mới *
                        </label>
                        <input
                          id="sec-confirm-pass"
                          type="password"
                          required
                          minLength={6}
                          className={styles.input}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới..."
                        />
                      </div>

                      <div className={styles.fieldFull}>
                        <button
                          type="submit"
                          className={styles.primaryBtn}
                          disabled={saving}
                        >
                          <FiShield size={15} />
                          <span>
                            {saving
                              ? "Đang mã hóa & lưu..."
                              : "Cập nhật Mật khẩu & Khóa phiên"}
                          </span>
                        </button>
                      </div>
                    </form>
                  </section>

                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div className={styles.panelTitleGroup}>
                        <h2 className={styles.panelTitle}>
                          Trạng thái Bảo mật Hệ thống
                        </h2>
                        <p className={styles.panelSub}>
                          Cơ chế bảo vệ dữ liệu quản trị &amp; thông tin khách
                          hàng
                        </p>
                      </div>
                    </div>

                    <div
                      className={styles.securityNoteBox}
                      style={{ marginTop: "20px" }}
                    >
                      <strong style={{ color: "var(--ink)" }}>
                        1. Phiên đăng nhập HttpOnly &amp; chữ ký HMAC-SHA256
                      </strong>
                      <span>
                        Token xác thực được lưu trong Cookie{" "}
                        <code>HttpOnly</code> (chống đọc trộm qua XSS) và tự
                        động hết hạn sau 12 giờ. Khi đổi mật khẩu, khóa bí mật
                        ký phiên sẽ được tạo mới để vô hiệu hóa mọi phiên cũ.
                      </span>
                    </div>

                    <div className={styles.securityNoteBox}>
                      <strong style={{ color: "var(--ink)" }}>
                        2. Chống dò mật khẩu (Brute-Force Protection)
                      </strong>
                      <span>
                        Tự động khóa đăng nhập tạm thời 3 phút nếu phát hiện 5
                        lần nhập sai liên tiếp.
                      </span>
                    </div>

                    <div className={styles.securityNoteBox}>
                      <strong style={{ color: "var(--ink)" }}>
                        3. Bảo vệ dữ liệu Khách hàng (PII) trên API
                      </strong>
                      <span>
                        Mọi thao tác chỉnh sửa dữ liệu (<code>POST /api/admin</code>)
                        và danh sách Đặt chỗ / Email khách hàng đều yêu cầu
                        chứng thực phiên hợp lệ ở phía máy chủ.
                      </span>
                    </div>
                  </section>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL: CREATE / EDIT TOUR */}
      {editingTour && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setEditingTour(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isNewTour
                  ? "Thêm Tuyến hành trình mới"
                  : `Chỉnh sửa: ${editingTour.title}`}
              </h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setEditingTour(null)}
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTour}>
              <div className={styles.modalBody}>
                <div className={styles.field}>
                  <label>Tên hành trình (Tiếng Việt) *</label>
                  <input
                    required
                    className={styles.input}
                    value={editingTour.title}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, title: e.target.value })
                    }
                    placeholder="VD: Hà Giang — Lời Thì Thầm Của Đá"
                  />
                </div>

                <div className={styles.field}>
                  <label>Tên hành trình (Tiếng Anh)</label>
                  <input
                    className={styles.input}
                    value={editingTour.titleEn}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        titleEn: e.target.value,
                      })
                    }
                    placeholder="Ha Giang — Whisper of Karst"
                  />
                </div>

                <div className={styles.field}>
                  <label>Vùng miền</label>
                  <select
                    className={styles.select}
                    value={editingTour.region}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, region: e.target.value })
                    }
                  >
                    <option value="bac">Miền Bắc</option>
                    <option value="trung">Miền Trung</option>
                    <option value="nam">Miền Nam & Đảo</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Địa danh chính *</label>
                  <input
                    required
                    className={styles.input}
                    value={editingTour.location}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        location: e.target.value,
                      })
                    }
                    placeholder="VD: Đồng Văn · Mèo Vạc · Hoàng Su Phì"
                  />
                </div>

                <div className={styles.field}>
                  <label>Thời lượng</label>
                  <input
                    className={styles.input}
                    value={editingTour.duration}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>Quy mô đoàn</label>
                  <input
                    className={styles.input}
                    value={editingTour.groupSize}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        groupSize: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>Giá hiển thị (VD: 12.900.000₫) *</label>
                  <input
                    required
                    className={styles.input}
                    value={editingTour.price}
                    onChange={(e) => {
                      const rawNum = parseInt(
                        e.target.value.replace(/\D/g, ""),
                        10
                      );
                      setEditingTour({
                        ...editingTour,
                        price: e.target.value,
                        priceNumeric: Number.isNaN(rawNum)
                          ? editingTour.priceNumeric
                          : rawNum,
                      });
                    }}
                  />
                </div>

                <div className={styles.field}>
                  <label>Phương tiện di chuyển</label>
                  <input
                    className={styles.input}
                    value={editingTour.transport}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        transport: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>Mô tả ngắn / Phụ đề *</label>
                  <input
                    required
                    className={styles.input}
                    value={editingTour.subtitle}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        subtitle: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>Đường dẫn ảnh đại diện (URL) *</label>
                  <input
                    required
                    className={styles.input}
                    value={editingTour.image}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, image: e.target.value })
                    }
                  />
                  {editingTour.image && (
                    <div className={styles.previewBox}>
                      <img
                        src={editingTour.image}
                        alt="Xem trước"
                        className={styles.previewImg}
                      />
                      <span className={styles.tourSubText}>
                        Ảnh bìa hiển thị trên thẻ hành trình và cửa sổ đặt chỗ
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.field}>
                  <label>Điểm nhấn (Mỗi dòng 1 điểm nhấn)</label>
                  <textarea
                    className={styles.textarea}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Lịch trình từng ngày (Mỗi dòng 1 ngày)</label>
                  <textarea
                    className={styles.textarea}
                    value={itineraryText}
                    onChange={(e) => setItineraryText(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setEditingTour(null)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={saving}
                >
                  <FiCheck size={15} />
                  <span>{saving ? "Đang lưu..." : "Lưu Hành trình"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT JOURNAL ARTICLE */}
      {editingArticle && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setEditingArticle(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isNewArticle
                  ? "Viết bài Nhật ký mới"
                  : `Biên tập: ${editingArticle.title}`}
              </h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setEditingArticle(null)}
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveArticle}>
              <div className={styles.modalBody}>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>Tiêu đề bài viết *</label>
                  <input
                    required
                    className={styles.input}
                    value={editingArticle.title}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>Chuyên mục (Tag)</label>
                  <input
                    className={styles.input}
                    value={editingArticle.tag}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        tag: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>Địa điểm</label>
                  <input
                    className={styles.input}
                    value={editingArticle.location || ""}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        location: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>Tác giả</label>
                  <input
                    className={styles.input}
                    value={editingArticle.author}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        author: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>Thời lượng đọc</label>
                  <input
                    className={styles.input}
                    value={editingArticle.readTime}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        readTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>Ảnh bìa bài viết (URL) *</label>
                  <input
                    required
                    className={styles.input}
                    value={editingArticle.image}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        image: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>Đoạn dẫn nhập (Excerpt) *</label>
                  <textarea
                    required
                    className={styles.textarea}
                    value={editingArticle.excerpt}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        excerpt: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>Câu trích dẫn điểm nhấn (Pull Quote)</label>
                  <input
                    className={styles.input}
                    value={editingArticle.pullQuote || ""}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        pullQuote: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>
                    Nội dung chi tiết (Các đoạn cách nhau bằng 1 dòng trống)
                  </label>
                  <textarea
                    className={styles.textarea}
                    style={{ minHeight: "150px" }}
                    value={articleParagraphs}
                    onChange={(e) => setArticleParagraphs(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setEditingArticle(null)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={saving}
                >
                  <FiCheck size={15} />
                  <span>{saving ? "Đang lưu..." : "Lưu bài viết"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
