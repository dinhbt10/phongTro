import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-session";
import { signOut } from "../auth-actions";
import { Button } from "@/components/ui/button";

// Layout khu quản trị (đã đăng nhập). Guard lớp 2 (cùng middleware).
export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              href="/admin"
              className="rounded-md px-2 py-1 hover:bg-muted"
            >
              Danh sách phòng
            </Link>
            <Link
              href="/admin/phong/moi"
              className="rounded-md px-2 py-1 hover:bg-muted"
            >
              + Thêm phòng
            </Link>
            <Link
              href="/"
              className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
            >
              Xem trang khách
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
