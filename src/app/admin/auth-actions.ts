"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Đăng xuất admin → quay về trang đăng nhập.
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
