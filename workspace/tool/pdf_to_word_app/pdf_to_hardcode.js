'use strict';
/**
 * pdf_to_hardcode.js
 * 
 * BƯỚC 1: Đọc file PDF → sinh ra file JS hardcode chứa toàn bộ nội dung
 *         theo cú pháp giống scratch/build_part*.js
 * 
 * Cách dùng:
 *   node pdf_to_hardcode.js "path/to/file.pdf" [output_prefix]
 * 
 * Output:
 *   - {output_prefix}_content.js  : file JS hardcode nội dung
 *   - {output_prefix}_runner.js   : file runner để sinh DOCX
 *   - doc_images/                 : thư mục chứa ảnh đã extract
 */

const fs   = require('fs');
const path = require('path');
const { extractRichTextFromPdf, extractImagesFromPdf } = require('./converter_core');

// ============================================================
// Helpers: phân tích cấu trúc từ merged segments
// ============================================================

function getDominantFontSize(items) {
  const cnt = {};
  for (const it of items) {
    if (it.height > 0) { const s = Math.round(it.height); cnt[s] = (cnt[s]||0)+1; }
  }
  let max = 0, dom = 13;
  for (const [s, c] of Object.entries(cnt)) { if (c > max) { max = c; dom = Number(s); } }
  return dom;
}

function groupIntoRows(items, yTol = 3) {
  if (!items.length) return [];
  const sorted = [...items].sort((a, b) =>
    Math.abs(a.yTop - b.yTop) <= yTol ? a.x - b.x : a.yTop - b.yTop
  );
  const rows = []; let cur = [sorted[0]], cy = sorted[0].yTop;
  for (let i = 1; i < sorted.length; i++) {
    const it = sorted[i];
    if (Math.abs(it.yTop - cy) <= yTol) cur.push(it);
    else { rows.push(cur.sort((a,b)=>a.x-b.x)); cur = [it]; cy = it.yTop; }
  }
  if (cur.length) rows.push(cur.sort((a,b)=>a.x-b.x));
  return rows;
}

function mergeRowIntoSegments(row) {
  if (!row.length) return [];
  const totalW = row.reduce((s, it) => s + it.width, 0);
  const totalC = row.reduce((s, it) => s + Math.max(it.str.length, 1), 0);
  const avgCharW = totalC > 0 ? totalW / totalC : 6;
  const wordGap  = avgCharW * 0.9;
  const colGap   = avgCharW * 4.5;

  const tokens = [];
  let cur = { str: row[0].str, x: row[0].x, endX: row[0].x + row[0].width, height: row[0].height };
  for (let i = 1; i < row.length; i++) {
    const it = row[i], gap = it.x - cur.endX;
    if (gap < wordGap) {
      const sp = cur.str.length > 0 && !cur.str.endsWith(' ') && !it.str.startsWith(' ') && gap > avgCharW * 0.6;
      cur.str  += (sp ? ' ' : '') + it.str;
      cur.endX  = Math.max(cur.endX, it.x + it.width);
      if (it.height > cur.height) cur.height = it.height;
    } else { tokens.push(cur); cur = { str: it.str, x: it.x, endX: it.x + it.width, height: it.height }; }
  }
  tokens.push(cur);

  const segs = []; let seg = { ...tokens[0] };
  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i], gap = t.x - tokens[i-1].endX;
    if (gap >= colGap) { segs.push(seg); seg = { ...t }; }
    else {
      const sp = seg.str.length > 0 && !seg.str.endsWith(' ') && !t.str.startsWith(' ');
      seg.str += (sp ? ' ' : '') + t.str; seg.endX = t.endX;
      if (t.height > seg.height) seg.height = t.height;
    }
  }
  segs.push(seg);
  return segs.map(s => ({ ...s, str: s.str.trim() })).filter(s => s.str.length > 0);
}

function detectHeadingLevel(text) {
  const t = (text || '').trim();
  if (!t) return 0;
  if (/^(PHẦN\s+[IVXLCDM\d]+|QUY ĐỊNH CHUNG|QUYẾT ĐỊNH|PHỤ LỤC(\s+[IVXLCDM\d]+)?|ĐỊNH DẠNG THÀNH PHẦN|KẾT LUẬN)/i.test(t)) return 1;
  if (/^QUY ĐỊNH$|^CỤC TRƯỞNG/.test(t)) return 1;
  if (/^[IVXLCDM]{1,6}\.\s+\S/.test(t)) return 2;
  if (/^\d{1,2}\.\s+\S/.test(t)) return 3;
  if (/^Điều\s+\d+/i.test(t)) return 3;
  if (/^[a-zđ]\)\s+\S/i.test(t)) return 4;
  return 0;
}

function isBoldLine(text) {
  const t = (text || '').trim();
  if (!t) return false;
  // ALL CAPS 4+ chars
  if (t.length >= 4 && t === t.toUpperCase() && /[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐƠƯẠẶẦẨẪẬẮẰẲẴẶẺẼẸỀỆỂỄỊỌỘỔỖỘỜỞỢỤỪỨỰỲỴ]/.test(t)) return true;
  if (/^[IVXLCDM]{1,6}\.\s/.test(t)) return true;
  if (/^\d{1,2}\.\s/.test(t)) return true;
  if (/^[a-zđ]\)\s/i.test(t)) return true;
  if (/^Điều\s+\d+/i.test(t)) return true;
  if (/^(Phần|Phụ lục)\s/i.test(t)) return true;
  return false;
}

function isCenterLine(text, segs, pageWidth) {
  if (!segs || !segs.length) return false;
  const lx = segs[0].x;
  const rx = segs[segs.length-1].endX || segs[segs.length-1].x + 40;
  const cx = (lx + rx) / 2;
  return Math.abs(cx - pageWidth/2) < pageWidth * 0.1 && lx > pageWidth * 0.18;
}

function isGovHeaderRow(row, pageWidth) {
  const mid = pageWidth / 2;
  const left  = row.filter(it => it.x < mid - 20);
  const right = row.filter(it => it.x > mid + 20);
  return left.length > 0 && right.length > 0;
}

// ============================================================
// JS Code generation helpers
// ============================================================

function escStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function genHeading(level, text) {
  const fn = ['', 'createHeading1', 'createHeading2', 'createHeading3', 'createHeading4', 'createHeading5'];
  return `  ${fn[level] || 'createHeading3'}(\`${escStr(text)}\`),`;
}

function genParagraph(text, bold = false, center = false, italic = false, bullet = false) {
  const opts = [];
  if (bold)   opts.push('bold: true');
  if (center) opts.push('alignment: AlignmentType.CENTER');
  if (italic) opts.push('italics: true');
  if (bullet) opts.push('bullet: { level: 0 }');

  if (opts.length === 0) {
    return `  createParagraph(\`${escStr(text)}\`),`;
  }
  return `  createParagraph(\`${escStr(text)}\`, { ${opts.join(', ')} }),`;
}

function genBlank(spacing = 60) {
  return `  createParagraph('', { spacingBefore: ${spacing}, spacingAfter: ${spacing} }),`;
}

function genImage(imgVarName, w, h, caption) {
  const lines = [];
  lines.push(`  // [IMAGE ${imgVarName}]`);
  lines.push(`  new Paragraph({`);
  lines.push(`    children: [new ImageRun({ data: ${imgVarName}, transformation: { width: ${w}, height: ${h} } })],`);
  lines.push(`    alignment: AlignmentType.CENTER,`);
  lines.push(`    spacing: { before: 100, after: 60 },`);
  lines.push(`  }),`);
  if (caption) {
    lines.push(`  createParagraph(\`${escStr(caption)}\`, { italics: true, alignment: AlignmentType.CENTER, spacingBefore: 20, spacingAfter: 80 }),`);
  }
  return lines.join('\n');
}

function genGovHeaderTable(leftLines, rightLines) {
  const lines = [];
  lines.push(`  // === HEADER VĂN BẢN HÀNH CHÍNH (2 cột) ===`);
  lines.push(`  new Table({`);
  lines.push(`    width: { size: 100, type: WidthType.PERCENTAGE },`);
  lines.push(`    borders: NO_BORDER,`);
  lines.push(`    rows: [new TableRow({ children: [`);
  lines.push(`      new TableCell({`);
  lines.push(`        width: { size: 45, type: WidthType.PERCENTAGE },`);
  lines.push(`        borders: NO_BORDER,`);
  lines.push(`        children: [`);
  for (const l of leftLines) {
    const isUnder = /độc lập|tự do|hạnh phúc/i.test(l);
    const isBold  = isBoldLine(l) || /BỘ|CỤC|SỐ/i.test(l);
    lines.push(`          new Paragraph({ children: [new TextRun({ text: \`${escStr(l)}\`, font: FONT, size: 26, bold: ${isBold}, ${isUnder ? 'underline: { type: UnderlineType.SINGLE },' : ''} color: '000000' })], alignment: AlignmentType.CENTER, spacing: { line: 240, before: 30, after: 30 } }),`);
  }
  lines.push(`        ],`);
  lines.push(`      }),`);
  lines.push(`      new TableCell({`);
  lines.push(`        width: { size: 55, type: WidthType.PERCENTAGE },`);
  lines.push(`        borders: NO_BORDER,`);
  lines.push(`        children: [`);
  for (const r of rightLines) {
    const isUnder = /độc lập|tự do|hạnh phúc/i.test(r);
    const isBold  = isBoldLine(r) || /CỘNG HÒA|ĐỘC LẬP/i.test(r);
    lines.push(`          new Paragraph({ children: [new TextRun({ text: \`${escStr(r)}\`, font: FONT, size: 26, bold: ${isBold}, ${isUnder ? 'underline: { type: UnderlineType.SINGLE },' : ''} color: '000000' })], alignment: AlignmentType.CENTER, spacing: { line: 240, before: 30, after: 30 } }),`);
  }
  lines.push(`        ],`);
  lines.push(`      }),`);
  lines.push(`    ]})],`);
  lines.push(`  }),`);
  return lines.join('\n');
}

function genTable(headerCells, dataRows, colWidths) {
  const totalW = colWidths.reduce((a,b)=>a+b,0);
  const lines  = [];
  lines.push(`  createTable(`);
  lines.push(`    [${headerCells.map(h => `\`${escStr(h)}\``).join(', ')}],`);
  lines.push(`    [`);
  for (const row of dataRows) {
    if (row.isSection) {
      lines.push(`      { isSection: true, text: \`${escStr(row.text)}\` },`);
    } else {
      const cells = row.cells.map(c => `\`${escStr(c)}\``).join(', ');
      lines.push(`      { cells: [${cells}] },`);
    }
  }
  lines.push(`    ],`);
  lines.push(`    [${colWidths.join(', ')}],`);
  lines.push(`  ),`);
  return lines.join('\n');
}

// ============================================================
// Detect table structure from consecutive rows
// ============================================================
function detectTableRegions(rows) {
  const tagged = rows.map(row => ({
    row, segs: mergeRowIntoSegments(row)
  }));

  const groups = [];
  let i = 0;
  while (i < tagged.length) {
    if (tagged[i].segs.length >= 3) {
      const tbl = [tagged[i]];
      let j = i + 1;
      // Collect subsequent rows with >= 2 segs OR single-seg continuations
      while (j < tagged.length) {
        const nextSegs = tagged[j].segs;
        const prevSegs = tbl[tbl.length-1].segs;
        if (nextSegs.length >= 2) {
          tbl.push(tagged[j]); j++;
        } else if (nextSegs.length === 1 && prevSegs.length >= 2) {
          // Continuation row — merge into last row's last column
          const lastRow = tbl[tbl.length-1];
          const lastCol = lastRow.segs.length - 1;
          const merged  = { ...lastRow };
          merged.segs   = [...lastRow.segs];
          merged.segs[lastCol] = {
            ...merged.segs[lastCol],
            str: merged.segs[lastCol].str + ' ' + nextSegs[0].str,
          };
          tbl[tbl.length-1] = merged;
          j++;
        } else break;
      }
      if (tbl.length >= 2) {
        groups.push({ type: 'table', items: tbl });
        i = j;
        continue;
      }
    }
    groups.push({ type: 'text', items: [tagged[i]] });
    i++;
  }
  return groups;
}

// Convert column x-positions to DXA widths
function computeColWidths(tableItems) {
  // Find row with most columns to use as reference
  const ref = tableItems.reduce((m, ti) => ti.segs.length > m.segs.length ? ti : m, tableItems[0]);
  const segs = ref.segs;
  const colCount = segs.length;
  const totalDxa = 9072;

  if (colCount <= 1) return [totalDxa];

  // Proportional widths from x-gap between column starts
  const gaps = [];
  for (let c = 0; c < colCount; c++) {
    const seg  = segs[c];
    const next = segs[c+1];
    const w    = next ? (next.x - seg.x) : 100;
    gaps.push(Math.max(w, 20));
  }
  const totalGap = gaps.reduce((s, g) => s + g, 0);
  return gaps.map(g => Math.round((g / totalGap) * totalDxa));
}

// ============================================================
// MAIN: Parse PDF → generate JS code
// ============================================================
async function generateHardcode(pdfPath, outputPrefix) {
  console.log('=== PDF → Hardcode JS Generator ===');
  console.log('Input:', pdfPath);

  const pdfBuffer = fs.readFileSync(pdfPath);
  const baseName  = path.basename(pdfPath, path.extname(pdfPath));
  const prefix    = outputPrefix || baseName.replace(/[^a-zA-Z0-9_]/g, '_');
  const outDir    = path.dirname(pdfPath) === '.' ? process.cwd() : path.dirname(pdfPath);

  // --- Extract images ---
  console.log('Đang extract hình ảnh...');
  const imagesByPage = await extractImagesFromPdf(pdfBuffer, () => {});
  const imgDir = path.join(process.cwd(), 'doc_images');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

  const imgVarMap = {};  // pageNum → { varName, w, h, ext }
  for (const [pageNum, imgs] of Object.entries(imagesByPage)) {
    imgs.forEach((img, idx) => {
      const varName = `img_p${pageNum}_${idx}`;
      const ext     = img.buffer[0] === 0xFF ? 'jpg' : 'png';
      const outPath = path.join(imgDir, `${varName}.${ext}`);
      fs.writeFileSync(outPath, img.buffer);
      if (!imgVarMap[pageNum]) imgVarMap[pageNum] = [];
      imgVarMap[pageNum].push({ varName, w: img.width, h: img.height, ext, outPath });
    });
  }
  console.log('Saved', Object.values(imgVarMap).flat().length, 'images to', imgDir);

  // --- Extract text ---
  console.log('Đang phân tích văn bản...');
  const richPages = await extractRichTextFromPdf(pdfBuffer, () => {});
  console.log('Tổng', richPages.length, 'trang');

  // --- Generate JS code ---
  const contentLines = []; // array of JS code strings for each element
  const imgImports   = []; // image require lines

  // Collect image imports
  for (const imgs of Object.values(imgVarMap)) {
    for (const img of imgs) {
      const relPath = path.relative(process.cwd(), img.outPath).replace(/\\/g, '/');
      imgImports.push(`const ${img.varName} = fs.readFileSync('./${relPath}');`);
    }
  }

  for (const { pageNum, items, pageWidth, pageHeight } of richPages) {
    const valid = items.filter(it => it.str && it.str.trim().length > 0);

    // Add comment marker per page
    contentLines.push(`\n  // ========== TRANG ${pageNum} ==========`);

    // Scanned / image-only page
    if (valid.length === 0) {
      const pImgs = imgVarMap[pageNum] || [];
      for (const img of pImgs) {
        // Scale image to fit page
        const maxW = 480, maxH = 580;
        let w = img.w, h = img.h;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
        contentLines.push(genImage(img.varName, w, h, ''));
      }
      continue;
    }

    const dominantSize = getDominantFontSize(valid);
    const rows         = groupIntoRows(valid);
    const pw           = pageWidth || 595;

    // Detect gov header (2-col rows at top) — ONLY on first few pages of document
    // FIX: merge full row into segments FIRST, then split by segment center point.
    // This avoids cutting a word like "CỘNG HÒA" in half when its start-x is near mid.
    const mid = pw / 2;
    let govHeaderEndIdx = 0;
    const leftLines  = [];
    const rightLines = [];

    if (pageNum <= 5) {
      for (let ri = 0; ri < Math.min(8, rows.length); ri++) {
        const row  = rows[ri];
        const segs = mergeRowIntoSegments(row.sort((a,b) => a.x - b.x));

        // Classify each segment by its visual center x
        const leftSegs  = segs.filter(s => {
          const centerX = s.x + (s.endX - s.x) / 2;
          return centerX < mid;
        });
        const rightSegs = segs.filter(s => {
          const centerX = s.x + (s.endX - s.x) / 2;
          return centerX >= mid;
        });

        if (leftSegs.length > 0 && rightSegs.length > 0) {
          const lStr = leftSegs.map(s => s.str).join(' ').trim();
          const rStr = rightSegs.map(s => s.str).join(' ').trim();
          if (lStr) leftLines.push(lStr);
          if (rStr) rightLines.push(rStr);
          govHeaderEndIdx = ri + 1;
        } else {
          // Once we lose the 2-col structure, stop
          if (leftLines.length > 0 || rightLines.length > 0) break;
        }
      }
    }

    if (leftLines.length > 0 || rightLines.length > 0) {
      contentLines.push(genGovHeaderTable(leftLines, rightLines));
      contentLines.push(genBlank(80));
    }

    // Detect images for this page
    const pImgs = [...(imgVarMap[pageNum] || [])];
    let imgUsedIdx = 0;

    // Process content rows (after header)
    const contentRows = rows.slice(govHeaderEndIdx);
    const groups      = detectTableRegions(contentRows);

    for (const group of groups) {
      if (group.type === 'table' && group.items.length >= 2) {
        // Generate table
        const headerRow  = group.items[0];
        const headerSegs = headerRow.segs;
        const headers    = headerSegs.map(s => s.str);
        const colWidths  = computeColWidths(group.items);
        
        // Pad colWidths if needed
        while (colWidths.length < headers.length) colWidths.push(1200);

        const dataRows = [];
        for (let ri = 1; ri < group.items.length; ri++) {
          const segs  = group.items[ri].segs;
          const cells = [];
          for (let ci = 0; ci < headers.length; ci++) {
            cells.push(segs[ci] ? segs[ci].str : '');
          }
          dataRows.push({ cells });
        }

        contentLines.push(genTable(headers, dataRows, colWidths));
        contentLines.push(genBlank(60));
        continue;
      }

      // Text rows
      for (const { segs } of group.items) {
        const lineStr = segs.map(s => s.str).join(' ').trim();
        if (!lineStr) continue;
        if (/^\d{1,4}$/.test(lineStr)) continue;  // skip page numbers

        // Image caption → insert image before it
        const isCaption = /^(Hình\s*(minh họa|số\s*\d|\d)|Sơ đồ\s*\d|Biểu đồ\s*\d|Figure\s*\d)/i.test(lineStr);
        if (isCaption && imgUsedIdx < pImgs.length) {
          const img = pImgs[imgUsedIdx++];
          const maxW = 480, maxH = 580;
          let w = img.w, h = img.h;
          if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
          if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
          contentLines.push(genImage(img.varName, w, h, lineStr));
          continue;
        }

        const hlevel = detectHeadingLevel(lineStr);
        if (hlevel > 0) {
          contentLines.push(genHeading(hlevel, lineStr));
        } else {
          const bold    = isBoldLine(lineStr);
          const center  = isCenterLine(lineStr, segs, pw);
          const italic  = /^(Căn cứ|Theo đề nghị|Xét|Trên cơ sở)/i.test(lineStr);
          const bullet  = /^[+\-▪•]\s/.test(lineStr);
          contentLines.push(genParagraph(lineStr, bold, center, italic, bullet));
        }
      }
    }

    // Remaining images
    while (imgUsedIdx < pImgs.length) {
      const img = pImgs[imgUsedIdx++];
      const maxW = 480, maxH = 580;
      let w = img.w, h = img.h;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
      contentLines.push(genImage(img.varName, w, h, ''));
    }
  }

  // ============================================================
  // Write generated content JS file
  // ============================================================
  const contentFile = path.join(process.cwd(), `${prefix}_content.js`);

  const contentJS = `'use strict';
/**
 * ${prefix}_content.js
 * AUTO-GENERATED by pdf_to_hardcode.js
 * Source: ${path.basename(pdfPath)}
 * 
 * Bạn có thể EDIT file này để chỉnh sửa nội dung trước khi tạo DOCX.
 * Sau khi chỉnh xong, chạy: node ${prefix}_runner.js
 */

const fs = require('fs');
const path = require('path');
const {
  Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, BorderStyle, VerticalAlign,
  ImageRun, HeadingLevel, UnderlineType
} = require('docx');
const {
  createText, createParagraph,
  createHeading1, createHeading2, createHeading3, createHeading4, createHeading5,
  createTable, createDocImage, FONT_FAMILY
} = require('./docx_builder');

const FONT = FONT_FAMILY;

// No-border helper for header table
const NO_BORDER = {
  top:             { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom:          { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left:            { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right:           { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal:{ style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

// ---- Image imports ----
${imgImports.join('\n')}

// ---- Document content ----
function getElements() {
  return [
${contentLines.join('\n')}
  ];
}

module.exports = { getElements };
`;

  fs.writeFileSync(contentFile, contentJS, 'utf8');
  console.log('\n✅ Bước 1 hoàn tất!');
  console.log('  Content JS:', contentFile);

  // ============================================================
  // Write runner JS file
  // ============================================================
  const runnerFile = path.join(process.cwd(), `${prefix}_runner.js`);
  const runnerJS = `'use strict';
/**
 * ${prefix}_runner.js
 * AUTO-GENERATED by pdf_to_hardcode.js
 * 
 * Bước 2: Đọc content JS đã hardcode → sinh file DOCX chuẩn.
 * Cách dùng: node ${prefix}_runner.js
 */

const fs   = require('fs');
const path = require('path');
const {
  Document, Packer, Header, Footer, AlignmentType, PageNumber
} = require('docx');
const { createParagraph, createText, FONT_FAMILY } = require('./docx_builder');
const { getElements } = require('./${prefix}_content');

async function build() {
  console.log('Đang nạp nội dung từ ${prefix}_content.js...');
  const elements = getElements();
  console.log('Tổng', elements.length, 'phần tử (paragraphs/tables/images)');

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT_FAMILY, size: 26, color: '000000' },
          paragraph: { spacing: { line: 276, before: 40, after: 40 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, bottom: 1134, left: 1701, right: 1134 },
        },
      },
      headers: {
        default: new Header({
          children: [createParagraph([
            createText('${baseName.replace(/'/g, "\\'")}', { italics: true, size: 20 })
          ], { alignment: AlignmentType.RIGHT })],
        }),
      },
      footers: {
        default: new Footer({
          children: [createParagraph([
            createText('Trang ', { size: 20 }),
            PageNumber.CURRENT,
          ], { alignment: AlignmentType.CENTER })],
        }),
      },
      children: elements,
    }],
  });

  console.log('Đang đóng gói DOCX...');
  const buffer = await Packer.toBuffer(doc);

  const outPath = path.join(process.cwd(), '${prefix}_output.docx');
  fs.writeFileSync(outPath, buffer);

  // Also copy to Downloads
  const dlPath = 'C:\\\\Users\\\\DANGHP\\\\Downloads\\\\${prefix}_output.docx';
  try { fs.writeFileSync(dlPath, buffer); } catch {}

  console.log('\\n✅ Bước 2 hoàn tất!');
  console.log('  File Word:', outPath);
  console.log('  Kích thước:', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
}

build().catch(err => { console.error('LỖI:', err.message); process.exit(1); });
`;

  fs.writeFileSync(runnerFile, runnerJS, 'utf8');
  console.log('  Runner JS:', runnerFile);

  console.log('\n📌 Tiếp theo:');
  console.log('  1. Review/edit:', contentFile);
  console.log('  2. Chạy Bước 2: node', path.basename(runnerFile));

  return { contentFile, runnerFile, prefix };
}

// ============================================================
// CLI entry point
// ============================================================
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Cách dùng: node pdf_to_hardcode.js <file.pdf> [output_prefix]');
  process.exit(1);
}

generateHardcode(args[0], args[1]).catch(err => {
  console.error('LỖI:', err.message);
  console.error(err.stack);
  process.exit(1);
});
