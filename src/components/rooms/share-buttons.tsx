"use client";
// Chia sẻ nhanh phòng: copy link, Zalo, Facebook.
import { LinkIcon, ShareIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButtons() {
  const getUrl = () => window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      toast.success("Đã sao chép link");
    } catch {
      toast.error("Không thể sao chép link");
    }
  };

  const shareZalo = () => {
    window.open(`https://zalo.me/share?u=${encodeURIComponent(getUrl())}`, "_blank", "noopener");
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={copyLink}>
        <LinkIcon /> Sao chép link
      </Button>
      <Button variant="outline" size="sm" onClick={shareZalo}>
        <ShareIcon /> Zalo
      </Button>
      <Button variant="outline" size="sm" onClick={shareFacebook}>
        <ShareIcon /> Facebook
      </Button>
    </div>
  );
}
