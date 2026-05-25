import { createClient } from "@/lib/supabase/server";

// Lấy user hiện tại (admin) phía server. Trả null nếu chưa đăng nhập.
// Dùng để guard layout admin + đầu mỗi server action ghi dữ liệu.
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
