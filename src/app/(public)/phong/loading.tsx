// Loading skeleton cho trang danh sách phòng /phong
import { Skeleton } from "@/components/ui/skeleton";
import { RoomCardSkeleton } from "@/components/rooms/room-card-skeleton";

export default function RoomListLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-56" />

      <div className="flex gap-8">
        {/* Filter sidebar skeleton (desktop) */}
        <aside className="hidden w-56 shrink-0 flex-col gap-4 lg:flex">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </aside>

        {/* Results */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Count + mobile filter bar */}
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-28 lg:hidden" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
