# Phase 02 — Setup Supabase (DB + RLS + Storage)

**Priority:** P0 · **Status:** pending · **Depends:** P1

## Overview
Tạo schema Postgres (`rooms`, `room_images`), index (gồm GIN cho amenities), trigger
`updated_at`, RLS (public đọc phòng không ẩn — chỉ authenticated ghi), bucket Storage
`room-images` (public read), và các Supabase client helper (server/browser/middleware).

## Requirements
- 2 bảng đúng data model spec §7.
- RLS spec §7: anon SELECT khi `status != 'hidden'`; authenticated full write.
- Bucket `room-images`: public read, write chỉ authenticated.
- Client helpers tách rõ: browser client (anon), server client (cookies/SSR), service client (service_role, CHỈ server actions).

## Related code files (tạo)
- `supabase/schema.sql` — DDL: tables, indexes, trigger, RLS, storage policies
- `src/lib/supabase/client.ts` — browser client (`@supabase/ssr`)
- `src/lib/supabase/server.ts` — server client (đọc cookies)
- `src/lib/supabase/service.ts` — service_role client (server-only, ghi/storage)
- `.env.local` (user điền key — KHÔNG commit)

## Implementation steps
1. User tạo Supabase project → lấy URL + anon + service_role.
2. Viết `schema.sql`:
   - `rooms`, `room_images` (FK cascade) đúng cột spec §7.
   - Index: `price`, `district`, `room_type`, `status`; GIN `amenities`; index `room_images(room_id, sort_order)`.
   - Trigger set `updated_at = now()` on update.
   - Bật RLS; policy SELECT anon (`status != 'hidden'`), policy ALL cho `authenticated`.
   - Storage: tạo bucket `room-images` (public), policy write cho authenticated.
3. Chạy `schema.sql` trong Supabase SQL editor.
4. Viết 3 client helper; `service.ts` đánh dấu `import 'server-only'`.
5. Điền `.env.local` (3 biến spec §7) + xác nhận `.gitignore` chứa `.env*`.
6. Smoke test: 1 server component query `rooms` (rỗng) chạy không lỗi.

## Todo
- [ ] tạo Supabase project + lấy keys
- [ ] `schema.sql`: tables + index (GIN amenities) + trigger
- [ ] RLS policies (read public / write authenticated)
- [ ] bucket `room-images` + storage policies
- [ ] client helpers: browser / server / service (server-only)
- [ ] `.env.local` + verify gitignore
- [ ] smoke test query

## Success criteria
- Query `rooms` từ server chạy OK.
- anon KHÔNG insert được (RLS chặn) — verify nhanh.
- Upload thử 1 file vào bucket OK (sẽ test kỹ ở P4).

## Security
- `service_role` chỉ dùng server-side (`server-only`), tuyệt đối không expose client.
- `.env*` không commit.

## Risks
- Sai policy RLS → lộ ghi hoặc chặn nhầm đọc. Test cả 2 chiều (anon đọc được phòng hiện, không ghi được).
