import { createBrowserClient } from "@supabase/ssr";

// Supabase client dùng phía trình duyệt (client components). Chỉ dùng anon key.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
