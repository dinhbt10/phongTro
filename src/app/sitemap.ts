// Sitemap tự động — bao gồm trang tĩnh + tất cả phòng đang hiển thị.
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/lib/constants/site-config";

const base = SITE_CONFIG.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Trang tĩnh
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/phong`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/gioi-thieu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Lấy tất cả phòng đang hiển thị (status != hidden qua RLS)
  const supabase = await createClient();
  const { data } = await supabase
    .from("rooms")
    .select("id, updated_at")
    .neq("status", "hidden")
    .order("created_at", { ascending: false });

  const roomRoutes: MetadataRoute.Sitemap = (data ?? []).map((room) => ({
    url: `${base}/phong/${room.id}`,
    lastModified: room.updated_at ? new Date(room.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...roomRoutes];
}
