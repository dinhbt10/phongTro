# Phase 01 — Khởi tạo dự án

**Priority:** P0 (nền tảng) · **Status:** pending · **Depends:** none

## Overview
Tạo Next.js 15 (App Router, TS, Tailwind), cài shadcn/ui + thư viện cốt lõi, dựng
cấu trúc thư mục, layout gốc, và các hằng số dùng chung (quận/huyện HN, loại phòng,
tiện ích).

## Requirements
- Next.js 15 App Router + TypeScript + Tailwind CSS.
- shadcn/ui (button, input, select, dialog, card, badge, sheet, dropdown-menu, sonner/toast).
- Thư viện: `@supabase/supabase-js`, `@supabase/ssr`, `react-hook-form`, `zod`, `@hookform/resolvers`, `browser-image-compression`, `lucide-react`, dnd (vd `@dnd-kit/core` cho reorder ảnh).

## Related code files (tạo)
- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`
- `src/app/layout.tsx`, `src/app/page.tsx` (placeholder), `src/app/globals.css`
- `src/lib/constants/hanoi-districts.ts` — danh sách quận/huyện HN (slug + label)
- `src/lib/constants/room-types.ts` — loại hình (slug + label)
- `src/lib/constants/amenities.ts` — tiện ích (slug + label + icon)
- `src/lib/types/room.ts` — type `Room`, `RoomImage`, `RoomFilters`
- `src/components/ui/*` (shadcn generated)
- `.env.local.example`

## Implementation steps
1. `npx create-next-app@latest` (TS, App Router, Tailwind, src dir, import alias `@/*`).
2. `npx shadcn@latest init` → thêm các component nêu trên.
3. Cài thư viện cốt lõi (mục Requirements).
4. Viết constants: quận/huyện HN (đủ 30 quận/huyện), room-types (7 loại), amenities (15 mục) — mỗi item `{ slug, label }`, dùng slug ổn định cho filter.
5. Định nghĩa types `Room`, `RoomImage`, `RoomFilters` khớp data model spec §7.
6. Layout gốc: font, container, `<Toaster/>`, metadata mặc định (title/description tiếng Việt).
7. Trang chủ placeholder để chạy được.

## Todo
- [ ] create-next-app (TS + App Router + Tailwind)
- [ ] shadcn init + thêm components
- [ ] cài thư viện cốt lõi
- [ ] constants: districts / room-types / amenities
- [ ] types: Room / RoomImage / RoomFilters
- [ ] layout gốc + Toaster + metadata
- [ ] `.env.local.example`
- [ ] `npm run build` pass

## Success criteria
- `npm run dev` chạy, trang chủ hiển thị.
- `npm run build` không lỗi TS.
- Constants & types sẵn sàng cho các phase sau.

## Notes
- File constants/types < 200 dòng; tách nếu dài.
- Slug constants là "hợp đồng" với filter URL ở Phase 05 — đặt cẩn thận, không đổi về sau.
