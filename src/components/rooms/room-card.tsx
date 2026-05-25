// Thẻ phòng dùng ở danh sách công khai (trang chủ + /phong).
import Link from "next/link";
import Image from "next/image";
import { HomeIcon } from "lucide-react";
import type { RoomWithImages } from "@/lib/types/room";
import { formatPriceMonth, formatArea } from "@/lib/format";
import { getDistrictLabel } from "@/lib/constants/hanoi-districts";
import { getRoomTypeLabel } from "@/lib/constants/room-types";
import { getAmenityLabel } from "@/lib/constants/amenities";
import { Badge } from "@/components/ui/badge";
import { AmenityIcon } from "./amenity-icon";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  rented: "bg-gray-100 text-gray-600",
};

interface RoomCardProps {
  room: RoomWithImages;
}

export function RoomCard({ room }: RoomCardProps) {
  const cover = room.images[0]?.url;
  const shownAmenities = room.amenities.slice(0, 3);

  return (
    <Link
      href={`/phong/${room.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-md"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] w-full bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={room.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <HomeIcon className="absolute inset-0 m-auto size-10 text-muted-foreground" />
        )}
        {/* Status badge — only show if not available */}
        {room.status !== "available" && (
          <span className={cn("absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium", STATUS_CLASS[room.status] ?? "bg-muted")}>
            {room.status === "rented" ? "Hết phòng" : room.status}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Price */}
        <p className="text-base font-bold text-primary">{formatPriceMonth(room.price)}</p>

        {/* Title */}
        <p className="line-clamp-2 text-sm font-medium leading-snug">{room.title}</p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{getDistrictLabel(room.district)}</span>
          {room.area_m2 && <span>{formatArea(room.area_m2)}</span>}
          <span>{getRoomTypeLabel(room.room_type)}</span>
        </div>

        {/* Amenities */}
        {shownAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {shownAmenities.map((slug) => (
              <Badge key={slug} variant="secondary" className="gap-1 text-xs">
                <AmenityIcon slug={slug} className="size-3" />
                {getAmenityLabel(slug)}
              </Badge>
            ))}
            {room.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">+{room.amenities.length - 3}</Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
