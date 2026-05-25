"use client";
// Nhúng video hoặc hiển thị nút mở link tuỳ platform.
import { ExternalLinkIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface Props { url: string }

function getYouTubeId(url: string): string | null {
  const m =
    url.match(/youtube\.com\/watch\?v=([\w-]+)/) ??
    url.match(/youtu\.be\/([\w-]+)/);
  return m ? m[1] : null;
}

export function VideoEmbed({ url }: Props) {
  const ytId = getYouTubeId(url);

  if (ytId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title="Video phòng"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  // Fallback: link button for FB, TikTok, Drive, or unknown
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      <ExternalLinkIcon /> Mở video
    </a>
  );
}
