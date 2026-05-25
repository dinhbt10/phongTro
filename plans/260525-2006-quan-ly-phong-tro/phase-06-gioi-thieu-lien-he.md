# Phase 06 — Trang giới thiệu / liên hệ

**Priority:** P1 · **Status:** pending · **Depends:** P1

## Overview
Trang giới thiệu dịch vụ + trang liên hệ, header/footer điều hướng dùng chung, và
cấu hình thông tin liên hệ (Zalo/FB/SĐT) tập trung 1 chỗ.

## Requirements
- `/gioi-thieu`: giới thiệu dịch vụ sale trọ (text + ảnh placeholder).
- `/lien-he`: kênh liên hệ (gọi, Zalo, Facebook), khu vực hoạt động (Hà Nội).
- Header + footer nhất quán toàn site, có link tới `/phong`, `/gioi-thieu`, `/lien-he`.

## Related code files (tạo)
- `src/app/gioi-thieu/page.tsx`
- `src/app/lien-he/page.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/lib/constants/site-config.ts` — tên brand, slogan, phone, zalo, facebook

## Implementation steps
1. `site-config.ts`: gom brand/slogan/kênh liên hệ (user cung cấp nội dung thật sau).
2. `site-header.tsx`: logo/brand + nav (responsive, menu mobile).
3. `site-footer.tsx`: liên hệ nhanh + copyright.
4. Gắn header/footer vào layout công khai (không áp cho `/admin`).
5. `/gioi-thieu`, `/lien-he`: nội dung tĩnh + nút gọi/Zalo (dùng `site-config`).

## Todo
- [ ] site-config (brand + kênh liên hệ)
- [ ] site-header (responsive nav)
- [ ] site-footer
- [ ] /gioi-thieu
- [ ] /lien-he
- [ ] gắn header/footer cho layout public (trừ admin)

## Success criteria
- Điều hướng giữa trang chủ / phòng / giới thiệu / liên hệ mượt.
- Nút gọi/Zalo hoạt động trên mobile.
- Admin không bị áp header/footer công khai.

## Notes
- Nội dung chữ + logo thật: user cung cấp; trước mắt dùng placeholder hợp lý.
