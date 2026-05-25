import "server-only";
import { createClient } from "@supabase/supabase-js";

// Client dùng SERVICE ROLE KEY — BỎ QUA RLS. CHỈ DÙNG PHÍA SERVER.
// Dùng cho thao tác cần quyền cao (vd dọn file Storage). KHÔNG import vào client.
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
