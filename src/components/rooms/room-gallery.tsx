"use client";
// Gallery ảnh phòng — grid + lightbox Dialog với prev/next.
import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon, XIcon } from "lucide-react";
import type { RoomImage } from "@/lib/types/room";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomableImage } from "./zoomable-image";

interface Props { images: RoomImage[] }

export function RoomGallery({ images }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
        <HomeIcon className="size-12 text-muted-foreground" />
        <span className="sr-only">Chưa có ảnh</span>
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const openAt = (i: number) => { setIndex(i); setOpen(true); };

  return (
    <>
      {/* Grid */}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: images.length > 1 ? "2fr 1fr" : "1fr" }}>
        {/* Cover — large */}
        <div
          className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl"
          onClick={() => openAt(0)}
        >
          <Image src={images[0].url} alt="Ảnh bìa" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" priority />
        </div>

        {/* Side thumbnails (up to 4) */}
        {images.length > 1 && (
          <div className="grid grid-rows-2 gap-1.5">
            {images.slice(1, 3).map((img, i) => (
              <div
                key={img.id}
                className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl"
                onClick={() => openAt(i + 1)}
              >
                <Image src={img.url} alt={`Ảnh ${i + 2}`} fill className="object-cover" sizes="30vw" />
                {/* Overlay "+N more" on last visible thumb if there are more */}
                {i === 1 && images.length > 3 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 text-lg font-bold text-white">
                    +{images.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox — full màn hình, nền đen */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="h-[100dvh] w-screen max-w-none rounded-none border-0 bg-black p-0 sm:max-w-none"
        >
          <div className="relative h-full w-full overflow-hidden bg-black">
            {/* key = url → đổi ảnh thì reset zoom */}
            <ZoomableImage key={images[index].url} src={images[index].url} alt={`Ảnh ${index + 1}`} />

            {/* Nút đóng (trắng, nổi trên nền đen) */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-30 bg-black/40 text-white hover:bg-black/60"
              aria-label="Đóng"
            >
              <XIcon />
            </Button>
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={prev}
                  className="absolute top-1/2 left-2 z-20 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={next}
                  className="absolute top-1/2 right-2 z-20 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
                >
                  <ChevronRightIcon />
                </Button>
                <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                  {index + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
