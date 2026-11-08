/* cspell:disable */
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  PRODUCTS,
  DESTINY_TABLE,
  STUDIO_STONES,
  CHARM_PRICES,
  CHARM_NAMES,
  ELEMENT_COLORS,
  HERO_STAGE_IDS,
  formatVND,
  getSinhCycleStatus,
  Product,
  ElementKey,
} from "@/data/gemstones";
import Bracelet3DStage from "@/components/Bracelet3DStage";
import BraceletCard3D from "@/components/BraceletCard3D";
import TasteSkillProvider from "@/components/TasteSkillProvider";

interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  menh: ElementKey;
  menhName: string;
  beadSize: number;
  beadCount: number;
  wristCm: number;
  price: number;
  qty: number;
  stoneKey: string;
  charm: string;
  isCustom?: boolean;
  note?: string;
}

const ANATOMY_SPECIMENS = [
  {
    stoneKey: "jade",
    label: "Ngọc Phỉ Thúy",
    origin: "Myanmar · Mệnh Mộc & Hỏa",
    charm: "lotus",
    beadSize: 10,
    beadCount: 17,
  },
  {
    stoneKey: "rutile_gold",
    label: "Thạch Anh Tóc Vàng",
    origin: "Brazil · Mệnh Kim & Thổ",
    charm: "piyao",
    beadSize: 10,
    beadCount: 17,
  },
  {
    stoneKey: "aquamarine",
    label: "Aquamarine",
    origin: "Brazil · Mệnh Thủy & Mộc",
    charm: "luthong",
    beadSize: 10,
    beadCount: 17,
  },
  {
    stoneKey: "garnet",
    label: "Ngọc Hồng Lựu",
    origin: "Mozambique · Mệnh Hỏa & Thổ",
    charm: "lotus",
    beadSize: 10,
    beadCount: 17,
  },
] as const;

const ANATOMY_BEATS = [
  {
    step: "Góc nhìn nghiêng 35°",
    title: "Phôi Đá Nguyên Khối Tự Nhiên",
    desc: "Từng viên đá được cắt trực tiếp từ lõi phôi thô Lục Yên, Myanmar và Brazil, giữ trọn vân mây khoáng vật độc bản không viên nào trùng lặp.",
    angle: "tilt" as const,
  },
  {
    step: "Góc nhìn trực diện",
    title: "Tán Sắc Nội Quang & Tơ Khoáng",
    desc: "Hiệu ứng khúc xạ ánh sáng tự nhiên đi xuyên qua thớ đá trong suốt và sợi tơ Rutile ánh kim, hoàn toàn không xử lý nhiệt hay ép màu.",
    angle: "front" as const,
  },
  {
    step: "Góc nhìn đỉnh vòng",
    title: "Chuẩn Số Hạt Cung Sinh Lão",
    desc: "Chuỗi hạt được tính toán nghiêm ngặt theo chu vi cổ tay kết hợp quy luật Sinh - Lão - Bệnh - Tử, đảm bảo tổng hạt rơi đúng cung Sinh hoặc Lão.",
    angle: "top" as const,
  },
  {
    step: "Chi tiết chế tác",
    title: "Charm Bạc S925 & Vàng 18K Thủ Công",
    desc: "Phối kiện Tỳ Hưu, Hoa Sen, Lu Thống chạm khắc sắc nét từng đường vân, luồn dây cáp lụa đàn hồi 4 lõi chịu lực cao.",
    angle: "tilt" as const,
  },
];

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  // Theme state (defaults to dark per .taste-skill/direction.json green-black-bone)
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Header & scroll progress
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollProgressBarRef = useRef<HTMLDivElement | null>(null);

  // Hero 3D stage state
  const [heroStageIndex, setHeroStageIndex] = useState(0);
  const [heroAngleMode, setHeroAngleMode] = useState<"tilt" | "top" | "front">("tilt");
  const [isHeroSwitching, setIsHeroSwitching] = useState(false);

  // Taste Skill Scroll Scene ("object-spin") state
  const [anatomySpecimenIdx, setAnatomySpecimenIdx] = useState(0);
  const [anatomyBeat, setAnatomyBeat] = useState(0);
  const [anatomyProgress, setAnatomyProgress] = useState(0);
  const [anatomyAngleMode, setAnatomyAngleMode] = useState<"tilt" | "top" | "front">("tilt");

  // Ngũ Hành Nạp Âm Calculator state
  const [birthYearInput, setBirthYearInput] = useState<number>(1996);
  const [genderInput, setGenderInput] = useState<"nam" | "nu">("nam");
  const [wristInput, setWristInput] = useState<number>(16);
  const [calcYear, setCalcYear] = useState<number>(1996);
  const [calcWrist, setCalcWrist] = useState<number>(16);
  const [isCalcUpdating, setIsCalcUpdating] = useState(false);

  // Catalogue Filters
  const [selectedElement, setSelectedElement] = useState<"all" | ElementKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [activeDestinyFilter, setActiveDestinyFilter] = useState<ElementKey | null>(null);

  // Custom Studio State
  const [studioStone, setStudioStone] = useState<string>("jade");
  const [studioBeadSize, setStudioBeadSize] = useState<number>(10);
  const [studioWristCm, setStudioWristCm] = useState<number>(16);
  const [studioBeadCount, setStudioBeadCount] = useState<number>(17);
  const [studioCharm, setStudioCharm] = useState<string>("none");
  const [studioNote, setStudioNote] = useState<string>("");
  const [studioAngleMode, setStudioAngleMode] = useState<"tilt" | "top" | "front">("tilt");

  // Wishlist & Cart State
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistFilterOn, setIsWishlistFilterOn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [modalSize, setModalSize] = useState<number>(10);
  const [modalWrist, setModalWrist] = useState<number>(16);
  const [modalAngleMode, setModalAngleMode] = useState<"tilt" | "top" | "front">("tilt");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Lead form & Toasts
  const [leadPhone, setLeadPhone] = useState("");
  const [leadFeedback, setLeadFeedback] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);

  const showToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("lnd_theme") as "light" | "dark" | null;
      const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);

      const savedCart = localStorage.getItem("lnd_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWish = localStorage.getItem("lnd_wishlist");
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch {
      // ignore storage errors
    }
    setIsMounted(true);
  }, []);

  // Listen to Taste Skill ScrollTrigger scene events ("object-spin")
  useEffect(() => {
    const handleSceneProgress = (ev: Event) => {
      const detail = (ev as CustomEvent).detail;
      if (!detail || detail.scene !== "object-spin") return;
      const p = Number(detail.progress) || 0;
      const beat = Number(detail.beat) || 0;
      setAnatomyProgress(p);
      setAnatomyBeat(beat);
      const targetAngle = ANATOMY_BEATS[beat]?.angle || "tilt";
      setAnatomyAngleMode(targetAngle);
    };
    window.addEventListener("tasteskill:scene-progress", handleSceneProgress);
    return () => {
      window.removeEventListener("tasteskill:scene-progress", handleSceneProgress);
    };
  }, []);

  // Persist cart & wishlist
  useEffect(() => {
    try {
      localStorage.setItem("lnd_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("lnd_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Lock body scroll when modal or drawer is open & close on Escape key
  useEffect(() => {
    if (quickViewProduct || isCartOpen || isCheckoutOpen) {
      document.body.classList.add("is-modal-open");
    } else {
      document.body.classList.remove("is-modal-open");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isCheckoutOpen) setIsCheckoutOpen(false);
        else if (isCartOpen) setIsCartOpen(false);
        else if (quickViewProduct) setQuickViewProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickViewProduct, isCartOpen, isCheckoutOpen]);

  // Scroll listener for progress bar & header
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nextScrolled = y > 28;
      const nextShowTop = y > 520;
      setIsScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));
      setShowScrollTop((prev) => (prev !== nextShowTop ? nextShowTop : prev));
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;
      if (scrollProgressBarRef.current) {
        scrollProgressBarRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("lnd_theme", next);
    } catch {}
  };

  // Hero stage product
  const heroProduct = useMemo(() => {
    const targetId = HERO_STAGE_IDS[heroStageIndex] || HERO_STAGE_IDS[0];
    return PRODUCTS.find((p) => p.id === targetId) || PRODUCTS[0];
  }, [heroStageIndex]);

  const switchHeroStage = (idx: number) => {
    if (idx === heroStageIndex) return;
    setIsHeroSwitching(true);
    setTimeout(() => {
      setHeroStageIndex(idx);
      setIsHeroSwitching(false);
    }, 180);
  };

  const cycleAngle = (
    current: "tilt" | "top" | "front",
    setter: React.Dispatch<React.SetStateAction<"tilt" | "top" | "front">>
  ) => {
    const order: ("tilt" | "top" | "front")[] = ["tilt", "top", "front"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setter(next);
  };

  const angleLabel = (mode: "tilt" | "top" | "front") => {
    if (mode === "tilt") return "Góc nghiêng 3D";
    if (mode === "top") return "Góc nhìn trên";
    return "Góc chính diện";
  };

  // Destiny calculation
  const destinyResult = useMemo(() => {
    const offset = ((calcYear - 1984) % 60 + 60) % 60;
    const pairIndex = Math.floor(offset / 2);
    const info = DESTINY_TABLE[pairIndex] || DESTINY_TABLE[0];

    const recBeadSize = calcWrist < 15.5 ? 8 : calcWrist <= 17.5 ? 10 : 12;
    const rawCount = Math.round((calcWrist * 10) / recBeadSize) + 1;
    let recCount = rawCount;
    while (recCount % 4 !== 1 && recCount % 4 !== 2) {
      recCount++;
    }

    return {
      ...info,
      year: calcYear,
      wrist: calcWrist,
      recBeadSize,
      recCount,
    };
  }, [calcYear, calcWrist]);

  const handleCalculateDestiny = (e: React.FormEvent) => {
    e.preventDefault();
    const validYear = Math.min(2025, Math.max(1940, Number(birthYearInput) || 1996));
    const validWrist = Math.min(22, Math.max(12, Number(wristInput) || 16));
    setIsCalcUpdating(true);
    setTimeout(() => {
      setCalcYear(validYear);
      setCalcWrist(validWrist);
      setIsCalcUpdating(false);
      showToast(`Đã luận giải bản mệnh năm ${validYear}`);
    }, 160);
  };

  const applyDestinyToCatalog = () => {
    setSelectedElement(destinyResult.menh);
    setActiveDestinyFilter(destinyResult.menh);
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    showToast(`Đang lọc vòng tay hợp ${destinyResult.menhName}`);
  };

  const applyDestinyToStudio = () => {
    const stoneByMenh: Record<ElementKey, string> = {
      kim: "rutile_gold",
      moc: "jade",
      thuy: "aquamarine",
      hoa: "garnet",
      tho: "tigereye",
    };
    setStudioStone(stoneByMenh[destinyResult.menh] || "jade");
    setStudioWristCm(destinyResult.wrist);
    setStudioBeadSize(destinyResult.recBeadSize);
    setStudioBeadCount(destinyResult.recCount);
    const el = document.getElementById("studio-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    showToast(
      `Đã nạp cấu hình ${destinyResult.recCount} hạt (${destinyResult.recBeadSize}mm) hợp ${destinyResult.menhName}`
    );
  };

  const hasActiveFilters =
    selectedElement !== "all" ||
    activeDestinyFilter !== null ||
    searchQuery.trim() !== "" ||
    priceFilter !== "all" ||
    sizeFilter !== "all" ||
    isWishlistFilterOn;

  const resetCatalogFilters = () => {
    setSelectedElement("all");
    setActiveDestinyFilter(null);
    setSearchQuery("");
    setPriceFilter("all");
    setSizeFilter("all");
    setSortBy("featured");
    setIsWishlistFilterOn(false);
    showToast("Đã đặt lại toàn bộ bộ lọc sản phẩm");
  };

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (isWishlistFilterOn && !wishlist.includes(p.id)) return false;

      if (selectedElement !== "all") {
        if (activeDestinyFilter) {
          const isMatch =
            p.menh === activeDestinyFilter ||
            p.compatible.includes(activeDestinyFilter);
          if (!isMatch) return false;
        } else if (p.menh !== selectedElement) {
          return false;
        }
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchText = `${p.name} ${p.subtitle} ${p.stone} ${p.menhName} ${p.benefit}`.toLowerCase();
        if (!matchText.includes(q)) return false;
      }

      if (priceFilter === "under2m" && p.price >= 2000000) return false;
      if (priceFilter === "2mto4m" && (p.price < 2000000 || p.price > 4000000))
        return false;
      if (priceFilter === "over4m" && p.price <= 4000000) return false;

      if (sizeFilter !== "all" && !p.sizes.includes(Number(sizeFilter))) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.reviews - a.reviews;
      return 0;
    });
  }, [
    isWishlistFilterOn,
    wishlist,
    selectedElement,
    activeDestinyFilter,
    searchQuery,
    priceFilter,
    sizeFilter,
    sortBy,
  ]);

  // Studio calculations
  const currentStudioStone = STUDIO_STONES[studioStone] || STUDIO_STONES.jade;
  const studioCycleInfo = getSinhCycleStatus(studioBeadCount);
  const studioPrice = useMemo(() => {
    const sizeMultiplier =
      studioBeadSize === 8 ? 0.85 : studioBeadSize === 10 ? 1 : studioBeadSize === 12 ? 1.22 : 1.48;
    const stoneCost = Math.round(
      currentStudioStone.pricePerBead * studioBeadCount * sizeMultiplier
    );
    const charmCost = CHARM_PRICES[studioCharm] || 0;
    return stoneCost + charmCost;
  }, [currentStudioStone, studioBeadCount, studioBeadSize, studioCharm]);

  const handleWristSliderChange = (cm: number) => {
    setStudioWristCm(cm);
    const est = Math.max(13, Math.min(25, Math.round((cm * 10) / studioBeadSize) + 1));
    setStudioBeadCount(est);
  };

  const snapToSinhBeadCount = () => {
    let c = studioBeadCount;
    while (c % 4 !== 1) {
      c++;
      if (c > 25) c = 13;
    }
    setStudioBeadCount(c);
    showToast(`Đã chuẩn hóa về ${c} hạt (Cung Sinh)`);
  };

  // Cart & Wishlist handlers
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      showToast(exists ? "Đã bỏ khỏi danh sách yêu thích" : "Đã lưu vào danh sách yêu thích");
      return next;
    });
  };

  const addToCart = (item: Omit<CartItem, "cartId" | "qty">, qty = 1) => {
    const cartId = `${item.productId}-${item.beadSize}-${item.wristCm}-${item.charm}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...item, cartId, qty }];
    });
    showToast(`Đã thêm "${item.name}" vào giỏ hàng`);
  };

  const handleQuickAddProduct = (p: Product) => {
    addToCart({
      productId: p.id,
      name: p.name,
      menh: p.menh,
      menhName: p.menhName,
      beadSize: p.defaultSize,
      beadCount: p.beadCount,
      wristCm: 16,
      price: p.price,
      stoneKey: p.stoneKey,
      charm: p.charm,
    });
  };

  const handleAddStudioToCart = () => {
    addToCart({
      productId: `custom-${Date.now()}`,
      name: `Vòng Chế Tác Riêng · ${currentStudioStone.name}`,
      menh: "moc",
      menhName: currentStudioStone.menhName,
      beadSize: studioBeadSize,
      beadCount: studioBeadCount,
      wristCm: studioWristCm,
      price: studioPrice,
      stoneKey: studioStone,
      charm: studioCharm,
      isCustom: true,
      note: studioNote.trim() || undefined,
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (appliedPromo === "LINHNGOC10") return Math.round(subtotal * 0.1);
    if (appliedPromo === "PHONGTHUY200" && subtotal >= 2000000) return 200000;
    return 0;
  }, [appliedPromo, subtotal]);

  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === "LINHNGOC10") {
      setAppliedPromo("LINHNGOC10");
      setPromoMessage("Đã áp dụng mã LINHNGOC10: Giảm 10% tổng đơn hàng");
      showToast("Áp dụng mã giảm 10% thành công");
    } else if (code === "PHONGTHUY200") {
      setAppliedPromo("PHONGTHUY200");
      setPromoMessage("Đã áp dụng mã PHONGTHUY200: Giảm 200.000đ");
      showToast("Áp dụng mã PHONGTHUY200 thành công");
    } else {
      setPromoMessage("Mã ưu đãi không hợp lệ (Thử: LINHNGOC10)");
    }
  };

  const openProductModal = (p: Product) => {
    setQuickViewProduct(p);
    setModalSize(p.defaultSize);
    setModalWrist(16);
    setModalAngleMode("tilt");
  };

  const modalComputedBeadCount = useMemo(() => {
    if (!quickViewProduct) return 17;
    if (modalSize === quickViewProduct.defaultSize && modalWrist === 16) {
      return quickViewProduct.beadCount;
    }
    let c = Math.max(13, Math.min(25, Math.round((modalWrist * 10) / modalSize) + 1));
    while (c % 4 !== 1 && c % 4 !== 2) {
      c++;
    }
    return c;
  }, [quickViewProduct, modalSize, modalWrist]);

  const modalComputedPrice = useMemo(() => {
    if (!quickViewProduct) return 0;
    const diff = modalSize - quickViewProduct.defaultSize;
    const multiplier = diff === 0 ? 1 : diff > 0 ? 1 + diff * 0.09 : 1 + diff * 0.06;
    return Math.round((quickViewProduct.price * multiplier) / 10000) * 10000;
  }, [quickViewProduct, modalSize]);

  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCart([]);
    showToast("Đặt thỉnh vòng thành công! Nghệ nhân sẽ liên hệ xác nhận trong 15 phút.");
  };

  const activeAnatomySpecimen =
    ANATOMY_SPECIMENS[anatomySpecimenIdx] || ANATOMY_SPECIMENS[0];

  if (!isMounted) {
    return (
      <div
        className="app-hydration-shell"
        suppressHydrationWarning
        style={{ minHeight: "100dvh", background: "var(--bg)" }}
      />
    );
  }

  return (
    <>
      {/* Top Atelier Notice Bar */}
      <div className="atelier-bar" data-ui>
        <div className="wrap atelier-bar-inner">
          <p className="atelier-bar-note">
            Chế tác đá quý tự nhiên nguyên khối 100%, kèm chứng thư kiểm định LIULAB &amp; PNJ cho từng tuyệt tác
          </p>
          <div className="atelier-bar-right">
            <button
              type="button"
              className="promo-copy-trigger"
              data-ui
              onClick={() => {
                navigator.clipboard?.writeText("LINHNGOC10");
                setPromoCodeInput("LINHNGOC10");
                setAppliedPromo("LINHNGOC10");
                showToast("Đã sao chép & áp dụng mã LINHNGOC10 (-10%)");
              }}
            >
              Mã ưu đãi: <strong>LINHNGOC10</strong> (Giảm 10% đơn đầu)
            </button>
            <a href="#calculator-section" className="atelier-bar-link">
              Tra cứu Ngũ Hành Nạp Âm
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`} data-ui>
        <div className="wrap header-inner">
          <a href="#top" className="brand-logo" aria-label="Linh Ngọc Đường">
            <span className="brand-emblem" aria-hidden="true">
              <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
                <circle cx="18" cy="18" r="11" stroke="currentColor" strokeWidth="1.3" />
                <path
                  d="M18 7C21.5 12.5 21.5 23.5 18 29C14.5 23.5 14.5 12.5 18 7Z"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                <circle cx="18" cy="18" r="2.6" fill="currentColor" />
              </svg>
            </span>
            <div className="brand-text">
              <span className="brand-name">Linh Ngọc Đường</span>
              <span className="brand-tagline">Xưởng Đá Quý Phong Thủy Tự Nhiên</span>
            </div>
          </a>

          <nav className="main-nav" aria-label="Điều hướng chính">
            <a href="#anatomy-scene" className="nav-link">
              Giải Phẫu Đá 3D
            </a>
            <a href="#calculator-section" className="nav-link">
              Tra Mệnh Nạp Âm
            </a>
            <a href="#catalog-section" className="nav-link">
              Bộ Sưu Tập
            </a>
            <a href="#studio-section" className="nav-link">
              Xưởng Phối Vòng 3D
            </a>
            <a href="#authenticity-section" className="nav-link">
              Kiểm Định
            </a>
          </nav>

          <div className="header-actions">
            <div className="search-box" data-ui>
              <svg
                className="search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.2 16.2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    const el = document.getElementById("catalog-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                placeholder="Tìm đá, mệnh Kim, Mộc..."
                aria-label="Tìm kiếm vòng đá phong thủy"
              />
            </div>

            <button
              type="button"
              className="icon-btn"
              data-ui
              onClick={toggleTheme}
              aria-label="Đổi giao diện Sáng / Tối"
              title="Đổi giao diện Sáng / Tối"
            >
              <svg
                className="icon-sun"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="4.5" />
                <path
                  d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                className="icon-moon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="icon-btn"
              data-ui
              onClick={() => {
                setIsWishlistFilterOn((prev) => !prev);
                const el = document.getElementById("catalog-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label="Danh sách yêu thích"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isWishlistFilterOn ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M12 20.5s-7.5-4.6-9.3-9.1A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 5.4c-1.8 4.5-9.3 9.1-9.3 9.1Z"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="badge-count num">{wishlist.length}</span>
            </button>

            <button
              type="button"
              className="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Mở giỏ hàng"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 7h12l1 13H5L6 7Z" strokeLinejoin="round" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" />
              </svg>
              <span className="cart-label">Giỏ hàng</span>
              <span className="cart-count num">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            </button>
          </div>
        </div>
        <nav className="mobile-quick-nav" aria-label="Điều hướng nhanh trên di động">
          <a href="#anatomy-scene" className="mobile-nav-pill">
            Giải Phẫu 3D
          </a>
          <a href="#calculator-section" className="mobile-nav-pill">
            Tra Mệnh
          </a>
          <a href="#catalog-section" className="mobile-nav-pill">
            Bộ Sưu Tập
          </a>
          <a href="#studio-section" className="mobile-nav-pill">
            Phối Vòng 3D
          </a>
          <a href="#authenticity-section" className="mobile-nav-pill">
            Kiểm Định
          </a>
        </nav>
        <div className="scroll-progress-track" aria-hidden="true">
          <div
            ref={scrollProgressBarRef}
            className="scroll-progress-bar"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </header>

      <main id="top">
        {/* HERO SECTION (hero-object / object-stage / masked-headline) */}
        <section className="hero-stage-section" data-ink="#e3e2da">
          <div className="wrap hero-grid">
            <div className="hero-editorial">
              <div
                className="hero-origin"
                data-load
                style={{ ["--i" as string]: 0 }}
              >
                <span className="origin-marker" aria-hidden="true" />
                <span>Xưởng Chế Tác Đá Quý Phong Thủy Độc Bản</span>
              </div>

              <h1 className="hero-headline lines">
                <span className="line">
                  <span data-line style={{ ["--i" as string]: 0 }}>
                    Tinh Hoa Đá Quý Tự Nhiên
                  </span>
                </span>
                <span className="line">
                  <span
                    data-line
                    className="hero-accent-line"
                    style={{ ["--i" as string]: 1 }}
                  >
                    Hộ Mệnh Bình An &amp; Thịnh Vượng
                  </span>
                </span>
              </h1>

              <p
                className="hero-lead"
                data-load
                style={{ ["--i" as string]: 2 }}
              >
                Mỗi chiếc vòng tại Linh Ngọc Đường được tuyển chọn từ những phôi
                đá quý nguyên khối hàng triệu năm tuổi, mài cắt thủ công chuẩn
                cung Sinh và kiểm định độc lập trước khi trao đến tay chủ nhân.
              </p>

              <div
                className="hero-actions"
                data-load
                style={{ ["--i" as string]: 3 }}
              >
                <a href="#calculator-section" className="btn btn-primary">
                  <span>Tra Cứu Mệnh &amp; Chọn Đá</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a href="#studio-section" className="btn btn-secondary" data-ui>
                  Tự Thiết Kế Vòng 3D Theo Cổ Tay
                </a>
              </div>

              <dl
                className="hero-ledger"
                data-ui
                data-load
                style={{ ["--i" as string]: 4 }}
              >
                <div className="ledger-cell">
                  <dt>Kiểm định ngọc học</dt>
                  <dd className="num">100% Đá Tự Nhiên</dd>
                </div>
                <div className="ledger-cell">
                  <dt>Chuẩn thước Lỗ Ban</dt>
                  <dd className="num">Cung Sinh · Phú Quý</dd>
                </div>
                <div className="ledger-cell">
                  <dt>Bảo hành chế tác</dt>
                  <dd className="num">Thay Dây Trọn Đời</dd>
                </div>
              </dl>
            </div>

            {/* Right: Velvet Plinth 3D Object Stage */}
            <div
              className="hero-object-stage"
              data-load
              style={{ ["--i" as string]: 2 }}
            >
              <div className="object-plinth" data-ui>
                <div className="object-stage-top" data-ui>
                  <span className="stage-element-badge">
                    {heroProduct.menhName} · Khuyên dùng
                  </span>
                  <span className="stage-grade num">Kiểm định: Tự nhiên loại A</span>
                </div>

                <Bracelet3DStage
                  stoneKey={heroProduct.stoneKey}
                  beadCount={heroProduct.beadCount}
                  beadSizeMm={heroProduct.defaultSize}
                  charmType={heroProduct.charm}
                  angleMode={heroAngleMode}
                  className="hero-bracelet-preview"
                >
                  <div className="webgl-3d-controls">
                    <span className="webgl-3d-pill">
                      <span className="webgl-dot" /> 3D Thực Tế · Kéo chuột để xoay 360°
                    </span>
                    <button
                      type="button"
                      className="webgl-angle-btn"
                      onClick={() => cycleAngle(heroAngleMode, setHeroAngleMode)}
                    >
                      {angleLabel(heroAngleMode)}
                    </button>
                  </div>
                </Bracelet3DStage>

                <div className="object-stage-caption" data-ui>
                  <div
                    className={`stage-caption-main ${
                      isHeroSwitching ? "is-switching" : ""
                    }`}
                  >
                    <h2 className="stage-title">{heroProduct.name}</h2>
                    <p className="stage-sub">
                      {heroProduct.subtitle} · {heroProduct.origin}
                    </p>
                  </div>
                  <div className="stage-caption-foot" data-ui>
                    <div className="stage-price num">
                      {formatVND(heroProduct.price)}
                    </div>
                    <div
                      className="stage-switcher"
                      role="tablist"
                      aria-label="Chọn mẫu vật trưng bày"
                    >
                      {HERO_STAGE_IDS.map((id, idx) => {
                        const prod = PRODUCTS.find((p) => p.id === id);
                        const shortNames = ["Phỉ Thúy", "Tóc Vàng", "Aquamarine", "Hồng Lựu"];
                        return (
                          <button
                            key={id}
                            type="button"
                            className={`stage-chip-btn ${
                              idx === heroStageIndex ? "active" : ""
                            }`}
                            onClick={() => switchHeroStage(idx)}
                            aria-label={prod?.name || `Mẫu số ${idx + 1}`}
                          >
                            <span
                              className="stage-chip-swatch"
                              style={{
                                background:
                                  STUDIO_STONES[prod?.stoneKey || "jade"]?.swatch,
                              }}
                            />
                            <span>{shortNames[idx] || `Mẫu ${idx + 1}`}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => openProductModal(heroProduct)}
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TASTE SKILL SCROLL SCENE: 3D GEMOLOGICAL ANATOMY (data-scene="object-spin") */}
        <section
          id="anatomy-scene"
          className="scene anatomy-scene-section"
          data-scene="object-spin"
          data-ink="#e3e2da"
        >
          <div className="scene-stage">
            <div className="anatomy-stage-wrap">
              <div className="anatomy-top-row">
                <div>
                  <span className="chapter-note">
                    <span className="origin-marker" aria-hidden="true" />
                    Khảo Sát Quang Học 3D Theo Nhịp Cuộn
                  </span>
                  <h2 className="section-heading">
                    Giải Phẫu Kết Cấu Khoáng Vật &amp; Chuẩn Chế Tác
                  </h2>
                </div>

                <div className="anatomy-stone-tabs" data-ui role="tablist">
                  {ANATOMY_SPECIMENS.map((spec, idx) => (
                    <button
                      key={spec.stoneKey}
                      type="button"
                      className={`anatomy-stone-tab ${
                        anatomySpecimenIdx === idx ? "active" : ""
                      }`}
                      onClick={() => setAnatomySpecimenIdx(idx)}
                    >
                      {spec.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="anatomy-3d-layout">
                <div className="anatomy-callouts-col">
                  {ANATOMY_BEATS.slice(0, 2).map((beat, idx) => (
                    <button
                      key={beat.title}
                      type="button"
                      data-callout
                      data-ui
                      className={`anatomy-callout-card ${
                        anatomyBeat === idx ? "is-active-beat" : ""
                      }`}
                      onClick={() => {
                        setAnatomyBeat(idx);
                        setAnatomyAngleMode(beat.angle);
                      }}
                    >
                      <span className="callout-step-tag">{beat.step}</span>
                      <h3>{beat.title}</h3>
                      <p>{beat.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="anatomy-center-plinth" data-ui data-move>
                  <div className="object-stage-top" data-ui style={{ width: "100%" }}>
                    <span className="stage-element-badge">
                      {activeAnatomySpecimen.label}
                    </span>
                    <span className="stage-grade num">
                      {activeAnatomySpecimen.origin}
                    </span>
                  </div>

                  <Bracelet3DStage
                    stoneKey={activeAnatomySpecimen.stoneKey}
                    beadCount={activeAnatomySpecimen.beadCount}
                    beadSizeMm={activeAnatomySpecimen.beadSize}
                    charmType={activeAnatomySpecimen.charm}
                    angleMode={anatomyAngleMode}
                    scrollRotDeg={anatomyProgress * 240}
                    className="anatomy-3d-stage"
                  >
                    <div className="webgl-3d-controls">
                      <span className="webgl-3d-pill">
                        <span className="webgl-dot" /> Cuộn trang hoặc kéo xoay 360°
                      </span>
                      <button
                        type="button"
                        className="webgl-angle-btn"
                        onClick={() =>
                          cycleAngle(anatomyAngleMode, setAnatomyAngleMode)
                        }
                      >
                        {angleLabel(anatomyAngleMode)}
                      </button>
                    </div>
                  </Bracelet3DStage>

                  <div className="anatomy-progress-bar-wrap">
                    <span>Tiến trình khảo sát 3D</span>
                    <div className="anatomy-progress-track">
                      <div
                        className="anatomy-progress-fill"
                        data-scene-bar
                        style={{
                          transform: `scaleX(${Math.max(0.18, anatomyProgress)})`,
                        }}
                      />
                    </div>
                    <span className="num">
                      {Math.round(Math.max(0.25, anatomyProgress) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="anatomy-callouts-col">
                  {ANATOMY_BEATS.slice(2, 4).map((beat, idx) => {
                    const realIdx = idx + 2;
                    return (
                      <button
                        key={beat.title}
                        type="button"
                        data-callout
                        data-ui
                        className={`anatomy-callout-card ${
                          anatomyBeat === realIdx ? "is-active-beat" : ""
                        }`}
                        onClick={() => {
                          setAnatomyBeat(realIdx);
                          setAnatomyAngleMode(beat.angle);
                        }}
                      >
                        <span className="callout-step-tag">{beat.step}</span>
                        <h3>{beat.title}</h3>
                        <p>{beat.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 1: ABOUT WORKSHOP (statement-and-proof + [data-roll] + .shutter) */}
        <section
          id="about-section"
          className="chapter-section chapter-surface"
          data-ink="#e3e2da"
        >
          <div className="wrap statement-proof-grid">
            <div className="statement-col" data-reveal>
              <span className="chapter-note">
                <span className="origin-marker" aria-hidden="true" />
                Triết Lý Chế Tác Thủ Công
              </span>
              <h2 className="section-heading">
                Khởi Nguồn Từ Đá Thô Nguyên Bản, Hoàn Thiện Bởi Bàn Tay Nghệ Nhân Việt
              </h2>
              <p className="fill-statement" data-fill>
                Chúng tôi từ chối đá nhuộm màu, đá ép nhựa hay thủy tinh nhân tạo.
                Giá trị phong thủy chân chính nằm ở cấu trúc tinh thể tự nhiên tích
                tụ năng lượng địa chất qua hàng triệu năm.
              </p>
              <p className="editorial-prose">
                Tại xưởng Linh Ngọc Đường, mỗi khối đá thô từ mỏ Lục Yên (Yên Bái),
                Brazil, Myanmar hay Madagascar đều được cắt lát dưới nước lạnh để
                giữ nguyên độ trong và vân mây tự nhiên, trước khi tiện tròn và đánh
                bóng thủ công từng hạt.
              </p>
              <dl className="proof-figures" data-ui>
                <div className="proof-item">
                  <dt>Kinh nghiệm chế tác</dt>
                  <dd className="num">
                    <span data-roll>18</span> Năm
                  </dd>
                </div>
                <div className="proof-item">
                  <dt>Tác phẩm độc bản</dt>
                  <dd className="num">
                    <span data-roll>4200</span>+
                  </dd>
                </div>
                <div className="proof-item">
                  <dt>Kiểm định độc lập</dt>
                  <dd className="num">
                    <span data-roll>100</span>% LIULAB
                  </dd>
                </div>
              </dl>
            </div>
            <div className="proof-visual-col">
              <figure className="atelier-photo-frame shutter" data-reveal>
                <img
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1100&q=85"
                  alt="Nghệ nhân tuyển chọn hạt đá quý tự nhiên tại xưởng Linh Ngọc Đường"
                  loading="lazy"
                />
                <figcaption className="photo-caption">
                  Khâu tuyển lựa đồng đều sắc độ và soi kiểm vân mây dưới ánh sáng
                  tiêu chuẩn tại xưởng chế tác.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* CHAPTER 2: NGŨ HÀNH NẠP ÂM CALCULATOR */}
        <section
          id="calculator-section"
          className="chapter-section"
          data-ink="#e3e2da"
        >
          <div className="wrap">
            <div className="section-head-split" data-reveal>
              <div>
                <span className="chapter-note">
                  <span className="origin-marker" aria-hidden="true" />
                  Công Cụ Phong Thủy Chuyên Sâu
                </span>
                <h2 className="section-heading">
                  Tra Cứu Ngũ Hành Nạp Âm &amp; Chọn Đá Hợp Mệnh
                </h2>
              </div>
              <p className="section-lead">
                Nhập năm sinh âm lịch (hoặc dương lịch) cùng số đo cổ tay để hệ
                thống luận giải chính xác Nạp Âm 60 Hoa Giáp, màu đá Tương Sinh và
                số hạt rơi vào cung Sinh.
              </p>
            </div>

            <div className="calculator-vessel" data-ui data-reveal>
              <form className="calc-form" data-ui onSubmit={handleCalculateDestiny}>
                <div className="form-field">
                  <label htmlFor="birthYearInput">Năm sinh của bạn</label>
                  <div className="input-with-hint">
                    <input
                      type="number"
                      id="birthYearInput"
                      min={1940}
                      max={2025}
                      value={birthYearInput}
                      onChange={(e) => setBirthYearInput(Number(e.target.value))}
                      required
                    />
                    <span className="input-suffix num">1940 - 2025</span>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="genderInput">Giới tính</label>
                  <select
                    id="genderInput"
                    value={genderInput}
                    onChange={(e) =>
                      setGenderInput(e.target.value as "nam" | "nu")
                    }
                  >
                    <option value="nam">Nam mệnh</option>
                    <option value="nu">Nữ mệnh</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="wristInput">Chu vi cổ tay (cm)</label>
                  <div className="input-with-hint">
                    <input
                      type="number"
                      id="wristInput"
                      min={12}
                      max={22}
                      step={0.5}
                      value={wristInput}
                      onChange={(e) => setWristInput(Number(e.target.value))}
                      required
                    />
                    <span className="input-suffix num">cm</span>
                  </div>
                </div>

                <div className="form-field form-field-action">
                  <button
                    type="submit"
                    className="btn btn-primary btn-full calc-submit-btn"
                  >
                    Luận Giải Bản Mệnh
                  </button>
                </div>
              </form>

              <div
                className={`calc-result-panel ${
                  isCalcUpdating ? "is-updating" : ""
                }`}
                aria-live="polite"
              >
                <div className="destiny-result-grid">
                  <div className="destiny-badge-card" data-ui>
                    <div>
                      <span className="destiny-year-tag num">
                        Năm {destinyResult.year} · {destinyResult.canChi} (
                        {genderInput === "nam" ? "Nam mệnh" : "Nữ mệnh"})
                      </span>
                      <h3 className="destiny-main-heading">
                        {destinyResult.menhName}
                      </h3>
                      <p className="destiny-nap-am">
                        Nạp âm: {destinyResult.napAm}
                      </p>
                      <p className="destiny-desc-text">{destinyResult.desc}</p>
                    </div>
                    <div className="destiny-action-stack">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm btn-full"
                        onClick={applyDestinyToCatalog}
                      >
                        Lọc Ngay Các Vòng Hợp {destinyResult.menhName}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm btn-full"
                        data-ui
                        onClick={applyDestinyToStudio}
                      >
                        Phối Vòng 3D ({destinyResult.recCount} Hạt · {destinyResult.recBeadSize}mm)
                      </button>
                    </div>
                  </div>

                  <div className="destiny-details-card">
                    <div className="harmony-box" data-ui>
                      <span className="harmony-label">
                        Màu Đá Tương Sinh (Tốt Nhất)
                      </span>
                      <h4 className="harmony-title">
                        {destinyResult.tuongSinhElement}
                      </h4>
                      <p className="harmony-copy">
                        Nuôi dưỡng nguyên khí bản mệnh, thu hút quý nhân phù trợ và
                        tài lộc bền vững.
                      </p>
                      <div className="color-dots-row">
                        {destinyResult.sinhColors.map((c) => (
                          <span key={c.name} className="color-chip" data-ui>
                            <span
                              className="chip-swatch"
                              style={{ backgroundColor: c.hex }}
                            />
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="harmony-box" data-ui>
                      <span className="harmony-label">
                        Màu Đá Tương Hợp (Bản Mệnh)
                      </span>
                      <h4 className="harmony-title">{destinyResult.menhName}</h4>
                      <p className="harmony-copy">
                        Củng cố nội lực, giữ tâm trí vững vàng và cân bằng trường
                        năng lượng cá nhân.
                      </p>
                      <div className="color-dots-row">
                        {destinyResult.hopColors.map((c) => (
                          <span key={c.name} className="color-chip" data-ui>
                            <span
                              className="chip-swatch"
                              style={{ backgroundColor: c.hex }}
                            />
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="harmony-box" data-ui>
                      <span className="harmony-label">
                        Cấu Hình Chuẩn Thước Lỗ Ban
                      </span>
                      <h4 className="harmony-title num">
                        Cổ tay {destinyResult.wrist} cm · Size{" "}
                        {destinyResult.recBeadSize}mm
                      </h4>
                      <p className="harmony-copy">
                        Khuyên dùng chuỗi{" "}
                        <strong className="num">{destinyResult.recCount} hạt</strong>{" "}
                        (Cung Sinh / Lão) để vừa vặn cổ tay và giữ trọn cát khí.
                      </p>
                      <p className="harmony-note">
                        Lưu ý hạn chế: {destinyResult.khacNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 3: PRODUCT CATALOGUE */}
        <section
          id="catalog-section"
          className="chapter-section chapter-surface"
          data-ink="#e3e2da"
        >
          <div className="wrap">
            <div className="section-head-split" data-reveal>
              <div>
                <span className="chapter-note">
                  <span className="origin-marker" aria-hidden="true" />
                  Bộ Sưu Tập Tuyển Chọn
                </span>
                <h2 className="section-heading">
                  Tuyệt Tác Vòng Đá Phong Thủy Theo Ngũ Hành
                </h2>
              </div>
              <p className="section-lead">
                Mỗi thiết kế được chế tác giới hạn từ nguồn đá tự nhiên chọn lọc,
                hiển thị trực quan dưới dạng 3D thời gian thực và đi kèm hộp gấm,
                dây dự phòng cùng chứng thư kiểm định.
              </p>
            </div>

            {/* Five Elements Filter Bar */}
            <div
              className="element-filter-bar"
              role="tablist"
              aria-label="Lọc theo Ngũ Hành"
              data-reveal
            >
              {[
                { key: "all", label: "Tất Cả", sub: "12 tuyệt tác", dot: "el-all" },
                { key: "kim", label: "Mệnh Kim", sub: "Trắng · Vàng ánh kim", dot: "el-kim" },
                { key: "moc", label: "Mệnh Mộc", sub: "Xanh ngọc · Lục bảo", dot: "el-moc" },
                { key: "thuy", label: "Mệnh Thủy", sub: "Xanh biển · Đen huyền", dot: "el-thuy" },
                { key: "hoa", label: "Mệnh Hỏa", sub: "Đỏ · Hồng · Tím", dot: "el-hoa" },
                { key: "tho", label: "Mệnh Thổ", sub: "Vàng nâu · Hổ phách", dot: "el-tho" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  data-ui
                  className={`element-pill ${
                    selectedElement === tab.key ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedElement(tab.key as "all" | ElementKey);
                    if (tab.key === "all") setActiveDestinyFilter(null);
                  }}
                >
                  <span className={`el-dot ${tab.dot}`} />
                  <span className="el-text">
                    <strong>{tab.label}</strong>
                    <small>{tab.sub}</small>
                  </span>
                </button>
              ))}
            </div>

            {/* Secondary Filter & Sort Bar */}
            <div className="catalog-toolbar" data-ui data-reveal>
              <div className="toolbar-filters">
                <div className="catalog-search-inline" data-ui>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20L16.2 16.2" strokeLinecap="round" />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên đá, công dụng..."
                    aria-label="Tìm nhanh trong bộ sưu tập"
                  />
                </div>

                <div className="filter-select-wrap">
                  <label htmlFor="priceFilter">Mức giá:</label>
                  <select
                    id="priceFilter"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="all">Tất cả mức giá</option>
                    <option value="under2m">Dưới 2.000.000đ</option>
                    <option value="2mto4m">Từ 2.000.000đ - 4.000.000đ</option>
                    <option value="over4m">Trên 4.000.000đ (Cao cấp)</option>
                  </select>
                </div>

                <div className="filter-select-wrap">
                  <label htmlFor="sizeFilter">Kích cỡ hạt:</label>
                  <select
                    id="sizeFilter"
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                  >
                    <option value="all">Mọi kích cỡ (8mm - 14mm)</option>
                    <option value="8">8 mm (Thanh mảnh)</option>
                    <option value="10">10 mm (Cân đối)</option>
                    <option value="12">12 mm (Bề thế)</option>
                    <option value="14">14 mm (Đại cát)</option>
                  </select>
                </div>

                {activeDestinyFilter && (
                  <div className="active-destiny-indicator" data-ui>
                    <span>
                      Đang ưu tiên vòng hợp{" "}
                      {PRODUCTS.find((p) => p.menh === activeDestinyFilter)?.menhName}
                    </span>
                    <button
                      type="button"
                      className="clear-destiny-btn"
                      data-ui
                      onClick={() => {
                        setActiveDestinyFilter(null);
                        setSelectedElement("all");
                      }}
                    >
                      Bỏ lọc mệnh
                    </button>
                  </div>
                )}

                {hasActiveFilters && (
                  <button
                    type="button"
                    className="reset-filters-btn"
                    data-ui
                    onClick={resetCatalogFilters}
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              <div className="toolbar-right">
                <span className="result-count num">
                  Hiển thị {filteredProducts.length} / {PRODUCTS.length} tuyệt tác
                </span>
                <div className="filter-select-wrap">
                  <label htmlFor="sortBySelect">Sắp xếp:</label>
                  <select
                    id="sortBySelect"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Nổi bật &amp; Hợp mệnh</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="catalog-empty-state" data-ui>
                <h3>Không tìm thấy mẫu vòng phù hợp với bộ lọc hiện tại</h3>
                <p>
                  Bạn có thể đặt lại bộ lọc để xem toàn bộ 12 tuyệt tác hoặc tự
                  phối vòng riêng tại Xưởng Chế Tác 3D bên dưới.
                </p>
                <div className="empty-state-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={resetCatalogFilters}
                  >
                    Xem Toàn Bộ 12 Tuyệt Tác
                  </button>
                  <a
                    href="#studio-section"
                    className="btn btn-secondary btn-sm"
                    data-ui
                  >
                    Tự Thiết Kế Vòng 3D Riêng
                  </a>
                </div>
              </div>
            ) : (
              <div className="product-grid" aria-live="polite">
              {filteredProducts.map((product, index) => {
                const isWished = wishlist.includes(product.id);
                const isDestinyMatch =
                  activeDestinyFilter &&
                  (product.menh === activeDestinyFilter ||
                    product.compatible.includes(activeDestinyFilter));

                return (
                  <article
                    key={product.id}
                    className="product-card"
                    data-ui
                    data-reveal
                    style={{ ["--i" as string]: index % 3 }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = (e.clientX - rect.left) / rect.width - 0.5;
                      const y = (e.clientY - rect.top) / rect.height - 0.5;
                      e.currentTarget.style.setProperty(
                        "--card-tilt-x",
                        `${(-y * 5).toFixed(2)}deg`
                      );
                      e.currentTarget.style.setProperty(
                        "--card-tilt-y",
                        `${(x * 6).toFixed(2)}deg`
                      );
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.setProperty("--card-tilt-x", "0deg");
                      e.currentTarget.style.setProperty("--card-tilt-y", "0deg");
                    }}
                  >
                    <div
                      className="card-visual"
                      data-ui
                      onClick={() => openProductModal(product)}
                    >
                      <div className="card-badges-top">
                        <div className="badge-stack">
                          <span className="menh-pill" data-ui>
                            {product.menhName}
                          </span>
                          {isDestinyMatch && (
                            <span className="match-ribbon">Hợp Bản Mệnh</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className={`wishlist-card-btn ${
                            isWished ? "active" : ""
                          }`}
                          data-ui
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          aria-label="Lưu vào yêu thích"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              d="M12 20.5s-7.5-4.6-9.3-9.1A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 5.4c-1.8 4.5-9.3 9.1-9.3 9.1Z"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      <BraceletCard3D
                        stoneKey={product.stoneKey}
                        beadCount={product.beadCount}
                        charmType={product.charm}
                      />
                    </div>

                    <div className="card-body">
                      <div className="card-meta-row num">
                        <span>
                          {product.stone} · {product.beadCount} hạt (Cung Sinh)
                        </span>
                        <span>
                          {product.rating} ({product.reviews} đánh giá)
                        </span>
                      </div>
                      <h3
                        className="card-title"
                        onClick={() => openProductModal(product)}
                      >
                        {product.name}
                      </h3>
                      <p className="card-benefit">{product.benefit}</p>

                      <div className="card-footer" data-ui>
                        <div className="price-block num">
                          <span className="price-current">
                            {formatVND(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="price-old">
                              {formatVND(product.oldPrice)}
                            </span>
                          )}
                        </div>
                        <div className="card-actions">
                          <button
                            type="button"
                            className="btn-quick-view"
                            data-ui
                            onClick={() => openProductModal(product)}
                          >
                            Chi tiết 3D
                          </button>
                          <button
                            type="button"
                            className="btn-add-cart"
                            onClick={() => handleQuickAddProduct(product)}
                          >
                            + Giỏ hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
              </div>
            )}
          </div>
        </section>

        {/* CHAPTER 4: INTERACTIVE CUSTOM BRACELET STUDIO */}
        <section
          id="studio-section"
          className="chapter-section"
          data-ink="#e3e2da"
        >
          <div className="wrap">
            <div className="section-head-split" data-reveal>
              <div>
                <span className="chapter-note">
                  <span className="origin-marker" aria-hidden="true" />
                  Xưởng Chế Tác Cá Nhân Hóa 3D
                </span>
                <h2 className="section-heading">
                  Tự Thiết Kế Vòng Tay Chuẩn Số Hạt Cung Sinh
                </h2>
              </div>
              <p className="section-lead">
                Tùy chỉnh chất liệu đá quý, kích thước hạt, charm bạc S925 mạ vàng
                18K và kiểm tra trực tiếp quy luật Sinh · Lão · Bệnh · Tử trên mô
                hình 3D tương tác thời gian thực.
              </p>
            </div>

            <div className="studio-grid" data-reveal>
              {/* Left: Live 3D Bracelet Visualizer */}
              <div className="studio-canvas-card" data-ui>
                <div className="studio-canvas-header" data-ui>
                  <div
                    className={`canvas-badge ${
                      studioCycleInfo.isGood ? "" : "warn"
                    }`}
                    data-ui
                  >
                    {studioBeadCount} Hạt · {studioCycleInfo.title}
                  </div>
                  <div className="canvas-specs num">
                    Cổ tay {studioWristCm.toFixed(1)} cm · Hạt {studioBeadSize} mm
                  </div>
                </div>

                <Bracelet3DStage
                  stoneKey={studioStone}
                  beadCount={studioBeadCount}
                  beadSizeMm={studioBeadSize}
                  charmType={studioCharm}
                  angleMode={studioAngleMode}
                  className="studio-svg-stage"
                >
                  <div className="webgl-3d-controls">
                    <span className="webgl-3d-pill">
                      <span className="webgl-dot" /> 3D Studio · Giữ chuột kéo xoay
                      360°
                    </span>
                    <button
                      type="button"
                      className="webgl-angle-btn"
                      onClick={() =>
                        cycleAngle(studioAngleMode, setStudioAngleMode)
                      }
                    >
                      {angleLabel(studioAngleMode)}
                    </button>
                  </div>
                </Bracelet3DStage>

                {/* Sinh - Lão - Bệnh - Tử Indicator */}
                <div className="studio-cycle-legend">
                  {[
                    { key: "sinh", name: "Cung Sinh", desc: "Khởi sinh tài lộc (Dư 1)" },
                    { key: "lao", name: "Cung Lão", desc: "Trường thọ phúc trạch (Dư 2)" },
                    { key: "benh", name: "Cung Bệnh", desc: "Nên tránh (Dư 3)" },
                    { key: "tu", name: "Cung Tử", desc: "Nên tránh (Chia hết 4)" },
                  ].map((c) => (
                    <div
                      key={c.key}
                      data-ui
                      className={`cycle-step ${
                        studioCycleInfo.step === c.key ? "active" : ""
                      }`}
                    >
                      <span className="step-name">{c.name}</span>
                      <span className="step-desc">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Studio Controls */}
              <div className="studio-controls-card" data-ui>
                <div className="control-group">
                  <label className="control-label">
                    Bước 1 · Chọn chất liệu đá chủ đạo
                  </label>
                  <div className="stone-swatch-grid">
                    {Object.entries(STUDIO_STONES).map(([key, st]) => (
                      <button
                        key={key}
                        type="button"
                        data-ui
                        className={`stone-swatch-btn ${
                          studioStone === key ? "active" : ""
                        }`}
                        onClick={() => setStudioStone(key)}
                      >
                        <span
                          className="swatch-ball"
                          style={{ background: st.swatch }}
                        />
                        <span className="swatch-info">
                          <strong>{st.name}</strong>
                          <small>{st.menhName}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-row-2col">
                  <div className="control-group">
                    <label className="control-label">
                      Bước 2 · Đường kính hạt đá (mm)
                    </label>
                    <div className="pill-radio-group">
                      {[
                        { size: 8, note: "Nữ thanh mảnh" },
                        { size: 10, note: "Phổ thông" },
                        { size: 12, note: "Nam lịch lãm" },
                        { size: 14, note: "Bề thế" },
                      ].map((item) => (
                        <button
                          key={item.size}
                          type="button"
                          data-ui
                          className={`size-pill num ${
                            studioBeadSize === item.size ? "active" : ""
                          }`}
                          onClick={() => setStudioBeadSize(item.size)}
                        >
                          {item.size} mm
                          <small>{item.note}</small>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="control-group">
                    <label className="control-label" htmlFor="studioWristRange">
                      Bước 3 · Chu vi cổ tay:{" "}
                      <strong className="num">{studioWristCm.toFixed(1)} cm</strong>
                    </label>
                    <input
                      type="range"
                      id="studioWristRange"
                      min={13}
                      max={20}
                      step={0.5}
                      value={studioWristCm}
                      onChange={(e) =>
                        handleWristSliderChange(Number(e.target.value))
                      }
                      className="luxury-range"
                    />
                    <div className="bead-count-selector">
                      <span>Số hạt chế tác:</span>
                      <div className="bead-stepper" data-ui>
                        <button
                          type="button"
                          onClick={() =>
                            setStudioBeadCount((c) => Math.max(13, c - 1))
                          }
                          aria-label="Giảm 1 hạt"
                        >
                          -
                        </button>
                        <strong className="num">{studioBeadCount} hạt</strong>
                        <button
                          type="button"
                          onClick={() =>
                            setStudioBeadCount((c) => Math.min(25, c + 1))
                          }
                          aria-label="Tăng 1 hạt"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="auto-sinh-btn"
                        onClick={snapToSinhBeadCount}
                      >
                        Chuẩn Cung Sinh
                      </button>
                    </div>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">
                    Bước 4 · Phối Charm Bạc S925 Mạ Vàng 18K
                  </label>
                  <div className="charm-option-grid">
                    {[
                      { key: "none", title: "Không phối Charm", sub: "Nguyên bản tối giản (+0đ)" },
                      { key: "lotus", title: "Charm Liên Hoa", sub: "Bình an thanh tịnh (+350.000đ)" },
                      { key: "piyao", title: "Charm Tỳ Hưu Chiêu Tài", sub: "Tụ lộc giữ của (+650.000đ)" },
                      { key: "luthong", title: "Charm Lu Thống", sub: "Hanh thông vạn sự (+450.000đ)" },
                    ].map((ch) => (
                      <button
                        key={ch.key}
                        type="button"
                        data-ui
                        className={`charm-btn ${
                          studioCharm === ch.key ? "active" : ""
                        }`}
                        onClick={() => setStudioCharm(ch.key)}
                      >
                        <strong>{ch.title}</strong>
                        <span className="num">{ch.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label" htmlFor="studioNoteInput">
                    Bước 5 · Ghi chú khắc tên hoặc lời chúc trên thẻ quà tặng
                  </label>
                  <input
                    type="text"
                    id="studioNoteInput"
                    value={studioNote}
                    onChange={(e) => setStudioNote(e.target.value)}
                    placeholder="Ví dụ: Tặng mẹ bình an, mệnh Hỏa 1986..."
                    maxLength={80}
                  />
                </div>

                <div className="studio-summary-bar" data-ui>
                  <div className="studio-price-box">
                    <span className="price-caption">Giá chế tác hoàn thiện</span>
                    <strong className="studio-total-price num">
                      {formatVND(studioPrice)}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddStudioToCart}
                  >
                    Thêm Vòng Thiết Kế Vào Giỏ Hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 5: GEMOLOGICAL AUTHENTICITY SPEC-SHEET */}
        <section
          id="authenticity-section"
          className="chapter-section chapter-surface"
          data-ink="#e3e2da"
        >
          <div className="wrap">
            <div className="section-head-split" data-reveal>
              <div>
                <span className="chapter-note">
                  <span className="origin-marker" aria-hidden="true" />
                  Bảo Chứng Ngọc Học Minh Bạch
                </span>
                <h2 className="section-heading">
                  Tiêu Chuẩn Kiểm Định &amp; Quy Trình Tuyển Chọn Đá Quý
                </h2>
              </div>
              <p className="section-lead">
                Mỗi chiếc vòng xuất xưởng đều có mã hồ sơ kiểm định riêng biệt,
                cho phép tra cứu trực tuyến các chỉ số khúc xạ, tỷ trọng và nguồn
                gốc khoáng vật tự nhiên.
              </p>
            </div>

            <div className="spec-sheet-layout">
              <dl className="spec-ledger" data-ui data-reveal>
                <div className="spec-row" data-ui>
                  <dt>Chứng thư kiểm định độc lập</dt>
                  <dd>
                    100% sản phẩm kèm giấy kiểm định từ Trung tâm Nghiên cứu &amp;
                    Ứng dụng Ngọc học LIULAB hoặc PNJ Lab. Cam kết bồi hoàn gấp 10
                    lần nếu phát hiện đá giả, đá nhuộm màu hoặc xử lý hóa chất.
                  </dd>
                </div>
                <div className="spec-row" data-ui>
                  <dt>Độ tinh khiết &amp; Tơ khoáng tự nhiên</dt>
                  <dd>
                    Chỉ tuyển chọn nhóm phôi đá đạt độ trong 5A - 6A (với thạch anh
                    tóc) và phôi ngọc già (với Phỉ Thúy, Hòa Điền), giữ nguyên bao
                    thể tự nhiên mang năng lượng địa chất nguyên bản.
                  </dd>
                </div>
                <div className="spec-row" data-ui>
                  <dt>Dây lõi lụa đàn hồi &amp; Phụ kiện</dt>
                  <dd>
                    Sử dụng dây cáp lụa 4 lõi chuyên dụng chống tưa đứt, phối kiện
                    bạc S925 mạ vàng 18K không đen dị ứng. Tặng kèm hộp gỗ sơn mài
                    lót nhung, túi gấm, kim luồn và dây dự phòng.
                  </dd>
                </div>
                <div className="spec-row" data-ui>
                  <dt>Trì chú &amp; Thanh tẩy năng lượng</dt>
                  <dd>
                    Trước khi đóng gói, mỗi chiếc vòng được thanh tẩy từ trường
                    bằng tinh thể Thạch Anh Trắng nguyên khối (Cluster) và trầm hương tự nhiên
                    trong 24 giờ để đạt trạng thái năng lượng thuần khiết nhất.
                  </dd>
                </div>
              </dl>

              <div className="spec-photo-pair">
                <figure className="spec-photo-card shutter" data-reveal>
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"
                    alt="Kiểm tra khúc xạ ánh sáng và cấu trúc tinh thể đá quý tự nhiên"
                    loading="lazy"
                  />
                  <figcaption className="photo-caption">
                    Kiểm tra cấu trúc bao thể và mật độ tơ Rutile dưới kính hiển vi
                    ngọc học 40x.
                  </figcaption>
                </figure>
                <figure className="spec-photo-card shutter" data-reveal>
                  <img
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85"
                    alt="Hộp quà sơn mài và chứng thư kiểm định đi kèm vòng tay"
                    loading="lazy"
                  />
                  <figcaption className="photo-caption">
                    Bộ lễ hộp bàn giao gồm chứng thư kiểm định, thẻ bảo hành trọn
                    đời và bộ dây thay thế.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 6: KNOWLEDGE & CARE GUIDE */}
        <section
          id="guide-section"
          className="chapter-section"
          data-ink="#e3e2da"
        >
          <div className="wrap">
            <div className="section-head-split" data-reveal>
              <div>
                <span className="chapter-note">
                  <span className="origin-marker" aria-hidden="true" />
                  Cẩm Nang Phong Thủy Ứng Dụng
                </span>
                <h2 className="section-heading">
                  Nghệ Thuật Đeo Vòng &amp; Thanh Tẩy Năng Lượng Đá Quý
                </h2>
              </div>
              <p className="section-lead">
                Hiểu đúng nguyên lý Tả nhập · Hữu xuất và cách bảo dưỡng định kỳ
                giúp viên đá luôn sáng bóng, đồng hành bền bỉ cùng gia chủ.
              </p>
            </div>

            <div className="guide-spread-grid">
              <article
                className="guide-card"
                data-reveal
                style={{ ["--i" as string]: 0 }}
              >
                <div className="guide-media shutter" data-reveal>
                  <img
                    src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80"
                    alt="Quy tắc đeo vòng tay trái và tay phải trong phong thủy"
                    loading="lazy"
                  />
                </div>
                <div className="guide-body">
                  <span className="guide-tag">Nguyên tắc Tả - Hữu</span>
                  <h3>Khi Nào Nên Đeo Tay Trái, Khi Nào Đeo Tay Phải?</h3>
                  <p>
                    Theo Đông y và Phong thủy học, tay trái là cửa ngõ thu nạp sinh
                    khí (nên đeo khi ký kết hợp đồng, dự tiệc, cầu tài lộc). Tay
                    phải giúp hóa giải uế khí và bảo vệ bản thân khi đến nơi đông
                    người hoặc môi trường âm khí nặng.
                  </p>
                </div>
              </article>

              <article
                className="guide-card"
                data-reveal
                style={{ ["--i" as string]: 1 }}
              >
                <div className="guide-media shutter" data-reveal>
                  <img
                    src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80"
                    alt="Cách đo chu vi cổ tay và tính số hạt cung Sinh"
                    loading="lazy"
                  />
                </div>
                <div className="guide-body">
                  <span className="guide-tag">Quy luật Sinh · Lão</span>
                  <h3>Cách Tính Số Hạt Vòng Rơi Đúng Cung Sinh</h3>
                  <p>
                    Lấy tổng số hạt chia cho 4: nếu dư 1 là cung Sinh (khởi đầu hanh
                    thông), dư 2 là cung Lão (bền vững an khang). Các con số vàng
                    thường được nghệ nhân lựa chọn là 13, 14, 17, 18, 21 hoặc 22
                    hạt tùy kích cỡ đá.
                  </p>
                </div>
              </article>

              <article
                className="guide-card"
                data-reveal
                style={{ ["--i" as string]: 2 }}
              >
                <div className="guide-media shutter" data-reveal>
                  <img
                    src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80"
                    alt="Thanh tẩy và nạp năng lượng cho vòng đá tự nhiên"
                    loading="lazy"
                  />
                </div>
                <div className="guide-body">
                  <span className="guide-tag">Bảo dưỡng định kỳ</span>
                  <h3>3 Phương Pháp Thanh Tẩy &amp; Nạp Lại Từ Trường Đá</h3>
                  <p>
                    Sau mỗi 1 - 2 tháng sử dụng, bạn có thể rửa nhẹ vòng dưới dòng
                    nước sạch, hong khô tự nhiên rồi đặt dưới ánh trăng rằm hoặc
                    xông khói trầm hương 15 phút để làm mới trường năng lượng của
                    đá.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* CLOSING CONSULTATION BAND */}
        <section className="closing-band" data-ink="#e3e2da">
          <div className="wrap closing-band-inner" data-reveal>
            <div className="closing-copy">
              <span className="chapter-note">
                <span className="origin-marker" aria-hidden="true" />
                Tư Vấn Cá Nhân Hóa 1:1
              </span>
              <h2 className="closing-heading">
                Cần Nghệ Nhân Tư Vấn Theo Lá Số Bát Tự Chuyên Sâu?
              </h2>
              <p className="closing-sub">
                Để lại số điện thoại hoặc Zalo, chuyên gia phong thủy tại Linh Ngọc
                Đường sẽ gửi video quay trực tiếp từng chiếc vòng dưới ánh sáng tự
                nhiên để bạn chọn lựa.
              </p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!leadPhone.trim()) return;
                setLeadFeedback(
                  `Cảm ơn bạn! Chuyên gia phong thủy sẽ liên hệ Zalo ${leadPhone} trong ít phút.`
                );
                setLeadPhone("");
                showToast("Đã gửi yêu cầu tư vấn 1:1 thành công");
              }}
            >
              <input
                type="tel"
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder="Nhập số điện thoại / Zalo của bạn..."
                required
                aria-label="Số điện thoại nhận tư vấn"
              />
              <button type="submit" className="btn btn-primary">
                Nhận Video Thực Tế Qua Zalo
              </button>
              {leadFeedback && <p className="lead-feedback">{leadFeedback}</p>}
            </form>
          </div>
        </section>
      </main>

      {/* WORDMARK FOOTER */}
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <p className="footer-title">Linh Ngọc Đường</p>
              <p className="footer-desc">
                Xưởng chế tác vòng tay đá quý phong thủy tự nhiên nguyên khối. Minh
                bạch kiểm định, chuẩn mực phong thủy Đông phương và bảo hành trọn
                đời.
              </p>
              <div className="footer-contact-list num">
                <p>
                  <strong>Phòng trưng bày Hà Nội:</strong> 86 Phố Huế, Quận Hai Bà
                  Trưng, Hà Nội
                </p>
                <p>
                  <strong>Phòng trưng bày TP.HCM:</strong> 142 Nguyễn Đình Chiểu,
                  Quận 3, TP.HCM
                </p>
                <p>
                  <strong>Hotline / Zalo Nghệ Nhân:</strong> 0988 688 999 (8:30 -
                  21:30)
                </p>
              </div>
            </div>

            <div className="footer-col">
              <h3>Bộ Sưu Tập Ngũ Hành</h3>
              <ul>
                {(["kim", "moc", "thuy", "hoa", "tho"] as ElementKey[]).map(
                  (elKey) => (
                    <li key={elKey}>
                      <a
                        href="#catalog-section"
                        onClick={() => {
                          setSelectedElement(elKey);
                          setActiveDestinyFilter(null);
                        }}
                      >
                        Vòng Tay Mệnh{" "}
                        {elKey === "kim"
                          ? "Kim"
                          : elKey === "moc"
                          ? "Mộc"
                          : elKey === "thuy"
                          ? "Thủy"
                          : elKey === "hoa"
                          ? "Hỏa"
                          : "Thổ"}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="footer-col">
              <h3>Chính Sách &amp; Cam Kết</h3>
              <ul>
                <li>
                  <a href="#authenticity-section">
                    Chứng thư kiểm định LIULAB &amp; PNJ
                  </a>
                </li>
                <li>
                  <a href="#studio-section">
                    Bảo hành thay dây cáp lụa trọn đời
                  </a>
                </li>
                <li>
                  <a href="#catalog-section">
                    Đồng kiểm thực tế trước khi thanh toán
                  </a>
                </li>
                <li>
                  <a href="#guide-section">
                    Đổi cỡ hạt miễn phí trong 30 ngày
                  </a>
                </li>
                <li>
                  <a href="#calculator-section">
                    Bảng tra Ngũ Hành Nạp Âm 60 Hoa Giáp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-wordmark-band" aria-hidden="true">
            <span className="footer-giant-wordmark">LINH NGỌC ĐƯỜNG</span>
          </div>

          <div className="footer-bottom">
            <p>
              © 2026 Linh Ngọc Đường Atelier. Chế tác thủ công tại Việt Nam.
            </p>
            <p className="num">Giấy phép kinh doanh đá quý số 0108926541</p>
          </div>
        </div>
      </footer>

      {/* QUICK VIEW PRODUCT MODAL */}
      {quickViewProduct && (
        <div
          className="modal-backdrop is-open"
          data-ui
          role="dialog"
          aria-modal="true"
          aria-label="Chi tiết sản phẩm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuickViewProduct(null);
          }}
        >
          <div className="product-modal" data-ui>
            <button
              type="button"
              className="modal-close-btn"
              data-ui
              onClick={() => setQuickViewProduct(null)}
              aria-label="Đóng cửa sổ"
            >
              Đóng
            </button>

            <div className="modal-detail-grid">
              <div className="modal-visual-box" data-ui>
                <Bracelet3DStage
                  stoneKey={quickViewProduct.stoneKey}
                  beadCount={modalComputedBeadCount}
                  beadSizeMm={modalSize}
                  charmType={quickViewProduct.charm}
                  angleMode={modalAngleMode}
                  className="modal-3d-stage"
                >
                  <div className="webgl-3d-controls">
                    <span className="webgl-3d-pill">
                      <span className="webgl-dot" /> Kéo để xoay 3D 360°
                    </span>
                    <button
                      type="button"
                      className="webgl-angle-btn"
                      onClick={() =>
                        cycleAngle(modalAngleMode, setModalAngleMode)
                      }
                    >
                      {angleLabel(modalAngleMode)}
                    </button>
                  </div>
                </Bracelet3DStage>

                <div className="cert-card-mini" data-ui>
                  <div className="cert-card-head" data-ui>
                    <span>CHỨNG THƯ KIỂM ĐỊNH ĐÁ QUÝ</span>
                    <strong className="num">{quickViewProduct.certCode}</strong>
                  </div>
                  <div className="cert-card-rows num">
                    <div>
                      <span>Khoáng vật:</span>
                      <strong>{quickViewProduct.stone} Tự Nhiên</strong>
                    </div>
                    <div>
                      <span>Độ cứng Mohs:</span>
                      <strong>{quickViewProduct.hardness}</strong>
                    </div>
                    <div>
                      <span>Khai thác:</span>
                      <strong>{quickViewProduct.origin}</strong>
                    </div>
                    <div>
                      <span>Phẩm cấp đá:</span>
                      <strong>{quickViewProduct.grade}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-info-col">
                <span className="chapter-note">
                  <span className="origin-marker" aria-hidden="true" />
                  {quickViewProduct.menhName} · {quickViewProduct.subtitle}
                </span>
                <h2
                  className="section-heading"
                  style={{ fontSize: "1.65rem", marginBottom: "0.5rem" }}
                >
                  {quickViewProduct.name}
                </h2>
                <div
                  className="price-block num"
                  style={{ marginBottom: "0.85rem" }}
                >
                  <span
                    className="price-current"
                    style={{ fontSize: "1.4rem" }}
                  >
                    {formatVND(modalComputedPrice)}
                  </span>
                  {quickViewProduct.oldPrice && (
                    <span className="price-old">
                      {formatVND(quickViewProduct.oldPrice)}
                    </span>
                  )}
                </div>

                <p
                  className="section-lead"
                  style={{ marginBottom: "0.9rem", fontSize: "0.88rem" }}
                >
                  {quickViewProduct.description}
                </p>

                <div className="modal-energy-grid num" data-ui>
                  {[
                    { label: "Chiêu Tài Lộc", val: quickViewProduct.energyScores.taiLoc },
                    { label: "Bình An Hộ Mệnh", val: quickViewProduct.energyScores.binhAn },
                    { label: "Nhân Duyên Hòa Hợp", val: quickViewProduct.energyScores.tinhDuyen },
                    { label: "Cân Bằng Khí Huyết", val: quickViewProduct.energyScores.sucKhoe },
                  ].map((score) => (
                    <div key={score.label} className="modal-energy-item">
                      <div className="modal-energy-top">
                        <span>{score.label}</span>
                        <strong>{score.val}%</strong>
                      </div>
                      <div className="modal-energy-bar">
                        <span style={{ width: `${score.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="control-group"
                  style={{ marginBottom: "0.9rem" }}
                >
                  <label className="control-label">
                    Chọn kích thước hạt đá (mm):
                  </label>
                  <div className="pill-radio-group">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        data-ui
                        className={`size-pill num ${
                          modalSize === s ? "active" : ""
                        }`}
                        onClick={() => setModalSize(s)}
                      >
                        {s} mm
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className="control-group"
                  style={{ marginBottom: "1.1rem" }}
                >
                  <label className="control-label" htmlFor="modalWristSelect">
                    Chu vi cổ tay người đeo:{" "}
                    <strong className="num">
                      {modalComputedBeadCount} hạt · Cung Sinh
                    </strong>
                  </label>
                  <select
                    id="modalWristSelect"
                    value={modalWrist}
                    onChange={(e) => setModalWrist(Number(e.target.value))}
                    style={{
                      width: "100%",
                      height: "2.6rem",
                      paddingInline: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-strong)",
                      backgroundColor: "var(--bg)",
                    }}
                  >
                    {[14, 15, 16, 17, 18, 19].map((cm) => (
                      <option key={cm} value={cm}>
                        Cổ tay {cm} cm (Chế tác chuẩn Cung Sinh)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      addToCart({
                        productId: quickViewProduct.id,
                        name: quickViewProduct.name,
                        menh: quickViewProduct.menh,
                        menhName: quickViewProduct.menhName,
                        beadSize: modalSize,
                        beadCount: modalComputedBeadCount,
                        wristCm: modalWrist,
                        price: modalComputedPrice,
                        stoneKey: quickViewProduct.stoneKey,
                        charm: quickViewProduct.charm,
                      });
                      setQuickViewProduct(null);
                      setIsCartOpen(true);
                    }}
                  >
                    Thỉnh Vòng Này ({formatVND(modalComputedPrice)})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER CART DRAWER */}
      {isCartOpen && (
        <div
          className="drawer-backdrop is-open"
          data-ui
          role="dialog"
          aria-modal="true"
          aria-label="Giỏ hàng của bạn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCartOpen(false);
          }}
        >
          <aside className="cart-drawer" data-ui>
            <div className="drawer-header" data-ui>
              <div>
                <h3>Giỏ Hàng Của Bạn</h3>
                <p className="drawer-subtitle num">
                  {cart.reduce((s, i) => s + i.qty, 0)} tuyệt tác đã chọn
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                data-ui
                onClick={() => setIsCartOpen(false)}
                aria-label="Đóng giỏ hàng"
              >
                Đóng
              </button>
            </div>

            <div className="shipping-progress-bar" data-ui>
              <p>
                Miễn phí vận chuyển bảo hiểm toàn quốc &amp; tặng hộp sơn mài cao
                cấp
              </p>
            </div>

            <div className="drawer-items">
              {cart.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "var(--muted)",
                  }}
                >
                  <p style={{ marginBottom: "1rem" }}>
                    Giỏ hàng của bạn đang trống.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    data-ui
                    onClick={() => setIsCartOpen(false)}
                  >
                    Khám Phá Bộ Sưu Tập
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="cart-item" data-ui>
                    <div className="cart-item-thumb">
                      <span
                        className="cart-item-Dot"
                        style={{
                          background:
                            STUDIO_STONES[item.stoneKey]?.swatch ||
                            ELEMENT_COLORS[item.menh],
                        }}
                      />
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="cart-item-meta num">
                        Size {item.beadSize}mm · {item.beadCount} hạt · Cổ tay{" "}
                        {item.wristCm}cm
                        {item.charm !== "none"
                          ? ` · ${CHARM_NAMES[item.charm]}`
                          : ""}
                      </p>
                      <span className="cart-item-price num">
                        {formatVND(item.price * item.qty)}
                      </span>
                    </div>
                    <div className="cart-qty-box">
                      <div className="qty-controls" data-ui>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.cartId, -1)}
                        >
                          -
                        </button>
                        <span className="num">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.cartId, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => updateCartQty(item.cartId, -item.qty)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="drawer-footer" data-ui>
              <div className="promo-box">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Nhập mã ưu đãi (VD: LINHNGOC10)"
                  aria-label="Mã giảm giá"
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  data-ui
                  onClick={handleApplyPromo}
                >
                  Áp dụng
                </button>
              </div>
              {promoMessage && <p className="promo-status">{promoMessage}</p>}

              <div className="cart-totals num">
                <div className="total-row">
                  <span>Tạm tính:</span>
                  <strong>{formatVND(subtotal)}</strong>
                </div>
                {discountAmount > 0 && (
                  <div className="total-row discount-row">
                    <span>Ưu đãi giảm giá:</span>
                    <strong>-{formatVND(discountAmount)}</strong>
                  </div>
                )}
                <div className="total-row">
                  <span>Phí vận chuyển bảo hiểm:</span>
                  <span className="free-tag">Miễn phí</span>
                </div>
                <div className="total-row grand-total-row" data-ui>
                  <span>Tổng thanh toán:</span>
                  <strong>{formatVND(grandTotal)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full"
                disabled={cart.length === 0}
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
              >
                Tiến Hành Đặt Thỉnh Vòng
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div
          className="modal-backdrop is-open"
          data-ui
          role="dialog"
          aria-modal="true"
          aria-label="Thanh toán đơn hàng"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCheckoutOpen(false);
          }}
        >
          <div className="checkout-modal" data-ui>
            <button
              type="button"
              className="modal-close-btn"
              data-ui
              onClick={() => setIsCheckoutOpen(false)}
              aria-label="Đóng"
            >
              Đóng
            </button>

            <div className="checkout-header">
              <span className="chapter-note">
                <span className="origin-marker" aria-hidden="true" />
                Xác Nhận Thông Tin Giao Vòng
              </span>
              <h2>Hoàn Tất Đơn Đặt Chế Tác</h2>
              <p className="checkout-sub">
                Nghệ nhân sẽ liên hệ qua Zalo để gửi ảnh/video kiểm định chiếc
                vòng thực tế trước khi niêm phong gửi đến bạn.
              </p>
            </div>

            <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="custName">Họ và tên người nhận *</label>
                  <input
                    type="text"
                    id="custName"
                    required
                    placeholder="Nguyễn Văn An"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="custPhone">Số điện thoại / Zalo *</label>
                  <input
                    type="tel"
                    id="custPhone"
                    required
                    placeholder="0909 xxx xxx"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="custCity">Tỉnh / Thành phố *</label>
                  <select id="custCity" required defaultValue="Hà Nội">
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Tỉnh thành khác">Tỉnh / Thành khác</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="custBirthYear">
                    Năm sinh người đeo (để trì chú)
                  </label>
                  <input
                    type="number"
                    id="custBirthYear"
                    placeholder="Ví dụ: 1992"
                    min={1930}
                    max={2025}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="custAddress">Địa chỉ nhận hàng chi tiết *</label>
                <input
                  type="text"
                  id="custAddress"
                  required
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                />
              </div>

              <div className="form-field">
                <label>Phương thức thanh toán</label>
                <div className="payment-methods">
                  <label className="payment-radio" data-ui>
                    <input
                      type="radio"
                      name="payMethod"
                      value="cod"
                      defaultChecked
                    />
                    <span>
                      <strong>Kiểm tra vòng thực tế rồi thanh toán (COD)</strong>
                      <span>
                        Mở hộp kiểm tra đá và mã chứng thư LIULAB trước khi
                        thanh toán
                      </span>
                    </span>
                  </label>
                  <label className="payment-radio" data-ui>
                    <input type="radio" name="payMethod" value="bank" />
                    <span>
                      <strong>Chuyển khoản Ngân hàng / VietQR</strong>
                      <span>
                        Tặng thêm túi trầm hương thanh tẩy đá khi chuyển khoản
                        trước
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="checkout-summary-box num" data-ui>
                <div className="total-row">
                  <span>Tổng thanh toán ({cart.length} sản phẩm):</span>
                  <strong>{formatVND(grandTotal)}</strong>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Xác Nhận Đặt Thỉnh Vòng
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div
        className="toast-container"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div key={t.id} className="toast-msg" data-ui>
            {t.text}
          </div>
        ))}
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <button
        type="button"
        data-ui
        className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}
        aria-label="Lên đầu trang"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 19V5M5 12l7-7 7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <TasteSkillProvider />
    </>
  );
}
