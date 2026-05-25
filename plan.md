# 📋 PLAN: Web Quản Lý & Tìm Phòng Trọ (Khu vực Hà Nội)

> Công cụ cho nhân viên sale trọ: lưu trữ hình ảnh + link video phòng, tìm kiếm
> nhanh theo nhiều tiêu chí (giá, khu vực, loại hình, tiện ích...), giao diện đẹp,
> dễ deploy.

---

## 0. Tóm tắt yêu cầu

- **Giao diện đẹp**, có trang giới thiệu công khai; hiện tại chủ yếu chủ shop tự xem.
- **Trang quản trị (admin) cần đăng nhập** bằng account.
- **Upload ảnh trực tiếp** (miễn phí, qua Supabase Storage); video lưu dưới dạng link.
- **Next.js + Supabase**, deploy lên **Vercel**.

---

## 1. Công nghệ (Stack)

| Thành phần | Lựa chọn | Lý do |
|---|---|---|
| Framework | **Next.js 15** (App Router) + TypeScript | React + backend chung 1 dự án, deploy Vercel 1 lần |
| Giao diện | **Tailwind CSS + shadcn/ui** | Đẹp, hiện đại, responsive (xem tốt trên điện thoại) |
| Database | **Supabase (PostgreSQL)** | Lọc/tìm kiếm nhanh, free tier rộng rãi |
| Lưu ảnh | **Supabase Storage** | Upload trực tiếp, miễn phí |
| Đăng nhập | **Supabase Auth** (email + mật khẩu) | Bảo vệ trang admin |
| Form | react-hook-form + zod | Nhập liệu chắc chắn, validate |
| Deploy | **Vercel** | Tự động, miễn phí |

---

## 2. Cấu trúc trang

### Trang công khai (đẹp, giới thiệu)
- `/` — Trang chủ: banner + ô tìm kiếm nhanh + phòng nổi bật / mới nhất
- `/phong` — Danh sách phòng + **bộ lọc** (xem mục 4)
- `/phong/[id]` — Chi tiết: thư viện ảnh, video nhúng, đầy đủ thông tin, nút gọi/Zalo, nút copy link gửi khách
- `/gioi-thieu` — Giới thiệu dịch vụ
- `/lien-he` — Thông tin liên hệ

### Trang quản trị (cần đăng nhập)
- `/admin/login` — Đăng nhập
- `/admin` — Bảng điều khiển: danh sách phòng, tìm nhanh, đổi trạng thái (còn trống / đã thuê), ẩn/hiện
- `/admin/phong/moi` — Thêm phòng (form + **upload nhiều ảnh kéo-thả sắp xếp** + dán link video)
- `/admin/phong/[id]` — Sửa / Xóa phòng

---

## 3. Mô hình dữ liệu

### Bảng `rooms`
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | uuid | khóa chính |
| title | text | tiêu đề |
| description | text | mô tả |
| price | int | giá thuê/tháng (VND) — dùng để lọc |
| area_m2 | numeric | diện tích |
| district | text | quận/huyện |
| ward | text | phường/xã |
| address | text | địa chỉ chi tiết |
| room_type | text | khép kín / chung chủ / không chung chủ / CCMN / nhà nguyên căn / ở ghép / studio |
| deposit | int | tiền cọc |
| electricity_price | int | giá điện (đ/số) |
| water_price | int | giá nước |
| service_fee | int | phí dịch vụ/vệ sinh |
| parking_fee | int | phí gửi xe |
| internet_fee | int | phí internet |
| max_occupants | int | số người ở tối đa |
| amenities | text[] | tiện ích (chọn nhiều) — có GIN index để lọc |
| video_links | text[] | link video (YouTube/FB/Drive...) |
| contact_name | text | người liên hệ |
| contact_phone | text | SĐT |
| status | text | available / rented / hidden |
| featured | bool | nổi bật ở trang chủ |
| created_at | timestamptz | ngày đăng |
| updated_at | timestamptz | cập nhật |

### Bảng `room_images`
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | uuid | khóa chính |
| room_id | uuid | FK → rooms |
| url | text | link ảnh trong Supabase Storage |
| sort_order | int | thứ tự hiển thị (ảnh đầu = ảnh bìa) |

### Danh mục gợi ý
- **Loại hình** (`room_type`): Khép kín · Chung chủ · Không chung chủ · Chung cư mini (CCMN) · Nhà nguyên căn · Ở ghép · Studio
- **Tiện ích** (`amenities`): Điều hòa · Nóng lạnh · Wifi · Gác xép · Ban công · Tủ lạnh · Máy giặt · Bếp · Thang máy · Chỗ để xe · Khóa vân tay · Giờ giấc tự do · Camera an ninh · Nuôi pet · Full nội thất

---

## 4. Tìm kiếm & Lọc (điểm cốt lõi)

Lọc kết hợp nhiều điều kiện, trả kết quả tức thì:
- 💰 **Khoảng giá** (từ – đến)
- 📍 **Khu vực** (quận/huyện Hà Nội)
- 🏠 **Loại hình** (khép kín, không chung chủ...)
- ✅ **Tiện ích** (chọn nhiều cùng lúc)
- 📐 Diện tích · 🔍 từ khóa · sắp xếp theo mới nhất / giá tăng / giá giảm

> Tốc độ nhanh nhờ index PostgreSQL: index cho `price`, `district`, `room_type`,
> `status`, và GIN index cho `amenities`.

---

## 5. Bảo mật & Upload ảnh

- Trang admin chỉ vào được khi đã đăng nhập (middleware chặn route `/admin/*`).
- Công khai chỉ **xem** được phòng đang hiển thị (`status != hidden`); chỉ admin
  **thêm/sửa/xóa** — dùng **RLS (Row Level Security)** của Supabase.
- Luồng upload ảnh: chọn ảnh → đẩy lên Supabase Storage (bucket `room-images`) →
  lấy URL công khai → lưu vào `room_images`. Có sắp xếp thứ tự + chọn ảnh bìa.

---

## 6. Các bước thực hiện

1. Khởi tạo dự án Next.js + Tailwind + shadcn/ui
2. Thiết lập Supabase: bảng dữ liệu, RLS, bucket ảnh
3. Đăng nhập admin + bảo vệ route `/admin`
4. Admin: form thêm/sửa phòng + upload ảnh + video
5. Công khai: trang chủ, danh sách + bộ lọc, chi tiết phòng
6. Trang giới thiệu, liên hệ
7. Tinh chỉnh giao diện (mobile) + SEO cơ bản
8. Deploy lên Vercel

---

## 7. Chuẩn bị (đều miễn phí)

- Tài khoản **Supabase** → lấy `Project URL` + `anon key` + `service_role key`
- Tài khoản **Vercel** (deploy)
- Email + mật khẩu dùng làm **account admin**

### Biến môi trường (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 8. Chi phí

Toàn bộ chạy trên **free tier** (đủ cho hàng nghìn phòng + ảnh). Khi dùng nhiều mới
cần nâng cấp.

---

## 9. Ý tưởng mở rộng (tùy chọn, làm sau)

- 🗺️ Bản đồ vị trí phòng
- ⭐ Đánh dấu phòng yêu thích / so sánh
- 📄 Xuất PDF thông tin phòng để gửi khách
- 📊 Thống kê: số phòng còn trống, theo khu vực
- 👥 Thêm nhiều account nhân viên (phân quyền)
