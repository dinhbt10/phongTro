"use server";
// Server Actions quản lý phòng — mỗi action đều guard session.
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import {
  extractStoragePath,
  deleteStorageObjects,
} from "@/lib/storage/room-image-storage";
import type { CoercedRoomValues } from "@/lib/validation/room-schema";
import type { RoomStatus } from "@/lib/types/room";

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/phong");
  revalidatePath("/");
}

async function assertAuth() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/** Tạo phòng mới kèm ảnh. Trả về id phòng vừa tạo. */
export async function createRoom(
  values: CoercedRoomValues,
  imageUrls: string[],
): Promise<string> {
  await assertAuth();
  const supabase = await createClient();

  const { contact_phone, ...rest } = values;
  const { data, error } = await supabase
    .from("rooms")
    .insert({
      ...rest,
      contact_phone: contact_phone || null,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const roomId = data.id as string;

  if (imageUrls.length > 0) {
    await supabase.from("room_images").insert(
      imageUrls.map((url, idx) => ({ room_id: roomId, url, sort_order: idx })),
    );
  }

  revalidateAll();
  return roomId;
}

/** Cập nhật phòng — thay toàn bộ danh sách ảnh theo thứ tự mới. */
export async function updateRoom(
  id: string,
  values: CoercedRoomValues,
  imageUrls: string[],
): Promise<void> {
  await assertAuth();
  const supabase = await createClient();

  const { contact_phone, ...rest } = values;
  const { error } = await supabase
    .from("rooms")
    .update({ ...rest, contact_phone: contact_phone || null, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Xóa ảnh cũ → insert lại theo thứ tự mới
  await supabase.from("room_images").delete().eq("room_id", id);
  if (imageUrls.length > 0) {
    await supabase.from("room_images").insert(
      imageUrls.map((url, idx) => ({ room_id: id, url, sort_order: idx })),
    );
  }

  revalidateAll();
  revalidatePath(`/phong/${id}`);
}

/** Xóa phòng + dọn file Storage không còn tham chiếu. */
export async function deleteRoom(id: string): Promise<void> {
  await assertAuth();
  const supabase = await createClient();

  // Lấy URL ảnh của phòng này
  const { data: ownImages } = await supabase
    .from("room_images")
    .select("url")
    .eq("room_id", id);

  const ownUrls = (ownImages ?? []).map((r: { url: string }) => r.url);

  // Xóa phòng (cascade room_images)
  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Chỉ xóa file Storage nếu không còn phòng nào khác tham chiếu
  if (ownUrls.length > 0) {
    const { data: stillReferenced } = await supabase
      .from("room_images")
      .select("url")
      .in("url", ownUrls);
    const referencedSet = new Set((stillReferenced ?? []).map((r: { url: string }) => r.url));
    const toDelete = ownUrls
      .filter((u) => !referencedSet.has(u))
      .map(extractStoragePath);
    await deleteStorageObjects(supabase, toDelete);
  }

  revalidateAll();
}

/** Nhân bản phòng: copy field + ảnh (cùng URL), status=hidden. */
export async function duplicateRoom(id: string): Promise<string> {
  await assertAuth();
  const supabase = await createClient();

  const { data: original, error: fetchErr } = await supabase
    .from("rooms")
    .select("*, images:room_images(*)")
    .eq("id", id)
    .single();

  if (fetchErr || !original) throw new Error("Phòng không tồn tại");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at: _ca, updated_at: _ua, images, ...fields } = original;
  const { data: newRoom, error: insertErr } = await supabase
    .from("rooms")
    .insert({
      ...fields,
      title: `${fields.title} (bản sao)`,
      status: "hidden",
      featured: false,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertErr) throw new Error(insertErr.message);
  const newId = newRoom.id as string;

  const sortedImages = [...(images ?? [])].sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
  );
  if (sortedImages.length > 0) {
    await supabase.from("room_images").insert(
      sortedImages.map((img: { url: string }, idx: number) => ({
        room_id: newId,
        url: img.url,
        sort_order: idx,
      })),
    );
  }

  revalidateAll();
  return newId;
}

/** Đổi trạng thái phòng nhanh. */
export async function setRoomStatus(
  id: string,
  status: RoomStatus,
): Promise<void> {
  await assertAuth();
  const supabase = await createClient();
  const { error } = await supabase
    .from("rooms")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
  revalidatePath(`/phong/${id}`);
}
