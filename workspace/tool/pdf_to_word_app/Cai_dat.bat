@echo off
chcp 65001 >nul
title Cài Đặt - PDF to Word Pro

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║       PDF to Word Pro - Cài Đặt             ║
echo  ║       Chuyển đổi PDF sang Word chuẩn        ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: ── Check Node.js ──────────────────────────────────────────
echo [1/4] Kiểm tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo     ❌ Node.js chưa được cài. Tải tại: https://nodejs.org
    echo     Sau khi cài xong, chạy lại install.bat
    pause
    start https://nodejs.org
    exit /b 1
) else (
    for /f %%v in ('node --version') do echo     ✅ Node.js %%v
)

:: ── Check Python ────────────────────────────────────────────
echo [2/4] Kiểm tra Python...
set PYTHON_EXE=
for %%P in (
    "%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python310\python.exe"
    "C:\Python312\python.exe"
    "C:\Python311\python.exe"
) do (
    if exist %%P (
        set PYTHON_EXE=%%~P
        goto :found_python
    )
)
:: Try generic
python --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_EXE=python
    goto :found_python
)
echo     ⚠️  Python chưa được cài. Đang cài tự động qua winget...
winget install Python.Python.3.12 --accept-source-agreements --accept-package-agreements
if errorlevel 1 (
    echo     ❌ Không cài được Python tự động.
    echo     Tải Python tại: https://www.python.org/downloads/
    pause
    start https://www.python.org/downloads/
    exit /b 1
)
set PYTHON_EXE=python

:found_python
for /f "tokens=*" %%v in ('"%PYTHON_EXE%" --version 2^>^&1') do echo     ✅ %%v

:: ── Install Node.js packages ────────────────────────────────
echo [3/4] Cài đặt thư viện Node.js...
call npm install --silent
if errorlevel 1 (
    echo     ❌ npm install thất bại!
    pause
    exit /b 1
)
echo     ✅ Node.js packages OK

:: ── Install Python packages ─────────────────────────────────
echo [4/4] Cài đặt thư viện Python (pdf2docx)...
"%PYTHON_EXE%" -m pip install pdf2docx --quiet --upgrade
if errorlevel 1 (
    echo     ⚠️  Cài pdf2docx thất bại - ứng dụng sẽ dùng engine dự phòng.
) else (
    echo     ✅ pdf2docx OK
)

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   ✅ Cài đặt HOÀN TẤT!                      ║
echo  ║   Chạy Start.bat để mở ứng dụng             ║
echo  ╚══════════════════════════════════════════════╝
echo.
pause
