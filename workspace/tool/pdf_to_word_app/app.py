#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF to Word Pro - Standalone Windows Application Server
Được đóng gói trọn gói toàn bộ dependencies (Python, pdf2docx, Bottle, PyMuPDF, python-docx, etc.)
Không cần cài thêm bất kỳ runtime hay thư viện nào!
"""

import os
import sys
import tempfile
import urllib.parse
import webbrowser
import threading
import time
from pathlib import Path

# Fix Windows console encoding
import io
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def get_public_dir():
    candidates = []
    if getattr(sys, 'frozen', False):
        if hasattr(sys, '_MEIPASS'):
            candidates.append(Path(sys._MEIPASS) / "public")
        exe_dir = Path(sys.executable).parent
        candidates.append(exe_dir / "public")
        candidates.append(exe_dir / "_internal" / "public")
    candidates.append(Path(__file__).resolve().parent / "public")
    for p in candidates:
        if p.exists():
            return p
    return candidates[0]

PUBLIC_DIR = get_public_dir()

from bottle import Bottle, request, response, static_file, HTTPError
from pdf2word import convert, postprocess_docx

app = Bottle()

def get_downloads_dir():
    """Return user's Downloads directory across Windows versions."""
    home = Path.home()
    dl = home / "Downloads"
    if dl.exists():
        return dl
    return home

@app.route('/')
def index():
    return static_file("index.html", root=str(PUBLIC_DIR))

@app.route('/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=str(PUBLIC_DIR))

@app.get('/api/status')
def api_status():
    response.content_type = 'application/json'
    return {
        "status": "running",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "engine": "pdf2docx (Python) — Standalone Windows App",
        "python": True,
        "pdf2docx": True,
    }

@app.post('/api/convert')
def api_convert():
    upload = request.files.get('pdfFile')
    if not upload:
        response.status = 400
        return {"error": "Vui lòng chọn một file PDF hợp lệ!"}

    raw_filename = upload.raw_filename
    # Handle utf-8 encoded filename if needed
    try:
        filename = raw_filename.encode('latin1').decode('utf-8')
    except Exception:
        filename = raw_filename

    base_name = Path(filename).stem
    out_filename = f"{base_name}.docx"

    print(f"\n[SERVER] Đang xử lý file: {filename}")

    temp_dir = tempfile.mkdtemp(prefix="pdf2word_")
    in_pdf = os.path.join(temp_dir, filename)
    out_docx = os.path.join(temp_dir, out_filename)

    try:
        upload.save(in_pdf, overwrite=True)
        print(f"[SERVER] Đã lưu file tạm tại: {in_pdf} ({os.path.getsize(in_pdf)/1024/1024:.2f} MB)")

        # Get TOC level from form (default 4: detailed to a, b, c)
        try:
            toc_level = int(request.forms.get('tocLevel', 4))
        except Exception:
            toc_level = 4

        # Run conversion (multi-core + post-processing with TOC)
        success = convert(in_pdf, out_docx, toc_level=toc_level)
        if not success or not os.path.exists(out_docx):
            raise RuntimeError("Quá trình chuyển đổi PDF sang DOCX không thành công!")

        # Copy to Downloads
        dl_dir = get_downloads_dir()
        saved_path = str(dl_dir / out_filename)
        try:
            import shutil
            shutil.copy2(out_docx, saved_path)
            print(f"[SERVER] Đã lưu bản sao tại: {saved_path}")
        except Exception as e:
            print(f"[SERVER] Không thể lưu vào Downloads: {e}")
            saved_path = ""

        file_size = os.path.getsize(out_docx)
        encoded_saved_path = urllib.parse.quote(saved_path)

        # Read buffer to return
        with open(out_docx, 'rb') as f:
            docx_data = f.read()

        response.set_header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        response.set_header('Content-Disposition', f'attachment; filename="{urllib.parse.quote(out_filename)}"')
        response.set_header('Content-Length', str(file_size))
        response.set_header('X-Saved-Path', encoded_saved_path)

        return docx_data

    except Exception as e:
        import traceback
        traceback.print_exc()
        response.status = 500
        return {"error": str(e)}
    finally:
        # Cleanup
        try:
            if os.path.exists(in_pdf):
                os.remove(in_pdf)
            if os.path.exists(out_docx):
                os.remove(out_docx)
            os.rmdir(temp_dir)
        except Exception:
            pass

@app.post('/api/open-word')
def api_open_word():
    data = request.json or {}
    file_path = data.get('filePath')
    if not file_path or not os.path.exists(file_path):
        response.status = 404
        return {"error": "File không tồn tại trên hệ thống!"}

    try:
        os.startfile(file_path)
        return {"success": True, "message": "Đã mở file thành công!"}
    except Exception as e:
        response.status = 500
        return {"error": f"Không thể mở file: {e}"}

def open_browser(port):
    time.sleep(1.2)
    url = f"http://localhost:{port}"
    print(f"\n🌐 Đang mở trình duyệt: {url}")
    webbrowser.open(url)

if __name__ == '__main__':
    import multiprocessing
    multiprocessing.freeze_support()

    PORT = 3030
    print("=" * 60)
    print("🚀 PDF to Word Pro - Standalone Windows Application")
    print(f"🌐 Server khởi động tại: http://localhost:{PORT}")
    print("=" * 60)

    # Open browser in a background thread
    threading.Thread(target=open_browser, args=(PORT,), daemon=True).start()

    # Start server
    try:
        app.run(host='0.0.0.0', port=PORT, quiet=True)
    except Exception as e:
        print(f"Lỗi khởi động server: {e}")
        input("Nhấn Enter để thoát...")
