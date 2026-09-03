'use strict';

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');

pdfjsLib.GlobalWorkerOptions.workerSrc = false;

const PDFJS_STANDARD_FONT_URL = path.join(
  path.dirname(require.resolve('pdfjs-dist/legacy/build/pdf')), '../'
);

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle,
  VerticalAlign, ImageRun, Header, Footer, PageNumber, UnderlineType
} = require('docx');

// ============================================================
// Constants
// ============================================================
const FONT_FAMILY_SERIF = 'Times New Roman';
const FONT_FAMILY_SANS  = 'Arial';
const DEFAULT_FONT_SIZE = 13;
const PAGE_WIDTH_PT     = 595;

// ============================================================
// PNG encoder helpers
// ============================================================
function crc32(buf) {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function makeChunk(type, data) {
  const b = Buffer.alloc(4 + 4 + data.length + 4);
  b.writeUInt32BE(data.length, 0); b.write(type, 4); data.copy(b, 8);
  b.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])), 8 + data.length);
  return b;
}
function encodeRawToPng(raw, w, h, ct = 2, bd = 8) {
  const ch = ct === 6 ? 4 : ct === 2 ? 3 : 1;
  const rb = Math.ceil(w * ch * bd / 8);
  const sc = Buffer.alloc(h * (1 + rb));
  for (let y = 0; y < h; y++) {
    const ro = y * rb, so = y * (1 + rb);
    sc[so] = 0;
    if (ro + rb <= raw.length) raw.copy(sc, so + 1, ro, ro + rb);
  }
  const ih = Buffer.alloc(13);
  ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih.writeUInt8(bd, 8); ih.writeUInt8(ct, 9);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    makeChunk('IHDR', ih),
    makeChunk('IDAT', zlib.deflateSync(sc)),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}
function cmykToRgb(raw, w, h) {
  const rgb = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    const c = raw[i*4]/255, m = raw[i*4+1]/255, y = raw[i*4+2]/255, k = raw[i*4+3]/255;
    rgb[i*3]   = Math.round(255*(1-c)*(1-k));
    rgb[i*3+1] = Math.round(255*(1-m)*(1-k));
    rgb[i*3+2] = Math.round(255*(1-y)*(1-k));
  }
  return rgb;
}

// ============================================================
// Image extraction — skip full-page scans
// ============================================================
async function extractImagesFromPdf(pdfBytes, logFn = console.log) {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const pages  = pdfDoc.getPages();
  const imgsByPage = {};

  for (let i = 0; i < pages.length; i++) {
    const pageNum = i + 1;
    let resources;
    try { resources = pages[i].node.normalizedEntries().Resources; } catch { continue; }
    if (!resources) continue;
    let rObj;
    try { rObj = pdfDoc.context.lookup(resources); } catch { continue; }
    if (!rObj?.get) continue;
    const xo = rObj.get(PDFName.of('XObject'));
    if (!xo) continue;
    let xDict;
    try { xDict = pdfDoc.context.lookup(xo); } catch { continue; }
    if (!xDict?.entries) continue;

    for (const [, ref] of xDict.entries()) {
      let obj;
      try { obj = pdfDoc.context.lookup(ref); } catch { continue; }
      if (!(obj instanceof PDFRawStream)) continue;
      const sub = obj.dict.get(PDFName.of('Subtype'));
      if (!sub || sub.toString() !== '/Image') continue;

      const wv  = obj.dict.get(PDFName.of('Width'));
      const hv  = obj.dict.get(PDFName.of('Height'));
      const csv = obj.dict.get(PDFName.of('ColorSpace'));
      const bpv = obj.dict.get(PDFName.of('BitsPerComponent'));
      const fv  = obj.dict.get(PDFName.of('Filter'));

      const w   = wv  ? parseInt(wv.toString().replace(/\D/g,''),  10) : 0;
      const h   = hv  ? parseInt(hv.toString().replace(/\D/g,''),  10) : 0;
      const bpc = bpv ? parseInt(bpv.toString().replace(/\D/g,''), 10) : 8;
      const cs  = csv ? csv.toString() : '';
      const f   = fv  ? fv.toString()  : '';

      if (w < 40 || h < 40) continue;
      // Skip full-page scans (≥ A4 at ~100dpi)
      if (w > 800 && h > 1100) continue;

      let buf = null;
      if (f === '/DCTDecode') {
        buf = Buffer.from(obj.contents);
      } else if (f === '/FlateDecode') {
        try {
          const raw = zlib.inflateSync(Buffer.from(obj.contents));
          if (cs.includes('CMYK'))      buf = encodeRawToPng(cmykToRgb(raw,w,h), w, h, 2, 8);
          else if (cs.includes('Gray')) buf = encodeRawToPng(raw, w, h, 0, bpc);
          else {
            const n3=w*h*3,n4=w*h*4,n1=w*h;
            if      (Math.abs(raw.length-n4)<16) buf = encodeRawToPng(raw,w,h,6,bpc);
            else if (Math.abs(raw.length-n3)<16) buf = encodeRawToPng(raw,w,h,2,bpc);
            else if (Math.abs(raw.length-n1)<16) buf = encodeRawToPng(raw,w,h,0,bpc);
            else                                  buf = encodeRawToPng(raw,w,h,2,bpc);
          }
        } catch {}
      } else if (f === '/JPXDecode') {
        buf = Buffer.from(obj.contents);
      }

      if (buf) {
        if (!imgsByPage[pageNum]) imgsByPage[pageNum] = [];
        imgsByPage[pageNum].push({ buffer: buf, width: w, height: h });
      }
    }
  }
  return imgsByPage;
}

// ============================================================
// pdfjs: Extract raw text items with position + font metadata
// FIX 1: Normalize zero-width items AT SOURCE using transform matrix
// ============================================================
async function extractRichTextFromPdf(pdfBuffer, logFn = console.log) {
  const pdfDoc = await pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer),
    standardFontDataUrl: PDFJS_STANDARD_FONT_URL,
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;

  const numPages = pdfDoc.numPages;
  logFn('Đang đọc ' + numPages + ' trang...');
  const richPages = [];

  for (let p = 1; p <= numPages; p++) {
    const page = await pdfDoc.getPage(p);
    const vp   = page.getViewport({ scale: 1 });
    const tc   = await page.getTextContent({ normalizeWhitespace: false });

    const items = tc.items
      .filter(it => typeof it.str === 'string')
      .map(it => {
        const fontSize   = it.height || 0;
        const scaleX     = Math.abs(it.transform[0]); // horizontal scale
        // FIX: if pdfjs reports width=0 (zero-width vowel), estimate from fontSize
        const rawWidth   = it.width || 0;
        const estWidth   = (rawWidth < 0.5 && fontSize > 0)
          ? Math.max(scaleX * 0.6, fontSize * 0.55)
          : rawWidth;

        return {
          str:      it.str,
          x:        it.transform[4],
          y:        it.transform[5],
          yTop:     vp.height - it.transform[5] - fontSize,
          height:   fontSize,
          width:    estWidth,
          rawWidth: rawWidth,   // keep original for debugging
          fontName: typeof it.fontName === 'string' ? it.fontName : String(it.fontName || ''),
        };
      });

    richPages.push({ pageNum: p, items, pageHeight: vp.height, pageWidth: vp.width });
  }
  return richPages;
}

// ============================================================
// Group items into rows by Y proximity (yTol = 3pt)
// ============================================================
function groupIntoRows(items, yTol = 3) {
  if (!items.length) return [];
  const sorted = [...items].sort((a, b) =>
    Math.abs(a.yTop - b.yTop) <= yTol ? a.x - b.x : a.yTop - b.yTop
  );
  const rows = [];
  let cur = [sorted[0]], cy = sorted[0].yTop;
  for (let i = 1; i < sorted.length; i++) {
    const it = sorted[i];
    if (Math.abs(it.yTop - cy) <= yTol) cur.push(it);
    else { rows.push(cur.sort((a,b) => a.x - b.x)); cur = [it]; cy = it.yTop; }
  }
  if (cur.length) rows.push(cur.sort((a,b) => a.x - b.x));
  return rows;
}

// ============================================================
// FIX 2 (core): Merge fragmented Vietnamese items into segments
// Uses normalized width from Step 1 (zero-width vowels already fixed)
// ============================================================
function mergeRowIntoSegments(row) {
  if (!row.length) return [];

  const totalW  = row.reduce((s, it) => s + it.width, 0);
  const totalC  = row.reduce((s, it) => s + Math.max(it.str.length, 1), 0);
  const avgCharW = totalC > 0 ? totalW / totalC : 6;

  // Word gap: small gaps are diacritic splits, larger = actual word space
  const wordGap = avgCharW * 0.9;
  // Column gap: used to detect table columns
  const colGap  = avgCharW * 4.5;

  // Step A: merge individual fragments into word tokens
  const tokens = [];
  let cur = {
    str:      row[0].str,
    x:        row[0].x,
    endX:     row[0].x + row[0].width,
    height:   row[0].height,
    fontName: row[0].fontName,
  };

  for (let i = 1; i < row.length; i++) {
    const it  = row[i];
    const gap = it.x - cur.endX;

    if (gap < wordGap) {
      // Same fragment — add space only if gap is "word-space sized"
      const needSp = cur.str.length > 0
        && !cur.str.endsWith(' ')
        && !it.str.startsWith(' ')
        && gap > avgCharW * 0.6;
      cur.str  += (needSp ? ' ' : '') + it.str;
      cur.endX  = Math.max(cur.endX, it.x + it.width);
      if (it.height > cur.height) cur.height = it.height;
    } else {
      tokens.push(cur);
      cur = { str: it.str, x: it.x, endX: it.x + it.width, height: it.height, fontName: it.fontName };
    }
  }
  tokens.push(cur);

  // Step B: merge tokens into column segments (break only at colGap)
  const segs = [];
  let seg = { ...tokens[0] };
  for (let i = 1; i < tokens.length; i++) {
    const t   = tokens[i];
    const gap = t.x - tokens[i-1].endX;
    if (gap >= colGap) {
      segs.push(seg);
      seg = { ...t };
    } else {
      const needSp = seg.str.length > 0 && !seg.str.endsWith(' ') && !t.str.startsWith(' ');
      seg.str += (needSp ? ' ' : '') + t.str;
      seg.endX = t.endX;
      if (t.height > seg.height) seg.height = t.height;
    }
  }
  segs.push(seg);

  return segs
    .map(s => ({ ...s, str: s.str.trim() }))
    .filter(s => s.str.length > 0);
}

// ============================================================
// FIX 3: Detect 2-column government document header
// Pattern: first few rows have text in left half AND right half of page
// → Build as borderless 2-column Table
// ============================================================
function detectGovHeader(rows, pageWidth) {
  // Government document header: first 4-6 rows have items in both halves
  const mid = pageWidth / 2;
  const headerRows = [];

  for (let i = 0; i < Math.min(8, rows.length); i++) {
    const row = rows[i];
    const leftItems  = row.filter(it => it.x < mid - 20);
    const rightItems = row.filter(it => it.x > mid + 20);
    if (leftItems.length > 0 && rightItems.length > 0) {
      headerRows.push({ row, leftItems, rightItems, index: i });
    } else {
      // Once we hit a row without 2-column structure, stop
      if (headerRows.length > 0) break;
    }
  }

  // Require at least 1 two-column row to treat as gov header
  if (headerRows.length === 0) return null;
  return headerRows;
}

// Build a 2-column borderless table for government document header
function buildGovHeaderTable(headerRows, dominantSize) {
  const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const noBorder = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };

  const leftParas  = [];
  const rightParas = [];

  for (const { leftItems, rightItems } of headerRows) {
    const leftSegs  = mergeRowIntoSegments(leftItems.sort((a,b) => a.x - b.x));
    const rightSegs = mergeRowIntoSegments(rightItems.sort((a,b) => a.x - b.x));

    const leftStr  = leftSegs.map(s => s.str).join(' ').trim();
    const rightStr = rightSegs.map(s => s.str).join(' ').trim();

    if (leftStr) {
      const isBold  = isBoldContent(leftStr);
      const isUnder = /độc lập|tự do|hạnh phúc/i.test(leftStr);
      leftParas.push(new Paragraph({
        children: [new TextRun({
          text: leftStr, font: FONT_FAMILY_SERIF,
          size: ptToHp(dominantSize), bold: isBold,
          underline: isUnder ? { type: UnderlineType.SINGLE } : undefined,
          color: '000000',
        })],
        alignment: AlignmentType.CENTER,
        spacing: { line: 240, before: 30, after: 30 },
      }));
    }
    if (rightStr) {
      const isBold  = isBoldContent(rightStr);
      const isUnder = /độc lập|tự do|hạnh phúc/i.test(rightStr);
      rightParas.push(new Paragraph({
        children: [new TextRun({
          text: rightStr, font: FONT_FAMILY_SERIF,
          size: ptToHp(dominantSize), bold: isBold,
          underline: isUnder ? { type: UnderlineType.SINGLE } : undefined,
          color: '000000',
        })],
        alignment: AlignmentType.CENTER,
        spacing: { line: 240, before: 30, after: 30 },
      }));
    }
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [new TableRow({
      children: [
        new TableCell({
          children: leftParas.length ? leftParas : [new Paragraph({ children: [] })],
          width: { size: 45, type: WidthType.PERCENTAGE },
          borders: noBorder,
        }),
        new TableCell({
          children: rightParas.length ? rightParas : [new Paragraph({ children: [] })],
          width: { size: 55, type: WidthType.PERCENTAGE },
          borders: noBorder,
        }),
      ],
    })],
  });
}

// ============================================================
// FIX 4: Multi-row wrapped table cell merging
// When table rows have "continuation" single-seg rows between multi-seg rows,
// merge them into the previous row's last cell.
// ============================================================
function mergeTableContinuationRows(tableItems) {
  if (!tableItems.length) return tableItems;

  const result = [tableItems[0]];

  for (let i = 1; i < tableItems.length; i++) {
    const item = tableItems[i];
    const prev = result[result.length - 1];
    const prevColCount = prev.segs.length;

    // A continuation row has fewer segments than the main table width
    // AND its content starts roughly at the same X as the last column of prev row
    if (item.segs.length === 1 && prevColCount >= 2) {
      const contSeg  = item.segs[0];
      const lastPrevSeg = prev.segs[prevColCount - 1];

      // Check if continuation segment is aligned to last column
      const xDiff = Math.abs(contSeg.x - (lastPrevSeg ? lastPrevSeg.x : 0));
      const isAligned = xDiff < 60; // within 60pt of last column X

      if (isAligned && lastPrevSeg) {
        // Merge into last cell of previous row
        const merged = { ...prev };
        merged.segs = [...prev.segs];
        merged.segs[prevColCount - 1] = {
          ...lastPrevSeg,
          str: lastPrevSeg.str + ' ' + contSeg.str,
        };
        result[result.length - 1] = merged;
        continue;
      }
    }

    result.push(item);
  }
  return result;
}

// ============================================================
// FIX 5: Bold detection by content heuristics
// (since this PDF type has no bold fontName)
// ============================================================
function isBoldContent(text) {
  if (!text) return false;
  const t = text.trim();

  // Explicit ALL CAPS phrases (common Vietnamese gov doc headings)
  if (/^[A-ZÀ-ỴĐẮẰẶẤẦẬÉÈẸÊẾỀỆÍÌỊÓÒỌÔỐỒỘƠỚỜỢÚÙỤƯỨỪỰÝ\s,\-\/\.()[\]0-9]{4,}$/.test(t)
    && t === t.toUpperCase()
    && t.length >= 4) return true;

  // Roman numeral section
  if (/^[IVXLCDM]{1,6}\.\s/.test(t)) return true;

  // Numbered heading
  if (/^\d{1,2}\.\s/.test(t)) return true;

  // Lettered sub-item
  if (/^[a-zđ]\)\s/i.test(t)) return true;

  // Điều X.
  if (/^Điều\s+\d+/i.test(t)) return true;

  // Phần / Phụ lục
  if (/^(Phần\s+[IVXLCDM\d]+|Phụ lục)/i.test(t)) return true;

  // Lines starting with +/- bullet (not bold, handled as bullet)
  return false;
}

// ============================================================
// Heading level detection (expanded Vietnamese gov patterns)
// ============================================================
function detectHeadingLevel(text) {
  if (!text) return 0;
  const t = text.trim();

  // H1: all-caps block titles or PHẦN/PHỤ LỤC
  if (/^(PHẦN\s+[IVXLCDM\d]+|QUY ĐỊNH CHUNG|QUYẾT ĐỊNH|PHỤ LỤC(\s+[IVXLCDM\d]+)?)/i.test(t)) return 1;
  if (/^QUY ĐỊNH$/.test(t)) return 1;
  if (/^ĐỊNH DẠNG THÀNH PHẦN/i.test(t)) return 1;
  if (/^KẾT LUẬN/i.test(t)) return 1;

  // H2: Roman numeral section "I. Thành phần..."
  if (/^[IVXLCDM]{1,6}\.\s+\S/.test(t)) return 2;

  // H3: Arabic "1. ...", "Điều X."
  if (/^\d{1,2}\.\s+\S/.test(t)) return 3;
  if (/^Điều\s+\d+\./i.test(t)) return 3;

  // H4: "a) ..." letter sub-items
  if (/^[a-zđ]\)\s+\S/i.test(t)) return 4;

  return 0;
}

// ============================================================
// Detect paragraph alignment from segments
// ============================================================
function detectAlignment(segs, pageWidth) {
  if (!segs.length) return AlignmentType.LEFT;
  const lx = segs[0].x;
  const rx = segs[segs.length - 1].endX || segs[segs.length - 1].x + 50;
  const cx = (lx + rx) / 2;
  const pm = pageWidth / 2;

  if (Math.abs(cx - pm) < pageWidth * 0.1 && lx > pageWidth * 0.18) return AlignmentType.CENTER;
  if (rx > pageWidth * 0.82 && lx < pageWidth * 0.25) return AlignmentType.JUSTIFIED;
  return AlignmentType.LEFT;
}

// ============================================================
// Detect groups: table vs text (using mergeRowIntoSegments)
// ============================================================
function detectTableGroups(rows, pageWidth) {
  const tagged = rows.map(row => {
    const segs = mergeRowIntoSegments(row);
    return { row, segs };
  });

  const groups = [];
  let i = 0;
  while (i < tagged.length) {
    const cur = tagged[i];
    if (cur.segs.length >= 3) {
      // Potential table — collect rows with >= 2 segs
      const tbl = [cur];
      let j = i + 1;
      while (j < tagged.length && tagged[j].segs.length >= 2) {
        tbl.push(tagged[j]);
        j++;
      }
      // Also absorb single-segment continuation rows
      while (j < tagged.length && tagged[j].segs.length === 1) {
        const contSeg = tagged[j].segs[0];
        const lastTblSeg = tbl[tbl.length - 1].segs[tbl[tbl.length - 1].segs.length - 1];
        if (lastTblSeg && Math.abs(contSeg.x - lastTblSeg.x) < 60) {
          tbl.push(tagged[j]);
          j++;
        } else break;
      }
      if (tbl.length >= 2) {
        // Apply continuation-row merging
        groups.push({ type: 'table', items: mergeTableContinuationRows(tbl) });
        i = j;
        continue;
      }
    }
    groups.push({ type: 'text', items: [cur] });
    i++;
  }
  return groups;
}

// ============================================================
// Font / style helpers
// ============================================================
function getDominantFontSize(items) {
  const cnt = {};
  for (const it of items) {
    if (it.height > 0) { const s = Math.round(it.height); cnt[s] = (cnt[s]||0)+1; }
  }
  let max = 0, dom = DEFAULT_FONT_SIZE;
  for (const [s, c] of Object.entries(cnt)) { if (c > max) { max = c; dom = Number(s); } }
  return dom;
}

function getFontFamily(fontName) {
  const fn = (fontName||'').toUpperCase();
  if (fn.includes('ARIAL') || fn.includes('HELVETICA') || fn.includes('SANS')) return FONT_FAMILY_SANS;
  return FONT_FAMILY_SERIF;
}

function isItalicFont(fontName) {
  return /italic|oblique/i.test(fontName || '');
}

function ptToHp(pt) {
  return Math.max(16, Math.min(144, Math.round(pt * 2)));
}

// ============================================================
// Build Paragraph from segments
// ============================================================
function buildParagraph(segs, dominantSize, pageWidth) {
  const lineStr = segs.map(s => s.str).join(' ').trim();
  if (!lineStr) return null;

  const heading   = detectHeadingLevel(lineStr);
  const alignment = detectAlignment(segs, pageWidth);
  const bold      = heading > 0 || isBoldContent(lineStr);
  const isItalicLine = /^(Căn cứ|Theo đề nghị|Xét|Trên cơ sở)/i.test(lineStr);

  // Bullet: lines starting with +, -, ▪
  const isBullet = /^[+\-▪•]\s/.test(lineStr);

  const runs = segs.map(seg => new TextRun({
    text: seg.str, font: getFontFamily(seg.fontName),
    size: ptToHp(seg.height > 0 ? seg.height : dominantSize),
    bold,
    italics: isItalicLine || isItalicFont(seg.fontName),
    color: '000000',
  }));

  if (!runs.length) return null;

  const sp = {
    line:   276,
    before: heading === 1 ? 200 : heading === 2 ? 140 : heading >= 3 ? 100 : isBullet ? 20 : 40,
    after:  heading === 1 ? 100 : heading === 2 ? 60  : heading >= 3 ? 40  : isBullet ? 20 : 40,
  };

  const opts = {
    children: runs, alignment, spacing: sp,
    ...(isBullet ? {
      bullet: { level: 0 },
      indent: { left: 400, hanging: 200 },
    } : {}),
  };

  if      (heading === 1) opts.heading = HeadingLevel.HEADING_1;
  else if (heading === 2) opts.heading = HeadingLevel.HEADING_2;
  else if (heading === 3) opts.heading = HeadingLevel.HEADING_3;
  else if (heading === 4) opts.heading = HeadingLevel.HEADING_4;

  return new Paragraph(opts);
}

// ============================================================
// Build DOCX Table
// ============================================================
function buildTable(tableItems, dominantSize) {
  // Determine column count (mode of segs.length across rows)
  const colCounts = tableItems.map(ti => ti.segs.length);
  const colCount  = Math.max(...colCounts);
  if (colCount < 2) return null;

  const bdr    = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const borders = { top: bdr, bottom: bdr, left: bdr, right: bdr, insideHorizontal: bdr, insideVertical: bdr };

  // Determine column widths proportionally from x positions of header row
  const headerRow = tableItems.find(ti => ti.segs.length === colCount) || tableItems[0];
  const totalDxa  = 9072; // ~16cm usable width in dxa units

  let colWidths;
  if (headerRow.segs.length === colCount) {
    // Use actual x gaps for proportional widths
    const gaps = [];
    for (let c = 0; c < colCount; c++) {
      const seg  = headerRow.segs[c];
      const next = headerRow.segs[c + 1];
      const w    = next ? (next.x - seg.x) : (PAGE_WIDTH_PT - seg.x - 50);
      gaps.push(Math.max(w, 30));
    }
    const totalGap = gaps.reduce((s, g) => s + g, 0);
    colWidths = gaps.map(g => Math.round((g / totalGap) * totalDxa));
  } else {
    colWidths = Array(colCount).fill(Math.floor(totalDxa / colCount));
  }

  const rows = tableItems.map((ti, ri) => {
    const isHeader = ri === 0;
    const cells = [];
    for (let c = 0; c < colCount; c++) {
      const seg     = ti.segs[c];
      const text    = seg ? seg.str.trim() : '';
      const bold    = isHeader || isBoldContent(text);
      const font    = seg ? getFontFamily(seg.fontName) : FONT_FAMILY_SERIF;
      const size    = seg ? ptToHp(seg.height || dominantSize) : ptToHp(dominantSize);
      cells.push(new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text, font, size, bold, color: '000000' })],
          spacing: { line: 240, before: 60, after: 60 },
        })],
        width: { size: colWidths[c], type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders,
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
      }));
    }
    return new TableRow({ children: cells });
  });

  return new Table({ rows, borders, width: { size: 100, type: WidthType.PERCENTAGE } });
}

// ============================================================
// Build image paragraph
// ============================================================
function createImageParagraph(img) {
  const maxW = 480, maxH = 580;
  let w = img.width, h = img.height;
  if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
  if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
  return new Paragraph({
    children: [new ImageRun({ data: img.buffer, transformation: { width: w, height: h } })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80 },
  });
}

// ============================================================
// FIX 6: Smart image placement (insert image BEFORE its caption)
// ============================================================
function isImageCaption(text) {
  return /^(Hình\s*(minh họa\s*:?|số\s*\d|ảnh\s*\d|\d)|Sơ đồ\s*\d|Biểu đồ\s*\d|Figure\s*\d)/i.test(text);
}

// ============================================================
// Master text → DOCX elements
// ============================================================
async function parseRichPdfToWord(pdfBuffer, imagesByPage, logFn = console.log) {
  const richPages = await extractRichTextFromPdf(pdfBuffer, logFn);
  const elements  = [];

  for (const { pageNum, items, pageWidth, pageHeight } of richPages) {
    const pageImgs  = [...(imagesByPage[pageNum] || [])];
    let imgInserted = false;

    const valid = items.filter(it => it.str && it.str.trim().length > 0);
    if (valid.length === 0) {
      // Scanned page — insert images
      for (const img of pageImgs) elements.push(createImageParagraph(img));
      continue;
    }

    const dominantSize = getDominantFontSize(valid);
    const rows         = groupIntoRows(valid);

    // FIX 3: Detect 2-column gov header on FIRST page (or any page with header block)
    const headerRowData = detectGovHeader(rows, pageWidth || PAGE_WIDTH_PT);
    let headerEndIndex  = 0;

    if (headerRowData && headerRowData.length > 0) {
      const headerTable = buildGovHeaderTable(headerRowData, dominantSize);
      elements.push(headerTable);
      elements.push(new Paragraph({ children: [], spacing: { before: 80, after: 40 } }));
      headerEndIndex = headerRowData[headerRowData.length - 1].index + 1;
    }

    const contentRows = rows.slice(headerEndIndex);
    const groups      = detectTableGroups(contentRows, pageWidth || PAGE_WIDTH_PT);

    for (const group of groups) {
      if (group.type === 'table' && group.items.length >= 2) {
        const tbl = buildTable(group.items, dominantSize);
        if (tbl) {
          elements.push(tbl);
          elements.push(new Paragraph({ children: [], spacing: { before: 80, after: 80 } }));
          continue;
        }
      }

      for (const { segs } of group.items) {
        const lineStr = segs.map(s => s.str).join(' ').trim();
        if (!lineStr) continue;

        // Skip bare page numbers
        if (/^\d{1,4}$/.test(lineStr)) continue;

        // FIX 6: Insert image BEFORE its caption
        if (isImageCaption(lineStr) && pageImgs.length > 0 && !imgInserted) {
          elements.push(createImageParagraph(pageImgs.shift()));
          imgInserted = true;
        }

        const para = buildParagraph(segs, dominantSize, pageWidth || PAGE_WIDTH_PT);
        if (para) elements.push(para);
      }
    }

    // Remaining images at end of page
    for (const img of pageImgs) {
      if (!imgInserted) { elements.push(createImageParagraph(img)); imgInserted = true; }
    }
  }

  return elements;
}

// ============================================================
// Master Converter
// ============================================================
async function convertPdfToDocx(pdfBuffer, options = {}, logFn = console.log) {
  logFn('Bắt đầu phân tích tài liệu PDF...');

  logFn('Đang trích xuất hình ảnh và sơ đồ...');
  const imagesByPage = await extractImagesFromPdf(pdfBuffer, logFn);
  const totalImgs = Object.values(imagesByPage).reduce((s, a) => s + a.length, 0);
  logFn('Trích xuất ' + totalImgs + ' hình ảnh thực từ PDF.');

  logFn('Đang phân tích văn bản: ghép ký tự VN, detect header/bảng/heading...');
  const elements = await parseRichPdfToWord(pdfBuffer, imagesByPage, logFn);
  logFn('Tổng ' + elements.length + ' phần tử (đoạn văn + bảng + hình ảnh).');

  logFn('Đóng gói file Word (.docx)...');

  const doc = new Document({
    styles: {
      default: {
        document: {
          run:       { font: FONT_FAMILY_SERIF, size: ptToHp(DEFAULT_FONT_SIZE), color: '000000' },
          paragraph: { spacing: { line: 276, before: 40, after: 40 } },
        },
      },
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, bottom: 1134, left: 1701, right: 1134 } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({
              text: options.docTitle || '',
              italics: true, size: 18, font: FONT_FAMILY_SERIF, color: '777777',
            })],
            alignment: AlignmentType.RIGHT,
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [
              new TextRun({ text: 'Trang ', size: 18, font: FONT_FAMILY_SERIF }),
              PageNumber.CURRENT,
            ],
            alignment: AlignmentType.CENTER,
          })],
        }),
      },
      children: elements,
    }],
  });

  const buf = await Packer.toBuffer(doc);
  logFn('=== HOÀN TẤT! ' + (buf.length / 1024 / 1024).toFixed(2) + ' MB ===');
  return buf;
}

function ptToHalfPt(pt) { return ptToHp(pt); }

module.exports = {
  convertPdfToDocx,
  extractImagesFromPdf,
  extractRichTextFromPdf,
  parseRichPdfToWord,
  FONT_FAMILY_SERIF,
  FONT_FAMILY_SANS,
  ptToHalfPt,
};
