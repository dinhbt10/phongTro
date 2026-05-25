import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoomById } from "@/lib/rooms/room-fetchers";
import { RoomForm } from "@/components/admin/room-form";

// Next 16: params is a Promise
interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoomById(id);
  return { title: room ? `Sửa: ${room.title}` : "Phòng không tồn tại" };
}

export default async function EditRoomPage({ params }: Props) {
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Sửa phòng</h1>
      <RoomForm room={room} roomId={id} />
    </div>
  );
}
