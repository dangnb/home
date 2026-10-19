// Tours Data for Modal and Details
const toursData = [
  {
    id: "tour-01",
    title: { vi: "Qua miền di sản", en: "Through Heritage Lands" },
    location: { vi: "NINH BÌNH", en: "NINH BINH" },
    duration: { vi: "3 NGÀY · 2 ĐÊM", en: "3 DAYS · 2 NIGHTS" },
    region: "bac",
    image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=1000&q=85",
    priceNumeric: 6800000,
    priceFormatted: "6.800.000 ₫",
    highlights: {
      vi: [
        "Đi thuyền riêng tư qua các hang động Tràng An lúc sáng sớm vắng khách",
        "Trải nghiệm thêu tay truyền thống cùng nghệ nhân làng Văn Lâm",
        "Nghỉ dưỡng tại boutique resort ẩn mình giữa rặng núi đá vôi"
      ],
      en: [
        "Private wooden boat through Trang An caves during serene early mornings",
        "Traditional hand-embroidery workshop with master artisans in Van Lam",
        "Boutique resort stay nestled in the heart of limestone karsts"
      ]
    }
  },
  {
    id: "tour-02",
    title: { vi: "Một dải miền Trung", en: "Central Coast Essence" },
    location: { vi: "ĐÀ NẴNG · QUẢNG NAM", en: "DA NANG · HOI AN" },
    duration: { vi: "4 NGÀY · 3 ĐÊM", en: "4 DAYS · 3 NIGHTS" },
    region: "trung",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=85",
    priceNumeric: 8900000,
    priceFormatted: "8.900.000 ₫",
    highlights: {
      vi: [
        "Khám phá phố cổ Hội An lúc sáng sớm yên bình cùng hướng dẫn viên bản địa",
        "Thưởng thức bữa tối ẩm thực riêng biệt bên dòng sông Hoài thơ mộng",
        "Resort 5 sao ven biển với bãi cát riêng biệt tuyệt đẹp"
      ],
      en: [
        "Explore tranquil Hoi An Ancient Town at sunrise with local cultural guide",
        "Private riverside dining experience beside romantic Hoai River",
        "5-star beachfront resort with exclusive private sands"
      ]
    }
  },
  {
    id: "tour-03",
    title: { vi: "Đảo xa, ngày thật chậm", en: "Con Dao, Serene Solitude" },
    location: { vi: "CÔN ĐẢO", en: "CON DAO ISLANDS" },
    duration: { vi: "4 NGÀY · 3 ĐÊM", en: "4 DAYS · 3 NIGHTS" },
    region: "nam",
    image: "https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&w=1000&q=85",
    priceNumeric: 12500000,
    priceFormatted: "12.500.000 ₫",
    highlights: {
      vi: [
        "Tour cano riêng ngắm san hô và thả rùa con về biển tại Hòn Bảy Cạnh",
        "Dạo bước trên cung đường biển vắng tuyệt đẹp Đầm Trầu",
        "Khu nghỉ dưỡng biệt lập hướng trọn biển ngọc"
      ],
      en: [
        "Private speedboat to coral reefs and baby sea turtle release on Bay Canh island",
        "Coastal stroll along untouched Dam Trau golden beach",
        "Secluded luxury eco-resort overlooking crystalline waters"
      ]
    }
  },
  {
    id: "tour-04",
    title: { vi: "Qua miền đá nở hoa", en: "Where Rocks Bloom" },
    location: { vi: "HÀ GIANG", en: "HA GIANG" },
    duration: { vi: "5 NGÀY · 4 ĐÊM", en: "5 DAYS · 4 NIGHTS" },
    region: "bac",
    image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1000&q=85",
    priceNumeric: 9600000,
    priceFormatted: "9.600.000 ₫",
    highlights: {
      vi: [
        "Chinh phục đèo Mã Pí Lèng và du thuyền trên dòng sông Nho Quế màu ngọc bích",
        "Lưu trú homestay nhà trình tường truyền thống tại làng Lô Lô Chải",
        "Thưởng thức ẩm thực vùng cao bên bếp lửa cùng đồng bào bản địa"
      ],
      en: [
        "Conquer Ma Pi Leng pass and cruise the turquoise waters of Nho Que river",
        "Stay at authentic earthen clay houses in picturesque Lo Lo Chai village",
        "Savor authentic highland cuisine around warm crackling fires"
      ]
    }
  },
  {
    id: "tour-05",
    title: { vi: "Huế, một thoáng kinh kỳ", en: "Hue, Imperial Splendor" },
    location: { vi: "CỐ ĐÔ HUẾ", en: "HUE IMPERIAL CITY" },
    duration: { vi: "3 NGÀY · 2 ĐÊM", en: "3 DAYS · 2 NIGHTS" },
    region: "trung",
    image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=1000&q=85",
    priceNumeric: 7200000,
    priceFormatted: "7.200.000 ₫",
    highlights: {
      vi: [
        "Dùng cơm cung đình Huế cùng nghệ nhân ẩm thực nổi tiếng",
        "Trải nghiệm ca Huế và thả hoa đăng trên sông Hương",
        "Thăm nhà vườn Kim Long cổ kính và nghệ thuật làm hương truyền thống"
      ],
      en: [
        "Imperial royal banquet curated by celebrated culinary master",
        "Traditional chamber singing & lantern release on Perfume River",
        "Visit heritage Kim Long garden houses and artisanal incense makers"
      ]
    }
  },
  {
    id: "tour-06",
    title: { vi: "Một đảo ngọc thật chậm", en: "Phu Quoc, The Slow Island" },
    location: { vi: "PHÚ QUỐC", en: "PHU QUOC" },
    duration: { vi: "4 NGÀY · 3 ĐÊM", en: "4 DAYS · 3 NIGHTS" },
    region: "nam",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=85",
    priceNumeric: 11800000,
    priceFormatted: "11.800.000 ₫",
    highlights: {
      vi: [
        "Hoàng hôn riêng tư bên bãi cát vắng và tiệc BBQ hải sản tươi sống",
        "Khám phá làng chài Hàm Ninh nguyên bản cùng ngư dân địa phương",
        "Nghỉ dưỡng villa hồ bơi riêng tư chuẩn 5 sao"
      ],
      en: [
        "Private sunset on quiet beach with freshly caught seafood barbecue",
        "Discover traditional Ham Ninh fishing hamlet with local fishermen",
        "Exclusive 5-star private pool luxury beachfront villa"
      ]
    }
  }
];

// Dictionary for i18n
const dictionary = {
  vi: {
    navTours: "Hành trình",
    navPhilosophy: "Bản sắc Nếp",
    navManifesto: "Cách Nếp đi",
    navJournal: "Nhật ký",
    navContact: "Liên hệ",
    navCta: "Lên lịch riêng",
    heroEyebrow: "VIỆT NAM, THEO CÁCH CỦA BẠN",
    heroTitle: "Đi để thấy<br />một Việt Nam <i>khác.</i>",
    heroSubtitle: "Những hành trình riêng tư đưa bạn đến gần hơn với con người, nếp sống và vẻ đẹp nguyên bản của Việt Nam.",
    heroLocation: "VỊNH HẠ LONG, QUẢNG NINH",
    introLabel: "ĐI CHẬM<br />SỐNG SÂU",
    introEyebrow: "KHÔNG CHỈ LÀ MỘT CHUYẾN ĐI",
    introTitle: "Mỗi vùng đất đều có<br />một <i>nếp sống</i> đáng nhớ.",
    introDesc: "Nếp kết nối bạn với những người địa phương, những căn nhà có câu chuyện và những khoảnh khắc không nằm trong lịch trình thông thường.",
    introLink: "Tìm hiểu cách Nếp đi",
    stampTop: "ĐI BẰNG SỰ TÒ MÒ",
    stampBottom: "Ở LẠI BẰNG CẢM XÚC",
    tourEyebrow: "CHỌN MỘT NHỊP ĐI",
    tourTitle: "Hành trình <i>được tuyển chọn</i>",
    allTours: "Tất cả hành trình",
    filterAll: "Tất cả",
    filterBac: "Miền Bắc",
    filterTrung: "Miền Trung",
    filterNam: "Miền Nam & Đảo",
    manifestoEyebrow: "NẾP TIN RẰNG",
    manifestoTitle: "Đi xa không quan trọng bằng <i>đi đủ gần.</i>",
    manifestoDesc: "Gần hơn với bữa cơm nhà, với đôi tay làm nên món đồ thủ công, với câu chuyện chỉ được kể khi ta chịu ngồi lại.",
    manifestoCta: "Tìm hành trình của bạn",
    manifestoBadge: "ĐỦ CHẬM ĐỂ CẢM NHẬN",
    journalEyebrow: "GHI CHÉP TRÊN ĐƯỜNG",
    journalTitle: "Nhật ký <i>của những miền nhớ</i>",
    journalRead: "Đọc nhật ký Nếp",
    journalTag: "TỪ CUỐN SỔ TAY CỦA NẾP",
    journalHeading: "Những buổi sáng không cần đặt báo thức ở vùng cao",
    journalExcerpt: "Ở một nơi mây ghé qua hiên nhà trước cả tiếng chuông, ngày mới bắt đầu bằng một chén trà ấm.",
    journalLink: "Đọc câu chuyện",
    contactEyebrow: "CHUYẾN ĐI TIẾP THEO BẮT ĐẦU TỪ ĐÂY",
    contactTitle: "Mình cùng<br />lên <i>đường nhé?</i>",
    contactDesc: "Để lại email, Nếp sẽ gửi vài gợi ý thật hợp với bạn.",
    contactTagline: "HÀNH TRÌNG RIÊNG · KỂ CHUYỆN THẬT",
    footerBackTop: "TRỞ VỀ ĐẦU TRANG ↑",
    quickBooking: "ĐẶT TOUR NHANH",
    drawerTitle: "Đặt lịch tư vấn",
    drawerSubtitle: "Chuyên viên Nếp sẽ liên hệ hỗ trợ bạn trong vòng 15 phút",
    selectTour: "Chọn hành trình",
    fullName: "Họ và tên của bạn",
    phone: "Số điện thoại / Zalo",
    departDate: "Ngày khởi hành",
    guestCount: "Số lượng khách",
    specialRequest: "Yêu cầu đặc biệt",
    btnSubmitDrawer: "GỬI YÊU CẦU TƯ VẤN ↗",
    tripHighlights: "ĐIỂM NHẤN HÀNH TRÌNH",
    unitPrice: "Đơn giá / khách:",
    estTotal: "Tạm tính:",
    confirmBooking: "XÁC NHẬN ĐẶT TOUR ↗"
  },
  en: {
    navTours: "Journeys",
    navPhilosophy: "Our Essence",
    navManifesto: "The Way We Travel",
    navJournal: "Journal",
    navContact: "Contact",
    navCta: "Plan My Trip",
    heroEyebrow: "VIETNAM, YOUR WAY",
    heroTitle: "Travel to unveil<br />an <i>unseen</i> Vietnam.",
    heroSubtitle: "Private bespoke journeys bringing you closer to the people, authentic ways of living, and serene heritage of Vietnam.",
    heroLocation: "HA LONG BAY, QUANG NINH",
    introLabel: "TRAVEL SLOW<br />LIVE DEEP",
    introEyebrow: "MORE THAN JUST A TRIP",
    introTitle: "Every land holds<br />a memorable <i>soul.</i>",
    introDesc: "Nếp connects you with local wisdom, homes filled with narratives, and peaceful moments beyond conventional tourist itineraries.",
    introLink: "Discover our philosophy",
    stampTop: "DRIVEN BY CURIOSITY",
    stampBottom: "STAY WITH AFFECTION",
    tourEyebrow: "CHOOSE YOUR RHYTHM",
    tourTitle: "Curated <i>Journeys</i>",
    allTours: "All Journeys",
    filterAll: "All",
    filterBac: "Northern",
    filterTrung: "Central",
    filterNam: "Southern & Islands",
    manifestoEyebrow: "NẾP BELIEVES",
    manifestoTitle: "Traveling far matters less than <i>traveling close enough.</i>",
    manifestoDesc: "Closer to home-cooked meals, to the warm hands that craft heritage, and to heartfelt stories that only unfold when we pause to listen.",
    manifestoCta: "Find Your Journey",
    manifestoBadge: "SLOW ENOUGH TO EMBRACE",
    journalEyebrow: "NOTES FROM THE ROAD",
    journalTitle: "Chronicles <i>of Cherished Lands</i>",
    journalRead: "Read Our Journal",
    journalTag: "FROM NẾP'S NOTEBOOK",
    journalHeading: "Mornings without an alarm clock in the misty highlands",
    journalExcerpt: "Where drifting clouds visit the porch before any bells ring, the day gently greets you with a steaming cup of wild forest tea.",
    journalLink: "Read the story",
    contactEyebrow: "YOUR NEXT EXPEDITION BEGINS HERE",
    contactTitle: "Shall we<br />begin the <i>journey?</i>",
    contactDesc: "Leave your email, and Nếp will curate ideas crafted uniquely for you.",
    contactTagline: "BESPOKE JOURNEYS · TRUE NARRATIVES",
    footerBackTop: "BACK TO TOP ↑",
    quickBooking: "QUICK BOOKING",
    drawerTitle: "Request Consultation",
    drawerSubtitle: "Our concierge will reach out to support you within 15 minutes",
    selectTour: "Select journey",
    fullName: "Your full name",
    phone: "Phone / WhatsApp / Zalo",
    departDate: "Departure date",
    guestCount: "Number of guests",
    specialRequest: "Special requests",
    btnSubmitDrawer: "SEND REQUEST ↗",
    tripHighlights: "JOURNEY HIGHLIGHTS",
    unitPrice: "Unit price / guest:",
    estTotal: "Estimated total:",
    confirmBooking: "CONFIRM RESERVATION ↗"
  }
};

let currentLocale = "vi";

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

// Set Locale Function
function setLocale(lang) {
  currentLocale = lang;
  localStorage.setItem("nep_locale", lang);

  const dict = dictionary[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Toggle active class on lang switcher buttons
  const btnVi = document.getElementById("langVi");
  const btnEn = document.getElementById("langEn");
  if (btnVi && btnEn) {
    if (lang === "vi") {
      btnVi.classList.add("is-active");
      btnVi.setAttribute("aria-pressed", "true");
      btnEn.classList.remove("is-active");
      btnEn.setAttribute("aria-pressed", "false");
    } else {
      btnEn.classList.add("is-active");
      btnEn.setAttribute("aria-pressed", "true");
      btnVi.classList.remove("is-active");
      btnVi.setAttribute("aria-pressed", "false");
    }
  }

  // Update open modal if visible
  if (activeModalTourId) {
    renderModalTour(activeModalTourId);
  }
}

// ── Luxury Floating Toast Notification System ───────────────────────
function showLuxuryToast(title, message, duration = 4800) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-card";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">✦</span>
    <div class="toast-content">
      <h5 class="toast-title">${title}</h5>
      <p class="toast-msg">${message}</p>
    </div>
    <button class="toast-close" type="button" aria-label="Đóng thông báo">✕</button>
    <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  container.appendChild(toast);

  // Trigger smooth entrance animation
  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  const closeToast = () => {
    toast.classList.remove("is-visible");
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 450);
  };

  toast.querySelector(".toast-close")?.addEventListener("click", closeToast);

  let timer = window.setTimeout(closeToast, duration);
  toast.addEventListener("mouseenter", () => window.clearTimeout(timer));
  toast.addEventListener("mouseleave", () => {
    timer = window.setTimeout(closeToast, 1200);
  });
}

// ── Region Filter Buttons with Fluid Fade/Stagger ───────────────────
const filterButtons = document.querySelectorAll(".filter-button");
const journeyCards = document.querySelectorAll(".journey-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    let delayCounter = 0;
    journeyCards.forEach((card) => {
      const matches = (filter === "all" || card.dataset.region === filter);

      if (matches) {
        card.style.display = "";
        card.style.opacity = "0";
        card.style.transform = "scale(0.96) translateY(14px)";

        const currentDelay = delayCounter * 65;
        delayCounter++;

        setTimeout(() => {
          card.style.transition = "opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)";
          card.style.opacity = "1";
          card.style.transform = "scale(1) translateY(0)";
        }, currentDelay);
      } else {
        card.style.transition = "opacity 0.22s ease, transform 0.22s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.95) translateY(10px)";
        setTimeout(() => {
          if (button.dataset.filter !== "all" && card.dataset.region !== button.dataset.filter) {
            card.style.display = "none";
          }
        }, 240);
      }
    });
  });
});

// Card movement stays intentionally subtle. The hover treatment lives in CSS so
// touch devices and lower-powered screens retain a consistent, calm experience.

// ── Header Scroll Detection ─────────────────────────────────────────
const siteHeader = document.getElementById("siteHeader");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    siteHeader?.classList.add("is-scrolled");
  } else {
    siteHeader?.classList.remove("is-scrolled");
  }
}, { passive: true });

// ── Mobile Menu Toggle ──────────────────────────────────────────────
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("is-open");
    });
  });
}

// ── Language Switcher Listeners ─────────────────────────────────────
document.getElementById("langVi")?.addEventListener("click", () => setLocale("vi"));
document.getElementById("langEn")?.addEventListener("click", () => setLocale("en"));

// ── Slide-Out Quick Booking Drawer ──────────────────────────────────
const slideoutTab = document.getElementById("slideoutTab");
const bookingDrawer = document.getElementById("bookingDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerClose = document.getElementById("drawerClose");
const drawerForm = document.getElementById("drawerForm");

function openDrawer() {
  bookingDrawer?.classList.add("is-open");
  drawerBackdrop?.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  bookingDrawer?.classList.remove("is-open");
  drawerBackdrop?.classList.remove("is-open");
  document.body.style.overflow = "";
}

slideoutTab?.addEventListener("click", openDrawer);
drawerClose?.addEventListener("click", closeDrawer);
drawerBackdrop?.addEventListener("click", closeDrawer);

drawerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("drawerName").value;
  const phone = document.getElementById("drawerPhone").value;

  const title = currentLocale === "vi" ? "Yêu cầu đã được tiếp nhận" : "Request Received";
  const msg = currentLocale === "vi"
    ? `Cảm ơn ${name}! Nếp đã ghi nhận thông tin đặt lịch tư vấn và sẽ liên hệ qua ${phone} trong 15 phút tới.`
    : `Thank you ${name}! Nếp has received your consultation request and will reach out via ${phone} within 15 minutes.`;
  showLuxuryToast(title, msg);

  drawerForm.reset();
  closeDrawer();
});

// ── Tour Booking & Details Pop-up Modal ──────────────────────────────
const tourModalOverlay = document.getElementById("tourModalOverlay");
const modalCloseBtn = document.getElementById("modalCloseBtn");
let activeModalTourId = null;

function renderModalTour(tourId) {
  const tour = toursData.find(t => t.id === tourId);
  if (!tour) return;

  const modalImg = document.getElementById("modalImg");
  const modalMetaLocation = document.getElementById("modalMetaLocation");
  const modalMetaDuration = document.getElementById("modalMetaDuration");
  const modalTitle = document.getElementById("modalTitle");
  const modalHighlights = document.getElementById("modalHighlights");
  const modalUnitPrice = document.getElementById("modalUnitPrice");

  if (modalImg) modalImg.src = tour.image;
  if (modalMetaLocation) modalMetaLocation.textContent = tour.location[currentLocale];
  if (modalMetaDuration) modalMetaDuration.textContent = tour.duration[currentLocale];
  if (modalTitle) modalTitle.textContent = tour.title[currentLocale];
  if (modalUnitPrice) modalUnitPrice.textContent = formatVND(tour.priceNumeric);

  if (modalHighlights) {
    modalHighlights.innerHTML = "";
    tour.highlights[currentLocale].forEach(hl => {
      const li = document.createElement("li");
      li.className = "modal-highlight-item";
      li.innerHTML = `<span class="modal-highlight-bullet">✦</span> <span>${hl}</span>`;
      modalHighlights.appendChild(li);
    });
  }

  updateModalTotal();
}

function updateModalTotal() {
  if (!activeModalTourId) return;
  const tour = toursData.find(t => t.id === activeModalTourId);
  if (!tour) return;

  const guestsCount = parseInt(document.getElementById("modalGuestsCount")?.value || "2", 10);
  const total = tour.priceNumeric * guestsCount;
  const modalTotalPrice = document.getElementById("modalTotalPrice");
  if (modalTotalPrice) {
    modalTotalPrice.textContent = formatVND(total);
  }
}

function openTourModal(tourId) {
  activeModalTourId = tourId;
  renderModalTour(tourId);
  tourModalOverlay?.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeTourModal() {
  tourModalOverlay?.classList.remove("is-open");
  document.body.style.overflow = "";
  activeModalTourId = null;
}

modalCloseBtn?.addEventListener("click", closeTourModal);
tourModalOverlay?.addEventListener("click", (e) => {
  if (e.target === tourModalOverlay) {
    closeTourModal();
  }
});

document.getElementById("modalBookingForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("modalFullName").value;
  const phone = document.getElementById("modalPhone").value;
  const tour = toursData.find(t => t.id === activeModalTourId);
  const tourName = tour ? tour.title[currentLocale] : "";

  const title = currentLocale === "vi" ? "Đặt tour thành công" : "Reservation Requested";
  const msg = currentLocale === "vi"
    ? `Chúc mừng ${name}! Bạn đã gửi yêu cầu đặt tour "${tourName}" thành công. Chuyên viên của Nếp sẽ liên hệ xác nhận và gửi lịch trình chi tiết đến bạn sớm nhất!`
    : `Congratulations ${name}! Your booking request for "${tourName}" has been received. Our concierge will contact you shortly to confirm and deliver your complete itinerary!`;
  showLuxuryToast(title, msg);

  closeTourModal();
});

// ── Contact Form ───────────────────────────────────────────────────
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("email");
  const formMessage = document.getElementById("formMessage");

  if (!emailInput.validity.valid) {
    emailInput.reportValidity();
    return;
  }

  const title = currentLocale === "vi" ? "Đăng ký thành công" : "Subscribed Successfully";
  const msg = currentLocale === "vi"
    ? "Nếp đã nhận được email của bạn. Hẹn sớm gửi bạn những gợi ý hành trình tuyệt vời nhất!"
    : "Nếp has received your email. We look forward to sharing our bespoke journey inspirations with you!";

  formMessage.textContent = msg;
  showLuxuryToast(title, msg);

  emailInput.value = "";
});

// Initialize saved locale
const savedLocale = localStorage.getItem("nep_locale") || "vi";
if (savedLocale !== "vi") {
  setLocale(savedLocale);
}

// ── Intersection Observer for Scroll Reveal Animations ─────────────
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.12
  });

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

