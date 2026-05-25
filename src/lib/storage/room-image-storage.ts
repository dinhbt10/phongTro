// Helpers xử lý file ảnh trên Supabase Storage bucket "room-images".
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "room-images";

/**
 * Trích xuất storage object path từ public URL.
 * VD: "https://xxx.supabase.co/storage/v1/object/public/room-images/abc.jpg"
 *     → "abc.jpg"
 */
export function extractStoragePath(publicUrl: string): string {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return publicUrl;
  return publicUrl.slice(idx + marker.length);
}

/**
 * Xóa nhiều object trên Storage theo path list.
 * Dùng client đã đăng nhập (admin) — RLS cho phép authenticated xóa.
 */
export async function deleteStorageObjects(
  supabase: SupabaseClient,
  paths: string[],
): Promise<void> {
  if (!paths.length) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error("[storage] deleteStorageObjects error:", error.message);
  }
}
