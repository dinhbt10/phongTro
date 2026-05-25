# Phase 03 — Auth admin + bảo vệ /admin

**Priority:** P0 · **Status:** pending · **Depends:** P2

## Overview
Đăng nhập admin bằng Supabase Auth (email/mật khẩu), middleware chặn `/admin/*`,
helper lấy session phía server, nút đăng xuất.

## Requirements
- 1 account admin (tạo sẵn trong Supabase).
- Chưa login vào `/admin/*` → redirect `/admin/login`.
- Session lưu qua cookie (`@supabase/ssr`), refresh tự động.

## Related code files (tạo)
- `src/middleware.ts` — match `/admin/:path*`, kiểm tra session, redirect
- `src/app/admin/login/page.tsx` — form đăng nhập (email + mật khẩu)
- `src/app/admin/login/login-form.tsx` — client form (react-hook-form + zod)
- `src/lib/auth/get-session.ts` — helper server đọc user/session
- `src/app/admin/layout.tsx` — layout admin + nút Đăng xuất (guard lần 2)
- action đăng xuất (server action)

## Implementation steps
1. Trong Supabase → tạo user admin (email/mật khẩu user cung cấp). Tắt signup công khai nếu có.
2. `middleware.ts`: dùng `@supabase/ssr` updateSession; nếu route `/admin/*` (trừ `/admin/login`) và không có user → redirect login.
3. Login form: `signInWithPassword`; lỗi → toast; thành công → redirect `/admin`.
4. `get-session.ts`: trả `user` từ server client; dùng để guard layout + server actions.
5. `admin/layout.tsx`: nếu không user → redirect; render nav + nút Đăng xuất.
6. Đăng xuất: server action `signOut` → redirect `/admin/login`.

## Todo
- [ ] tạo user admin trong Supabase
- [ ] `middleware.ts` bảo vệ `/admin/*`
- [ ] trang + form đăng nhập (validate, toast lỗi)
- [ ] `get-session` helper
- [ ] admin layout + đăng xuất
- [ ] test: truy cập `/admin` khi chưa login → bị chặn

## Success criteria
- Chưa login: `/admin` → `/admin/login`.
- Login đúng → vào `/admin`; sai → báo lỗi.
- Đăng xuất → trở lại login, mất quyền.

## Security
- Guard 2 lớp: middleware + kiểm tra `user` đầu mỗi server action ghi.
- Không tin client; mọi action ghi đều verify session server-side.
