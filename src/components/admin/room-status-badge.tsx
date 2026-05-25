// Badge màu theo trạng thái phòng.
import { Badge } from "@/components/ui/badge";
import { ROOM_STATUS_LABEL, type RoomStatus } from "@/lib/types/room";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<RoomStatus, string> = {
  available: "bg-green-100 text-green-800 border-green-200",
  rented: "bg-gray-100 text-gray-600 border-gray-200",
  hidden: "bg-amber-100 text-amber-800 border-amber-200",
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_CLASS[status])}
    >
      {ROOM_STATUS_LABEL[status]}
    </Badge>
  );
}
