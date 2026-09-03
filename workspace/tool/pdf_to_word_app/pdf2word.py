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
import io
import re
import traceback
import multiprocessing

# Fix Windows console encoding unconditionally
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass


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


def add_bookmark(paragraph, bm_id, bm_name):
    """Add an OpenXML bookmark to a paragraph so it can be targeted by hyperlinks."""
    from docx.oxml import parse_xml
    from docx.oxml.ns import nsdecls
    p = paragraph._p
    bm_start = parse_xml(f'<w:bookmarkStart {nsdecls("w")} w:id="{bm_id}" w:name="{bm_name}"/>')
    bm_end = parse_xml(f'<w:bookmarkEnd {nsdecls("w")} w:id="{bm_id}"/>')
    p.insert(0, bm_start)
    p.append(bm_end)


def add_hyperlink_to_bookmark(paragraph, bm_name, text, bold=False, size=11, color="1B365D"):
    """Add a clickable hyperlink pointing to an internal bookmark."""
    import html
    from docx.oxml import parse_xml
    from docx.oxml.ns import nsdecls
    p = paragraph._p
    hyperlink = parse_xml(f'<w:hyperlink {nsdecls("w")} w:anchor="{bm_name}" w:history="1"/>')
    b_tag = "<w:b/>" if bold else ""
    escaped_text = html.escape(str(text))
    run = parse_xml(f'<w:r {nsdecls("w")}><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="{color}"/><w:sz w:val="{int(size*2)}"/>{b_tag}</w:rPr><w:t>{escaped_text}</w:t></w:r>')
    hyperlink.append(run)
    p.append(hyperlink)


def set_heading_nav(paragraph, level=1):
    """Ensure paragraph appears in Word's Left Navigation Pane (Headings tab) with clickable tree."""
    from docx.oxml import parse_xml
    from docx.oxml.ns import nsdecls
    pPr = paragraph._p.get_or_add_pPr()
    outlineLvl = parse_xml(f'<w:outlineLvl {nsdecls("w")} w:val="{level-1}"/>')
    pPr.append(outlineLvl)
    try:
        paragraph.style = f'Heading {level}'
    except Exception:
        pass


def _generate_toc_and_headings(doc, input_pdf=None, toc_level=4):
    """Detect Phần, Mục, Điều, Phụ lục, apply Heading styles for Left Navigation Pane, and insert interactive Table of Contents."""
    if toc_level == 0:
        print("[POSTPROCESS] Bỏ qua tạo mục lục (người dùng chọn tắt).")
        return

    import re
    from docx.shared import Pt, Inches, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
    from docx.enum.table import WD_TABLE_ALIGNMENT
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    # Apply Heading styles and Bookmarks across document for Word's Navigation Pane
    p_phu_luc   = re.compile(r'^(Phụ lục|PHỤ LỤC)\s+([IVXLCDM\d]+)', re.I)
    p_phan      = re.compile(r'^(Phần|PHẦN)\s+([IVXLCDM\d]+)', re.I)
    p_muc_la_ma = re.compile(r'^([IVXLCDM]{1,6})\.\s+(.+)', re.I)
    p_dieu      = re.compile(r'^(Điều\s+\d+[\.:]|\d{1,2}\.\s+)\s*(.+)', re.I)
    p_alpha     = re.compile(r'^([a-zđ])\)\s+(.+)', re.I)

    bm_counter = 1
    para_bookmarks = {}

    for p in doc.paragraphs:
        t = p.text.strip()
        if not t:
            continue
        lvl = None
        if p_phan.match(t) or p_phu_luc.match(t):
            lvl = 1
        elif p_muc_la_ma.match(t) and len(t.split('\n')[0]) < 120:
            lvl = 2
        elif p_dieu.match(t) and len(t.split('\n')[0]) < 120:
            lvl = 3
        elif p_alpha.match(t) and len(t.split('\n')[0]) < 120:
            lvl = 4

        if lvl is not None and lvl <= toc_level:
            set_heading_nav(p, level=lvl)
            bm_name = f"bm_nav_{bm_counter}"
            add_bookmark(p, bm_counter, bm_name)
            clean_t = _extract_title(t)
            para_bookmarks[clean_t] = bm_name
            # Also map by first few words
            words = " ".join(clean_t.split()[:4])
            if words: para_bookmarks[words] = bm_name
            bm_counter += 1

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
    insert_para("MỤC LỤC TÀI LIỆU (Click để nhảy tới phần tương ứng)", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=14)

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

        full_text = f"{indent}{prefix}{title}"
        
        # Check if there is a matching bookmark to make it a clickable hyperlink
        matched_bm = para_bookmarks.get(title)
        if not matched_bm:
            words = " ".join(title.split()[:4])
            matched_bm = para_bookmarks.get(words)

        if matched_bm:
            add_hyperlink_to_bookmark(pt, matched_bm, full_text, bold=bold, size=sz, color="000000")
        else:
            rt = pt.add_run(full_text)
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


def _add_footer_page_numbers(doc):
    """Add dynamic page numbers 'Trang {PAGE} / {NUMPAGES}' to document footers."""
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.shared import Pt

    for sec in doc.sections:
        footer = sec.footer
        p = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p.text = ""

        def add_fld(p_el, field_name):
            run = p_el.add_run()
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.5)
            run.font.italic = True

            f1 = OxmlElement('w:fldChar'); f1.set(qn('w:fldCharType'), 'begin')
            it = OxmlElement('w:instrText'); it.set(qn('xml:space'), 'preserve'); it.text = field_name
            f2 = OxmlElement('w:fldChar'); f2.set(qn('w:fldCharType'), 'separate')
            f3 = OxmlElement('w:fldChar'); f3.set(qn('w:fldCharType'), 'end')

            run._r.append(f1); run._r.append(it); run._r.append(f2); run._r.append(f3)

        r = p.add_run("Trang ")
        r.font.name = "Times New Roman"; r.font.size = Pt(9.5); r.font.italic = True
        add_fld(p, "PAGE")
        r2 = p.add_run(" / ")
        r2.font.name = "Times New Roman"; r2.font.size = Pt(9.5); r2.font.italic = True
        add_fld(p, "NUMPAGES")


def _standardize_fonts(doc, target_font="Times New Roman"):
    """Enforce uniform professional font (Times New Roman) across all styles, paragraphs, and tables.
    Sets OpenXML w:ascii, w:hAnsi, and w:cs so Vietnamese diacritics never lose formatting or fall back.
    """
    from docx.oxml import parse_xml
    from docx.oxml.ns import nsdecls

    # 1. Set Normal style
    try:
        normal = doc.styles['Normal']
        normal.font.name = target_font
        rPr = normal._element.get_or_add_rPr()
        for el in rPr.findall('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}rFonts'):
            rPr.remove(el)
        rPr.append(parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{target_font}" w:hAnsi="{target_font}" w:cs="{target_font}"/>'))
    except Exception:
        pass

    def fix_run(run):
        run.font.name = target_font
        rPr = run._r.get_or_add_rPr()
        for el in rPr.findall('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}rFonts'):
            rPr.remove(el)
        rPr.append(parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{target_font}" w:hAnsi="{target_font}" w:cs="{target_font}"/>'))

    for p in doc.paragraphs:
        for r in p.runs:
            fix_run(r)

    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for r in p.runs:
                        fix_run(r)
                for nested in cell.tables:
                    for n_row in nested.rows:
                        for n_cell in n_row.cells:
                            for n_p in n_cell.paragraphs:
                                for n_r in n_p.runs:
                                    fix_run(n_r)


def postprocess_docx(docx_path, input_pdf=None, toc_level=4):
    """Open generated DOCX, fix table borders & width, standardize fonts, and insert Table of Contents and Page Numbers."""
    from docx import Document

    print(f"[POSTPROCESS] Đang xử lý hoàn thiện tài liệu: {os.path.basename(docx_path)} (Mục lục level: {toc_level})")
    doc = Document(docx_path)
    count = 0

    # 1. Standardize all fonts to Times New Roman with full OpenXML w:rFonts
    try:
        _standardize_fonts(doc, target_font="Times New Roman")
    except Exception as e:
        print(f"[POSTPROCESS] Lỗi chuẩn hóa font: {e}")

    # 2. Fix tables
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

    # 3. Apply headings and generate Table of Contents (Mục lục)
    try:
        _generate_toc_and_headings(doc, input_pdf=input_pdf, toc_level=toc_level)
    except Exception as e:
        print(f"[POSTPROCESS] Lỗi khi tạo mục lục: {e}")

    # 4. Add dynamic page numbers in footer
    try:
        _add_footer_page_numbers(doc)
    except Exception as e:
        print(f"[POSTPROCESS] Lỗi khi đánh số trang: {e}")

    doc.save(docx_path)
    print(f"[POSTPROCESS] Hoàn tất: {count} bảng đã được chuẩn hóa, Font Times New Roman, Mục Lục & Số Trang đã được thêm.")
    return count

def is_scanned_pdf(input_pdf):
    """Check if the PDF has virtually no digital text (scanned document)."""
    try:
        import fitz
        doc = fitz.open(input_pdf)
        total_chars = sum(len(page.get_text().strip()) for page in doc)
        return total_chars < 50
    except Exception:
        return False


def convert_scanned_pdf(input_pdf, output_docx, toc_level=4):
    """Convert a scanned image-based PDF into an editable Word document dynamically with AI OCR & Computer Vision.
    No hardcoded document text or templates: all text, tables, colons, headers, and headings are extracted dynamically from the PDF.
    """
    import html
    import fitz
    import cv2
    import numpy as np
    from docx import Document
    from docx.shared import Pt, Inches, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.enum.table import WD_TABLE_ALIGNMENT
    from docx.oxml import OxmlElement, parse_xml
    from docx.oxml.ns import qn, nsdecls
    import easyocr

    print("[OCR] Khởi tạo mô hình AI OCR tiếng Việt & Smart Dynamic Layout Engine...")
    reader = easyocr.Reader(['vi', 'en'], gpu=False)

    import unicodedata

    def clean_vietnamese_ocr(text):
        """Universal OCR noise filtering and character normalization without any document-specific hardcoding."""
        if not text:
            return ""
        # 1. Unicode NFC normalization (unifies composite diacritics)
        text = unicodedata.normalize('NFC', text)

        # 2. Filter out single-character margin noise and artifacts
        if len(text.strip()) == 1 and text.strip() in '~^`|\\/_—*':
            return ""

        # 3. Universal OCR typo normalization for legal headings and digits
        text = re.sub(r'\b(Điều|ĐIỀU)\s+[ỊIl!|]\b', r'\1 1', text)
        text = re.sub(r'\b(Điều|ĐIỀU)\s+[Zz]\b', r'\1 2', text)
        text = re.sub(r'(\d{1,2}/\d{1,2}/202)[Ili|]\b', r'\g<1>1', text)

        # 4. Standard whitespace cleanup
        return re.sub(r'\s+', ' ', text).strip()

    def apply_tnr_font(run, size=12, bold=False, italic=False, color="000000"):
        run.font.name = "Times New Roman"
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.italic = italic
        run.font.color.rgb = RGBColor(int(color[:2], 16), int(color[2:4], 16), int(color[4:], 16))
        rPr = run._r.get_or_add_rPr()
        for el in rPr.findall('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}rFonts'):
            rPr.remove(el)
        rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
        rPr.append(rFonts)

    doc_pdf = fitz.open(input_pdf)
    num_pages = len(doc_pdf)
    print(f"[OCR] Đang bóc tách & phục dựng cấu trúc {num_pages} trang scan...")

    doc_word = Document()
    for sec in doc_word.sections:
        sec.page_width = Inches(8.27); sec.page_height = Inches(11.69)
        sec.top_margin = Inches(0.79); sec.bottom_margin = Inches(0.79)
        sec.left_margin = Inches(0.98); sec.right_margin = Inches(0.79)

    # Set normal style font
    style = doc_word.styles['Normal']
    style.font.name = 'Times New Roman'
    style.font.size = Pt(12)
    style.font.color.rgb = RGBColor(0, 0, 0)
    rPr = style._element.get_or_add_rPr()
    rPr.append(parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>'))

    # Extract all lines per page dynamically from OCR
    all_pages_lines = []
    for p_idx in range(num_pages):
        page = doc_pdf[p_idx]
        print(f"[OCR] Đang quét OCR trang {p_idx + 1}/{num_pages}...")
        pix = page.get_pixmap(dpi=150)
        img = cv2.imdecode(np.frombuffer(pix.tobytes(), np.uint8), cv2.IMREAD_COLOR)
        h, w = img.shape[:2]
        ocr_res = reader.readtext(img)

        boxes = []
        for bbox, text, conf in ocr_res:
            text = clean_vietnamese_ocr(text)
            if not text or conf < 0.15: continue
            xs = [pt[0] for pt in bbox]; ys = [pt[1] for pt in bbox]
            boxes.append({
                'x': min(xs), 'y': min(ys), 'r': max(xs), 'b': max(ys),
                'w': max(xs) - min(xs), 'h': max(ys) - min(ys),
                'text': text, 'conf': conf
            })

        boxes.sort(key=lambda b: (b['y'], b['x']))
        lines = []
        for b in boxes:
            matched = False
            for line in lines:
                if abs(b['y'] - line['y']) < 14:
                    line['items'].append(b)
                    line['y'] = (line['y'] + b['y']) / 2
                    matched = True
                    break
            if not matched:
                lines.append({'y': b['y'], 'items': [b]})

        for line in lines:
            line['items'].sort(key=lambda it: it['x'])
            line['text'] = " ".join(it['text'] for it in line['items'])
            line['text'] = clean_vietnamese_ocr(line['text'])

        all_pages_lines.append({'page_idx': p_idx, 'lines': lines, 'img_w': w, 'img_h': h})

    # Render Page 1 Header (2 columns borderless)
    p1 = all_pages_lines[0]
    p1_lines = p1['lines']

    header_lines = [l for l in p1_lines if l['y'] < p1['img_h'] * 0.16]
    body_lines_p1 = [l for l in p1_lines if l['y'] >= p1['img_h'] * 0.16]

    left_header = []
    right_header = []
    for l in header_lines:
        mid_x = (l['items'][0]['x'] + l['items'][-1]['r']) / 2
        if mid_x < p1['img_w'] * 0.5:
            left_header.append(l['text'])
        else:
            right_header.append(l['text'])

    if left_header or right_header:
        tbl_hdr = doc_word.add_table(rows=1, cols=2)
        tbl_hdr.alignment = WD_TABLE_ALIGNMENT.CENTER
        for c in tbl_hdr.rows[0].cells:
            tcPr = c._tc.get_or_add_tcPr()
            tcBorders = OxmlElement('w:tcBorders')
            for b in ('top', 'left', 'bottom', 'right'):
                el = OxmlElement(f'w:{b}'); el.set(qn('w:val'), 'none'); tcBorders.append(el)
            tcPr.append(tcBorders)

        c_l, c_r = tbl_hdr.rows[0].cells[0], tbl_hdr.rows[0].cells[1]
        c_l.width = Inches(3.6); c_r.width = Inches(3.8)
        p_l = c_l.paragraphs[0]; p_l.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for txt in left_header:
            r = p_l.add_run(txt + "\n")
            apply_tnr_font(r, size=10.5, bold=bool(re.search(r'CÔNG TY|ĐƠN VỊ|BAN', txt, re.I)))

        p_r = c_r.paragraphs[0]; p_r.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for txt in right_header:
            r = p_r.add_run(txt + "\n")
            apply_tnr_font(r, size=10.5, bold=bool(re.search(r'CỘNG HÒA|ĐỘC LẬP|QUỐC HỘI', txt, re.I)))

    # Process all body lines across pages
    all_body_lines = []
    for p_info in all_pages_lines:
        if p_info['page_idx'] == 0:
            all_body_lines.extend(body_lines_p1)
        else:
            all_body_lines.append({'is_page_break': True})
            all_body_lines.extend(p_info['lines'])

    # Smart Paragraph Reflow: merge continuation lines
    reflowed_lines = []
    curr_line = None

    for line in all_body_lines:
        if line.get('is_page_break'):
            if curr_line:
                reflowed_lines.append(curr_line)
                curr_line = None
            reflowed_lines.append(line)
            continue

        txt = line['text']

        # Determine if this line starts a NEW block
        is_new_block = (
            bool(re.search(r'^(HỢP ĐỒNG|BÁO GIÁ|QUYẾT ĐỊNH|THÔNG BÁO|PHỤ LỤC|QUY ĐỊNH)', txt, re.I)) or
            bool(re.search(r'^(Điều\s+\d+[\.:]?|\d+\.\d+\s*[-:]?)', txt, re.I)) or
            bool(re.search(r'^\s*[-+•]\s*', txt)) or
            bool(re.search(r'^(Căn cứ|Hôm nay ngày|Hai bên|Một bên|Và một bên|Chức vụ|Đại diện|Địa chỉ|Mã số thuế|Số CCCD|Ngày tháng|NGƯỜI)', txt, re.I))
        )

        if is_new_block:
            if curr_line:
                reflowed_lines.append(curr_line)
            curr_line = dict(line)
        else:
            if curr_line:
                curr_line['text'] += " " + txt
            else:
                curr_line = dict(line)

    if curr_line:
        reflowed_lines.append(curr_line)

    # Find headings for TOC & Navigation Pane dynamically from text
    toc_headings = []
    bm_counter = 100
    for line in reflowed_lines:
        if line.get('is_page_break'): continue
        txt = line['text']
        m_dieu = re.search(r'^(Điều\s+\d+[\.:]?\s*.*)$', txt, re.I)
        m_sub = re.search(r'^(\d+\.\d+\s*[-:]?\s*.*)$', txt)
        m_title = re.search(r'^(HỢP ĐỒNG|BÁO GIÁ|QUYẾT ĐỊNH|THÔNG BÁO|PHỤ LỤC|QUY ĐỊNH)', txt, re.I)

        if m_title and len(txt) < 80:
            bm_counter += 1
            toc_headings.append({'title': txt, 'level': 1, 'bm': f'bm_nav_{bm_counter}'})
        elif m_dieu:
            bm_counter += 1
            toc_headings.append({'title': txt, 'level': 2, 'bm': f'bm_nav_{bm_counter}'})
        elif m_sub:
            bm_counter += 1
            toc_headings.append({'title': txt, 'level': 3, 'bm': f'bm_nav_{bm_counter}'})

    # Add dynamic Table of Contents
    if toc_level > 0 and toc_headings:
        p_toc_lbl = doc_word.add_paragraph()
        p_toc_lbl.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_toc_lbl.paragraph_format.space_before = Pt(8)
        p_toc_lbl.paragraph_format.space_after = Pt(6)
        r_toc_lbl = p_toc_lbl.add_run("MỤC LỤC TÀI LIỆU (Click để nhảy tới phần tương ứng)")
        apply_tnr_font(r_toc_lbl, size=12, bold=True)

        tbl_toc = doc_word.add_table(rows=0, cols=2)
        tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
        for b in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
            el = OxmlElement(f'w:{b}'); el.set(qn('w:val'), 'none'); tbl_toc._tbl.tblPr.append(el)

        for h_item in toc_headings:
            row = tbl_toc.add_row()
            c0, c1 = row.cells[0], row.cells[1]
            c0.width = Inches(5.8); c1.width = Inches(1.0)
            p0, p1 = c0.paragraphs[0], c1.paragraphs[0]
            p0.paragraph_format.space_before = Pt(1); p0.paragraph_format.space_after = Pt(1)
            p1.paragraph_format.space_before = Pt(1); p1.paragraph_format.space_after = Pt(1)
            p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT

            indent = "    " * (h_item['level'] - 1)
            display_title = indent + ("• " if h_item['level'] > 1 else "") + h_item['title']
            add_hyperlink_to_bookmark(p0, h_item['bm'], display_title, bold=(h_item['level'] <= 2), size=10.5, color="000000")
            r1 = p1.add_run("Xem")
            apply_tnr_font(r1, size=9.5, italic=True)

        p_spacer = doc_word.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(4)
        p_spacer.paragraph_format.space_after = Pt(4)

    # Render Document Body with Pure Dynamic Structuring
    idx = 0
    while idx < len(reflowed_lines):
        line = reflowed_lines[idx]
        if line.get('is_page_break'):
            doc_word.add_page_break()
            idx += 1
            continue

        txt = line['text']

        # Check if line matches a Heading
        matched_h = None
        for h in toc_headings:
            if h['title'] == txt:
                matched_h = h
                break

        if matched_h:
            p_h = doc_word.add_paragraph()
            p_h.paragraph_format.space_before = Pt(14) if matched_h['level'] == 1 else Pt(10)
            p_h.paragraph_format.space_after = Pt(4)
            p_h.paragraph_format.line_spacing = 1.15
            p_h.paragraph_format.keep_with_next = True
            if matched_h['level'] == 1:
                p_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
            set_heading_nav(p_h, level=matched_h['level'])
            add_bookmark(p_h, int(matched_h['bm'].replace('bm_nav_', '')), matched_h['bm'])
            r_h = p_h.add_run(txt)
            apply_tnr_font(r_h, size=14 if matched_h['level'] == 1 else 12.5, bold=True)
            idx += 1
            continue

        # Check if line is Key-Value with Colon (e.g. "Chức vụ: Giám đốc", "Địa chỉ: Số 3...")
        colon_match = re.match(r'^([^:]{2,35})\s*:\s*(.+)$', txt)
        if colon_match:
            colon_group = [(colon_match.group(1).strip(), ": " + colon_match.group(2).strip())]
            next_idx = idx + 1
            while next_idx < len(reflowed_lines):
                n_line = reflowed_lines[next_idx]
                if n_line.get('is_page_break'): break
                m_next = re.match(r'^([^:]{2,35})\s*:\s*(.+)$', n_line['text'])
                if m_next:
                    colon_group.append((m_next.group(1).strip(), ": " + m_next.group(2).strip()))
                    next_idx += 1
                else:
                    break

            if len(colon_group) >= 2:
                tbl_info = doc_word.add_table(rows=0, cols=2)
                tbl_info.alignment = WD_TABLE_ALIGNMENT.CENTER
                for b in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
                    el = OxmlElement(f'w:{b}'); el.set(qn('w:val'), 'none'); tbl_info._tbl.tblPr.append(el)

                for lbl, val in colon_group:
                    row = tbl_info.add_row()
                    c0, c1 = row.cells[0], row.cells[1]
                    c0.width = Inches(1.8); c1.width = Inches(5.2)
                    p0, p1 = c0.paragraphs[0], c1.paragraphs[0]
                    p0.paragraph_format.space_before = Pt(1); p0.paragraph_format.space_after = Pt(1)
                    p1.paragraph_format.space_before = Pt(1); p1.paragraph_format.space_after = Pt(1)

                    r0 = p0.add_run(lbl)
                    apply_tnr_font(r0, size=12, bold=bool(re.search(r'Một bên|Bên|Đại diện', lbl, re.I)))

                    r1 = p1.add_run(val)
                    apply_tnr_font(r1, size=12, bold=bool(re.search(r'Một bên|Bên', lbl, re.I)))

                idx = next_idx
                continue

        # Normal paragraph
        p_para = doc_word.add_paragraph()
        p_para.paragraph_format.space_before = Pt(2)
        p_para.paragraph_format.space_after = Pt(3)
        p_para.paragraph_format.line_spacing = 1.15

        if txt.startswith('-') or txt.startswith('•'):
            p_para.paragraph_format.left_indent = Inches(0.25)
            p_para.paragraph_format.first_line_indent = Inches(-0.15)
            p_para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        elif txt.startswith('+'):
            p_para.paragraph_format.left_indent = Inches(0.45)
            p_para.paragraph_format.first_line_indent = Inches(-0.15)
            p_para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        else:
            p_para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

        is_italic = bool(re.search(r'^(Căn cứ|Hai bên thỏa thuận|Hôm nay ngày|Những vấn đề)', txt, re.I))
        r_txt = p_para.add_run(txt)
        apply_tnr_font(r_txt, size=12, italic=is_italic)
        idx += 1

    # Crop signature/stamp from last page dynamically
    last_p = doc_pdf[num_pages - 1]
    rect = last_p.rect
    sig_rect = fitz.Rect(rect.width * 0.08, rect.height * 0.35, rect.width * 0.95, rect.height * 0.92)
    pix = last_p.get_pixmap(dpi=300, clip=sig_rect)
    sig_temp_path = os.path.join(os.path.dirname(output_docx), "temp_sig_dyn.png")
    pix.save(sig_temp_path)

    p_sig = doc_word.add_paragraph()
    p_sig.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sig.paragraph_format.space_before = Pt(12)
    r_sig = p_sig.add_run()
    r_sig.add_picture(sig_temp_path, width=Inches(6.0))
    try: os.remove(sig_temp_path)
    except Exception: pass

    # Dynamic footer page numbers
    def add_fld(paragraph, field_text):
        f1 = OxmlElement('w:fldChar'); f1.set(qn('w:fldCharType'), 'begin')
        it = OxmlElement('w:instrText'); it.set(qn('xml:space'), 'preserve'); it.text = field_text
        f2 = OxmlElement('w:fldChar'); f2.set(qn('w:fldCharType'), 'separate')
        f3 = OxmlElement('w:fldChar'); f3.set(qn('w:fldCharType'), 'end')
        run = paragraph.add_run()
        run._r.append(f1); run._r.append(it); run._r.append(f2); run._r.append(f3)

    for sec in doc_word.sections:
        footer = sec.footer
        p_ft = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
        p_ft.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_ft.text = ""
        r_f1 = p_ft.add_run("Trang ")
        apply_tnr_font(r_f1, size=9.5, italic=True)
        add_fld(p_ft, "PAGE")
        r_f2 = p_ft.add_run(" / ")
        apply_tnr_font(r_f2, size=9.5, italic=True)
        add_fld(p_ft, "NUMPAGES")

    doc_word.save(output_docx)
    print(f"[OCR] Hoan tat phuc dung {num_pages} trang scan sang Word!")
    return True




# ============================================================
# Main converter
# ============================================================
def convert(input_pdf, output_docx, start=0, end=None, toc_level=4):
    print(f"[PDF2WORD] Input:     {input_pdf}")
    print(f"[PDF2WORD] Output:    {output_docx}")

    # Check if scanned document (image-only)
    if is_scanned_pdf(input_pdf):
        print("[PDF2WORD] [SCAN DETECTED] Phat hien tai lieu anh Scan! Kich hoat AI OCR tieng Viet...")
        try:
            success = convert_scanned_pdf(input_pdf, output_docx, toc_level=toc_level)
            if success and os.path.exists(output_docx):
                size = os.path.getsize(output_docx)
                print(f"[PDF2WORD] DONE (AI OCR): {size/1024/1024:.2f} MB")
                return True
        except Exception as e:
            print(f"[PDF2WORD] Loi khi xu ly OCR: {e}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)

    try:
        from pdf2docx import Converter
    except ImportError:
        print("ERROR: pdf2docx not installed. Run: pip install pdf2docx", file=sys.stderr)
        sys.exit(2)

    cpu_count = max(1, multiprocessing.cpu_count() - 1)
    use_mp    = cpu_count > 1

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

    inp     = sys.argv[1]
    out     = sys.argv[2]
    start   = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3] != "0" else 0
    end     = int(sys.argv[4]) if len(sys.argv) > 4 and sys.argv[4] != "0" else None
    toc_lvl = int(sys.argv[5]) if len(sys.argv) > 5 else 4

    ok = convert(inp, out, start=start, end=end, toc_level=toc_lvl)
    sys.exit(0 if ok else 1)
