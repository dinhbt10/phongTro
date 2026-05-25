// robots.txt tự động — cho phép crawl toàn bộ, chặn /admin.
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
