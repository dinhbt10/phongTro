// Skeleton placeholder cho RoomCard — dùng ở trang loading.
import { Skeleton } from "@/components/ui/skeleton";

export function RoomCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10">
      {/* Cover image */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      {/* Info */}
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
