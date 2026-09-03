@echo off
chcp 65001 >nul
title PDF to Word Pro

:: ── Find Node.js ─────────────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js chưa cài. Chạy Cai_dat.bat trước!
    pause
    exit /b 1
)

:: ── Kill any existing instance on port 3030 ──────────────────
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3030 "') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: ── Start server in background ───────────────────────────────
echo.
echo  ┌──────────────────────────────────────────────┐
echo  │       PDF to Word Pro - Đang khởi động...   │
echo  └──────────────────────────────────────────────┘
echo.

start /B "" node "%~dp0server.js" > "%~dp0app.log" 2>&1

:: ── Wait for server to be ready ──────────────────────────────
echo   Đang khởi động server, vui lòng chờ...
timeout /t 3 /nobreak >nul

:: Retry up to 10 times
set /a attempts=0
:wait_loop
set /a attempts+=1
curl -s http://localhost:3030/api/status >nul 2>&1
if not errorlevel 1 goto :server_ready
if %attempts% geq 10 goto :server_timeout
timeout /t 1 /nobreak >nul
goto :wait_loop

:server_timeout
echo   ⚠️  Server khởi động chậm, thử mở trình duyệt...
goto :open_browser

:server_ready
echo   ✅ Server đã sẵn sàng!

:open_browser
echo   🌐 Đang mở http://localhost:3030 ...
start "" "http://localhost:3030"

echo.
echo  ┌──────────────────────────────────────────────┐
echo  │  ✅ PDF to Word Pro đang chạy!               │
echo  │  🌐 http://localhost:3030                    │
echo  │                                              │
echo  │  Đóng cửa sổ này để dừng ứng dụng           │
echo  └──────────────────────────────────────────────┘
echo.

:: Keep window open — killing this window stops the server
node "%~dp0server.js"
