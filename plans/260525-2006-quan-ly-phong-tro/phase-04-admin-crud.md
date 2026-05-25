# Phase 04 — Admin CRUD (form + ảnh + duplicate)

**Priority:** P0 (lõi) · **Status:** pending · **Depends:** P3

## Overview
Khu quản lý phòng: bảng danh sách (đổi trạng thái, nhân bản, xóa), form thêm/sửa
(react-hook-form + zod), uploader nhiều ảnh (nén client + kéo-thả sắp xếp + chọn bìa),
nhập link video. Mọi ghi qua Server Actions có guard session.

## Requirements
- CRUD phòng đầy đủ + đổi `status` (available/rented/hidden).
- Upload nhiều ảnh → Supabase Storage; nén client trước upload; reorder; ảnh đầu = bìa.
- Video: mảng link (YouTube/FB/TikTok/Drive), validate URL.
- **Nhân bản phòng:** copy field; ảnh dùng lại URL (xem Risks).

## Related code files (tạo)
- `src/app/admin/page.tsx` — danh sách + `admin-room-table.tsx`
- `src/app/admin/phong/moi/page.tsx`, `src/app/admin/phong/[id]/page.tsx`
- `src/components/admin/room-form.tsx` — form (RHF + zod)
- `src/components/admin/image-uploader.tsx` — chọn/nén/upload/reorder (dnd-kit)
- `src/components/admin/video-links-input.tsx`
- `src/lib/validation/room-schema.ts` — zod schema (spec §8)
- `src/app/actions/rooms.ts` — server actions (guard session)
- `src/lib/storage/upload-room-images.ts`, `.../delete-room-images.ts`

## Server actions (đều check session)
- `createRoom(input)` / `updateRoom(id, input)` / `deleteRoom(id)`
- `duplicateRoom(id)` / `setRoomStatus(id, status)`
- `uploadRoomImages(roomId, files)` / `reorderImages(roomId, orderedIds)`

## Implementation steps
1. zod schema theo spec §8 (price≥0, area>0, title bắt buộc, district∈danh mục, room_type∈enum, phone VN, video_links là URL).
2. `room-form.tsx`: tất cả field data model; select district/room_type, multi-select amenities, input phí, video links động.
3. `image-uploader.tsx`: chọn nhiều → nén `browser-image-compression` → upload Storage (đường dẫn `room-images/{roomId}/{uuid}`) → lưu `room_images` → preview + dnd reorder + đặt bìa + xóa.
4. server actions: guard session; create/update qua service client; revalidate path.
5. `admin-room-table.tsx`: cột ảnh bìa/tiêu đề/giá/khu vực/trạng thái; actions sửa/nhân bản/đổi trạng thái/xóa (confirm dialog).
6. `deleteRoom`: xóa record (cascade ảnh DB) + xóa file Storage không còn tham chiếu.
7. `duplicateRoom`: copy fields (title + " (bản sao)"), `status='hidden'`; nhân bản `room_images` trỏ cùng URL.

## Todo
- [ ] zod room-schema
- [ ] room-form (đủ field, validate)
- [ ] image-uploader (nén + upload + reorder + bìa + xóa)
- [ ] video-links-input
- [ ] server actions (guard + revalidate)
- [ ] admin-room-table (status/duplicate/delete confirm)
- [ ] storage upload/delete helpers
- [ ] test CRUD + upload + duplicate

## Success criteria
- Thêm phòng kèm 5–10 ảnh < 2 phút; ảnh hiển thị đúng thứ tự.
- Sửa/xóa hoạt động; xóa dọn luôn file Storage.
- Nhân bản < 15s, ra phòng `hidden` để sửa.
- anon không gọi được action (RLS + guard).

## Risks
- **Ảnh khi nhân bản:** v1 dùng chung URL. Khi xóa phòng, CHỈ xóa file Storage nếu không `room_images` nào khác trỏ tới (đếm tham chiếu). Nếu phức tạp → fallback: nhân bản copy file thật (tốn dung lượng nhưng an toàn). Chốt khi code.
- Storage free tier giới hạn → nén ảnh bắt buộc; giới hạn kích thước/định dạng.

## Modularization
- `room-form` dễ vượt 200 dòng → tách field-group (thông tin / chi phí / tiện ích / media).
