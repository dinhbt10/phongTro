# Phase 08 — Deploy Vercel

**Priority:** P1 · **Status:** pending · **Depends:** P1–P7

## Overview
Đưa dự án lên GitHub, deploy Vercel với biến môi trường, cấu hình Supabase cho
production, và kiểm thử end-to-end trên bản live.

## Requirements
- Repo GitHub (private khuyến nghị).
- Vercel project + env vars (3 biến Supabase).
- Supabase: thêm URL Vercel vào Auth redirect/allowed (nếu cần).
- Bản live chạy đúng: login admin, CRUD, lọc, share.

## Related files
- `.env.local.example` (đã có) — đối chiếu khi điền env trên Vercel
- `README.md` — hướng dẫn chạy + deploy + điền env

## Implementation steps
1. `git init` + `.gitignore` (đảm bảo `.env*`, `node_modules` bị loại) → push GitHub.
2. Import repo vào Vercel; framework auto-detect Next.js.
3. Khai báo env trên Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
4. Supabase: thêm domain Vercel vào Auth "Site URL"/redirect nếu dùng email link (login password thì thường không cần).
5. Deploy → mở bản live.
6. E2E thật: đăng nhập admin → thêm phòng (upload ảnh) → lọc → mở chi tiết → share link.
7. Viết `README.md` (chạy local + deploy + env + chạy `schema.sql`).

## Todo
- [ ] push GitHub (verify không lộ `.env`)
- [ ] tạo Vercel project + env vars
- [ ] cấu hình Supabase cho domain production
- [ ] deploy + mở live
- [ ] E2E live (login → thêm → upload → lọc → share)
- [ ] README hướng dẫn

## Success criteria
- Bản live hoạt động đầy đủ trên free tier.
- Không lộ secret; `service_role` chỉ server-side.
- E2E pass.

## Security
- Kiểm tra lần cuối: anon không ghi được trên production (RLS).
- Không có `.env`/key trong repo.

## Risks
- Sai env trên Vercel → app lỗi runtime. Đối chiếu kỹ tên biến.
- Quên thêm host ảnh Supabase (P7) → ảnh `next/image` lỗi trên live.
