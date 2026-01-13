<p align="center">
  <h1 align="center">Locado</h1>
  <p align="center">
    <strong>Quản Lý Domain Cục Bộ</strong><br>
    Tên miền đẹp cho phát triển local
  </p>
</p>

<p align="center">
  <a href="https://github.com/xuandung38/locado/releases/latest">
    <img src="https://img.shields.io/github/v/release/xuandung38/locado?style=flat-square" alt="Phiên bản">
  </a>
  <a href="https://github.com/xuandung38/locado/releases">
    <img src="https://img.shields.io/github/downloads/xuandung38/locado/total?style=flat-square" alt="Lượt tải">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-proprietary-blue?style=flat-square" alt="Giấy phép">
  </a>
</p>

<p align="center">
  <a href="README.md">🇺🇸 English</a>
</p>

---

## Tính Năng

- 🌐 **Domain Cục Bộ Tùy Chỉnh** - Map `myapp.local` → `localhost:3000`
- 🔒 **HTTPS Tự Động** - Chứng chỉ SSL local, được trình duyệt tin cậy
- 🐳 **Hỗ Trợ Docker** - Proxy đến container theo tên
- 🌍 **Host Từ Xa** - Chuyển tiếp đến server remote
- 🖥️ **Giao Diện Web** - UI đẹp mắt để quản lý domain
- ⚡ **DNS Không Cần Cấu Hình** - Tự động phân giải DNS

## Cài Đặt Nhanh

```bash
curl -fsSL https://locado.hxd.app/install.sh | bash
```

Hoặc tải trực tiếp từ [Releases](https://github.com/xuandung38/locado/releases).

## Sử Dụng

```bash
# Khởi động server (cần sudo cho port 80/443)
sudo locado

# Mở dashboard
open http://localhost:2280
```

## Yêu Cầu

- **macOS** 10.15+ hoặc **Linux** (Ubuntu, Debian, Fedora, etc.)
- Port **80** và **443** phải khả dụng
- *(Tùy chọn)* Docker cho hỗ trợ container

## Các Lệnh

| Lệnh | Mô tả |
|------|-------|
| `locado` | Khởi động server |
| `locado server` | Khởi động server (tường minh) |
| `locado update check` | Kiểm tra cập nhật |
| `locado update changelog` | Xem changelog mới nhất |
| `locado uninstall` | Gỡ cài đặt Locado |

## Cách Hoạt Động

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Trình      │────▶│   Locado    │────▶│   Service    │
│   duyệt      │     │   Proxy     │     │   của bạn    │
│ myapp.local  │     │             │     │ localhost:3000│
└──────────────┘     └─────────────┘     └──────────────┘
```

1. **Phân Giải DNS** - Locado cấu hình hệ thống để phân giải domain `.local` về `127.0.0.1`
2. **Reverse Proxy** - Request được định tuyến đến service local của bạn
3. **TLS Termination** - HTTPS tự động với chứng chỉ được tin cậy cục bộ

## Cấu Hình

Quản lý domain qua giao diện web tại `http://localhost:2280`.

Mỗi domain có thể trỏ đến:
- **Port Local** - Chuyển tiếp đến `localhost:PORT`
- **Docker Container** - Chuyển tiếp đến container đang chạy
- **Host Từ Xa** - Chuyển tiếp đến server bên ngoài

## Xử Lý Sự Cố

### Port 80/443 đang được sử dụng

Dừng các service xung đột:
```bash
# macOS
sudo lsof -i :80
sudo lsof -i :443

# Dừng process hoặc dùng port khác
```

### DNS không phân giải được

Locado sử dụng dnsmasq cho DNS. Nếu domain không phân giải:
```bash
# Kiểm tra trạng thái dnsmasq
brew services list | grep dnsmasq  # macOS
systemctl status dnsmasq           # Linux
```

## Tác Giả

**Hồ Xuân Dũng**

- 🌐 Website: [hxd.vn](https://hxd.vn)
- 📧 Email: [me@hxd.vn](mailto:me@hxd.vn)
- 💻 GitHub: [@xuandung38](https://github.com/xuandung38)

## Giấy Phép

Locado **miễn phí sử dụng** cho các dự án cá nhân và thương mại.

Mã nguồn là độc quyền. Xem [LICENSE](LICENSE) để biết chi tiết.

---

<p align="center">
  Made with ❤️ by <a href="https://hxd.vn">Hồ Xuân Dũng</a>
</p>
