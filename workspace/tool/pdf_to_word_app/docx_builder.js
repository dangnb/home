// Helper module to build docx elements matching the exact format of official Vietnamese Government PDFs
const fs = require('fs');
const path = require('path');
const {
  Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  VerticalAlign, UnderlineType, ImageRun
} = require('docx');
const { imageSize } = require('image-size');

const FONT_FAMILY = "Times New Roman";

function createText(text, options = {}) {
  return new TextRun({
    text: text,
    font: FONT_FAMILY,
    size: options.size || 26, // 13pt
    bold: options.bold || false,
    italics: options.italics || false,
    color: options.color || "000000",
    underline: options.underline ? { type: UnderlineType.SINGLE } : undefined,
    break: options.break || undefined
  });
}

function createParagraph(children, options = {}) {
  const runChildren = Array.isArray(children) 
    ? children.map(c => typeof c === 'string' ? createText(c, options) : c)
    : [typeof children === 'string' ? createText(children, options) : children];

  return new Paragraph({
    children: runChildren,
    alignment: options.alignment || AlignmentType.LEFT,
    heading: options.heading || undefined,
    spacing: {
      line: 276, // 1.15 line spacing
      before: options.spacingBefore !== undefined ? options.spacingBefore : 40,
      after: options.spacingAfter !== undefined ? options.spacingAfter : 40,
    },
    bullet: options.bullet || undefined,
    indent: options.indent || undefined
  });
}

// Chuẩn phân cấp văn bản hành chính Việt Nam
// Level 1: PHẦN (In hoa đậm, căn giữa)
function createHeading1(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT_FAMILY, size: 28, bold: true, color: "000000" })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 80, line: 276 },
    alignment: options.alignment || AlignmentType.CENTER
  });
}

// Level 2: I, II, III, IV... (Số La Mã đậm)
function createHeading2(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT_FAMILY, size: 26, bold: true, color: "000000" })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 140, after: 60, line: 276 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

// Level 3: 1, 2, 3, 4... (Số Ả Rập đậm)
function createHeading3(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT_FAMILY, size: 26, bold: true, color: "000000" })],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 100, after: 40, line: 276 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

// Level 4: a), b), c), d), đ)... (Chữ cái thường đậm)
function createHeading4(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT_FAMILY, size: 26, bold: true, color: "000000" })],
    heading: HeadingLevel.HEADING_4,
    spacing: { before: 80, after: 40, line: 276 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

// Level 5: Các mục con sâu hơn
function createHeading5(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT_FAMILY, size: 26, bold: true, italics: true, color: "000000" })],
    heading: HeadingLevel.HEADING_5,
    spacing: { before: 60, after: 30, line: 276 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

// Helper chèn hình ảnh sơ đồ chính xác
function createDocImage(pageNum, caption) {
  const elements = [];
  const imgDir = path.join(__dirname, 'doc_images');
  let imgPath = path.join(imgDir, `figure_page_${pageNum}.png`);
  if (!fs.existsSync(imgPath)) {
    imgPath = path.join(imgDir, `figure_page_${pageNum}.jpg`);
  }

  if (fs.existsSync(imgPath)) {
    try {
      const imgBuffer = fs.readFileSync(imgPath);
      const dim = imageSize(imgBuffer);
      
      // Page printable width in points ~ 500pt (or ~600px)
      const maxW = 520;
      const maxH = 450;
      let w = dim.width;
      let h = dim.height;

      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      if (h > maxH) {
        w = Math.round((w * maxH) / h);
        h = maxH;
      }

      elements.push(new Paragraph({
        children: [
          new ImageRun({
            data: imgBuffer,
            transformation: {
              width: w,
              height: h
            }
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 40 }
      }));
    } catch (e) {
      console.error(`Error loading image for page ${pageNum}:`, e.message);
    }
  }

  if (caption) {
    elements.push(new Paragraph({
      children: [new TextRun({ text: caption, font: FONT_FAMILY, size: 24, italics: true, color: "000000" })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 20, after: 80 }
    }));
  }

  return elements;
}

// Border chuẩn đơn sắc đen mảnh như file gốc PDF
const standardTableBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
};

const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function createCell(content, options = {}) {
  let pList = [];
  if (typeof content === 'string') {
    const lines = content.split('\n');
    pList = lines.map(line => new Paragraph({
      children: [new TextRun({
        text: line,
        font: FONT_FAMILY,
        size: options.size || 24, // 12pt in table
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || "000000"
      })],
      alignment: options.alignment || AlignmentType.LEFT,
      spacing: { line: 240, before: 10, after: 10 }
    }));
  } else if (Array.isArray(content)) {
    pList = content;
  } else {
    pList = [content];
  }

  return new TableCell({
    children: pList,
    width: options.width ? { size: options.width, type: WidthType.DXA } : undefined,
    columnSpan: options.colSpan || undefined,
    rowSpan: options.rowSpan || undefined,
    shading: options.shading ? { fill: options.shading, type: ShadingType.CLEAR } : undefined,
    verticalAlign: options.verticalAlign || VerticalAlign.CENTER,
    margins: cellMargins
  });
}

function createSectionRow(text, colCount, width) {
  return new TableRow({
    children: [
      createCell(text, {
        bold: true,
        colSpan: colCount,
        width: width,
        size: 24
      })
    ]
  });
}

function createTable(headers, rowsData, widths, options = {}) {
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => createCell(h, {
      bold: true,
      alignment: AlignmentType.CENTER,
      width: widths[i],
      size: 24
    }))
  });

  const tableRows = [headerRow];

  for (const r of rowsData) {
    if (r.isSection) {
      tableRows.push(createSectionRow(r.text, widths.length, totalWidth));
    } else {
      const cells = r.cells.map((c, i) => {
        let align = AlignmentType.LEFT;
        if (i === 0 && (r.cells.length > 2 || widths[i] <= 1000)) {
          align = AlignmentType.CENTER;
        } else if (headers[i] && (headers[i].includes("Độ dài") || headers[i] === "ID" || headers[i] === "Mã")) {
          align = AlignmentType.CENTER;
        }
        if (r.alignments && r.alignments[i]) {
          align = r.alignments[i];
        }
        return createCell(c, {
          width: widths[i],
          alignment: align,
          bold: r.boldColumns && r.boldColumns.includes(i)
        });
      });
      tableRows.push(new TableRow({ children: cells }));
    }
  }

  return new Table({
    rows: tableRows,
    width: { size: totalWidth, type: WidthType.DXA },
    borders: standardTableBorders,
    alignment: AlignmentType.CENTER
  });
}

module.exports = {
  createText,
  createParagraph,
  createHeading1,
  createHeading2,
  createHeading3,
  createHeading4,
  createHeading5,
  createDocImage,
  createCell,
  createTable,
  createSectionRow,
  FONT_FAMILY
};
