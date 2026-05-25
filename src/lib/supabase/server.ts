import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client dùng phía server (server components, server actions, route handlers).
// Mang session của user qua cookie → RLS áp role "authenticated" khi đã đăng nhập.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Trong Server Component, set cookie có thể bị chặn → bỏ qua an toàn.
          // Middleware sẽ lo việc refresh session.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // no-op
          }
        },
      },
    },
  );
}
