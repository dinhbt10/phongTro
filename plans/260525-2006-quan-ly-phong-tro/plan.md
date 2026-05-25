---
status: pending
created: 2026-05-25
slug: quan-ly-phong-tro
---

# Plan: Web Quản Lý & Tìm Phòng Trọ (Hà Nội)

> Công cụ cho sale trọ: lưu ảnh (upload) + link video, tìm/lọc phòng cực nhanh
> (mobile-first), gửi khách qua Zalo/FB. Công khai xem — riêng tư quản lý.

**Spec nguồn:** [design-spec](../reports/design-spec-260525-2006-quan-ly-phong-tro.md)

## Stack (thực tế đã cài)
Next.js **16.2.6** (App Router, Turbopack) + React 19 + TS · Tailwind **v4** · shadcn/ui (**Base UI**, không phải Radix) · Supabase (Postgres + Storage + Auth) · Vercel.

> ⚠️ **Deviation quan trọng:** shadcn bản này dùng **Base UI** (`@base-ui/react`). Component **không có `asChild`** — dùng prop **`render`** để compose (vd `<Button render={<Link href="..."/>}>Label</Button>`), hoặc dùng `buttonVariants()` cho thẻ `<a>/<Link>`. Áp dụng cho Select/Dialog/Sheet/DropdownMenu ở các phase sau.

## Prerequisites (user cung cấp)
- Tài khoản Supabase → `Project URL`, `anon key`, `service_role key`
- Tài khoản Vercel
- Email + mật khẩu cho account admin

## Phases

| # | Phase | File | Trạng thái |
|---|---|---|---|
| 1 | Khởi tạo dự án | [phase-01](phase-01-khoi-tao-du-an.md) | ✅ done |
| 2 | Setup Supabase (DB + RLS + Storage) | [phase-02](phase-02-setup-supabase.md) | ✅ done |
| 3 | Auth admin + bảo vệ /admin | [phase-03](phase-03-auth-admin.md) | ✅ done |
| 4 | Admin CRUD (form + ảnh + duplicate) | [phase-04](phase-04-admin-crud.md) | ✅ done |
| 5 | Public: trang chủ + lọc + chi tiết | [phase-05](phase-05-public-pages-filter.md) | ✅ done |
| 6 | Trang giới thiệu / liên hệ | [phase-06](phase-06-gioi-thieu-lien-he.md) | ✅ done |
| 7 | Polish mobile + SEO/OpenGraph | [phase-07](phase-07-polish-seo.md) | ✅ done (skeleton, sitemap/robots, 404, metadataBase, OG, rà mobile) |
| + | Extra: rich text, parser tin, bản đồ, zoom ảnh, nút xem, admin stats/search, sticky contact, phòng tương tự | — | ✅ done |
| 8 | Deploy Vercel | [phase-08](phase-08-deploy-vercel.md) | ☐ pending |

## Dependency chain
P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8
(P5 cần P2 cho data; P4 & P5 dùng chung constants + types từ P1.)

## Nguyên tắc
YAGNI/KISS/DRY · file < 200 dòng (modularize) · kebab-case · không mock/fake để pass build · `next/image` · RLS chặn ghi từ client.

## v2 (ngoài plan này)
Shortlist · gợi ý phòng khớp nhu cầu khách · xuất PDF · bản đồ · dashboard · nhiều account.
