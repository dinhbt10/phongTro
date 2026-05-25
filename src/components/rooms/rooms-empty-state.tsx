// Trạng thái rỗng khi không tìm thấy phòng phù hợp.
import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function RoomsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <SearchXIcon className="size-10 text-muted-foreground" />
      <div>
        <p className="text-base font-medium">Không tìm thấy phòng phù hợp</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Thử nới rộng bộ lọc hoặc tìm kiếm với từ khóa khác.
        </p>
      </div>
      <Link href="/phong" className={buttonVariants({ variant: "outline", size: "sm" })}>
        Xóa bộ lọc
      </Link>
    </div>
  );
}
