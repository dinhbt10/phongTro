"use client";
// Thanh liên hệ cố định phía dưới — chỉ hiện trên mobile, khi có số điện thoại.
import { PhoneIcon, MessageCircleIcon } from "lucide-react";

interface Props {
  phone: string;
}

export function StickyContactBar({ phone }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t bg-background/95 px-4 pb-[env(safe-area-inset-bottom)] pt-3 backdrop-blur-sm md:hidden">
      <a
        href={`tel:${phone}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity active:opacity-80"
      >
        <PhoneIcon className="size-4" />
        Gọi ngay
      </a>
      <a
        href={`https://zalo.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-semibold transition-opacity active:opacity-80"
      >
        <MessageCircleIcon className="size-4" />
        Zalo
      </a>
    </div>
  );
}
