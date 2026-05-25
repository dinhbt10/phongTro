// Trang 404 toàn cục — hiện khi không tìm thấy route.
import Link from "next/link";
import { HomeIcon, SearchIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-8xl font-black text-muted-foreground/30">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
        <p className="text-muted-foreground">
          Trang bạn đang tìm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          <HomeIcon className="size-4" />
          Về trang chủ
        </Link>
        <Link href="/phong" className={buttonVariants({ variant: "outline" })}>
          <SearchIcon className="size-4" />
          Tìm phòng trọ
        </Link>
      </div>
    </div>
  );
}
