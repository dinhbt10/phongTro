# Implementation Report — Phase 4/5/6 + next.config image fix

**Date:** 2026-05-25  
**Build status:** PASS (no errors, no warnings)

---

## Files Created / Modified

### Shared lib (new)
- `src/lib/format.ts` — formatPrice, formatPriceMonth, formatArea
- `src/lib/validation/room-schema.ts` — Zod v4 schema, RoomFormValues, CoercedRoomValues, coerceRoomValues()
- `src/lib/rooms/build-rooms-query.ts` — parseRoomFilters, fetchRooms (pagination, all filters)
- `src/lib/rooms/room-fetchers.ts` — getRoomById, getFeaturedRooms, getLatestRooms, getAllRoomsForAdmin
- `src/lib/storage/room-image-storage.ts` — extractStoragePath, deleteStorageObjects
- `src/lib/constants/site-config.ts` — SITE_CONFIG (brand, slogan, phone, zalo, facebook, area)

### Phase 4 — Admin CRUD (new)
- `src/app/admin/(protected)/phong/room-actions.ts` — createRoom, updateRoom, deleteRoom, duplicateRoom, setRoomStatus
- `src/components/admin/room-status-badge.tsx`
- `src/components/admin/video-links-input.tsx`
- `src/components/admin/sortable-image-thumb.tsx` — dnd-kit sortable thumbnail
- `src/components/admin/image-uploader.tsx` — compress+upload+reorder+cover badge
- `src/components/admin/room-form-sections/main-info-section.tsx`
- `src/components/admin/room-form-sections/costs-section.tsx`
- `src/components/admin/room-form-sections/amenities-section.tsx`
- `src/components/admin/room-form-sections/media-section.tsx`
- `src/components/admin/room-form-sections/contact-status-section.tsx`
- `src/components/admin/room-form.tsx` — full RHF form, calls server actions
- `src/components/admin/admin-room-table.tsx` — desktop table + mobile cards, DropdownMenu actions, delete Dialog
- `src/app/admin/(protected)/page.tsx` — replaced placeholder with real AdminRoomTable
- `src/app/admin/(protected)/phong/moi/page.tsx` — new room page
- `src/app/admin/(protected)/phong/[id]/page.tsx` — edit room page

### Phase 5/6 — Public pages + layout (new)
- `src/components/rooms/amenity-icon.tsx` — slug→lucide icon map
- `src/components/rooms/room-card.tsx`
- `src/components/rooms/room-filters.tsx` — URL-driven, desktop sidebar + mobile Sheet, debounced text
- `src/components/rooms/rooms-empty-state.tsx`
- `src/components/rooms/room-gallery.tsx` — grid + lightbox Dialog
- `src/components/rooms/video-embed.tsx` — YouTube iframe or link button
- `src/components/rooms/share-buttons.tsx` — copy link, Zalo, Facebook
- `src/components/rooms/quick-search.tsx` — hero search → /phong
- `src/components/layout/site-header.tsx` — sticky, mobile Sheet menu
- `src/components/layout/site-footer.tsx`
- `src/app/(public)/layout.tsx` — wraps SiteHeader + SiteFooter
- `src/app/(public)/page.tsx` — home: hero + quick-search + featured/latest sections
- `src/app/(public)/phong/page.tsx` — listing: filters + RoomCard grid + pagination
- `src/app/(public)/phong/[id]/page.tsx` — detail: gallery, amenities, costs, videos, share
- `src/app/(public)/phong/[id]/not-found.tsx`
- `src/app/(public)/gioi-thieu/page.tsx` — static intro
- `src/app/(public)/lien-he/page.tsx` — contact channels

### Modified
- `src/app/admin/(protected)/page.tsx` — replaced placeholder
- `next.config.ts` — added `images.remotePatterns` for `*.supabase.co`
- `src/app/page.tsx` — **DELETED** (moved to `(public)/page.tsx` to avoid route conflict)

---

## Routes Now Working

| Route | Type | Notes |
|---|---|---|
| `/` | dynamic | Home: hero + quick search + featured/latest |
| `/phong` | dynamic | Listing with URL-driven filters + pagination |
| `/phong/[id]` | dynamic | Detail: gallery, costs, video, share |
| `/gioi-thieu` | static | Intro page |
| `/lien-he` | static | Contact channels |
| `/admin` | dynamic + auth | Room table with actions |
| `/admin/phong/moi` | dynamic + auth | New room form |
| `/admin/phong/[id]` | dynamic + auth | Edit room form |

---

## Key Decisions

1. **Zod v4 `errorMap` → `error`**: Zod v4 changed the param name; fixed `z.enum(..., { error: "..." })`.
2. **`RoomFormValues` vs `CoercedRoomValues`**: RHF form uses string-or-number union fields (native `<input type="number">` submits strings); `coerceRoomValues()` converts to proper numbers before server action. Cast `zodResolver(roomSchema) as any` to suppress resolver overload mismatch.
3. **`(public)` route group**: Wraps all public pages with SiteHeader+SiteFooter without changing URLs. Old `src/app/page.tsx` deleted to avoid Next.js conflict with `(public)/page.tsx`.
4. **Native `<select>` everywhere** for district, room_type, sort — avoids Base UI Select complexity.
5. **Amenity toggles** = Button click → `setValue("amenities", ...)` — no Checkbox, no `asChild`.
6. **DropdownMenu trigger** = `render={<Button size="icon-sm" variant="ghost" />}` pattern.
7. **Storage cleanup**: On deleteRoom, service client checks if any other `room_images` row still references each URL before calling `remove()`.
8. **`FacebookIcon` not in lucide-react v1**: Used `Share2Icon` instead.

---

## Build Output

```
Route (app)
├ ƒ /
├ ○ /_not-found
├ ƒ /admin
├ ○ /admin/login
├ ƒ /admin/phong/[id]
├ ƒ /admin/phong/moi
├ ○ /gioi-thieu
├ ○ /lien-he
├ ƒ /phong
└ ƒ /phong/[id]
```

TypeScript: PASS. No errors.

---

## Unresolved Questions

1. **SITE_CONFIG placeholders**: phone/zalo/facebook are placeholder values (`0123456789`, `https://facebook.com/phongtrohanoi`). User must update `src/lib/constants/site-config.ts` with real info.
2. **Supabase Storage bucket**: Bucket `room-images` must exist with public-read + authenticated-write policies set in Supabase dashboard (Phase 2 should have done this).
3. **RLS policies**: `rooms` and `room_images` SELECT for anon must filter `status != 'hidden'`. If not set, hidden rooms will be visible to public. Verify in Supabase SQL editor.
4. **Image upload auth**: `createClient()` (browser) uploads to Storage — requires the logged-in user session cookie to be present. Uploads from the ImageUploader will only work when admin is logged in.
