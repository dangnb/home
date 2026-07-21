# 🔐 Hướng dẫn Cấu hình Bảo mật — TapHoa WMS

## Development (Local)

Tất cả secrets đã được lưu vào .NET User Secrets (không commit lên Git):

```bash
# Xem secrets hiện tại
dotnet user-secrets list --project TapHoa.API

# Đổi JWT key
dotnet user-secrets set "Security:JwtKey" "NEW_KEY_HERE" --project TapHoa.API

# Đổi DB connection
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Password=...;" --project TapHoa.API
```

## Production (Server / Docker)

Dùng Environment Variables — KHÔNG đặt trong file config:

```bash
# Linux / Docker
export Security__JwtKey="$(openssl rand -base64 64)"
export ConnectionStrings__DefaultConnection="Server=prod-db;Database=TapHoaWMS;User=taphoa_user;Password=STRONG_PASSWORD;"

# Windows
$env:Security__JwtKey = "..."
$env:ConnectionStrings__DefaultConnection = "..."
```

### Docker Compose
```yaml
services:
  api:
    image: taphoa-api
    environment:
      - Security__JwtKey=${JWT_KEY}
      - ConnectionStrings__DefaultConnection=${DB_CONNECTION}
    env_file:
      - .env.production  # Không commit file này lên Git!
```

### .env.production (KHÔNG COMMIT)
```
JWT_KEY=your_very_long_random_secret_key_here
DB_CONNECTION=Server=prod-server;Database=TapHoaWMS;User=prod_user;Password=strong_password;
```

## Gitignore — Đảm bảo các file này được ignore
```
appsettings.Development.json
appsettings.Production.json
.env
.env.*
secrets.json
```

## Tạo JWT Key mạnh
```bash
# PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))

# Linux
openssl rand -base64 64
```

## Security Headers được thêm tự động
Tất cả response sẽ có:
- `X-Frame-Options: DENY` — chống Clickjacking
- `X-Content-Type-Options: nosniff` — chống MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: ...`
- `Strict-Transport-Security` (chỉ khi HTTPS)
- Server header bị ẩn

## Rate Limiting
| Endpoint | Limit |
|---|---|
| `POST /auth/login` | **5 requests/minute** per IP |
| `POST /auth/refresh-token` | **10 requests/minute** per IP |
| Toàn bộ API | 100 requests/minute per user/IP |

## Security Logging
Tìm các sự kiện bảo mật trong log với prefix `SECURITY:`:
```bash
# Linux
grep "SECURITY:" Logs/log-*.txt

# PowerShell
Select-String "SECURITY:" Logs\log-*.txt
```
