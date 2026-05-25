# Design Spec — Web Quản Lý & Tìm Phòng Trọ (Hà Nội)

- **Ngày:** 2026-05-25
- **Loại:** Feature design spec (brainstorm-features)
- **Trạng thái:** Approved (chờ chuyển sang /plan)
- **Liên quan:** [plan.md](../../plan.md)

---

## 1. Problem statement

Nhân viên sale trọ tại Hà Nội cần 1 web để:
- Lưu trữ **hình ảnh (upload trực tiếp)** + **link video** từng phòng.
- **Tìm/lọc phòng cực nhanh** theo giá, khu vực, loại hình (khép kín, không chung chủ...), tiện ích.
- Gửi nhanh thông tin phòng cho khách (Zalo/Facebook/copy link).
- Tự quản lý kho phòng (thêm/sửa/xóa, đánh dấu trạng thái) qua trang admin có đăng nhập.

Hiện tại chủ yếu 1 người dùng (sale) quản lý; khách chỉ xem khi được gửi link.

## 2. User stories

- US1: Là sale, tôi đăng nhập admin để thêm phòng kèm nhiều ảnh + link video, nhanh.
- US2: Là sale, tôi lọc tức thì trên điện thoại theo giá/khu vực/loại/tiện ích để tìm phòng phù hợp khi đang nói chuyện với khách.
- US3: Là sale, tôi mở 1 phòng và gửi cho khách qua Zalo/FB hoặc copy link chỉ 1 chạm.
- US4: Là sale, tôi nhân bản 1 phòng để nhập nhanh phòng tương tự (cùng nhà/cùng khu).
- US5: Là sale, tôi đổi trạng thái phòng (còn trống / đã thuê / ẩn) để khách không thấy phòng hết.
- US6: Là khách (có link), tôi xem ảnh/video + thông tin phòng mà không cần đăng nhập.

## 3. Scope

### v1 (bản đầu)
- Lõi: CRUD phòng + upload ảnh + link video + tìm/lọc + chi tiết phòng + đăng nhập admin + trang giới thiệu/liên hệ.
- **Share nhanh Zalo/Facebook + copy link.**
- **Nhân bản phòng (duplicate).**
- Mobile-first, lọc tức thì.
- 1 account admin.

### v2 (sau)
- Shortlist (chọn nhiều phòng gửi 1 lúc).
- Lưu nhu cầu khách → gợi ý phòng khớp.
- Xuất PDF/ảnh tổng hợp gửi khách.
- Bản đồ vị trí.
- Dashboard thống kê.
- Nhiều account nhân viên + phân quyền.

### Out of scope
- Hosting video (chỉ lưu link).
- Thanh toán / hợp đồng online.

## 4. Decisions (đã chốt)

| Quyết định | Lựa chọn | Ghi chú |
|---|---|---|
| Stack | Next.js 15 (App Router) + TS, Tailwind + shadcn/ui | React fullstack, deploy Vercel |
| Backend/DB | Supabase (Postgres + Storage + Auth) | Free tier |
| Mô hình riêng tư | **Công khai xem, riêng tư quản lý** | Khách có link xem được; chỉ admin ghi |
| Thiết bị/UX | **Mobile-first, lọc tức thì** | Responsive desktop |
| Lưu ảnh | Upload trực tiếp → Supabase Storage | Nén ảnh client trước upload |
| Video | Link YouTube/Facebook/TikTok/Google Drive | Nhúng nếu được, không thì nút mở link |
| Khu vực | Dropdown quận/huyện Hà Nội cố định | |
| Auth | 1 account admin (v1) | Email + mật khẩu (Supabase Auth) |

## 5. Evaluated approaches

### Stack & hosting
- **Chọn: Next.js + Supabase + Vercel.** 1 repo, deploy 1 lần, Supabase lo DB/Storage/Auth, free.
- Loại: Vite React + Node/Express riêng (nhiều phần phải deploy & quản lý hơn — vi phạm KISS).

### Mô hình riêng tư
- A. Tất cả riêng tư (login mới xem) — không gửi link khách được → loại.
- **B. Công khai xem, riêng tư quản lý — CHỌN.** Tiện gửi khách, vẫn an toàn (RLS chỉ cho admin ghi).
- C. Lai (token chia sẻ từng phòng) — phức tạp, để cân nhắc v2 nếu cần ẩn phòng kỹ hơn.

### Đọc dữ liệu
- **Chọn: Server Components query trực tiếp Supabase** (nhanh, SEO, không cần tự xây REST layer).
- Ghi: **Server Actions** + kiểm tra session (không lộ service key ra client).

## 6. Architecture

```
Next.js (App Router) @ Vercel
├── Public (no login)
│   ├── /                       trang chủ: hero + tìm nhanh + phòng nổi bật/mới
│   ├── /phong                  danh sách + lọc tức thì (mobile-first)
│   ├── /phong/[id]             chi tiết: gallery ảnh, video, share Zalo/FB, copy link
│   ├── /gioi-thieu             giới thiệu dịch vụ
│   └── /lien-he                liên hệ
├── Admin (login required, middleware-protected)
│   ├── /admin/login
│   ├── /admin                  danh sách: tìm, đổi trạng thái, nhân bản, xóa
│   ├── /admin/phong/moi        form thêm + upload ảnh + video
│   └── /admin/phong/[id]       form sửa + xóa
└── Supabase
    ├── Postgres: rooms, room_images
    ├── Storage: bucket "room-images" (public read)
    └── Auth: admin email/password
```

### Components (FE)
- `RoomCard` — thẻ phòng (ảnh bìa, giá, khu vực, loại, tiện ích nổi bật, trạng thái).
- `RoomFilters` — bộ lọc tức thì (giá range, khu vực, loại, tiện ích multi-select, diện tích, từ khóa, sort). Đồng bộ URL query.
- `RoomGallery` — thư viện ảnh (lightbox, vuốt mobile).
- `VideoEmbed` — nhận diện platform → nhúng iframe hoặc nút mở link.
- `ShareButtons` — Zalo, Facebook, copy link.
- `RoomForm` — form thêm/sửa (react-hook-form + zod).
- `ImageUploader` — chọn nhiều ảnh, nén client, upload Storage, kéo-thả sắp xếp, chọn ảnh bìa.
- `AdminRoomTable` — bảng quản lý + actions (đổi trạng thái, nhân bản, xóa).

## 7. Data model

### Table `rooms`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid PK | |
| title | text | |
| description | text | |
| price | int | VND/tháng — index |
| area_m2 | numeric | |
| district | text | quận/huyện — index |
| ward | text | |
| address | text | |
| room_type | text | khép kín/chung chủ/không chung chủ/CCMN/nhà nguyên căn/ở ghép/studio — index |
| deposit | int | |
| electricity_price | int | |
| water_price | int | |
| service_fee | int | |
| parking_fee | int | |
| internet_fee | int | |
| max_occupants | int | |
| amenities | text[] | GIN index |
| video_links | text[] | |
| contact_name | text | |
| contact_phone | text | |
| status | text | available/rented/hidden — index |
| featured | bool | |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

### Table `room_images`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid PK | |
| room_id | uuid FK → rooms(id) on delete cascade | |
| url | text | link Storage |
| sort_order | int | ảnh đầu = bìa |

### Danh mục
- `room_type`: Khép kín · Chung chủ · Không chung chủ · CCMN · Nhà nguyên căn · Ở ghép · Studio
- `amenities`: Điều hòa · Nóng lạnh · Wifi · Gác xép · Ban công · Tủ lạnh · Máy giặt · Bếp · Thang máy · Chỗ để xe · Khóa vân tay · Giờ giấc tự do · Camera an ninh · Nuôi pet · Full nội thất

### RLS
- `rooms`, `room_images`: **SELECT** cho anon CHỈ khi `status != 'hidden'`; **INSERT/UPDATE/DELETE** chỉ cho authenticated (admin).
- Storage bucket `room-images`: public read; write chỉ authenticated.

## 8. Interface contracts

### Filter → query (URL-driven)
- URL: `/phong?q=&district=&type=&price_min=&price_max=&area_min=&amenities=a,b&sort=newest|price_asc|price_desc&page=`
- Server đọc query → build Supabase query → trả `{ rooms, total, page, pageSize }`.
- `amenities` lọc kiểu "chứa tất cả" (contains) qua GIN.
- URL là nguồn sự thật → share được, back/forward đúng.

### Server Actions (admin, có guard session)
- `createRoom(input)` → uuid
- `updateRoom(id, input)`
- `deleteRoom(id)` (cascade ảnh + xóa file Storage)
- `duplicateRoom(id)` → tạo bản sao (copy field; ảnh: tham chiếu lại hoặc copy — xem Risks)
- `setRoomStatus(id, status)`
- `uploadRoomImages(roomId, files[])` → urls[]; `reorderImages(roomId, orderedIds[])`

### Validation (zod)
- `price >= 0`, `area_m2 > 0`, `title` bắt buộc, `district` thuộc danh mục, `room_type` thuộc enum, `contact_phone` định dạng SĐT VN, `video_links` mỗi item là URL hợp lệ.

## 9. Error handling & edge cases

- Upload ảnh: lỗi/quá nặng → nén client trước; báo rõ + cho thử lại; giới hạn dung lượng/định dạng (jpg/png/webp).
- Phòng không tồn tại / `hidden` với anon → 404 thân thiện.
- Lọc 0 kết quả → gợi ý nới điều kiện + nút xóa lọc.
- Mất mạng khi submit form → giữ dữ liệu đã nhập (client state), báo lỗi, cho gửi lại.
- Link video sai định dạng → vẫn lưu, hiển thị nút mở link thường.
- Xóa phòng → confirm; xóa cascade ảnh DB + file Storage.
- Truy cập `/admin/*` chưa login → redirect `/admin/login`.

## 10. Testing strategy

- **Unit:** parse/validate filter, build Supabase query từ params, zod schema form, nhận diện platform video.
- **Integration:** CRUD phòng; upload + reorder ảnh; RLS (anon không ghi được, không thấy phòng hidden); duplicate.
- **E2E (nhẹ):** login → thêm phòng (kèm ảnh) → lọc → mở chi tiết → share/copy link.
- Nguyên tắc: không mock/fake để pass build; fix test thật.

## 11. Implementation considerations & risks

- **Duplicate ảnh:** nhân bản phòng — quyết định copy file Storage (tốn dung lượng) vs share URL (xóa phòng gốc có thể ảnh hưởng). Khuyến nghị v1: copy reference URL nhưng KHÔNG cascade-delete file dùng chung; đơn giản nhất là duplicate copy luôn record `room_images` trỏ cùng URL, và khi xóa phòng chỉ xóa file nếu không phòng khác dùng. (Cần chốt khi /plan.)
- **Nén ảnh client:** dùng thư viện (vd browser-image-compression) để tiết kiệm Storage free tier + tải nhanh trên mobile.
- **Service role key:** chỉ dùng phía server (Server Actions/route), không lộ client.
- **Danh mục quận/huyện & tiện ích:** giữ ở constant FE/DB; dễ sửa, dùng slug ổn định để lọc.
- **SEO/share preview:** thêm Open Graph (ảnh bìa, giá, khu vực) cho `/phong/[id]` để link Zalo/FB hiện đẹp.
- **Performance:** index đầy đủ; phân trang; `next/image` tối ưu ảnh.

## 12. Success metrics

- Lọc ra kết quả < 1s với vài nghìn phòng.
- Thêm 1 phòng (kèm 5–10 ảnh) < 2 phút.
- Nhân bản phòng < 15s.
- Mở chi tiết + share link < 3 chạm trên mobile.
- Deploy Vercel thành công, chạy trên free tier.

## 13. Next steps & dependencies

- Chuyển sang `/plan` để chia phase (khởi tạo → Supabase → auth → admin CRUD → public/filter → trang giới thiệu → polish/SEO → deploy).
- Cần từ user: tài khoản Supabase (URL + anon + service_role key), tài khoản Vercel, email/mật khẩu admin.

## 14. Unresolved questions

1. Nhân bản phòng: copy file ảnh thật hay dùng chung URL? (đề xuất: dùng chung URL, xóa file an toàn theo tham chiếu — chốt ở /plan).
2. Có cần ẩn SĐT/giá với người chưa đăng nhập không? (mặc định: hiện công khai; có thể bật ẩn sau).
3. Trang giới thiệu/liên hệ: nội dung cụ thể (logo, slogan, kênh liên hệ Zalo/FB/phone)? Cần user cung cấp khi làm UI.
