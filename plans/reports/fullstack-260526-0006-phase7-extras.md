# Phase 7 + Extras Implementation Report

## Status: Completed

## Files Modified

| File | Change |
|------|--------|
| `src/lib/constants/site-config.ts` | Added `url` field (`NEXT_PUBLIC_SITE_URL || "http://localhost:3000"`) |
| `src/app/layout.tsx` | Added `metadataBase: new URL(SITE_CONFIG.url)` to metadata export |
| `src/lib/rooms/room-fetchers.ts` | Added `getRelatedRooms(district, excludeId, limit)` fetcher |
| `src/app/(public)/phong/[id]/page.tsx` | Added related rooms section, StickyContactBar, `pb-20 md:pb-8` |
| `src/app/admin/(protected)/page.tsx` | Added stats bar (4 cards: total/available/rented/hidden) |
| `src/components/admin/admin-room-table.tsx` | Integrated AdminRoomFilters (search + status select), client-side filter via `useMemo` |
| `.env.local.example` | Added `NEXT_PUBLIC_SITE_URL=` entry |

## Files Created

| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | Dynamic sitemap: 4 static routes + all visible rooms from DB |
| `src/app/robots.ts` | Allow all, disallow `/admin`, reference sitemap |
| `src/app/not-found.tsx` | Global Vietnamese 404 with links to `/` and `/phong` |
| `src/app/(public)/phong/loading.tsx` | Listing page skeleton (filter sidebar + 6 RoomCardSkeleton) |
| `src/app/(public)/phong/[id]/loading.tsx` | Detail page skeleton (gallery + meta lines + contact buttons) |
| `src/components/rooms/room-card-skeleton.tsx` | Reusable RoomCard-shaped skeleton |
| `src/components/rooms/sticky-contact-bar.tsx` | Mobile-only fixed bottom bar: Gọi (tel:) + Zalo buttons |
| `src/components/admin/admin-room-filters.tsx` | Search input + status native select for admin table |

## Decisions

- `getRelatedRooms` fetches sequentially after `getRoomById` (can't parallelize — needs `room.district`); acceptable since Supabase is fast.
- `admin-room-table.tsx` at 232 lines (32 over soft limit) — `RoomActions` is tightly coupled via callbacks; splitting would add indirection without benefit. Left as-is.
- Related rooms grid: 2 cols mobile → 4 cols lg (fits nicely in max-w-4xl detail layout).
- Stats bar uses inline Tailwind color classes (no new component) per KISS.
- No debounce on search input — filtering is pure in-memory `useMemo`, instant even at 500+ rooms.

## Build Result

```
✓ Compiled successfully in 6.6s
✓ TypeScript clean
✓ 12 static/dynamic routes generated
/robots.txt → static
/sitemap.xml → dynamic
```

## Unresolved Questions

- `NEXT_PUBLIC_SITE_URL` not set in `.env.local` → sitemap/OG base defaults to `http://localhost:3000` in dev. User should set this for production deploy.
- Related rooms shows "available" only — if a detail page is for a "rented" room, the related section may still show. By design (shows alternatives). Confirm if OK.
