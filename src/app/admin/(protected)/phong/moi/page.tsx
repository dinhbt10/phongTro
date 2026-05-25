import type { Metadata } from "next";
import { RoomForm } from "@/components/admin/room-form";

export const metadata: Metadata = { title: "Thêm phòng — Quản trị" };

export default function NewRoomPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Thêm phòng mới</h1>
      <RoomForm />
    </div>
  );
}
