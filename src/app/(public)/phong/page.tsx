import type { Metadata } from "next";
import Link from "next/link";
import { parseRoomFilters, fetchRooms } from "@/lib/rooms/build-rooms-query";
import { RoomCard } from "@/components/rooms/room-card";
import { RoomFilters } from "@/components/rooms/room-filters";
import { RoomsEmptyState } from "@/components/rooms/rooms-empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tìm phòng trọ Hà Nội" };

// Next 16: searchParams is a Promise
interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RoomListPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const filters = parseRoomFilters(rawParams);
  const { rooms, total, page, totalPages } = await fetchRooms(filters);

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(
      Object.entries(rawParams)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, Array.isArray(v) ? v[0] : (v as string)]),
    );
    params.set("page", String(p));
    return `/phong?${params.toString()}`;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Tìm phòng trọ Hà Nội</h1>

      <div className="flex gap-8">
        {/* Filters: sidebar desktop / Sheet mobile */}
        <RoomFilters filters={filters} />

        {/* Results */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Sort + total count (mobile filter trigger is inside RoomFilters) */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {total > 0 ? `${total} phòng tìm thấy` : "Không tìm thấy phòng"}
            </p>
          </div>

          {rooms.length === 0 ? (
            <RoomsEmptyState />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Link
                    href={buildPageUrl(page - 1)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      page <= 1 && "pointer-events-none opacity-50",
                    )}
                    aria-disabled={page <= 1}
                  >
                    ← Trước
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages}
                  </span>
                  <Link
                    href={buildPageUrl(page + 1)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      page >= totalPages && "pointer-events-none opacity-50",
                    )}
                    aria-disabled={page >= totalPages}
                  >
                    Sau →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
