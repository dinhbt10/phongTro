import type { Metadata } from "next";
import { PhoneIcon, MessageCircleIcon, Share2Icon, MapPinIcon } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site-config";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Liên hệ" };

export default function LienHePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Liên hệ</h1>
      <p className="mb-10 text-muted-foreground">
        Liên hệ ngay để được tư vấn tìm phòng miễn phí.
      </p>

      <div className="flex flex-col gap-4">
        {/* Phone */}
        <div className="flex items-center gap-4 rounded-xl border p-4">
          <PhoneIcon className="size-6 shrink-0 text-primary" />
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-sm font-medium">Điện thoại</p>
            <p className="text-muted-foreground text-sm">{SITE_CONFIG.phone}</p>
          </div>
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className={buttonVariants({ size: "sm" })}
          >
            Gọi ngay
          </a>
        </div>

        {/* Zalo */}
        <div className="flex items-center gap-4 rounded-xl border p-4">
          <MessageCircleIcon className="size-6 shrink-0 text-blue-500" />
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-sm font-medium">Zalo</p>
            <p className="text-muted-foreground text-sm">{SITE_CONFIG.zalo}</p>
          </div>
          <a
            href={`https://zalo.me/${SITE_CONFIG.zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Nhắn Zalo
          </a>
        </div>

        {/* Facebook */}
        <div className="flex items-center gap-4 rounded-xl border p-4">
          <Share2Icon className="size-6 shrink-0 text-blue-600" />
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-sm font-medium">Facebook</p>
            <p className="truncate text-sm text-muted-foreground">{SITE_CONFIG.facebook}</p>
          </div>
          <a
            href={SITE_CONFIG.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Nhắn tin
          </a>
        </div>

        {/* Area */}
        <div className="flex items-center gap-4 rounded-xl border p-4">
          <MapPinIcon className="size-6 shrink-0 text-rose-500" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">Khu vực hoạt động</p>
            <p className="text-muted-foreground text-sm">{SITE_CONFIG.area} — tất cả quận/huyện</p>
          </div>
        </div>
      </div>
    </div>
  );
}
