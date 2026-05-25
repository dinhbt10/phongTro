// Footer chung site công khai — liên hệ nhanh + copyright.
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <p className="font-bold">{SITE_CONFIG.brand}</p>
            <p className="text-sm text-muted-foreground">{SITE_CONFIG.slogan}</p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Điều hướng</p>
            <nav className="flex flex-col gap-1 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Trang chủ</Link>
              <Link href="/phong" className="hover:text-foreground">Tìm phòng</Link>
              <Link href="/gioi-thieu" className="hover:text-foreground">Giới thiệu</Link>
              <Link href="/lien-he" className="hover:text-foreground">Liên hệ</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Liên hệ nhanh</p>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-foreground">
                Điện thoại: {SITE_CONFIG.phone}
              </a>
              <a
                href={`https://zalo.me/${SITE_CONFIG.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Zalo: {SITE_CONFIG.zalo}
              </a>
              <a
                href={SITE_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.brand}. Khu vực hoạt động: {SITE_CONFIG.area}.
        </div>
      </div>
    </footer>
  );
}
