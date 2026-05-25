# Phase 05 — Public: trang chủ + lọc + chi tiết

**Priority:** P0 (lõi, giá trị chính) · **Status:** pending · **Depends:** P2, P4

## Overview
Trang công khai mobile-first: trang chủ (hero + tìm nhanh + phòng nổi bật/mới), danh
sách `/phong` lọc **tức thì theo URL query**, và chi tiết `/phong/[id]` (gallery, video
nhúng, share Zalo/FB/copy link).

## Requirements
- Lọc: khoảng giá, khu vực, loại hình, tiện ích (multi, "chứa tất cả"), diện tích, từ khóa, sort (newest/price_asc/price_desc), phân trang.
- URL là nguồn sự thật: `/phong?q=&district=&type=&price_min=&price_max=&area_min=&amenities=a,b&sort=&page=`.
- Mobile: bộ lọc trong Sheet/drawer, áp dụng ngay; desktop: sidebar.
- Chi tiết: gallery lightbox, VideoEmbed nhận diện platform, ShareButtons.
- Public chỉ thấy `status != 'hidden'` (RLS).

## Related code files (tạo)
- `src/app/page.tsx` — trang chủ (hero + quick search + featured/newest)
- `src/app/phong/page.tsx` — danh sách (server, đọc searchParams)
- `src/components/rooms/room-filters.tsx` — client, đồng bộ URL (debounce text)
- `src/components/rooms/room-card.tsx`
- `src/components/rooms/room-gallery.tsx` — lightbox + vuốt
- `src/components/rooms/video-embed.tsx` — YouTube/FB/TikTok/Drive → iframe hoặc nút mở
- `src/components/rooms/share-buttons.tsx` — Zalo, Facebook, copy link
- `src/lib/rooms/build-rooms-query.ts` — searchParams → Supabase query
- `src/app/phong/[id]/page.tsx` — chi tiết
- `src/app/phong/[id]/not-found.tsx`

## Implementation steps
1. `build-rooms-query.ts`: parse/validate searchParams → query (`gte/lte` giá, `eq` district/type, `contains` amenities, `ilike` q trên title/address, order theo sort, range phân trang). Trả `{rooms,total,page,pageSize}`.
2. `/phong/page.tsx` (server): gọi query, render grid `room-card` + phân trang + tổng kết quả.
3. `room-filters.tsx` (client): điều khiển → cập nhật URL (`useRouter`/`useSearchParams`), text debounce ~300ms; mobile dùng Sheet; nút "Xóa lọc". Lọc tức thì = đổi URL → server re-render.
4. `room-card.tsx`: ảnh bìa (`next/image`), giá, khu vực, loại, 2–3 tiện ích, badge trạng thái.
5. `/phong/[id]/page.tsx`: fetch theo id; nếu không có / hidden (với anon) → `notFound()`. Render gallery + thông tin đầy đủ + VideoEmbed + ShareButtons + liên hệ (gọi/Zalo).
6. `video-embed.tsx`: regex nhận diện platform → iframe nhúng; không nhận diện → nút "Mở video".
7. `share-buttons.tsx`: Zalo share URL, FB sharer URL, copy link (toast).
8. Trang chủ: hero + ô tìm nhanh (đẩy sang `/phong` với query) + section phòng `featured` + mới nhất.

## Todo
- [ ] build-rooms-query (parse + validate + query)
- [ ] /phong danh sách + phân trang
- [ ] room-filters (URL-driven, mobile Sheet, debounce, xóa lọc)
- [ ] room-card
- [ ] /phong/[id] chi tiết + not-found
- [ ] room-gallery (lightbox)
- [ ] video-embed (đa nền tảng)
- [ ] share-buttons (Zalo/FB/copy)
- [ ] trang chủ (hero + tìm nhanh + featured/newest)
- [ ] test lọc + chi tiết + share

## Success criteria
- Lọc ra kết quả < 1s; URL share lại đúng bộ lọc.
- Back/forward giữ đúng trạng thái lọc.
- Mobile thao tác lọc mượt; chi tiết mở + share < 3 chạm.
- Phòng `hidden` không hiện với khách.

## Risks
- Filter logic dễ rối → tập trung ở `build-rooms-query` (1 nguồn), test riêng.
- `contains` amenities cần GIN index (P2) để nhanh.

## Modularization
- Tách section trang chủ; filters > 200 dòng → tách field con.
