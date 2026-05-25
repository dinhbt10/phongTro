"use client";
// Bảng danh sách phòng admin: cover, tiêu đề, giá, khu vực, trạng thái, actions.
import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreVerticalIcon, PencilIcon, CopyIcon, TrashIcon, EyeOffIcon, EyeIcon, CheckCircleIcon, HomeIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { RoomWithImages, RoomStatus } from "@/lib/types/room";
import { formatPriceMonth } from "@/lib/format";
import { getDistrictLabel } from "@/lib/constants/hanoi-districts";
import { getRoomTypeLabel } from "@/lib/constants/room-types";
import { deleteRoom, duplicateRoom, setRoomStatus } from "@/app/admin/(protected)/phong/room-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminRoomFilters, type StatusFilter } from "./admin-room-filters";
import { RoomStatusBadge } from "./room-status-badge";

interface Props { rooms: RoomWithImages[] }

export function AdminRoomTable({ rooms }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rooms.filter((room) => {
      if (statusFilter !== "all" && room.status !== statusFilter) return false;
      if (!q) return true;
      return (
        room.title.toLowerCase().includes(q) ||
        getDistrictLabel(room.district).toLowerCase().includes(q) ||
        (room.address ?? "").toLowerCase().includes(q)
      );
    });
  }, [rooms, search, statusFilter]);

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      try {
        await deleteRoom(deleteId);
        toast.success("Đã xóa phòng");
        router.refresh();
      } catch { toast.error("Xóa thất bại"); }
      finally { setDeleteId(null); }
    });
  };

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      try {
        await duplicateRoom(id);
        toast.success("Đã nhân bản phòng (trạng thái ẩn)");
        router.refresh();
      } catch { toast.error("Nhân bản thất bại"); }
    });
  };

  const handleStatus = (id: string, status: RoomStatus) => {
    startTransition(async () => {
      try {
        await setRoomStatus(id, status);
        toast.success("Đã cập nhật trạng thái");
        router.refresh();
      } catch { toast.error("Cập nhật thất bại"); }
    });
  };

  return (
    <>
      {/* Search + status filter */}
      <AdminRoomFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Empty filtered state */}
      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">Không có phòng khớp</p>
      )}

      {/* Desktop table */}
      {filtered.length > 0 && (
        <div className="hidden md:block overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Ảnh</th>
                <th className="px-3 py-2 text-left font-medium">Tiêu đề</th>
                <th className="px-3 py-2 text-left font-medium">Giá</th>
                <th className="px-3 py-2 text-left font-medium">Khu vực</th>
                <th className="px-3 py-2 text-left font-medium">Loại</th>
                <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
                <th className="px-3 py-2 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((room) => (
                <tr key={room.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                      {room.images[0] ? (
                        <Image src={room.images[0].url} alt={room.title} fill className="object-cover" sizes="64px" />
                      ) : <HomeIcon className="absolute inset-0 m-auto size-5 text-muted-foreground" />}
                    </div>
                  </td>
                  <td className="px-3 py-2 max-w-[220px]">
                    <p className="truncate font-medium">{room.title}</p>
                    {(room.contact_name || room.contact_phone) && (
                      <p className="truncate text-xs text-muted-foreground">
                        Phụ trách: {[room.contact_name, room.contact_phone].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatPriceMonth(room.price)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{getDistrictLabel(room.district)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{getRoomTypeLabel(room.room_type)}</td>
                  <td className="px-3 py-2"><RoomStatusBadge status={room.status} /></td>
                  <td className="px-3 py-2 text-right">
                    <RoomActions room={room} onDelete={setDeleteId} onDuplicate={handleDuplicate} onStatus={handleStatus} isPending={isPending} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3 md:hidden">
          {filtered.map((room) => (
            <div key={room.id} className="flex gap-3 rounded-xl border p-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                {room.images[0] ? (
                  <Image src={room.images[0].url} alt={room.title} fill className="object-cover" sizes="80px" />
                ) : <HomeIcon className="absolute inset-0 m-auto size-5 text-muted-foreground" />}
              </div>
              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <p className="truncate font-medium text-sm">{room.title}</p>
                <p className="text-xs text-muted-foreground">{getDistrictLabel(room.district)} · {formatPriceMonth(room.price)}</p>
                {(room.contact_name || room.contact_phone) && (
                  <p className="truncate text-xs text-muted-foreground">
                    Phụ trách: {[room.contact_name, room.contact_phone].filter(Boolean).join(" · ")}
                  </p>
                )}
                <RoomStatusBadge status={room.status} />
              </div>
              <RoomActions room={room} onDelete={setDeleteId} onDuplicate={handleDuplicate} onStatus={handleStatus} isPending={isPending} />
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Xác nhận xóa phòng?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Thao tác này không thể hoàn tác. Ảnh lưu trữ sẽ bị xóa theo.</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Đang xóa…" : "Xóa phòng"}
            </Button>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Hủy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ActionsProps {
  room: RoomWithImages;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onStatus: (id: string, status: RoomStatus) => void;
  isPending: boolean;
}

function RoomActions({ room, onDelete, onDuplicate, onStatus, isPending }: ActionsProps) {
  const allStatuses: { status: RoomStatus; label: string; icon: React.ReactNode }[] = [
    { status: "available", label: "Còn phòng", icon: <CheckCircleIcon className="size-4" /> },
    { status: "rented",    label: "Hết phòng", icon: <HomeIcon className="size-4" /> },
    { status: "hidden",    label: "Ẩn phòng",  icon: <EyeOffIcon className="size-4" /> },
  ];
  const otherStatuses = allStatuses.filter((s) => s.status !== room.status);

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Nút xem nhanh: mở trang chi tiết ở tab mới */}
      <Link
        href={`/phong/${room.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "outline", size: "icon-sm" })}
        aria-label="Xem chi tiết"
        title="Xem chi tiết"
      >
        <EyeIcon />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" disabled={isPending} aria-label="Thao tác" />}
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={<Link href={`/phong/${room.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5" />}
          >
            <EyeIcon className="size-4" /> Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href={`/admin/phong/${room.id}`} className="flex items-center gap-1.5" />}
          >
            <PencilIcon className="size-4" /> Sửa
          </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(room.id)}>
          <CopyIcon className="size-4" /> Nhân bản
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {otherStatuses.map((s) => (
          <DropdownMenuItem key={s.status} onClick={() => onStatus(room.id, s.status)}>
            {s.icon} {s.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(room.id)}>
          <TrashIcon className="size-4" /> Xóa
        </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
