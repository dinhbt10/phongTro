// Các hàm fetch phòng phía server — dùng cho public pages và admin.
import { createClient } from "@/lib/supabase/server";
import type { RoomWithImages } from "@/lib/types/room";

function sortImages(room: RoomWithImages): RoomWithImages {
  return {
    ...room,
    images: [...(room.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

/** Lấy 1 phòng theo id (kèm ảnh đã sắp xếp). Trả null nếu không tìm thấy. */
export async function getRoomById(id: string): Promise<RoomWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, images:room_images(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return sortImages(data as RoomWithImages);
}

/** Lấy phòng nổi bật (featured=true, status!=hidden) cho trang chủ. */
export async function getFeaturedRooms(limit = 6): Promise<RoomWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, images:room_images(*)")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as RoomWithImages[]).map(sortImages);
}

/** Lấy phòng mới nhất (status!=hidden qua RLS) cho trang chủ. */
export async function getLatestRooms(limit = 6): Promise<RoomWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, images:room_images(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as RoomWithImages[]).map(sortImages);
}

/** Lấy tất cả phòng cho admin (authenticated → bao gồm cả hidden). */
export async function getAllRoomsForAdmin(): Promise<RoomWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, images:room_images(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as RoomWithImages[]).map(sortImages);
}

/** Lấy phòng tương tự: cùng quận, status=available, loại trừ phòng hiện tại. */
export async function getRelatedRooms(
  district: string,
  excludeId: string,
  limit = 4,
): Promise<RoomWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, images:room_images(*)")
    .eq("district", district)
    .eq("status", "available")
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as RoomWithImages[]).map(sortImages);
}
