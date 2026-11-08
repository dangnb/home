/* ==========================================================================
   LINH NGỌC ĐƯỜNG — ATELIER INTERACTIVE APPLICATION LOGIC
   ========================================================================== */

// ---------------------------------------------------------------------------
// 1. STONE DEFINITIONS & PROCEDURAL REALISTIC SVG BRACELET GENERATOR
// ---------------------------------------------------------------------------
const STONE_PALETTES = {
  rutileGold: {
    id: 'rutileGold',
    name: 'Thạch Anh Tóc Vàng 6A',
    element: 'Kim',
    basePricePerBead: 115000,
    cLight: '#FFF6D6',
    cMid: '#DFAC42',
    cDark: '#6B480E',
    cGlow: '#FFE28A',
    inclusion: 'rutile-gold',
    swatchColor: '#DFAC42'
  },
  imperialJade: {
    id: 'imperialJade',
    name: 'Ngọc Phỉ Thúy Băng Chủng',
    element: 'Mộc',
    basePricePerBead: 135000,
    cLight: '#B6F7D8',
    cMid: '#1C8C5E',
    cDark: '#093B25',
    cGlow: '#7CE8B4',
    inclusion: 'jade-cloud',
    swatchColor: '#1C8C5E'
  },
  aquamarine: {
    id: 'aquamarine',
    name: 'Đá Aquamarine Lam Ngọc',
    element: 'Thủy',
    basePricePerBead: 110000,
    cLight: '#D8F5FF',
    cMid: '#3694C7',
    cDark: '#0F3F61',
    cGlow: '#99E2FF',
    inclusion: 'ice-vein',
    swatchColor: '#3694C7'
  },
  rutileRed: {
    id: 'rutileRed',
    name: 'Thạch Anh Tóc Đỏ Chu Sa',
    element: 'Hỏa',
    basePricePerBead: 120000,
    cLight: '#FFD2C9',
    cMid: '#C84332',
    cDark: '#57120A',
    cGlow: '#FF8A7A',
    inclusion: 'rutile-red',
    swatchColor: '#C84332'
  },
  tigerEyeGold: {
    id: 'tigerEyeGold',
    name: 'Đá Mắt Hổ Vàng Tâm Hổ',
    element: 'Thổ',
    basePricePerBead: 65000,
    cLight: '#F7D294',
    cMid: '#9E6324',
    cDark: '#361E07',
    cGlow: '#E8B364',
    inclusion: 'tigereye',
    swatchColor: '#9E6324'
  },
  amethyst: {
    id: 'amethyst',
    name: 'Thạch Anh Tím Amethyst',
    element: 'Hỏa',
    basePricePerBead: 78000,
    cLight: '#E8D8F0',
    cMid: '#6E4885',
    cDark: '#2A1836',
    cGlow: '#B894CC',
    inclusion: 'ice-vein',
    swatchColor: '#6E4885'
  },
  rutileBlack: {
    id: 'rutileBlack',
    name: 'Thạch Anh Tóc Đen Huyền Vũ',
    element: 'Thủy',
    basePricePerBead: 105000,
    cLight: '#E3E6E8',
    cMid: '#4A525A',
    cDark: '#121518',
    cGlow: '#9BA4AD',
    inclusion: 'rutile-black',
    swatchColor: '#4A525A'
  },
  moonstone: {
    id: 'moonstone',
    name: 'Đá Mặt Trăng Ánh Xanh',
    element: 'Kim',
    basePricePerBead: 95000,
    cLight: '#FFFFFF',
    cMid: '#B9D6EB',
    cDark: '#5B7891',
    cGlow: '#80D4FF',
    inclusion: 'moon-sheen',
    swatchColor: '#B9D6EB'
  },
  roseQuartz: {
    id: 'roseQuartz',
    name: 'Thạch Anh Hồng Madagascar',
    element: 'Hỏa',
    basePricePerBead: 72000,
    cLight: '#FFEBF0',
    cMid: '#E3869B',
    cDark: '#7D3244',
    cGlow: '#FFB8C9',
    inclusion: 'jade-cloud',
    swatchColor: '#E3869B'
  },
  agarwoodRed: {
    id: 'agarwoodRed',
    name: 'Trầm Hương Tốc Kiến',
    element: 'Mộc',
    basePricePerBead: 98000,
    cLight: '#BA8C63',
    cMid: '#6E4726',
    cDark: '#2E1A0B',
    cGlow: '#D4A373',
    inclusion: 'wood-grain',
    swatchColor: '#6E4726'
  },
  lapisLazuli: {
    id: 'lapisLazuli',
    name: 'Đá Lapis Lazuli Thanh Kim',
    element: 'Thủy',
    basePricePerBead: 88000,
    cLight: '#78A6FF',
    cMid: '#1C4496',
    cDark: '#0A1B47',
    cGlow: '#E8C56B',
    inclusion: 'lapis-gold',
    swatchColor: '#1C4496'
  },
  nephriteJade: {
    id: 'nephriteJade',
    name: 'Ngọc Bích Nephrite Tuyển Chọn',
    element: 'Mộc',
    basePricePerBead: 125000,
    cLight: '#9CE0B8',
    cMid: '#236B46',
    cDark: '#0B2B1A',
    cGlow: '#6BC492',
    inclusion: 'jade-cloud',
    swatchColor: '#236B46'
  }
};

window.STONE_PALETTES = STONE_PALETTES;

/**
 * Generates a rich, multi-layered gemstone bracelet SVG (used for cart thumbnails & fallback)
 */
function renderBraceletSVG({
  stoneKey = 'rutileGold',
  beadCount = 17,
  beadMm = 10,
  charmType = 'tyhuu',
  uid = 'br'
}) {
  const stone = STONE_PALETTES[stoneKey] || STONE_PALETTES.rutileGold;
  const gradId = `stoneGrad_${uid}_${stoneKey}`;
  const glowId = `glowGrad_${uid}_${stoneKey}`;
  const goldId = `goldCharm_${uid}`;

  const cx = 150;
  const cy = 150;
  const ringRadius = 82 + (beadMm - 8) * 1.4;
  // Exact tangent radius so every bead kisses its neighbor snugly
  const beadRadius = Math.min(25, ringRadius * Math.sin(Math.PI / beadCount) * 0.99);

  let beadsMarkup = '';

  for (let i = 0; i < beadCount; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / beadCount;
    const bx = cx + ringRadius * Math.cos(angle);
    const by = cy + ringRadius * Math.sin(angle);

    if (i === 0 && charmType !== 'none') {
      continue;
    }

    let inclusionLines = '';
    if (
      stone.inclusion === 'rutile-gold' ||
      stone.inclusion === 'rutile-red' ||
      stone.inclusion === 'rutile-black'
    ) {
      const needleColor =
        stone.inclusion === 'rutile-gold'
          ? '#FFE48C'
          : stone.inclusion === 'rutile-red'
          ? '#FF9E8E'
          : '#14181D';
      inclusionLines = `
        <g opacity="0.82" transform="rotate(${(i * 43) % 360} ${bx.toFixed(1)} ${by.toFixed(1)})">
          <line x1="${(bx - beadRadius * 0.62).toFixed(1)}" y1="${(by - beadRadius * 0.28).toFixed(1)}" x2="${(bx + beadRadius * 0.64).toFixed(1)}" y2="${(by + beadRadius * 0.24).toFixed(1)}" stroke="${needleColor}" stroke-width="1.15" stroke-linecap="round"/>
          <line x1="${(bx - beadRadius * 0.52).toFixed(1)}" y1="${(by - beadRadius * 0.08).toFixed(1)}" x2="${(bx + beadRadius * 0.58).toFixed(1)}" y2="${(by + beadRadius * 0.42).toFixed(1)}" stroke="${needleColor}" stroke-width="0.85" stroke-linecap="round"/>
          <line x1="${(bx - beadRadius * 0.44).toFixed(1)}" y1="${(by + beadRadius * 0.46).toFixed(1)}" x2="${(bx + beadRadius * 0.52).toFixed(1)}" y2="${(by - beadRadius * 0.42).toFixed(1)}" stroke="${needleColor}" stroke-width="0.95" stroke-linecap="round"/>
          <line x1="${(bx - beadRadius * 0.22).toFixed(1)}" y1="${(by - beadRadius * 0.64).toFixed(1)}" x2="${(bx + beadRadius * 0.48).toFixed(1)}" y2="${(by + beadRadius * 0.54).toFixed(1)}" stroke="${needleColor}" stroke-width="1.05" stroke-linecap="round"/>
          <line x1="${(bx - beadRadius * 0.58).toFixed(1)}" y1="${(by + beadRadius * 0.18).toFixed(1)}" x2="${(bx + beadRadius * 0.46).toFixed(1)}" y2="${(by - beadRadius * 0.16).toFixed(1)}" stroke="#FFF8DC" stroke-width="0.7" opacity="0.75" stroke-linecap="round"/>
        </g>
      `;
    } else if (stone.inclusion === 'tigereye') {
      inclusionLines = `
        <path d="M ${(bx - beadRadius * 0.68).toFixed(1)} ${(by - beadRadius * 0.22).toFixed(1)} Q ${bx.toFixed(1)} ${(by + beadRadius * 0.28).toFixed(1)} ${(bx + beadRadius * 0.68).toFixed(1)} ${(by - beadRadius * 0.16).toFixed(1)}" stroke="#FFE4A3" stroke-width="2.8" fill="none" opacity="0.62" stroke-linecap="round"/>
      `;
    } else if (stone.inclusion === 'lapis-gold') {
      inclusionLines = `
        <circle cx="${(bx - beadRadius * 0.25).toFixed(1)}" cy="${(by + beadRadius * 0.2).toFixed(1)}" r="1.2" fill="#F5D77F" opacity="0.88"/>
        <circle cx="${(bx + beadRadius * 0.3).toFixed(1)}" cy="${(by - beadRadius * 0.15).toFixed(1)}" r="1.0" fill="#F5D77F" opacity="0.78"/>
      `;
    } else if (stone.inclusion === 'wood-grain') {
      inclusionLines = `
        <path d="M ${(bx - beadRadius * 0.62).toFixed(1)} ${(by - beadRadius * 0.16).toFixed(1)} Q ${bx.toFixed(1)} ${(by - beadRadius * 0.36).toFixed(1)} ${(bx + beadRadius * 0.62).toFixed(1)} ${(by - beadRadius * 0.1).toFixed(1)}" stroke="#1F1004" stroke-width="1.15" fill="none" opacity="0.52"/>
        <path d="M ${(bx - beadRadius * 0.56).toFixed(1)} ${(by + beadRadius * 0.22).toFixed(1)} Q ${bx.toFixed(1)} ${(by + beadRadius * 0.05).toFixed(1)} ${(bx + beadRadius * 0.58).toFixed(1)}" stroke="#1F1004" stroke-width="1.0" fill="none" opacity="0.45"/>
      `;
    } else if (stone.inclusion === 'jade-cloud' || stone.inclusion === 'ice-vein') {
      inclusionLines = `
        <path d="M ${(bx - beadRadius * 0.44).toFixed(1)} ${(by + beadRadius * 0.16).toFixed(1)} Q ${bx.toFixed(1)} ${(by - beadRadius * 0.24).toFixed(1)} ${(bx + beadRadius * 0.46).toFixed(1)} ${(by + beadRadius * 0.12).toFixed(1)}" stroke="#FFFFFF" stroke-width="1.9" fill="none" opacity="0.26" stroke-linecap="round"/>
      `;
    }

    beadsMarkup += `
      <g class="svg-bead" filter="url(#shadow_${uid})">
        <circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${beadRadius.toFixed(1)}" fill="url(#${gradId})" />
        <circle cx="${(bx + beadRadius * 0.22).toFixed(1)}" cy="${(by + beadRadius * 0.24).toFixed(1)}" r="${(beadRadius * 0.64).toFixed(1)}" fill="url(#${glowId})" opacity="0.58" />
        ${inclusionLines}
        <circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${(beadRadius - 0.4).toFixed(1)}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="0.65" />
        <path d="M ${(bx - beadRadius * 0.56).toFixed(1)} ${(by - beadRadius * 0.22).toFixed(1)} A ${(beadRadius * 0.68).toFixed(1)} ${(beadRadius * 0.68).toFixed(1)} 0 0 1 ${(bx - beadRadius * 0.12).toFixed(1)} ${(by - beadRadius * 0.62).toFixed(1)}" stroke="#FFFFFF" stroke-width="${(beadRadius * 0.15).toFixed(1)}" stroke-linecap="round" fill="none" opacity="0.72" />
      </g>
    `;
  }

  const topX = cx;
  const topY = cy - ringRadius;
  let charmMarkup = '';

  if (charmType === 'tyhuu') {
    charmMarkup = `
      <g transform="translate(${topX}, ${topY})" filter="url(#shadow_${uid})">
        <ellipse cx="${(-beadRadius * 0.92).toFixed(1)}" cy="1" rx="3.2" ry="${(beadRadius * 0.46).toFixed(1)}" fill="url(#${goldId})" />
        <ellipse cx="${(beadRadius * 0.92).toFixed(1)}" cy="1" rx="3.2" ry="${(beadRadius * 0.46).toFixed(1)}" fill="url(#${goldId})" />
        <rect x="${(-beadRadius * 0.78).toFixed(1)}" y="${(-beadRadius * 0.56).toFixed(1)}" width="${(beadRadius * 1.56).toFixed(1)}" height="${(beadRadius * 1.12).toFixed(1)}" rx="${(beadRadius * 0.52).toFixed(1)}" fill="url(#${goldId})" stroke="#5C3D0C" stroke-width="0.8" />
        <rect x="${(-beadRadius * 0.26).toFixed(1)}" y="${(-beadRadius * 0.54).toFixed(1)}" width="${(beadRadius * 0.52).toFixed(1)}" height="${(beadRadius * 1.08).toFixed(1)}" rx="2" fill="url(#${gradId})" />
      </g>
    `;
  } else if (charmType === 'lotus') {
    charmMarkup = `
      <g transform="translate(${topX}, ${topY})" filter="url(#shadow_${uid})">
        <circle cx="${(-beadRadius * 0.88).toFixed(1)}" cy="1" r="3.8" fill="url(#${goldId})" />
        <circle cx="${(beadRadius * 0.88).toFixed(1)}" cy="1" r="3.8" fill="url(#${goldId})" />
        <circle cx="0" cy="0" r="${(beadRadius * 0.68).toFixed(1)}" fill="url(#${goldId})" />
        <circle cx="0" cy="0" r="${(beadRadius * 0.36).toFixed(1)}" fill="#FFF6D6" opacity="0.85" />
      </g>
    `;
  } else if (charmType === 'luthong') {
    charmMarkup = `
      <g transform="translate(${topX}, ${topY})" filter="url(#shadow_${uid})">
        <ellipse cx="${(-beadRadius * 0.88).toFixed(1)}" cy="1" rx="3" ry="${(beadRadius * 0.45).toFixed(1)}" fill="url(#${goldId})" />
        <ellipse cx="${(beadRadius * 0.88).toFixed(1)}" cy="1" rx="3" ry="${(beadRadius * 0.45).toFixed(1)}" fill="url(#${goldId})" />
        <rect x="${(-beadRadius * 0.76).toFixed(1)}" y="${(-beadRadius * 0.54).toFixed(1)}" width="${(beadRadius * 1.52).toFixed(1)}" height="${(beadRadius * 1.08).toFixed(1)}" rx="${(beadRadius * 0.5).toFixed(1)}" fill="url(#${gradId})" stroke="url(#${goldId})" stroke-width="1.8" />
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${stone.name}">
      <defs>
        <filter id="shadow_${uid}" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="5" stdDeviation="4.5" flood-color="#040806" flood-opacity="0.52" />
        </filter>
        <radialGradient id="${gradId}" cx="30%" cy="26%" r="72%">
          <stop offset="0%" stop-color="${stone.cLight}" />
          <stop offset="48%" stop-color="${stone.cMid}" />
          <stop offset="100%" stop-color="${stone.cDark}" />
        </radialGradient>
        <radialGradient id="${glowId}" cx="55%" cy="55%" r="48%">
          <stop offset="0%" stop-color="${stone.cGlow}" />
          <stop offset="100%" stop-color="${stone.cMid}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="${goldId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF0BC" />
          <stop offset="48%" stop-color="#D4A646" />
          <stop offset="100%" stop-color="#6E470E" />
        </linearGradient>
      </defs>

      <circle cx="${cx}" cy="${cy}" r="${ringRadius}" fill="none" stroke="#9A7836" stroke-width="2" opacity="0.55" />

      ${beadsMarkup}
      ${charmMarkup}
    </svg>
  `;
}

// ---------------------------------------------------------------------------
// 2. PRODUCT CATALOG DATASET (12 AUTHENTIC VIETNAMESE FENG SHUI BRACELETS)
// ---------------------------------------------------------------------------
const PRODUCTS = [
  {
    id: 'sp-01',
    name: 'Vòng Thạch Anh Tóc Vàng 6A Đồng Trục Kim Quang Phối Tỳ Hưu',
    category: 'Thạch Anh Tóc',
    stoneKey: 'rutileGold',
    charmType: 'tyhuu',
    price: 2850000,
    oldPrice: 3400000,
    rating: 5.0,
    reviews: 142,
    certId: 'LIULAB-98241',
    origin: 'Brazil',
    grade: '6A VIP Đồng Trục',
    beadMm: 10,
    beadCount: 17,
    elements: ['Kim', 'Thổ'],
    tuongSinhFor: 'Thủy',
    tuongHopFor: 'Kim',
    purposes: ['Tài lộc', 'Sự nghiệp'],
    shortBenefit: 'Chiêu tài lộc cực đại, củng cố bản lĩnh quyết đoán và thu hút vận may kinh doanh.',
    description:
      'Tuyển chọn từ những tinh thể Thạch Anh Tóc Vàng Brazil có mật độ sợi Rutile dày đặc, ánh kim rực rỡ dưới nắng. Phối cùng Tỳ Hưu Thiên Lộc chế tác tinh xảo giúp chiêu tài giữ lộc cho gia chủ.',
    energyScores: { taiLoc: 99, binhAn: 88, tinhDuyen: 82, sucKhoe: 90 }
  },
  {
    id: 'sp-02',
    name: 'Vòng Ngọc Phỉ Thúy Băng Chủng Tự Nhiên Charm Liên Hoa',
    category: 'Ngọc Quý',
    stoneKey: 'imperialJade',
    charmType: 'lotus',
    price: 3650000,
    oldPrice: 4200000,
    rating: 4.9,
    reviews: 98,
    certId: 'PNJ-77319',
    origin: 'Myanmar (Miến Điện)',
    grade: 'Ngọc A Tự Nhiên',
    beadMm: 9,
    beadCount: 18,
    elements: ['Mộc', 'Hỏa'],
    tuongSinhFor: 'Hỏa',
    tuongHopFor: 'Mộc',
    purposes: ['Bình an', 'Tài lộc'],
    shortBenefit: 'Dưỡng tâm an thần, cân bằng sinh khí, mang lại vẻ đẹp thanh cao và phúc trạch lâu dài.',
    description:
      'Ngọc Phỉ Thúy (Jadeite) chuẩn Type A thiên nhiên 100% từ Myanmar với chất ngọc trong mướt, lên nước bóng mượt khi đeo lâu ngày.',
    energyScores: { taiLoc: 92, binhAn: 99, tinhDuyen: 90, sucKhoe: 98 }
  },
  {
    id: 'sp-03',
    name: 'Vòng Đá Aquamarine Lam Ngọc Biển Sâu Phối Lu Thống',
    category: 'Đá Bán Quý',
    stoneKey: 'aquamarine',
    charmType: 'luthong',
    price: 2150000,
    oldPrice: 2550000,
    rating: 4.9,
    reviews: 116,
    certId: 'LIULAB-66402',
    origin: 'Brazil',
    grade: '5A Trong Mướt',
    beadMm: 10,
    beadCount: 17,
    elements: ['Thủy', 'Mộc'],
    tuongSinhFor: 'Mộc',
    tuongHopFor: 'Thủy',
    purposes: ['Sự nghiệp', 'Bình an'],
    shortBenefit: 'Tăng khả năng giao tiếp thuyết phục, làm dịu căng thẳng và mang lại bình an khi di chuyển.',
    description:
      'Mang sắc xanh thanh khiết của đại dương, viên đá giúp khai thông luân xa cổ họng, phù hợp cho người làm kinh doanh, đàm phán và ngoại giao.',
    energyScores: { taiLoc: 89, binhAn: 96, tinhDuyen: 88, sucKhoe: 92 }
  },
  {
    id: 'sp-04',
    name: 'Vòng Thạch Anh Tóc Đỏ Chu Sa 5A Charm Liên Hoa Vàng',
    category: 'Thạch Anh Tóc',
    stoneKey: 'rutileRed',
    charmType: 'lotus',
    price: 2490000,
    oldPrice: 2950000,
    rating: 5.0,
    reviews: 87,
    certId: 'LIULAB-51908',
    origin: 'Brazil',
    grade: '5A Tóc Mịn Đều',
    beadMm: 9,
    beadCount: 17,
    elements: ['Hỏa', 'Thổ'],
    tuongSinhFor: 'Thổ',
    tuongHopFor: 'Hỏa',
    purposes: ['Tình duyên', 'Tài lộc'],
    shortBenefit: 'Tăng cường khí huyết, thu hút nhân duyên tốt đẹp và khơi dậy nguồn năng lượng nhiệt huyết.',
    description:
      'Sợi tóc đỏ đồng ánh kim bên trong tinh thể thạch anh giúp lưu thông khí huyết, tôn vinh khí chất quyến rũ và thu hút quý nhân cho người mệnh Hỏa, mệnh Thổ.',
    energyScores: { taiLoc: 93, binhAn: 89, tinhDuyen: 98, sucKhoe: 94 }
  },
  {
    id: 'sp-05',
    name: 'Vòng Đá Mắt Hổ Vàng Tâm Hổ VIP Phối Tỳ Hưu Chiêu Tài',
    category: 'Đá Mắt Hổ & Trầm',
    stoneKey: 'tigerEyeGold',
    charmType: 'tyhuu',
    price: 1290000,
    oldPrice: 1650000,
    rating: 4.8,
    reviews: 215,
    certId: 'PNJ-33910',
    origin: 'Nam Phi',
    grade: 'VIP Ánh Lụa Sắc Nét',
    beadMm: 12,
    beadCount: 17,
    elements: ['Thổ', 'Kim'],
    tuongSinhFor: 'Kim',
    tuongHopFor: 'Thổ',
    purposes: ['Tài lộc', 'Sự nghiệp'],
    shortBenefit: 'Tăng sự tự tin, dũng khí vượt thử thách, trừ tà khí và giữ vững tài sản.',
    description:
      'Đá Mắt Hổ Vàng Tâm Nam Phi với hiệu ứng ánh lụa chạy sống động trên từng viên đá, biểu tượng của quyền uy và bản lĩnh vững vàng.',
    energyScores: { taiLoc: 95, binhAn: 93, tinhDuyen: 80, sucKhoe: 90 }
  },
  {
    id: 'sp-06',
    name: 'Vòng Thạch Anh Tóc Đen Huyền Vũ Phẩm Cấp 6A Nguyên Bản',
    category: 'Thạch Anh Tóc',
    stoneKey: 'rutileBlack',
    charmType: 'none',
    price: 2350000,
    oldPrice: 2800000,
    rating: 4.9,
    reviews: 74,
    certId: 'LIULAB-81204',
    origin: 'Brazil',
    grade: '6A Nước Trong Tóc Đậm',
    beadMm: 10,
    beadCount: 17,
    elements: ['Thủy', 'Mộc'],
    tuongSinhFor: 'Mộc',
    tuongHopFor: 'Thủy',
    purposes: ['Bình an', 'Sự nghiệp'],
    shortBenefit: 'Hóa giải tiểu nhân thị phi, bảo vệ trường năng lượng và mang lại sự minh mẫn.',
    description:
      'Chứa các tinh thể Tourmaline đen hình kim đan xen trong nền thạch anh trắng trong suốt, tạo nên lá chắn phong thủy mạnh mẽ.',
    energyScores: { taiLoc: 88, binhAn: 99, tinhDuyen: 82, sucKhoe: 95 }
  },
  {
    id: 'sp-07',
    name: 'Vòng Thạch Anh Tím Amethyst Uruguay Charm Hoa Sen',
    category: 'Đá Bán Quý',
    stoneKey: 'amethyst',
    charmType: 'lotus',
    price: 1680000,
    oldPrice: 1990000,
    rating: 4.9,
    reviews: 109,
    certId: 'PNJ-44821',
    origin: 'Uruguay',
    grade: '5A Tím Đậm Tự Nhiên',
    beadMm: 10,
    beadCount: 17,
    elements: ['Hỏa', 'Thổ'],
    tuongSinhFor: 'Thổ',
    tuongHopFor: 'Hỏa',
    purposes: ['Sự nghiệp', 'Bình an'],
    shortBenefit: 'Khai mở trí tuệ, cải thiện giấc ngủ sâu và thu hút quý nhân nâng đỡ công danh.',
    description:
      'Thạch Anh Tím Uruguay nổi tiếng với sắc độ trầm sâu, tần số năng lượng cao giúp tĩnh tâm, tập trung trí lực và an giấc.',
    energyScores: { taiLoc: 87, binhAn: 97, tinhDuyen: 91, sucKhoe: 96 }
  },
  {
    id: 'sp-08',
    name: 'Vòng Đá Mặt Trăng Moonstone Ánh Xanh Cầu Vồng 5A',
    category: 'Đá Bán Quý',
    stoneKey: 'moonstone',
    charmType: 'lotus',
    price: 1950000,
    oldPrice: 2350000,
    rating: 5.0,
    reviews: 92,
    certId: 'LIULAB-70312',
    origin: 'Sri Lanka',
    grade: '5A Xà Cừ Xanh Lam',
    beadMm: 8,
    beadCount: 21,
    elements: ['Kim', 'Thủy'],
    tuongSinhFor: 'Thủy',
    tuongHopFor: 'Kim',
    purposes: ['Tình duyên', 'Bình an'],
    shortBenefit: 'Gắn kết tình cảm đôi lứa, cân bằng cảm xúc dịu dàng và đánh thức trực giác nhạy bén.',
    description:
      'Mỗi viên Moonstone ẩn chứa ánh xà cừ xanh lam tựa ánh trăng phản chiếu mặt hồ, là viên đá hộ mệnh của tình cảm viên mãn.',
    energyScores: { taiLoc: 85, binhAn: 95, tinhDuyen: 99, sucKhoe: 91 }
  },
  {
    id: 'sp-09',
    name: 'Vòng Trầm Hương Tốc Kiến Tự Nhiên Phối Lu Thống Ngọc',
    category: 'Đá Mắt Hổ & Trầm',
    stoneKey: 'agarwoodRed',
    charmType: 'luthong',
    price: 2250000,
    oldPrice: 2700000,
    rating: 4.9,
    reviews: 134,
    certId: 'LIULAB-59011',
    origin: 'Khánh Hòa, Việt Nam',
    grade: 'Trầm Tốc Tự Nhiên 14 Năm',
    beadMm: 10,
    beadCount: 17,
    elements: ['Mộc', 'Hỏa', 'Thổ'],
    tuongSinhFor: 'Hỏa',
    tuongHopFor: 'Mộc',
    purposes: ['Bình an', 'Tài lộc'],
    shortBenefit: 'Hương trầm dịu ngọt định tâm, xua tan uế khí, kích hoạt tài vận hanh thông.',
    description:
      'Chế tác từ phôi Trầm Hương Tốc Kiến tự nhiên rừng Khánh Hòa, vân dầu rõ nét, tỏa hương thơm thanh ngọt tự nhiên theo thân nhiệt người đeo.',
    energyScores: { taiLoc: 94, binhAn: 99, tinhDuyen: 87, sucKhoe: 97 }
  },
  {
    id: 'sp-10',
    name: 'Vòng Thạch Anh Hồng Madagascar Ánh Sao Charm Liên Hoa',
    category: 'Đá Bán Quý',
    stoneKey: 'roseQuartz',
    charmType: 'lotus',
    price: 1450000,
    oldPrice: 1790000,
    rating: 4.8,
    reviews: 128,
    certId: 'PNJ-29405',
    origin: 'Madagascar',
    grade: '5A Hồng Phấn Trong',
    beadMm: 9,
    beadCount: 18,
    elements: ['Hỏa', 'Thổ'],
    tuongSinhFor: 'Thổ',
    tuongHopFor: 'Hỏa',
    purposes: ['Tình duyên', 'Bình an'],
    shortBenefit: 'Thu hút nhân duyên tốt lành, hóa giải mâu thuẫn gia đạo và mở rộng mối quan hệ khách hàng.',
    description:
      'Thạch Anh Hồng vùng Madagascar có độ trong suốt và sắc hồng phấn dịu dàng, nuôi dưỡng sự gắn kết và mang lại thiện cảm từ người đối diện.',
    energyScores: { taiLoc: 86, binhAn: 93, tinhDuyen: 99, sucKhoe: 90 }
  },
  {
    id: 'sp-11',
    name: 'Vòng Đá Lapis Lazuli Thanh Kim Hoàng Gia Phối Tỳ Hưu',
    category: 'Đá Bán Quý',
    stoneKey: 'lapisLazuli',
    charmType: 'tyhuu',
    price: 1890000,
    oldPrice: 2250000,
    rating: 4.9,
    reviews: 63,
    certId: 'LIULAB-61982',
    origin: 'Afghanistan',
    grade: '5A Điểm Vẩy Vàng Pyrite',
    beadMm: 10,
    beadCount: 17,
    elements: ['Thủy', 'Mộc'],
    tuongSinhFor: 'Mộc',
    tuongHopFor: 'Thủy',
    purposes: ['Sự nghiệp', 'Tài lộc'],
    shortBenefit: 'Tôn vinh trí tuệ minh triết, thăng tiến quyền lực và thu hút vượng khí tài chính.',
    description:
      'Sắc xanh lam thẫm điểm xuyết những hạt Pyrite lấp lánh như bầu trời đêm. Thanh Kim Thạch từ lâu là biểu tượng của sự minh triết.',
    energyScores: { taiLoc: 93, binhAn: 94, tinhDuyen: 85, sucKhoe: 91 }
  },
  {
    id: 'sp-12',
    name: 'Vòng Ngọc Bích Nephrite Tuyển Chọn Nguyên Khối 10 Ly',
    category: 'Ngọc Quý',
    stoneKey: 'nephriteJade',
    charmType: 'none',
    price: 3150000,
    oldPrice: 3750000,
    rating: 5.0,
    reviews: 81,
    certId: 'PNJ-88512',
    origin: 'Canada',
    grade: '6A Xanh Lục Bảo Đồng Đều',
    beadMm: 10,
    beadCount: 17,
    elements: ['Mộc', 'Hỏa'],
    tuongSinhFor: 'Hỏa',
    tuongHopFor: 'Mộc',
    purposes: ['Bình an', 'Tài lộc'],
    shortBenefit: 'Tăng cường sinh lực, hộ mệnh bình an và tích tụ phúc khí thịnh vượng cho gia tộc.',
    description:
      'Ngọc Bích Nephrite tự nhiên có độ dai kết cấu cao nhất trong các loài ngọc, sắc xanh lục ấm áp, bóng mịn như lụa, thích hợp làm vật phẩm truyền đời.',
    energyScores: { taiLoc: 95, binhAn: 99, tinhDuyen: 89, sucKhoe: 99 }
  }
];

// ---------------------------------------------------------------------------
// 3. ACCURATE VIETNAMESE CAN CHI & NGŨ HÀNH NẠP ÂM ENGINE
// ---------------------------------------------------------------------------
const THIEN_CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
const DIA_CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];

const NAP_AM_TABLE = [
  { element: 'Kim', name: 'Hải Trung Kim (Vàng trong biển)' },
  { element: 'Hỏa', name: 'Lô Trung Hỏa (Lửa trong lò)' },
  { element: 'Mộc', name: 'Đại Lâm Mộc (Gỗ rừng già)' },
  { element: 'Thổ', name: 'Lộ Bàng Thổ (Đất ven đường)' },
  { element: 'Kim', name: 'Kiếm Phong Kim (Vàng mũi kiếm)' },
  { element: 'Hỏa', name: 'Sơn Đầu Hỏa (Lửa trên núi)' },
  { element: 'Thủy', name: 'Giản Hạ Thủy (Nước dưới khe)' },
  { element: 'Thổ', name: 'Thành Đầu Thổ (Đất tường thành)' },
  { element: 'Kim', name: 'Bạch Lạp Kim (Vàng chân đèn)' },
  { element: 'Mộc', name: 'Dương Liễu Mộc (Gỗ cây dương)' },
  { element: 'Thủy', name: 'Tuyền Trung Thủy (Nước trong suối)' },
  { element: 'Thổ', name: 'Ốc Thượng Thổ (Đất mái nhà)' },
  { element: 'Hỏa', name: 'Tích Lịch Hỏa (Lửa sấm sét)' },
  { element: 'Mộc', name: 'Tùng Bách Mộc (Gỗ tùng bách)' },
  { element: 'Thủy', name: 'Trường Lưu Thủy (Nước chảy mạnh)' },
  { element: 'Kim', name: 'Sa Trung Kim (Vàng trong cát)' },
  { element: 'Hỏa', name: 'Sơn Hạ Hỏa (Lửa dưới chân núi)' },
  { element: 'Mộc', name: 'Bình Địa Mộc (Gỗ đồng bằng)' },
  { element: 'Thổ', name: 'Bích Thượng Thổ (Đất trên vách)' },
  { element: 'Kim', name: 'Kim Bạch Kim (Vàng pha bạc)' },
  { element: 'Hỏa', name: 'Phú Đăng Hỏa (Lửa đèn chụp)' },
  { element: 'Thủy', name: 'Thiên Hà Thủy (Nước trên trời)' },
  { element: 'Thổ', name: 'Đại Trạch Thổ (Đất nền nhà)' },
  { element: 'Kim', name: 'Thoa Xuyến Kim (Vàng trang sức)' },
  { element: 'Mộc', name: 'Tang Đố Mộc (Gỗ cây dâu)' },
  { element: 'Thủy', name: 'Đại Khê Thủy (Nước khe lớn)' },
  { element: 'Thổ', name: 'Sa Trung Thổ (Đất pha cát)' },
  { element: 'Hỏa', name: 'Thiên Thượng Hỏa (Lửa trên trời)' },
  { element: 'Mộc', name: 'Thạch Lựu Mộc (Gỗ cây lựu đá)' },
  { element: 'Thủy', name: 'Đại Hải Thủy (Nước biển lớn)' }
];

const ELEMENT_RELATIONS = {
  Kim: {
    tuongSinhElement: 'Thổ',
    tuongSinhLabel: 'Hành Thổ (Thổ sinh Kim · Đại Cát)',
    tuongSinhColors: [
      { name: 'Vàng Nâu', hex: '#B88938' },
      { name: 'Hổ Phách', hex: '#D49B35' }
    ],
    banMenhLabel: 'Hành Kim (Tương Hợp Bản Mệnh)',
    banMenhColors: [
      { name: 'Trắng Ánh Kim', hex: '#EAE6DF' },
      { name: 'Vàng Kim', hex: '#F2C94C' }
    ],
    khacLabel: 'Nên hạn chế màu Đỏ, Hồng, Tím (Hỏa khắc Kim)',
    recommendedStones: 'Thạch Anh Tóc Vàng, Đá Mắt Hổ Vàng Nâu, Đá Mặt Trăng Moonstone'
  },
  Mộc: {
    tuongSinhElement: 'Thủy',
    tuongSinhLabel: 'Hành Thủy (Thủy sinh Mộc · Đại Cát)',
    tuongSinhColors: [
      { name: 'Xanh Lam Biển', hex: '#2D88C4' },
      { name: 'Đen Huyền', hex: '#222831' }
    ],
    banMenhLabel: 'Hành Mộc (Tương Hợp Bản Mệnh)',
    banMenhColors: [
      { name: 'Xanh Ngọc Phỉ Thúy', hex: '#1C8C5E' },
      { name: 'Nâu Gỗ Trầm', hex: '#6E4726' }
    ],
    khacLabel: 'Nên hạn chế màu Trắng, Ánh Bạc (Kim khắc Mộc)',
    recommendedStones: 'Ngọc Phỉ Thúy, Ngọc Bích Nephrite, Đá Aquamarine, Thạch Anh Tóc Đen'
  },
  Thủy: {
    tuongSinhElement: 'Kim',
    tuongSinhLabel: 'Hành Kim (Kim sinh Thủy · Đại Cát)',
    tuongSinhColors: [
      { name: 'Trắng Xà Cừ', hex: '#F0F4F8' },
      { name: 'Vàng Ánh Kim', hex: '#DFAC42' }
    ],
    banMenhLabel: 'Hành Thủy (Tương Hợp Bản Mệnh)',
    banMenhColors: [
      { name: 'Xanh Aquamarine', hex: '#3694C7' },
      { name: 'Đen Huyền Vũ', hex: '#1E242B' },
      { name: 'Xanh Thanh Kim', hex: '#1C4496' }
    ],
    khacLabel: 'Nên hạn chế màu Nâu Đất, Vàng Sẫm (Thổ khắc Thủy)',
    recommendedStones: 'Đá Aquamarine, Thạch Anh Tóc Đen, Đá Mặt Trăng Moonstone, Thạch Anh Tóc Vàng'
  },
  Hỏa: {
    tuongSinhElement: 'Mộc',
    tuongSinhLabel: 'Hành Mộc (Mộc sinh Hỏa · Đại Cát)',
    tuongSinhColors: [
      { name: 'Xanh Ngọc Lục', hex: '#1C8C5E' },
      { name: 'Nâu Trầm Hương', hex: '#7A502E' }
    ],
    banMenhLabel: 'Hành Hỏa (Tương Hợp Bản Mệnh)',
    banMenhColors: [
      { name: 'Đỏ Chu Sa', hex: '#C84332' },
      { name: 'Hồng Đào', hex: '#E3869B' }
    ],
    khacLabel: 'Nên hạn chế màu Đen, Xanh Nước Biển (Thủy khắc Hỏa)',
    recommendedStones: 'Thạch Anh Tóc Đỏ, Ngọc Phỉ Thúy, Thạch Anh Tím, Thạch Anh Hồng'
  },
  Thổ: {
    tuongSinhElement: 'Hỏa',
    tuongSinhLabel: 'Hành Hỏa (Hỏa sinh Thổ · Đại Cát)',
    tuongSinhColors: [
      { name: 'Đỏ Chu Sa', hex: '#C84332' },
      { name: 'Hồng Phấn', hex: '#E3869B' }
    ],
    banMenhLabel: 'Hành Thổ (Tương Hợp Bản Mệnh)',
    banMenhColors: [
      { name: 'Vàng Nâu Mắt Hổ', hex: '#9E6324' },
      { name: 'Vàng Kim Thổ', hex: '#D4A03E' }
    ],
    khacLabel: 'Nên hạn chế màu Xanh Lục Đậm (Mộc khắc Thổ)',
    recommendedStones: 'Đá Mắt Hổ Vàng Nâu, Thạch Anh Tóc Vàng, Thạch Anh Tóc Đỏ, Thạch Anh Tím'
  }
};

function calculateFengShuiByYear(year, gender = 'female') {
  const y = parseInt(year, 10) || 1996;
  const can = THIEN_CAN[y % 10];
  const chi = DIA_CHI[y % 12];
  const canChi = `${can} ${chi}`;

  let offset = (y - 1984) % 60;
  if (offset < 0) offset += 60;
  const pairIndex = Math.floor(offset / 2);
  const napAm = NAP_AM_TABLE[pairIndex];
  const relation = ELEMENT_RELATIONS[napAm.element];

  return {
    year: y,
    canChi,
    genderLabel: gender === 'male' ? 'Nam Mệnh' : 'Nữ Mệnh',
    element: napAm.element,
    napAmName: napAm.name,
    relation
  };
}

// ---------------------------------------------------------------------------
// 4. APPLICATION STATE
// ---------------------------------------------------------------------------
const state = {
  activeElement: 'all',
  activeCategory: 'all',
  activePriceRange: 'all',
  activePurpose: 'all',
  searchQuery: '',
  sortBy: 'featured',
  userDestinyElement: null,
  wishlist: new Set(['sp-01', 'sp-02']),
  cart: [
    {
      cartItemId: 'init-1',
      productId: 'sp-01',
      name: 'Vòng Thạch Anh Tóc Vàng 6A Đồng Trục Kim Quang Phối Tỳ Hưu',
      stoneKey: 'rutileGold',
      charmType: 'tyhuu',
      beadMm: 10,
      beadCount: 17,
      wristCm: 16.0,
      price: 2850000,
      qty: 1
    }
  ],
  promoCode: null,
  promoDiscountPercent: 0,
  studio: {
    stoneKey: 'rutileGold',
    beadMm: 10,
    wristCm: 16.0,
    beadCount: 17,
    charmType: 'tyhuu',
    charmPrice: 450000,
    note: ''
  }
};

// ---------------------------------------------------------------------------
// 5. UTILITY FORMATTERS, NUMBER TWEENING, OVERLAY ENGINE & TOAST
// ---------------------------------------------------------------------------
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + '₫';
}

const currencyTweens = new WeakMap();

function animateCurrency(el, targetAmount, duration = 340) {
  if (!el) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prevState = currencyTweens.get(el);
  if (prevState && prevState.rafId) {
    cancelAnimationFrame(prevState.rafId);
  }

  const startAmount =
    prevState && typeof prevState.currentValue === 'number'
      ? prevState.currentValue
      : parseInt((el.textContent || '').replace(/[^\d]/g, ''), 10) || targetAmount;

  if (reducedMotion || startAmount === targetAmount) {
    el.textContent = formatVND(targetAmount);
    currencyTweens.set(el, { currentValue: targetAmount, rafId: null });
    return;
  }

  const startTime = performance.now();
  const diff = targetAmount - startAmount;

  function step(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 4);
    const val = startAmount + diff * eased;
    el.textContent = formatVND(val);

    if (progress < 1) {
      const rafId = requestAnimationFrame(step);
      currencyTweens.set(el, { currentValue: val, rafId });
    } else {
      el.textContent = formatVND(targetAmount);
      currencyTweens.set(el, { currentValue: targetAmount, rafId: null });
    }
  }

  const rafId = requestAnimationFrame(step);
  currencyTweens.set(el, { currentValue: startAmount, rafId });
}

function bumpBadge(el) {
  if (!el) return;
  el.classList.remove('is-bumping');
  void el.offsetWidth;
  el.classList.add('is-bumping');
  setTimeout(() => el.classList.remove('is-bumping'), 300);
}

const overlayCloseTimers = new WeakMap();

function syncBodyModalLock() {
  if (isOverlayOpen()) {
    document.body.classList.add('is-modal-open');
  } else {
    document.body.classList.remove('is-modal-open');
  }
}

function openOverlay(backdropEl) {
  if (!backdropEl) return;
  const pendingTimer = overlayCloseTimers.get(backdropEl);
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    overlayCloseTimers.delete(backdropEl);
  }
  backdropEl.hidden = false;
  syncBodyModalLock();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      backdropEl.classList.add('is-open');
    });
  });
}

function closeOverlay(backdropEl) {
  if (!backdropEl || backdropEl.hidden) return;
  backdropEl.classList.remove('is-open');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = reducedMotion ? 10 : 380;

  const prevTimer = overlayCloseTimers.get(backdropEl);
  if (prevTimer) clearTimeout(prevTimer);

  const timer = setTimeout(() => {
    backdropEl.hidden = true;
    overlayCloseTimers.delete(backdropEl);
    syncBodyModalLock();
  }, delay);

  overlayCloseTimers.set(backdropEl, timer);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

// ---------------------------------------------------------------------------
// 6. HERO SHOWCASE ROTATOR (SMOOTH CROSSFADE & POINTER FLOAT)
// ---------------------------------------------------------------------------
const HERO_SLIDES = [
  {
    stoneKey: 'rutileGold',
    charmType: 'tyhuu',
    element: 'Hợp mệnh Kim, Thổ',
    title: 'Thạch Anh Tóc Vàng Đồng Trục',
    sub: 'Hạt 10 ly tự nhiên Brazil, mật độ tóc dày ánh kim, phối charm Tỳ Hưu',
    price: 2850000
  },
  {
    stoneKey: 'imperialJade',
    charmType: 'lotus',
    element: 'Hợp mệnh Mộc, Hỏa',
    title: 'Ngọc Phỉ Thúy Băng Chủng Liên Hoa',
    sub: 'Ngọc tự nhiên Myanmar loại A chưa xử lý, chất ngọc trong mát dịu cổ tay',
    price: 3650000
  },
  {
    stoneKey: 'aquamarine',
    charmType: 'luthong',
    element: 'Hợp mệnh Thủy, Mộc',
    title: 'Đá Aquamarine Lam Ngọc Tự Nhiên',
    sub: 'Sắc xanh biển trong vắt, phối Lu Thống đá cùng phôi viền vàng',
    price: 2150000
  }
];

let currentHeroIndex = 0;
let heroSwitchTimer = null;

function renderHeroShowcase(index, animate = true) {
  const slide = HERO_SLIDES[index];
  const stageEl = document.getElementById('heroBraceletStage');
  const captionMain = document.querySelector('.stage-caption-main');
  const priceEl = document.getElementById('heroStagePrice');
  if (!stageEl) return;

  document.querySelectorAll('.stage-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const has3D = Boolean(window.Bracelet3DEngine);

  const applySlideContent = () => {
    if (has3D) {
      window.Bracelet3DEngine.mount(stageEl, {
        stoneKey: slide.stoneKey,
        beadCount: 17,
        beadMm: 10,
        charmType: slide.charmType,
        interactive: true,
        showHint: true,
        baseTiltX: -0.44,
        baseTiltY: 0.12
      });
    } else {
      stageEl.innerHTML = renderBraceletSVG({
        stoneKey: slide.stoneKey,
        beadCount: 17,
        beadMm: 10,
        charmType: slide.charmType,
        uid: `hero_${index}`
      });
    }
    document.getElementById('heroStageElement').textContent = slide.element;
    document.getElementById('heroStageTitle').textContent = slide.title;
    document.getElementById('heroStageSub').textContent = slide.sub;
    animateCurrency(priceEl, slide.price, 380);
  };

  if (!animate || reducedMotion) {
    applySlideContent();
    return;
  }

  if (heroSwitchTimer) clearTimeout(heroSwitchTimer);

  if (has3D) {
    // In 3D mode, morph the 3D bracelet immediately with natural bead wave while crossfading the caption
    window.Bracelet3DEngine.mount(stageEl, {
      stoneKey: slide.stoneKey,
      beadCount: 17,
      beadMm: 10,
      charmType: slide.charmType
    });
    captionMain?.classList.add('is-switching');
    heroSwitchTimer = setTimeout(() => {
      document.getElementById('heroStageElement').textContent = slide.element;
      document.getElementById('heroStageTitle').textContent = slide.title;
      document.getElementById('heroStageSub').textContent = slide.sub;
      animateCurrency(priceEl, slide.price, 380);
      requestAnimationFrame(() => {
        captionMain?.classList.remove('is-switching');
      });
    }, 160);
    return;
  }

  stageEl.classList.add('is-switching');
  captionMain?.classList.add('is-switching');

  heroSwitchTimer = setTimeout(() => {
    applySlideContent();
    requestAnimationFrame(() => {
      stageEl.classList.remove('is-switching');
      captionMain?.classList.remove('is-switching');
    });
  }, 190);
}

// ---------------------------------------------------------------------------
// 7. FENG SHUI BIRTH YEAR CALCULATOR UI
// ---------------------------------------------------------------------------
function updateFengShuiCalculatorUI(scrollToCatalog = false) {
  const yearInput = document.getElementById('birthYearInput');
  const genderSelect = document.getElementById('genderSelect');
  const wishSelect = document.getElementById('wishSelect');
  const panel = document.getElementById('calcResultPanel');

  const result = calculateFengShuiByYear(yearInput.value, genderSelect.value);
  const wishValue = wishSelect.value;

  const tuongSinhChips = result.relation.tuongSinhColors
    .map(
      (c) =>
        `<span class="color-chip"><span class="chip-swatch" style="background-color:${c.hex}"></span>${c.name}</span>`
    )
    .join('');

  const banMenhChips = result.relation.banMenhColors
    .map(
      (c) =>
        `<span class="color-chip"><span class="chip-swatch" style="background-color:${c.hex}"></span>${c.name}</span>`
    )
    .join('');

  const buildResultMarkup = () => {
    panel.innerHTML = `
      <div class="destiny-result-grid">
        <div class="destiny-badge-card">
          <div>
            <span class="destiny-year-tag num">Sinh năm ${result.year} (${result.canChi}) — ${result.genderLabel}</span>
            <h3 class="destiny-main-heading">Mệnh ${result.element}</h3>
            <div class="destiny-nap-am">Nạp âm: ${result.napAmName}</div>
            <p class="destiny-desc-text">
              Tuổi <strong>${result.canChi}</strong> hợp nhất với đá thuộc hành <strong>${result.relation.tuongSinhElement} (Tương Sinh)</strong> và hành <strong>${result.element} (Tương Hợp)</strong>, nên chọn vòng có số hạt lẻ rơi vào <strong>Cung Sinh (<span class="num">13, 17, 21</span> hạt)</strong>.
            </p>
          </div>
          <button type="button" class="btn btn-primary" id="applyDestinyFilterBtn">
            <span>Lọc các mẫu vòng hợp mệnh ${result.element}</span>
          </button>
        </div>

        <div class="destiny-details-card">
          <div class="harmony-box">
            <span class="harmony-label">Nhóm màu ưu tiên 1 (Tương Sinh)</span>
            <h4 class="harmony-title">${result.relation.tuongSinhLabel}</h4>
            <p class="harmony-copy">
              Nhóm màu tương sinh hỗ trợ tốt nhất cho người mệnh ${result.element} khi đeo hàng ngày.
            </p>
            <div class="color-dots-row">${tuongSinhChips}</div>
          </div>

          <div class="harmony-box">
            <span class="harmony-label">Nhóm màu ưu tiên 2 (Bản Mệnh)</span>
            <h4 class="harmony-title">${result.relation.banMenhLabel}</h4>
            <p class="harmony-copy">
              Nhóm màu đồng hành cùng bản mệnh, dễ phối trang phục và mang lại sự cân bằng.
            </p>
            <div class="color-dots-row">${banMenhChips}</div>
          </div>

          <div class="harmony-box">
            <span class="harmony-label">Gợi ý chọn đá tại xưởng</span>
            <h4 class="harmony-title">Dòng đá phù hợp</h4>
            <p class="harmony-copy">
              <strong>Nên chọn:</strong> ${result.relation.recommendedStones}.
            </p>
            <p class="harmony-note">
              ${result.relation.khacLabel}
            </p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('applyDestinyFilterBtn').addEventListener('click', () => {
      state.activeElement = result.element;
      state.userDestinyElement = result.element;
      state.activePurpose = wishValue;

      document.querySelectorAll('.element-pill').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.element === result.element);
      });

      const indicator = document.getElementById('activeDestinyIndicator');
      const indicatorText = document.getElementById('destinyTagText');
      indicator.hidden = false;
      indicatorText.textContent = `Tuổi ${result.canChi} (${result.year}) — Mệnh ${result.element}`;

      renderProductCatalog(true);
      smoothScrollToTarget(document.getElementById('bo-suu-tap'));
      showToast(`Đã lọc các mẫu vòng hợp tuổi ${result.canChi} (Mệnh ${result.element})`);
    });
  };

  if (scrollToCatalog) {
    panel.classList.add('is-updating');
    setTimeout(() => {
      buildResultMarkup();
      requestAnimationFrame(() => {
        panel.classList.remove('is-updating');
      });
    }, 150);
    showToast(`Kết quả tra cứu tuổi ${result.canChi} (${result.year}): Mệnh ${result.element}`);
  } else {
    buildResultMarkup();
  }
}

// ---------------------------------------------------------------------------
// 8. RENDER PRODUCT CATALOG & FILTERS
// ---------------------------------------------------------------------------
let filterTransitionTimer = null;

function renderProductCatalog(animateTransition = false) {
  const grid = document.getElementById('productGrid');
  const countLabel = document.getElementById('productResultCount');
  if (!grid) return;

  const filtered = PRODUCTS.filter((item) => {
    if (state.activeElement !== 'all') {
      if (!item.elements.includes(state.activeElement)) return false;
    }

    if (state.activeCategory !== 'all' && item.category !== state.activeCategory) {
      return false;
    }

    if (state.activePurpose !== 'all' && !item.purposes.includes(state.activePurpose)) {
      return false;
    }

    if (state.activePriceRange === 'under-1500' && item.price >= 1500000) return false;
    if (
      state.activePriceRange === '1500-3000' &&
      (item.price < 1500000 || item.price > 3000000)
    ) {
      return false;
    }
    if (state.activePriceRange === 'over-3000' && item.price <= 3000000) return false;

    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      const haystack = `${item.name} ${item.category} ${item.shortBenefit} ${item.elements.join(' ')} ${item.purposes.join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  filtered.sort((a, b) => {
    if (state.sortBy === 'price-asc') return a.price - b.price;
    if (state.sortBy === 'price-desc') return b.price - a.price;
    if (state.sortBy === 'rating') return b.rating - a.rating || b.reviews - a.reviews;
    if (state.activeElement !== 'all') {
      const aSinh = a.tuongSinhFor === state.activeElement ? 1 : 0;
      const bSinh = b.tuongSinhFor === state.activeElement ? 1 : 0;
      if (aSinh !== bSinh) return bSinh - aSinh;
    }
    return 0;
  });

  countLabel.textContent = `${filtered.length} mẫu vòng`;

  const commitMarkup = () => {
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 3.5rem 1.5rem; background-color: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
          <h3 style="font-family: var(--font-display); font-size: 1.45rem; font-weight: 600; line-height: 1.32; margin-bottom: 0.5rem;">Không có mẫu vòng nào khớp bộ lọc</h3>
          <p style="color: var(--muted); margin: 0 auto 1.25rem;">Bạn có thể mở rộng khoảng giá hoặc xem lại toàn bộ danh mục tại xưởng.</p>
          <button type="button" class="btn btn-secondary" id="resetAllFiltersBtn">Xem tất cả 12 mẫu vòng</button>
        </div>
      `;
      document.getElementById('resetAllFiltersBtn')?.addEventListener('click', resetFilters);
      return;
    }

    grid.innerHTML = filtered
      .map((product, index) => {
        const isLiked = state.wishlist.has(product.id);
        const targetEl =
          state.activeElement !== 'all' ? state.activeElement : state.userDestinyElement;

        let matchBadge = '';
        if (targetEl && product.elements.includes(targetEl)) {
          const isTuongSinh = product.tuongSinhFor === targetEl;
          matchBadge = `<span class="match-ribbon">${
            isTuongSinh ? `Tương Sinh mệnh ${targetEl}` : `Hợp mệnh ${targetEl}`
          }</span>`;
        }

        const svgHtml = renderBraceletSVG({
          stoneKey: product.stoneKey,
          beadCount: product.beadCount,
          beadMm: product.beadMm,
          charmType: product.charmType,
          uid: product.id
        });

        const delayMs = (index % 3) * 55;

        return `
          <article class="product-card reveal-on-scroll" style="--reveal-delay: ${delayMs}ms" data-id="${product.id}">
            <div class="card-visual" data-quickview="${product.id}">
              <div class="card-badges-top">
                <div class="badge-stack">
                  <span class="menh-pill">Mệnh ${product.elements.join(', ')}</span>
                  ${matchBadge}
                </div>
                <button type="button" class="wishlist-card-btn ${isLiked ? 'active' : ''}" data-wishlist="${product.id}" aria-label="Lưu sản phẩm">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              ${svgHtml}
            </div>

            <div class="card-body">
              <div class="card-meta-row num">
                <span>${product.category} — ${product.beadMm} ly (${product.beadCount} hạt)</span>
                <span>${product.origin}</span>
              </div>

              <h3 class="card-title" data-quickview="${product.id}">${product.name}</h3>

              <p class="card-benefit">${product.shortBenefit}</p>

              <div class="card-footer">
                <div class="price-block">
                  <span class="price-current num">${formatVND(product.price)}</span>
                  <span class="price-old num">${formatVND(product.oldPrice)}</span>
                </div>
                <div class="card-actions">
                  <button type="button" class="btn-quick-view" data-quickview="${product.id}">Xem 3D</button>
                  <button type="button" class="btn-add-cart" data-addcart="${product.id}">Chọn mua</button>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    // Mount real-time 3D WebGL gemstone bracelets onto every catalog card
    if (window.Bracelet3DEngine?.mountCard3D) {
      filtered.forEach((product) => {
        const cardVisualEl = grid.querySelector(
          `.product-card[data-id="${product.id}"] .card-visual`
        );
        if (cardVisualEl) {
          window.Bracelet3DEngine.mountCard3D(cardVisualEl, {
            stoneKey: product.stoneKey,
            beadCount: product.beadCount,
            beadMm: product.beadMm,
            charmType: product.charmType
          });
        }
      });
    }

    observeRevealElements(grid.querySelectorAll('.reveal-on-scroll'));
  };

  if (animateTransition) {
    if (filterTransitionTimer) clearTimeout(filterTransitionTimer);
    grid.classList.add('is-filtering');
    filterTransitionTimer = setTimeout(() => {
      commitMarkup();
      requestAnimationFrame(() => {
        grid.classList.remove('is-filtering');
      });
    }, 110);
  } else {
    commitMarkup();
  }
}

function resetFilters() {
  state.activeElement = 'all';
  state.activeCategory = 'all';
  state.activePriceRange = 'all';
  state.activePurpose = 'all';
  state.searchQuery = '';
  state.userDestinyElement = null;

  document.getElementById('categoryFilter').value = 'all';
  document.getElementById('priceFilter').value = 'all';
  document.getElementById('searchInput').value = '';
  document.getElementById('activeDestinyIndicator').hidden = true;

  document.querySelectorAll('.element-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.element === 'all');
  });

  renderProductCatalog(true);
}

// ---------------------------------------------------------------------------
// 9. INTERACTIVE 360° CUSTOM BRACELET STUDIO
// ---------------------------------------------------------------------------
const STUDIO_STONE_KEYS = [
  'rutileGold',
  'imperialJade',
  'aquamarine',
  'rutileRed',
  'tigerEyeGold',
  'moonstone'
];

function getSinhLaoBenhTuCycle(beadCount) {
  const mod = beadCount % 4;
  if (mod === 1) return { name: 'Sinh', good: true, label: 'Cung Sinh (Tốt)' };
  if (mod === 2) return { name: 'Lão', good: true, label: 'Cung Lão (Tốt)' };
  if (mod === 3) return { name: 'Bệnh', good: false, label: 'Cung Bệnh (Nên chỉnh lại)' };
  return { name: 'Tử', good: false, label: 'Cung Tử (Nên chỉnh về Cung Sinh)' };
}

function initCustomStudio() {
  const swatchContainer = document.getElementById('studioStoneSwatches');
  const studioStage = document.getElementById('studioSvgStage');
  if (!swatchContainer) return;

  swatchContainer.innerHTML = STUDIO_STONE_KEYS.map((key) => {
    const st = STONE_PALETTES[key];
    return `
      <button type="button" class="stone-swatch-btn ${
        state.studio.stoneKey === key ? 'active' : ''
      }" data-stone="${key}">
        <span class="swatch-ball" style="background-color: ${st.swatchColor}"></span>
        <span class="swatch-info">
          <strong>${st.name}</strong>
          <small class="num">Mệnh ${st.element} · ${formatVND(st.basePricePerBead)}/hạt</small>
        </span>
      </button>
    `;
  }).join('');

  swatchContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.stone-swatch-btn');
    if (!btn) return;
    state.studio.stoneKey = btn.dataset.stone;
    swatchContainer.querySelectorAll('.stone-swatch-btn').forEach((b) => {
      b.classList.toggle('active', b === btn);
    });
    updateCustomStudioPreview(true);
  });

  document.getElementById('studioBeadSizeGroup').addEventListener('click', (e) => {
    const btn = e.target.closest('.size-pill');
    if (!btn) return;
    state.studio.beadMm = parseInt(btn.dataset.mm, 10);
    document.querySelectorAll('#studioBeadSizeGroup .size-pill').forEach((b) => {
      b.classList.toggle('active', b === btn);
    });
    recalcBeadsFromWrist();
    updateCustomStudioPreview(true);
  });

  const wristSlider = document.getElementById('studioWristRange');
  wristSlider.addEventListener('input', () => {
    state.studio.wristCm = parseFloat(wristSlider.value);
    document.getElementById('wristValueDisplay').textContent = `${state.studio.wristCm.toFixed(1)} cm`;
    recalcBeadsFromWrist();
    updateCustomStudioPreview(false);
  });

  document.getElementById('decreaseBeadsBtn').addEventListener('click', () => {
    if (state.studio.beadCount > 12) {
      state.studio.beadCount -= 1;
      updateCustomStudioPreview(true);
    }
  });

  document.getElementById('increaseBeadsBtn').addEventListener('click', () => {
    if (state.studio.beadCount < 25) {
      state.studio.beadCount += 1;
      updateCustomStudioPreview(true);
    }
  });

  document.getElementById('autoSnapSinhBtn').addEventListener('click', () => {
    const sinhCandidates = [13, 17, 21, 25];
    let closest = sinhCandidates[0];
    let minDiff = Math.abs(state.studio.beadCount - closest);
    for (const c of sinhCandidates) {
      const diff = Math.abs(state.studio.beadCount - c);
      if (diff < minDiff) {
        minDiff = diff;
        closest = c;
      }
    }
    state.studio.beadCount = closest;
    updateCustomStudioPreview(true);
    showToast(`Đã điều chỉnh về ${closest} hạt (Rơi vào Cung Sinh · Đại Cát)`);
  });

  document.getElementById('studioCharmOptions').addEventListener('click', (e) => {
    const btn = e.target.closest('.charm-btn');
    if (!btn) return;
    state.studio.charmType = btn.dataset.charm;
    state.studio.charmPrice = parseInt(btn.dataset.price, 10);
    document.querySelectorAll('#studioCharmOptions .charm-btn').forEach((b) => {
      b.classList.toggle('active', b === btn);
    });
    updateCustomStudioPreview(true);
  });

  // Interactive 360° pointer drag rotation fallback when 3D WebGL is unavailable
  if (studioStage && !window.Bracelet3DEngine) {
    let isDragging = false;
    let startX = 0;
    let currentRot = 0;

    studioStage.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      studioStage.classList.add('is-dragging');
      studioStage.setPointerCapture?.(e.pointerId);
    });

    studioStage.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      startX = e.clientX;
      currentRot += deltaX * 0.65;
      studioStage.style.setProperty('--user-rot', `${currentRot.toFixed(1)}deg`);
    });

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      studioStage.classList.remove('is-dragging');
    };

    studioStage.addEventListener('pointerup', stopDrag);
    studioStage.addEventListener('pointercancel', stopDrag);
  }

  document.getElementById('addCustomToCartBtn').addEventListener('click', () => {
    const stone = STONE_PALETTES[state.studio.stoneKey];
    const totalPrice = calculateCustomBraceletPrice();
    const charmLabels = {
      tyhuu: 'Phối Tỳ Hưu Chiêu Tài',
      lotus: 'Phối Liên Hoa Bạc S925',
      luthong: 'Phối Lu Thống Ngọc',
      none: 'Vòng Trơn Nguyên Bản'
    };

    const customItem = {
      cartItemId: 'custom-' + Date.now(),
      productId: 'custom',
      name: `[Chế Tác Riêng] Vòng ${stone.name} (${charmLabels[state.studio.charmType]})`,
      stoneKey: state.studio.stoneKey,
      charmType: state.studio.charmType,
      beadMm: state.studio.beadMm,
      beadCount: state.studio.beadCount,
      wristCm: state.studio.wristCm,
      note: document.getElementById('studioNoteInput').value.trim(),
      price: totalPrice,
      qty: 1
    };

    state.cart.push(customItem);
    updateCartUI();
    bumpBadge(document.getElementById('cartCount'));
    openCartDrawer();
    showToast('Đã thêm mẫu vòng tự thiết kế độc bản vào giỏ thỉnh!');
  });

  updateCustomStudioPreview(false);
}

function recalcBeadsFromWrist() {
  const wristMm = state.studio.wristCm * 10;
  const rawCount = Math.round((wristMm + 15) / state.studio.beadMm);
  const rem = rawCount % 4;
  if (rem === 3) {
    state.studio.beadCount = rawCount - 2;
  } else if (rem === 0) {
    state.studio.beadCount = rawCount + 1;
  } else {
    state.studio.beadCount = rawCount;
  }
}

function calculateCustomBraceletPrice() {
  const stone = STONE_PALETTES[state.studio.stoneKey];
  const sizeMultiplier = 1 + (state.studio.beadMm - 8) * 0.12;
  const beadsCost = stone.basePricePerBead * state.studio.beadCount * sizeMultiplier;
  return Math.round((beadsCost + state.studio.charmPrice) / 10000) * 10000;
}

function updateCustomStudioPreview(pulseStage = false) {
  const stage = document.getElementById('studioSvgStage');
  if (!stage) return;

  if (window.Bracelet3DEngine) {
    window.Bracelet3DEngine.mount(stage, {
      stoneKey: state.studio.stoneKey,
      beadCount: state.studio.beadCount,
      beadMm: state.studio.beadMm,
      charmType: state.studio.charmType,
      interactive: true,
      showHint: true,
      baseTiltX: -0.42,
      baseTiltY: 0.1
    });
  } else {
    stage.innerHTML = renderBraceletSVG({
      stoneKey: state.studio.stoneKey,
      beadCount: state.studio.beadCount,
      beadMm: state.studio.beadMm,
      charmType: state.studio.charmType,
      uid: 'studio_live'
    });

    if (pulseStage) {
      stage.style.setProperty('--studio-scale', '0.965');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stage.style.setProperty('--studio-scale', '1');
        });
      });
    }
  }

  const cycle = getSinhLaoBenhTuCycle(state.studio.beadCount);
  const badge = document.getElementById('studioCycleBadge');
  badge.textContent = cycle.label;
  badge.classList.toggle('warn', !cycle.good);

  document.getElementById('studioSpecsSummary').textContent = `${state.studio.beadCount} hạt — ${
    state.studio.beadMm
  } ly — Cổ tay ${state.studio.wristCm.toFixed(1)}cm`;
  document.getElementById('studioBeadCountDisplay').textContent = `${state.studio.beadCount} hạt`;

  document.querySelectorAll('.studio-cycle-legend .cycle-step').forEach((step) => {
    step.classList.toggle('active', step.dataset.cycle === cycle.name);
  });

  const totalPrice = calculateCustomBraceletPrice();
  animateCurrency(document.getElementById('studioTotalPrice'), totalPrice, 340);
}

// ---------------------------------------------------------------------------
// 10. PRODUCT DETAIL MODAL
// ---------------------------------------------------------------------------
function openProductModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const backdrop = document.getElementById('productModalBackdrop');
  const body = document.getElementById('productModalBody');

  const svgHtml = renderBraceletSVG({
    stoneKey: product.stoneKey,
    beadCount: product.beadCount,
    beadMm: product.beadMm,
    charmType: product.charmType,
    uid: `modal_${product.id}`
  });

  body.innerHTML = `
    <div class="modal-detail-grid">
      <div class="modal-visual-box">
        <div class="modal-3d-stage" id="modalBracelet3DStage">
          ${svgHtml}
        </div>
        <div class="cert-card-mini">
          <div class="cert-card-head">
            <span>PHIẾU THÔNG SỐ KIỂM ĐỊNH</span>
            <strong class="num">${product.certId}</strong>
          </div>
          <div class="cert-card-rows">
            <div><span>Kết luận ngọc học:</span><strong>Đá tự nhiên 100%</strong></div>
            <div><span>Xử lý nhiệt / nhuộm:</span><strong>Không xử lý (Type A)</strong></div>
            <div><span>Độ cứng Mohs:</span><strong class="num">6.5 – 7.5</strong></div>
          </div>
        </div>
      </div>

      <div>
        <p style="font-size:var(--step-small); color:var(--muted); font-weight:500; margin-bottom:0.35rem;">
          ${product.category} — Xuất xứ ${product.origin}
        </p>
        <h2 id="modalProductTitle" style="font-family:var(--font-display); font-size:1.55rem; font-weight:600; line-height:1.3; margin-bottom:0.85rem;">
          ${product.name}
        </h2>
        <div style="display:flex; align-items:baseline; gap:0.75rem; margin-bottom:1rem; padding-bottom:0.9rem; border-bottom:1px solid var(--border-subtle);">
          <strong class="num" style="font-family:var(--font-sans); font-size:1.45rem; font-weight:700; color:var(--accent);">
            ${formatVND(product.price)}
          </strong>
          <span class="num" style="font-size:var(--step-small); color:var(--muted); text-decoration:line-through;">
            ${formatVND(product.oldPrice)}
          </span>
          <span style="font-size:var(--step-small); color:var(--el-moc); font-weight:600;">Còn phôi đá tại xưởng</span>
        </div>

        <p style="font-size:var(--step-small); color:var(--muted); margin-bottom:1.15rem; line-height:1.65;">
          ${product.description}
        </p>

        <div style="background-color:var(--bg); border:1px solid var(--border-subtle); padding:0.95rem 1.1rem; border-radius:var(--radius-sm); margin-bottom:1.15rem; font-size:var(--step-small); display:grid; grid-template-columns:1fr 1fr; gap:0.55rem;">
          <div><strong>Mệnh hợp:</strong> ${product.elements.join(', ')}</div>
          <div><strong>Phẩm cấp:</strong> ${product.grade}</div>
          <div class="num"><strong>Cỡ hạt:</strong> ${product.beadMm} ly (${product.beadCount} hạt)</div>
          <div><strong>Bảo hành:</strong> Thay dây trọn đời</div>
        </div>

        <div class="form-field" style="margin-bottom:1.25rem;">
          <label for="modalWristSelect">Chọn số đo cổ tay của bạn (Thợ xâu vừa tay):</label>
          <select id="modalWristSelect" class="num">
            <option value="14.5">14.5 cm (Nữ tay nhỏ — 17 hạt)</option>
            <option value="15.5" selected>15.5 cm – 16.0 cm (Cỡ phổ biến — 17 hạt Cung Sinh)</option>
            <option value="17.0">17.0 cm (Cổ tay đầy — 17 hạt)</option>
            <option value="18.0">18.0 cm (Nam tay lớn — 21 hạt Cung Sinh)</option>
          </select>
        </div>

        <div style="display:flex; gap:0.75rem;">
          <button type="button" class="btn btn-primary" id="modalAddToCartBtn" style="flex:1;">
            <span>Thêm vào giỏ hàng</span>
          </button>
          <button type="button" class="btn btn-secondary" id="modalBuyNowBtn">
            <span>Mua ngay</span>
          </button>
        </div>
      </div>
    </div>
  `;

  openOverlay(backdrop);

  if (window.Bracelet3DEngine) {
    const modalStage = document.getElementById('modalBracelet3DStage');
    requestAnimationFrame(() => {
      window.Bracelet3DEngine.mount(modalStage, {
        stoneKey: product.stoneKey,
        beadCount: product.beadCount,
        beadMm: product.beadMm,
        charmType: product.charmType,
        interactive: true,
        showHint: true,
        baseTiltX: -0.44,
        baseTiltY: 0.12
      });
    });
  }

  document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
    const wristVal = parseFloat(document.getElementById('modalWristSelect').value);
    closeOverlay(backdrop);
    addProductToCart(product, wristVal);
  });

  document.getElementById('modalBuyNowBtn').addEventListener('click', () => {
    const wristVal = parseFloat(document.getElementById('modalWristSelect').value);
    addProductToCart(product, wristVal, false);
    closeOverlay(backdrop);
    openCheckoutModal();
  });
}

// ---------------------------------------------------------------------------
// 11. CART, PROMO CODES & CHECKOUT FLOW
// ---------------------------------------------------------------------------
function addProductToCart(product, wristCm = 16.0, openDrawer = true) {
  const existing = state.cart.find(
    (item) => item.productId === product.id && item.wristCm === wristCm
  );

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      cartItemId: 'item-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      productId: product.id,
      name: product.name,
      stoneKey: product.stoneKey,
      charmType: product.charmType,
      beadMm: product.beadMm,
      beadCount: product.beadCount,
      wristCm,
      price: product.price,
      qty: 1
    });
  }

  updateCartUI();
  bumpBadge(document.getElementById('cartCount'));
  showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  if (openDrawer) openCartDrawer();
}

function calculateCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = Math.round((subtotal * state.promoDiscountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discount);
  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  return { subtotal, discount, grandTotal, totalCount };
}

function updateCartUI() {
  const { subtotal, discount, grandTotal, totalCount } = calculateCartTotals();

  document.getElementById('cartCount').textContent = totalCount;
  document.getElementById('drawerItemCountText').textContent = `${totalCount} sản phẩm đã chọn`;

  const container = document.getElementById('cartItemsContainer');
  const footer = document.getElementById('cartDrawerFooter');

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 3rem 1rem; color: var(--muted);">
        <p style="margin: 0 auto 1rem;">Giỏ hàng của bạn đang trống.</p>
        <button type="button" class="btn btn-secondary btn-sm" id="emptyCartBrowseBtn">Xem danh mục vòng đá</button>
      </div>
    `;
    footer.hidden = true;
    document.getElementById('emptyCartBrowseBtn')?.addEventListener('click', () => {
      closeCartDrawer();
    });
    return;
  }

  footer.hidden = false;
  container.innerHTML = state.cart
    .map((item) => {
      const thumbSvg = renderBraceletSVG({
        stoneKey: item.stoneKey,
        beadCount: item.beadCount,
        beadMm: item.beadMm,
        charmType: item.charmType,
        uid: `cart_${item.cartItemId}`
      });

      return `
        <div class="cart-item">
          <div class="cart-item-thumb">${thumbSvg}</div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-meta num">
              Hạt ${item.beadMm} ly, ${item.beadCount} hạt — Cổ tay ${item.wristCm}cm
            </div>
            <div class="cart-item-price num">${formatVND(item.price * item.qty)}</div>
          </div>
          <div class="cart-qty-box">
            <div class="qty-controls">
              <button type="button" data-cart-dec="${item.cartItemId}" aria-label="Giảm số lượng">−</button>
              <span class="num">${item.qty}</span>
              <button type="button" data-cart-inc="${item.cartItemId}" aria-label="Tăng số lượng">+</button>
            </div>
            <button type="button" class="remove-item-btn" data-cart-del="${item.cartItemId}">Xóa</button>
          </div>
        </div>
      `;
    })
    .join('');

  animateCurrency(document.getElementById('cartSubtotal'), subtotal, 280);
  const discountRow = document.getElementById('cartDiscountRow');
  if (discount > 0 && state.promoCode) {
    discountRow.hidden = false;
    document.getElementById('discountCodeLabel').textContent = state.promoCode;
    document.getElementById('cartDiscountAmount').textContent = `-${formatVND(discount)}`;
  } else {
    discountRow.hidden = true;
  }
  animateCurrency(document.getElementById('cartGrandTotal'), grandTotal, 320);
}

function openCartDrawer() {
  openOverlay(document.getElementById('cartDrawerBackdrop'));
}

function closeCartDrawer() {
  closeOverlay(document.getElementById('cartDrawerBackdrop'));
}

function openCheckoutModal() {
  closeCartDrawer();
  const { grandTotal, totalCount } = calculateCartTotals();
  const summaryBox = document.getElementById('checkoutOrderSummary');

  const itemsList = state.cart
    .map((i) => `<div class="num">${i.qty}x ${i.name} (${i.beadMm} ly, cổ tay ${i.wristCm}cm)</div>`)
    .join('');

  summaryBox.innerHTML = `
    <div style="font-weight:600; margin-bottom:0.4rem;">Chi tiết đơn hàng (<span class="num">${totalCount}</span> sản phẩm):</div>
    <div style="font-size:var(--step-small); color:var(--muted); margin-bottom:0.75rem;">${itemsList}</div>
    <div style="display:flex; justify-content:space-between; padding-top:0.5rem;">
      <span>Tổng thanh toán (Kèm chứng thư kiểm định):</span>
      <strong class="num" style="color:var(--accent); font-size:1.05rem;">${formatVND(
        grandTotal
      )}</strong>
    </div>
  `;

  openOverlay(document.getElementById('checkoutModalBackdrop'));
}

// ---------------------------------------------------------------------------
// 12. SMOOTH INERTIAL SCROLL ENGINE, REVEAL CHOREOGRAPHY & PARALLAX
// ---------------------------------------------------------------------------
let revealObserver = null;
const smoothScrollState = {
  currentY: 0,
  targetY: 0,
  rafId: null,
  isWheelSmoothing: false,
  isAnimatingAnchor: false
};

function observeRevealElements(nodeList) {
  if (!nodeList || nodeList.length === 0) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    nodeList.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.06
      }
    );
  }

  nodeList.forEach((el) => revealObserver.observe(el));
}

function isOverlayOpen() {
  const prodModal = document.getElementById('productModalBackdrop');
  const cartDrawer = document.getElementById('cartDrawerBackdrop');
  const checkoutModal = document.getElementById('checkoutModalBackdrop');
  return (
    (prodModal && !prodModal.hidden) ||
    (cartDrawer && !cartDrawer.hidden) ||
    (checkoutModal && !checkoutModal.hidden)
  );
}

function smoothScrollToTarget(targetElOrY, duration = 840) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerOffset = (document.getElementById('siteHeader')?.offsetHeight || 76) + 12;

  let destY = 0;
  if (typeof targetElOrY === 'number') {
    destY = targetElOrY;
  } else if (targetElOrY instanceof Element) {
    const rect = targetElOrY.getBoundingClientRect();
    destY = window.scrollY + rect.top - headerOffset;
  }

  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  destY = Math.max(0, Math.min(destY, maxScroll));

  if (reducedMotion) {
    window.scrollTo(0, destY);
    smoothScrollState.currentY = destY;
    smoothScrollState.targetY = destY;
    return;
  }

  if (smoothScrollState.rafId) {
    cancelAnimationFrame(smoothScrollState.rafId);
    smoothScrollState.rafId = null;
  }

  smoothScrollState.isWheelSmoothing = false;
  smoothScrollState.isAnimatingAnchor = true;
  const startY = window.scrollY;
  const diff = destY - startY;
  const startTime = performance.now();

  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  function stepAnchor(now) {
    const elapsed = Math.min(1, (now - startTime) / duration);
    const eased = easeOutQuint(elapsed);
    const nextY = startY + diff * eased;
    window.scrollTo(0, nextY);
    smoothScrollState.currentY = nextY;
    smoothScrollState.targetY = nextY;

    if (elapsed < 1) {
      smoothScrollState.rafId = requestAnimationFrame(stepAnchor);
    } else {
      smoothScrollState.isAnimatingAnchor = false;
      smoothScrollState.rafId = null;
    }
  }

  smoothScrollState.rafId = requestAnimationFrame(stepAnchor);
}

function initSmoothScrollAndEffects() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  smoothScrollState.currentY = window.scrollY;
  smoothScrollState.targetY = window.scrollY;

  // 1. Tag major editorial blocks with staggered reveal-on-scroll
  const revealSelectors = [
    '.statement-col',
    '.atelier-photo-frame',
    '.section-head-split',
    '.calculator-vessel',
    '.element-filter-bar',
    '.catalog-toolbar',
    '.studio-canvas-card',
    '.studio-controls-card',
    '.spec-row',
    '.spec-photo-card',
    '.guide-card',
    '.closing-band-inner',
    '.footer-grid > div',
    '.footer-wordmark-band'
  ];

  const blocks = document.querySelectorAll(revealSelectors.join(', '));
  blocks.forEach((el) => {
    el.classList.add('reveal-on-scroll');
    const siblingIndex = Array.from(el.parentElement ? el.parentElement.children : []).indexOf(el);
    const staggerMs = Math.min(siblingIndex * 70, 220);
    el.style.setProperty('--reveal-delay', `${staggerMs}ms`);
  });

  observeRevealElements(blocks);

  // 2. Smooth Anchor Link Interceptor
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        smoothScrollToTarget(0);
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        smoothScrollToTarget(target);
      }
    });
  });

  // 3. Back-to-top button
  document.getElementById('scrollTopBtn')?.addEventListener('click', () => {
    smoothScrollToTarget(0);
  });

  // 4. Subtle Magnetic Pointer Float on Hero Plinth
  const heroPlinth = document.querySelector('.object-plinth');
  const heroStageEl = document.getElementById('heroBraceletStage');
  if (heroPlinth && heroStageEl && !reducedMotion && isDesktopPointer) {
    let targetPX = 0;
    let targetPY = 0;
    let curPX = 0;
    let curPY = 0;
    let pointerRaf = null;

    function stepPointerFloat() {
      curPX += (targetPX - curPX) * 0.1;
      curPY += (targetPY - curPY) * 0.1;
      heroStageEl.style.setProperty('--pointer-x', `${curPX.toFixed(2)}px`);
      heroStageEl.style.setProperty('--pointer-y', `${curPY.toFixed(2)}px`);
      if (Math.abs(targetPX - curPX) > 0.06 || Math.abs(targetPY - curPY) > 0.06) {
        pointerRaf = requestAnimationFrame(stepPointerFloat);
      } else {
        pointerRaf = null;
      }
    }

    heroPlinth.addEventListener('pointermove', (e) => {
      const rect = heroPlinth.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetPX = nx * 10;
      targetPY = ny * 10;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(stepPointerFloat);
    });

    heroPlinth.addEventListener('pointerleave', () => {
      targetPX = 0;
      targetPY = 0;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(stepPointerFloat);
    });
  }

  // 5. Native-Compositor Scroll + Damped Visual Lerp for 3D Gemstone Rotation & Parallax
  const headerEl = document.getElementById('siteHeader');
  const progressBarEl = document.getElementById('scrollProgressBar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const studioStageEl = document.getElementById('studioSvgStage');
  const parallaxImages = document.querySelectorAll(
    '.atelier-photo-frame img, .spec-photo-card img, .guide-media img'
  );
  const trackedSections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.main-nav .nav-link'));

  let visualScrollY = window.scrollY;
  let scrollLerpRaf = null;

  function stepScrollVisuals() {
    const rawScrollY = window.scrollY;
    const diff = rawScrollY - visualScrollY;

    if (reducedMotion || Math.abs(diff) < 0.35) {
      visualScrollY = rawScrollY;
      scrollLerpRaf = null;
    } else {
      visualScrollY += diff * 0.14;
      scrollLerpRaf = requestAnimationFrame(stepScrollVisuals);
    }

    const viewportH = window.innerHeight;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportH);
    const progress = Math.max(0, Math.min(1, visualScrollY / maxScroll));

    if (progressBarEl) {
      progressBarEl.style.setProperty('--scroll-progress', progress.toFixed(4));
    }

    if (headerEl) {
      headerEl.classList.toggle('is-scrolled', rawScrollY > 36);
    }

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', rawScrollY > 520);
    }

    if (!reducedMotion) {
      if (heroStageEl && visualScrollY < viewportH * 1.35) {
        const rotDeg = visualScrollY * 0.028;
        const hero3D = window.Bracelet3DEngine?.get(heroStageEl);
        if (hero3D) {
          hero3D.setScrollRotation(rotDeg);
        } else {
          heroStageEl.style.setProperty('--scroll-rot', `${rotDeg.toFixed(2)}deg`);
        }
      }

      if (studioStageEl) {
        const rect = studioStageEl.getBoundingClientRect();
        if (rect.top < viewportH && rect.bottom > 0) {
          const studioRot = (viewportH - rect.top) * 0.018;
          const studio3D = window.Bracelet3DEngine?.get(studioStageEl);
          if (studio3D) {
            studio3D.setScrollRotation(studioRot);
          } else {
            studioStageEl.style.setProperty('--studio-rot', `${studioRot.toFixed(2)}deg`);
          }
        }
      }

      parallaxImages.forEach((img) => {
        const rect = img.getBoundingClientRect();
        if (rect.top < viewportH && rect.bottom > 0) {
          const centerOffset = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
          const shiftPx = (centerOffset * -14).toFixed(1);
          img.style.setProperty('--parallax-y', `${shiftPx}px`);
        }
      });
    }

    // Active section ScrollSpy
    let currentSectionId = '';
    const spyTriggerY = rawScrollY + viewportH * 0.32;
    for (const sec of trackedSections) {
      if (sec.offsetTop <= spyTriggerY) {
        currentSectionId = sec.id;
      }
    }
    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!scrollLerpRaf) {
        scrollLerpRaf = requestAnimationFrame(stepScrollVisuals);
      }
    },
    { passive: true }
  );

  stepScrollVisuals();
}

// ---------------------------------------------------------------------------
// 13. EVENT LISTENERS & INITIALIZATION
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 0. Initialize Smooth Scroll Engine, Reveal & Parallax
  initSmoothScrollAndEffects();

  // 1. Render Hero Showcase & auto-rotate (pauses on hover)
  renderHeroShowcase(0, false);
  let isHeroHovered = false;
  const heroPlinth = document.querySelector('.object-plinth');
  heroPlinth?.addEventListener('pointerenter', () => {
    isHeroHovered = true;
  });
  heroPlinth?.addEventListener('pointerleave', () => {
    isHeroHovered = false;
  });

  document.querySelectorAll('.stage-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const nextIdx = parseInt(dot.dataset.index, 10);
      if (nextIdx === currentHeroIndex) return;
      currentHeroIndex = nextIdx;
      renderHeroShowcase(currentHeroIndex, true);
    });
  });

  setInterval(() => {
    if (document.hidden || isHeroHovered) return;
    currentHeroIndex = (currentHeroIndex + 1) % HERO_SLIDES.length;
    renderHeroShowcase(currentHeroIndex, true);
  }, 6500);

  // 2. Theme Toggle (Light / Dark)
  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    const html = document.documentElement;
    const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    showToast(
      nextTheme === 'dark'
        ? 'Đã chuyển sang chế độ nền tối'
        : 'Đã chuyển sang chế độ nền sáng'
    );
  });

  // 3. Copy Promo Code
  document.getElementById('copyPromoBtn')?.addEventListener('click', () => {
    navigator.clipboard?.writeText('PHONGTHUY10').catch(() => {});
    state.promoCode = 'PHONGTHUY10';
    state.promoDiscountPercent = 10;
    document.getElementById('promoCodeInput').value = 'PHONGTHUY10';
    updateCartUI();
    showToast('Đã áp dụng mã ưu đãi PHONGTHUY10 (Giảm 10% toàn bộ đơn hàng)');
  });

  // 4. Initialize Feng Shui Calculator
  updateFengShuiCalculatorUI(false);
  document.getElementById('fengShuiForm').addEventListener('submit', (e) => {
    e.preventDefault();
    updateFengShuiCalculatorUI(true);
  });

  // 5. Render Product Catalog & Filter Listeners
  renderProductCatalog(false);

  document.querySelectorAll('.element-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      if (state.activeElement === pill.dataset.element) return;
      state.activeElement = pill.dataset.element;
      document.querySelectorAll('.element-pill').forEach((p) => {
        p.classList.toggle('active', p === pill);
      });
      renderProductCatalog(true);
    });
  });

  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    state.activeCategory = e.target.value;
    renderProductCatalog(true);
  });

  document.getElementById('priceFilter').addEventListener('change', (e) => {
    state.activePriceRange = e.target.value;
    renderProductCatalog(true);
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderProductCatalog(true);
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderProductCatalog(false);
  });

  document.getElementById('clearDestinyBtn').addEventListener('click', resetFilters);

  // Delegate clicks inside Product Grid (Quick View, Add to Cart, In-place Wishlist Toggle)
  document.getElementById('productGrid').addEventListener('click', (e) => {
    const wishBtn = e.target.closest('[data-wishlist]');
    if (wishBtn) {
      e.stopPropagation();
      const id = wishBtn.dataset.wishlist;
      if (state.wishlist.has(id)) {
        state.wishlist.delete(id);
        wishBtn.classList.remove('active');
        showToast('Đã bỏ khỏi danh sách yêu thích');
      } else {
        state.wishlist.add(id);
        wishBtn.classList.add('active');
        showToast('Đã lưu vào danh sách vòng đá yêu thích');
      }
      const wishBadge = document.getElementById('wishlistCount');
      wishBadge.textContent = state.wishlist.size;
      bumpBadge(wishBadge);
      return;
    }

    const addCartBtn = e.target.closest('[data-addcart]');
    if (addCartBtn) {
      e.stopPropagation();
      const prod = PRODUCTS.find((p) => p.id === addCartBtn.dataset.addcart);
      if (prod) addProductToCart(prod);
      return;
    }

    const quickViewEl = e.target.closest('[data-quickview]');
    if (quickViewEl) {
      openProductModal(quickViewEl.dataset.quickview);
    }
  });

  document.getElementById('wishlistCount').textContent = state.wishlist.size;

  // 6. Initialize Custom Studio
  initCustomStudio();

  // 7. Modal & Cart Drawer Controls (Animated Open/Close + Escape Key)
  const productModalBackdrop = document.getElementById('productModalBackdrop');
  const checkoutModalBackdrop = document.getElementById('checkoutModalBackdrop');

  document.getElementById('closeProductModalBtn').addEventListener('click', () => {
    closeOverlay(productModalBackdrop);
  });

  productModalBackdrop.addEventListener('click', (e) => {
    if (e.target === productModalBackdrop) {
      closeOverlay(productModalBackdrop);
    }
  });

  document.getElementById('cartTriggerBtn').addEventListener('click', openCartDrawer);
  document.getElementById('closeCartDrawerBtn').addEventListener('click', closeCartDrawer);
  document.getElementById('cartDrawerBackdrop').addEventListener('click', (e) => {
    if (e.target.id === 'cartDrawerBackdrop') closeCartDrawer();
  });

  document.getElementById('closeCheckoutModalBtn').addEventListener('click', () => {
    closeOverlay(checkoutModalBackdrop);
  });

  checkoutModalBackdrop.addEventListener('click', (e) => {
    if (e.target === checkoutModalBackdrop) {
      closeOverlay(checkoutModalBackdrop);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!productModalBackdrop.hidden) closeOverlay(productModalBackdrop);
      if (!checkoutModalBackdrop.hidden) closeOverlay(checkoutModalBackdrop);
      if (!document.getElementById('cartDrawerBackdrop').hidden) closeCartDrawer();
    }
  });

  // Cart item quantity & removal
  document.getElementById('cartItemsContainer').addEventListener('click', (e) => {
    const incBtn = e.target.closest('[data-cart-inc]');
    if (incBtn) {
      const item = state.cart.find((i) => i.cartItemId === incBtn.dataset.cartInc);
      if (item) item.qty += 1;
      updateCartUI();
      return;
    }

    const decBtn = e.target.closest('[data-cart-dec]');
    if (decBtn) {
      const item = state.cart.find((i) => i.cartItemId === decBtn.dataset.cartDec);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) {
          state.cart = state.cart.filter((i) => i.cartItemId !== item.cartItemId);
        }
      }
      updateCartUI();
      return;
    }

    const delBtn = e.target.closest('[data-cart-del]');
    if (delBtn) {
      const row = delBtn.closest('.cart-item');
      if (row) {
        row.style.opacity = '0';
        row.style.transform = 'translate3d(16px, 0, 0)';
        setTimeout(() => {
          state.cart = state.cart.filter((i) => i.cartItemId !== delBtn.dataset.cartDel);
          updateCartUI();
        }, 180);
      } else {
        state.cart = state.cart.filter((i) => i.cartItemId !== delBtn.dataset.cartDel);
        updateCartUI();
      }
    }
  });

  // Promo code application
  document.getElementById('applyPromoBtn').addEventListener('click', () => {
    const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
    const statusMsg = document.getElementById('promoStatusMsg');
    statusMsg.hidden = false;

    if (code === 'PHONGTHUY10' || code === 'LINHNGOC10') {
      state.promoCode = code;
      state.promoDiscountPercent = 10;
      statusMsg.style.color = 'var(--accent)';
      statusMsg.textContent = `Đã áp dụng mã ${code}: Giảm 10% tổng giá trị đơn hàng.`;
      updateCartUI();
    } else if (code === 'VIP15') {
      state.promoCode = code;
      state.promoDiscountPercent = 15;
      statusMsg.style.color = 'var(--accent)';
      statusMsg.textContent = `Đã áp dụng mã ${code}: Giảm 15% ưu đãi khách hàng thân thiết.`;
      updateCartUI();
    } else {
      statusMsg.style.color = 'var(--danger)';
      statusMsg.textContent = 'Mã không hợp lệ. Hãy thử mã PHONGTHUY10 (Giảm 10%).';
    }
  });

  // Proceed to Checkout
  document.getElementById('proceedCheckoutBtn').addEventListener('click', openCheckoutModal);

  document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const orderCode = 'LND-' + Math.floor(100000 + Math.random() * 900000);

    document.getElementById('checkoutModalBody').innerHTML = `
      <div style="text-align:center; padding: 1.5rem 0.75rem;">
        <h3 style="font-family:var(--font-display); font-size:1.65rem; font-weight:600; line-height:1.32; margin-bottom:0.65rem;">
          Cảm ơn bạn ${name}
        </h3>
        <p style="color:var(--muted); font-size:var(--step-small); max-width:48ch; margin:0 auto 1.25rem; line-height:1.6;">
          Mã đơn hàng của bạn là <strong class="num" style="color:var(--accent);">${orderCode}</strong>. Xưởng <strong>Linh Ngọc Đường</strong> sẽ liên hệ qua số <strong class="num">${phone}</strong> trong 15 phút để xác nhận chu vi cổ tay trước khi xâu vòng và đóng gói gửi đi.
        </p>
        <button type="button" class="btn btn-primary" id="finishOrderBtn">Hoàn tất &amp; quay lại trang chủ</button>
      </div>
    `;

    state.cart = [];
    updateCartUI();

    document.getElementById('finishOrderBtn').addEventListener('click', () => {
      closeOverlay(checkoutModalBackdrop);
      setTimeout(() => location.reload(), 380);
    });
  });

  // Footer Category Quick Links
  document.querySelectorAll('[data-filter-cat]').forEach((link) => {
    link.addEventListener('click', () => {
      const cat = link.dataset.filterCat;
      state.activeCategory = cat;
      document.getElementById('categoryFilter').value = cat;
      renderProductCatalog(true);
    });
  });

  // Closing Consultation Lead Form
  document.getElementById('consultLeadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = document.getElementById('leadPhoneInput').value.trim();
    const feedback = document.getElementById('leadFeedback');
    feedback.hidden = false;
    feedback.textContent = `Đã ghi nhận Zalo ${phone}. Nghệ nhân xưởng sẽ gửi ảnh chụp lô đá tự nhiên qua Zalo cho bạn.`;
    document.getElementById('leadPhoneInput').value = '';
  });

  // Initial Cart UI sync
  updateCartUI();
});
