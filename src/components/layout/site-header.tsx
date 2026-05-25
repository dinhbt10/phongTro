"use client";
// Header sticky toàn site công khai — nav responsive, mobile menu qua Sheet.
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site-config";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",            label: "Trang chủ" },
  { href: "/phong",       label: "Tìm phòng" },
  { href: "/gioi-thieu",  label: "Giới thiệu" },
  { href: "/lien-he",     label: "Liên hệ" },
];

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
        active ? "bg-muted text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Brand */}
        <Link href="/" className="text-base font-bold tracking-tight">
          {SITE_CONFIG.brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => <NavLink key={l.href} {...l} />)}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}
          >
            {SITE_CONFIG.phone}
          </a>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Mở menu" />}
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{SITE_CONFIG.brand}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((l) => (
                  <NavLink key={l.href} {...l} onClick={() => setOpen(false)} />
                ))}
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className={cn(buttonVariants({ variant: "default", size: "sm" }), "mt-4")}
                  onClick={() => setOpen(false)}
                >
                  Gọi ngay: {SITE_CONFIG.phone}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
