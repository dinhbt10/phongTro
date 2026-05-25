import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function RoomNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Không tìm thấy phòng</h1>
      <p className="text-muted-foreground">
        Phòng này không tồn tại hoặc đã bị ẩn.
      </p>
      <Link href="/phong" className={buttonVariants({ variant: "outline" })}>
        ← Quay lại danh sách phòng
      </Link>
    </div>
  );
}
