"use client";
// Ảnh có thể zoom trong lightbox: cuộn chuột / nút +−/ nhấp đúp / kéo di chuyển / pinch (mobile).
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ZoomInIcon, ZoomOutIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN = 1;
const MAX = 4;
const STEP = 0.5;

const clamp = (s: number) => Math.min(MAX, Math.max(MIN, s));

export function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Theo dõi con trỏ để kéo (pan) + pinch.
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const interacting = useRef(false);

  const reset = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  const zoomBy = (d: number) =>
    setScale((s) => {
      const ns = clamp(s + d);
      if (ns === 1) setPos({ x: 0, y: 0 });
      return ns;
    });

  // Cuộn chuột để zoom (listener non-passive để chặn cuộn trang).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? STEP : -STEP);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
      drag.current = null;
      interacting.current = true;
    } else if (scale > 1) {
      drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
      interacting.current = true;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      setScale(clamp(pinch.current.scale * (dist / pinch.current.dist)));
      return;
    }
    if (drag.current && scale > 1) {
      setPos({
        x: drag.current.px + (e.clientX - drag.current.x),
        y: drag.current.py + (e.clientY - drag.current.y),
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      drag.current = null;
      interacting.current = false;
      setScale((s) => {
        if (s <= 1) setPos({ x: 0, y: 0 });
        return s;
      });
    }
  };

  const toggleZoom = () => (scale > 1 ? reset() : setScale(2));

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 touch-none select-none overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={toggleZoom}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transition: interacting.current ? "none" : "transform 0.15s ease-out",
          cursor: scale > 1 ? "grab" : "zoom-in",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="90vw"
          draggable={false}
        />
      </div>

      {/* Nút điều khiển zoom */}
      <div className="absolute right-2 bottom-2 z-10 flex gap-1">
        <Button type="button" variant="ghost" size="icon-sm" className="bg-black/40 text-white hover:bg-black/60" onClick={stop(() => zoomBy(STEP))} aria-label="Phóng to">
          <ZoomInIcon />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" className="bg-black/40 text-white hover:bg-black/60" onClick={stop(() => zoomBy(-STEP))} aria-label="Thu nhỏ">
          <ZoomOutIcon />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" className="bg-black/40 text-white hover:bg-black/60" onClick={stop(reset)} aria-label="Đặt lại">
          <RotateCcwIcon />
        </Button>
      </div>
    </div>
  );
}
