# Phase 07 — Polish mobile + SEO/OpenGraph

**Priority:** P1 · **Status:** pending · **Depends:** P5, P6

## Overview
Hoàn thiện trải nghiệm mobile, thêm metadata + OpenGraph cho chi tiết phòng (để link
Zalo/FB hiện đẹp), các trạng thái loading/empty/404, tối ưu ảnh.

## Requirements
- Responsive kỹ trên mobile (lọc, gallery, form admin).
- `generateMetadata` cho `/phong/[id]`: title, description, OG image = ảnh bìa, giá + khu vực.
- Loading skeleton cho danh sách; empty state khi 0 kết quả; 404 thân thiện.
- `next/image` tối ưu; `sitemap.ts` + `robots.ts` cơ bản.

## Related code files (tạo/sửa)
- `src/app/phong/[id]/page.tsx` — thêm `generateMetadata`
- `src/app/phong/loading.tsx`, `src/app/loading.tsx`
- `src/components/rooms/rooms-empty-state.tsx`
- `src/app/not-found.tsx`
- `src/app/sitemap.ts`, `src/app/robots.ts`
- `next.config.ts` — cho phép domain ảnh Supabase trong `images`

## Implementation steps
1. `generateMetadata` chi tiết phòng (OG title/description/image).
2. `next.config.ts`: thêm host Supabase Storage vào `images.remotePatterns`.
3. Loading skeleton + empty state + 404.
4. Rà responsive: filter Sheet, gallery vuốt, bảng admin cuộn ngang, form 1 cột mobile.
5. `sitemap.ts` (liệt kê phòng public) + `robots.ts`.
6. Kiểm tra Lighthouse mobile (performance + a11y cơ bản).

## Todo
- [ ] generateMetadata + OG cho /phong/[id]
- [ ] next.config images remotePatterns (Supabase)
- [ ] loading skeleton + empty state + 404
- [ ] rà responsive mobile toàn site
- [ ] sitemap + robots
- [ ] Lighthouse mobile pass cơ bản

## Success criteria
- Share link phòng lên Zalo/FB hiện ảnh + tiêu đề + giá.
- Mobile mượt, không vỡ layout.
- Lighthouse mobile performance ổn (ảnh tối ưu).

## Notes
- OG image lấy ảnh bìa (sort_order nhỏ nhất).
