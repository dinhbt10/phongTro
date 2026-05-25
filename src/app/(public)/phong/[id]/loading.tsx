// Loading skeleton cho trang chi tiết phòng /phong/[id]
import { Skeleton } from "@/components/ui/skeleton";

export default function RoomDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Gallery */}
      <Skeleton className="aspect-[16/9] w-full rounded-xl" />

      <div className="mt-6 flex flex-col gap-6">
        {/* Title + price */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-7 w-32" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Meta */}
        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Amenities */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-20" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Description lines */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-16" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-2/3" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
