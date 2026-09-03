#!/usr/bin/env python3
"""
pdf2word.py — Chuyển đổi PDF sang Word sử dụng pdf2docx
Ưu tiên text, giữ nguyên layout 100%, fallback sang ảnh nếu cần.
Post-processing: fix table borders + table width overflow.

Cách dùng:
  python pdf2word.py input.pdf output.docx [start_page] [end_page]
"""

import sys
import os
import traceback
import multiprocessing

# Fix Windows console encoding — only when run as a script, not imported
if __name__ == "__main__":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


# ============================================================
# Post-processing: fix table borders & width
# ============================================================
def _set_border_elem(border_name, sz='4', color='000000'):
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    b = OxmlElement(f'w:{border_name}')
    b.set(qn('w:val'), 'single')
    b.set(qn('w:sz'), sz)
    b.set(qn('w:space'), '0')
    b.set(qn('w:color'), color)
    return b


def _fix_table_borders(table):
    """Ensure all borders (table-level and cell-level) are present and visible."""
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    tbl   = table._tbl
    tblPr = tbl.find(qn('w:tblPr'))
    if tblPr is None:
        tblPr = OxmlElement('w:tblPr')
        tbl.insert(0, tblPr)

    # Remove and re-add tblBorders to guarantee all 6 borders
    old = tblPr.find(qn('w:tblBorders'))
    if old is not None:
        tblPr.remove(old)

    tblBorders = OxmlElement('w:tblBorders')
    for name in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        tblBorders.append(_set_border_elem(name))
    tblPr.append(tblBorders)

    # Fix each cell's borders too (pdf2docx sometimes sets "none" on individual cells)
    for row in table.rows:
        for cell in row.cells:
            tc   = cell._tc
            tcPr = tc.find(qn('w:tcPr'))
            if tcPr is None:
                tcPr = OxmlElement('w:tcPr')
                tc.insert(0, tcPr)

            old = tcPr.find(qn('w:tcBorders'))
            if old is not None:
                tcPr.remove(old)

            tcBorders = OxmlElement('w:tcBorders')
            for name in ('top', 'left', 'bottom', 'right'):
                tcBorders.append(_set_border_elem(name))
            tcPr.append(tcBorders)


def _fix_table_width(table):
    """Set table width to 100% of text area — prevents right-side overflow."""
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    tbl   = table._tbl
    tblPr = tbl.find(qn('w:tblPr'))
    if tblPr is None:
        tblPr = OxmlElement('w:tblPr')
        tbl.insert(0, tblPr)

    old = tblPr.find(qn('w:tblW'))
    if old is not None:
        tblPr.remove(old)

    tblW = OxmlElement('w:tblW')
    tblW.set(qn('w:w'), '5000')   # 5000/100 = 100% of page text width
    tblW.set(qn('w:type'), 'pct')
    tblPr.append(tblW)

    # Also fix column widths: distribute proportionally
    # Get current col widths from grid
    tblGrid = tbl.find(qn('w:tblGrid'))
    if tblGrid is not None:
        gridCols = tblGrid.findall(qn('w:gridCol'))
        if gridCols:
            total_w = sum(int(c.get(qn('w:w'), 1000)) for c in gridCols)
            for c in gridCols:
                cw = int(c.get(qn('w:w'), 1000))
                # Keep relative proportions, will scale with tblW=100%
                c.set(qn('w:w'), str(cw))


def _fix_table_indent(table):
    """Remove any left indent (tblInd) that shifts the table off-page."""
    from docx.oxml.ns import qn

    tbl   = table._tbl
    tblPr = tbl.find(qn('w:tblPr'))
    if tblPr is None:
        return
    ind = tblPr.find(qn('w:tblInd'))
    if ind is not None:
        tblPr.remove(ind)


def _add_toc_field(paragraph):
    """Add a native Microsoft Word TOC field that updates automatically."""
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    p = paragraph._p
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.set(qn('xml:space'), 'preserve')
    instrText.text = 'TOC \\o "1-3" \\h \\z \\u'
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'separate')
    fldChar3 = OxmlElement('w:fldChar')
    fldChar3.set(qn('w:fldCharType'), 'end')

    r = paragraph.add_run()._r
    r.append(fldChar1)
    r.append(instrText)
    r.append(fldChar2)
    r.append(fldChar3)


def _extract_title(text):
    import re
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if not lines:
        return ""
    if len(lines) >= 2 and re.match(r'^(Phần|Phụ lục)\s+[IVXLCDM\d]+', lines[0], re.I):
        return f"{lines[0]}: {lines[1]}"
    return lines[0]


def _extract_toc_from_pdf(pdf_path, max_level=4):
    import fitz, re
    doc = fitz.open(pdf_path)
    toc_entries = []

    p_phu_luc   = re.compile(r'^(Phụ lục|PHỤ LỤC)\s+([IVXLCDM\d]+)\b', re.I)
    p_phan      = re.compile(r'^(Phần|PHẦN)\s+([IVXLCDM\d]+)\b', re.I)
    p_muc_la_ma = re.compile(r'^([IVXLCDM]{1,6})\.\s+(.+)', re.I)
    p_dieu      = re.compile(r'^(Điều\s+\d+[\.:]|\d{1,2}\.\s+)\s*(.+)', re.I)
    p_alpha     = re.compile(r'^([a-zđ])\)\s+(.+)', re.I)

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        text = page.get_text("text")
        lines = [l.strip() for l in text.split("\n") if l.strip()]

        for j, line in enumerate(lines):
            level = 0
            title = ""

            if p_phan.match(line):
                if len(line) < 30 and not re.search(r'quy định này|theo quy định', line, re.I):
                    level = 1
                    sub = lines[j+1] if j+1 < len(lines) and len(lines[j+1]) < 100 else ""
                    title = f"{line} - {sub}".strip(" -")
            elif p_phu_luc.match(line):
                if len(line) < 30 and not re.search(r'thông tư|nghị định|quy định này|kèm theo', line, re.I):
                    level = 1
                    sub = lines[j+1] if j+1 < len(lines) and len(lines[j+1]) < 120 else ""
                    title = f"{line} - {sub}".strip(" -")
            elif p_muc_la_ma.match(line) and len(line) < 90 and max_level >= 2:
                if not re.search(r'quy định này|theo quy định|điểm|khoản', line, re.I):
                    level = 2
                    title = line
            elif p_dieu.match(line) and len(line) < 100 and max_level >= 3:
                if not re.search(r'quy định này|theo quy định', line, re.I):
                    level = 3
                    title = line
            elif p_alpha.match(line) and len(line) < 110 and max_level >= 4:
                level = 4
                title = line

            if 0 < level <= max_level and len(title) > 3:
                title = re.sub(r'\s+', ' ', title)
                if not any(e[2] == title for e in toc_entries):
                    toc_entries.append((page_idx + 1, level, title))

    return toc_entries


def _generate_toc_and_headings(doc, input_pdf=None, toc_level=4):
    """Detect Phần, Mục, Điều, Phụ lục, apply Heading styles, and insert professional Table of Contents."""
    if toc_level == 0:
        print("[POSTPROCESS] Bỏ qua tạo mục lục (người dùng chọn tắt).")
        return

    import re
    from docx.shared import Pt, Inches, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
    from docx.enum.table import WD_TABLE_ALIGNMENT
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    # Apply Heading styles across document for Word's Navigation Pane
    p_phu_luc   = re.compile(r'^(Phụ lục|PHỤ LỤC)\s+([IVXLCDM\d]+)', re.I)
    p_phan      = re.compile(r'^(Phần|PHẦN)\s+([IVXLCDM\d]+)', re.I)
    p_muc_la_ma = re.compile(r'^([IVXLCDM]{1,6})\.\s+(.+)', re.I)
    p_dieu      = re.compile(r'^(Điều\s+\d+[\.:]|\d{1,2}\.\s+)\s*(.+)', re.I)
    p_alpha     = re.compile(r'^([a-zđ])\)\s+(.+)', re.I)

    for p in doc.paragraphs:
        t = p.text.strip()
        if not t:
            continue
        if p_phan.match(t) or p_phu_luc.match(t):
            try: p.style = 'Heading 1'
            except Exception: pass
        elif p_muc_la_ma.match(t) and len(t.split('\n')[0]) < 120:
            try: p.style = 'Heading 2'
            except Exception: pass
        elif p_dieu.match(t) and len(t.split('\n')[0]) < 120:
            try: p.style = 'Heading 3'
            except Exception: pass
        elif p_alpha.match(t) and len(t.split('\n')[0]) < 120:
            try: p.style = 'Heading 4'
            except Exception: pass

    # Get TOC entries
    toc_items = []
    if input_pdf and os.path.exists(input_pdf):
        try:
            toc_items = _extract_toc_from_pdf(input_pdf, max_level=toc_level)
        except Exception as e:
            print(f"[POSTPROCESS] Lỗi khi trích xuất mục lục từ PDF: {e}")

    if not toc_items:
        # Fallback from paragraphs
        for p in doc.paragraphs:
            t = p.text.strip()
            if not t: continue
            clean_t = _extract_title(t)
            if p_phan.match(t) or p_phu_luc.match(t):
                toc_items.append((1, 1, clean_t))
            elif p_muc_la_ma.match(t) and len(t.split('\n')[0]) < 90 and toc_level >= 2:
                toc_items.append((1, 2, clean_t))
            elif p_dieu.match(t) and len(t.split('\n')[0]) < 90 and toc_level >= 3:
                toc_items.append((1, 3, clean_t))
            elif p_alpha.match(t) and len(t.split('\n')[0]) < 90 and toc_level >= 4:
                toc_items.append((1, 4, clean_t))

    if not toc_items:
        return

    # Find insertion point (after legal decision / before Phần I)
    insert_idx = 0
    for i, p in enumerate(doc.paragraphs[:40]):
        if any(k in p.text for k in ('của Cục trưởng', 'QUY ĐỊNH', 'Ban hành kèm theo', 'QUYẾT ĐỊNH')):
            insert_idx = i + 1

    if insert_idx == 0:
        insert_idx = min(10, len(doc.paragraphs))

    ref_p = doc.paragraphs[insert_idx]._p

    def insert_para(text, bold=False, size=13, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=4, space_before=2):
        new_p = OxmlElement('w:p')
        ref_p.addprevious(new_p)
        from docx.text.paragraph import Paragraph
        p_obj = Paragraph(new_p, doc)
        p_obj.alignment = align
        p_obj.paragraph_format.space_before = Pt(space_before)
        p_obj.paragraph_format.space_after = Pt(space_after)
        p_obj.paragraph_format.line_spacing = 1.15
        if text:
            run = p_obj.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(size)
            run.font.bold = bold
            run.font.color.rgb = RGBColor(0, 0, 0)
        return p_obj

    # 1. Page Break before TOC
    p_brk1 = insert_para("")
    p_brk1.add_run().add_break(WD_BREAK.PAGE)

    # 2. Header Title
    insert_para("MỤC LỤC TÀI LIỆU", bold=True, size=18, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=16)

    # 3. Insert TOC Table with 2 columns (Nội Dung & Trang)
    table = doc.add_table(rows=0, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tblPr = table._tbl.tblPr
    tblBorders = OxmlElement('w:tblBorders')
    for b_name in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        b = OxmlElement(f'w:{b_name}')
        b.set(qn('w:val'), 'none')
        tblBorders.append(b)
    tblPr.append(tblBorders)

    # Header row
    hdr_row = table.add_row()
    c0 = hdr_row.cells[0]
    c1 = hdr_row.cells[1]
    p0 = c0.paragraphs[0]
    r0 = p0.add_run("NỘI DUNG")
    r0.font.name = 'Times New Roman'
    r0.font.bold = True
    r0.font.size = Pt(12)
    p0.alignment = WD_ALIGN_PARAGRAPH.LEFT

    p1 = c1.paragraphs[0]
    r1 = p1.add_run("TRANG")
    r1.font.name = 'Times New Roman'
    r1.font.bold = True
    r1.font.size = Pt(12)
    p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT

    tcPr0 = c0._tc.get_or_add_tcPr()
    tcBorders0 = OxmlElement('w:tcBorders')
    bottom0 = OxmlElement('w:bottom')
    bottom0.set(qn('w:val'), 'single')
    bottom0.set(qn('w:sz'), '8')
    bottom0.set(qn('w:color'), '000000')
    tcBorders0.append(bottom0)
    tcPr0.append(tcBorders0)

    tcPr1 = c1._tc.get_or_add_tcPr()
    tcBorders1 = OxmlElement('w:tcBorders')
    bottom1 = OxmlElement('w:bottom')
    bottom1.set(qn('w:val'), 'single')
    bottom1.set(qn('w:sz'), '8')
    bottom1.set(qn('w:color'), '000000')
    tcBorders1.append(bottom1)
    tcPr1.append(tcBorders1)

    for page_num, level, title in toc_items:
        row = table.add_row()
        cell_title = row.cells[0]
        cell_page  = row.cells[1]

        pt = cell_title.paragraphs[0]
        sp_bf = 3 if level == 1 else (2 if level == 2 else 1)
        sp_af = 3 if level == 1 else (2 if level == 2 else 1)
        pt.paragraph_format.space_before = Pt(sp_bf)
        pt.paragraph_format.space_after = Pt(sp_af)
        pt.paragraph_format.line_spacing = 1.15

        # Format visual prefixes
        indent = "      " * (level - 1)
        if level == 1:
            prefix = "● "
            sz = 11.5
            bold = True
        elif level == 2:
            prefix = "- "
            sz = 11.0
            bold = True
        elif level == 3:
            prefix = "+ "
            sz = 10.5
            bold = False
        else: # level 4
            prefix = "• "
            sz = 10.0
            bold = False

        rt = pt.add_run(f"{indent}{prefix}{title}")
        rt.font.name = 'Times New Roman'
        rt.font.size = Pt(sz)
        rt.font.bold = bold

        pp = cell_page.paragraphs[0]
        pp.paragraph_format.space_before = Pt(sp_bf)
        pp.paragraph_format.space_after = Pt(sp_af)
        pp.paragraph_format.line_spacing = 1.15
        pp.alignment = WD_ALIGN_PARAGRAPH.RIGHT

        rp = pp.add_run(f"{page_num}")
        rp.font.name = 'Times New Roman'
        rp.font.size = Pt(sz)
        rp.font.bold = bold

    for row in table.rows:
        row.cells[0].width = Inches(5.5)
        row.cells[1].width = Inches(1.0)

    ref_p.addprevious(table._tbl)

    # 4. Page Break after TOC
    p_brk2 = insert_para("", space_after=12)
    p_brk2.add_run().add_break(WD_BREAK.PAGE)

    print(f"[POSTPROCESS] Đã chèn Mục Lục thành công ({len(toc_items)} mục, độ sâu: level {toc_level}).")


def postprocess_docx(docx_path, input_pdf=None, toc_level=4):
    """Open generated DOCX, fix table borders & width, and insert Table of Contents."""
    from docx import Document

    print(f"[POSTPROCESS] Đang xử lý hoàn thiện tài liệu: {os.path.basename(docx_path)} (Mục lục level: {toc_level})")
    doc = Document(docx_path)
    count = 0

    # 1. Fix tables
    for table in doc.tables:
        _fix_table_borders(table)
        _fix_table_width(table)
        _fix_table_indent(table)
        count += 1

    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for nested in cell.tables:
                    _fix_table_borders(nested)
                    _fix_table_width(nested)
                    count += 1

    # 2. Apply headings and generate Table of Contents (Mục lục)
    try:
        _generate_toc_and_headings(doc, input_pdf=input_pdf, toc_level=toc_level)
    except Exception as e:
        print(f"[POSTPROCESS] Lỗi khi tạo mục lục: {e}")

    doc.save(docx_path)
    print(f"[POSTPROCESS] Hoàn tất: {count} bảng đã được chuẩn hóa viền & độ rộng, Mục Lục đã được thêm.")
    return count





# ============================================================
# Main converter
# ============================================================
def convert(input_pdf, output_docx, start=0, end=None, toc_level=4):
    try:
        from pdf2docx import Converter
    except ImportError:
        print("ERROR: pdf2docx not installed. Run: pip install pdf2docx", file=sys.stderr)
        sys.exit(2)

    cpu_count = max(1, multiprocessing.cpu_count() - 1)
    use_mp    = cpu_count > 1

    print(f"[PDF2WORD] Input:     {input_pdf}")
    print(f"[PDF2WORD] Output:    {output_docx}")
    print(f"[PDF2WORD] CPUs:      {cpu_count} cores, multi_processing={use_mp}")
    print(f"[PDF2WORD] Mục lục:   Level {toc_level}")

    try:
        cv = Converter(input_pdf)
        cv.convert(
            output_docx,
            start=start,
            end=end,
            multi_processing=use_mp,
            cpu_count=cpu_count,
        )
        cv.close()

        # ---- Post-process: fix table borders + width + Table of Contents ----
        postprocess_docx(output_docx, input_pdf=input_pdf, toc_level=toc_level)

        size = os.path.getsize(output_docx)
        print(f"[PDF2WORD] DONE: {size/1024/1024:.2f} MB")
        return True

    except Exception as e:
        print(f"[PDF2WORD] ERROR: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return False


# ============================================================
# CLI entry
# ============================================================
if __name__ == "__main__":
    multiprocessing.freeze_support()

    if len(sys.argv) < 3:
        print("Usage: python pdf2word.py <input.pdf> <output.docx> [start] [end]")
        sys.exit(1)

    inp   = sys.argv[1]
    out   = sys.argv[2]
    start = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    end   = int(sys.argv[4]) if len(sys.argv) > 4 else None

    ok = convert(inp, out, start, end)
    sys.exit(0 if ok else 1)
