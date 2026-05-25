import type { Metadata } from "next";
import Link from "next/link";
import { getAllRoomsForAdmin } from "@/lib/rooms/room-fetchers";
import { AdminRoomTable } from "@/components/admin/admin-room-table";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const metadata: Metadata = { title: "Danh sách phòng — Quản trị" };

const STAT_CONFIGS = [
  { key: "total",     label: "Tổng cộng",  bg: "bg-muted" },
  { key: "available", label: "Còn phòng",  bg: "bg-green-50 text-green-800" },
  { key: "rented",    label: "Hết phòng",  bg: "bg-blue-50 text-blue-800" },
  { key: "hidden",    label: "Đang ẩn",    bg: "bg-yellow-50 text-yellow-800" },
] as const;

export default async function AdminDashboardPage() {
  const rooms = await getAllRoomsForAdmin();

  const stats = {
    total:     rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    rented:    rooms.filter((r) => r.status === "rented").length,
    hidden:    rooms.filter((r) => r.status === "hidden").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Danh sách phòng</h1>
        <Link href="/admin/phong/moi" className={buttonVariants({ size: "sm" })}>
          <PlusIcon /> Thêm phòng
        </Link>
      </div>

      {/* Stats bar */}
      {rooms.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAT_CONFIGS.map(({ key, label, bg }) => (
            <div key={key} className={`flex flex-col rounded-xl border px-4 py-3 ${bg}`}>
              <span className="text-2xl font-bold">{stats[key]}</span>
              <span className="text-xs font-medium opacity-70">{label}</span>
            </div>
          ))}
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <p className="text-base font-medium">Chưa có phòng nào</p>
          <p className="mt-1 text-sm">
            Bắt đầu bằng cách{" "}
            <Link href="/admin/phong/moi" className="text-primary underline underline-offset-4">
              thêm phòng đầu tiên
            </Link>
            .
          </p>
        </div>
      ) : (
        <AdminRoomTable rooms={rooms} />
      )}
    </div>
  );
}
