"use client";
// Thumbnail ảnh có thể kéo-thả (dnd-kit sortable).
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SortableImageThumbProps {
  id: string;
  url: string;
  index: number;
  onRemove: (id: string) => void;
}

export function SortableImageThumb({
  id,
  url,
  index,
  onRemove,
}: SortableImageThumbProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-lg border bg-muted"
    >
      <Image src={url} alt={`Ảnh ${index + 1}`} fill className="object-cover" sizes="112px" />

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 cursor-grab rounded bg-black/40 p-0.5 text-white active:cursor-grabbing"
        aria-label="Kéo để sắp xếp"
      >
        <GripVerticalIcon className="size-3.5" />
      </button>

      {/* Cover badge */}
      {index === 0 && (
        <Badge className="absolute bottom-1 left-1 text-[10px]">Ảnh bìa</Badge>
      )}

      {/* Remove */}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => onRemove(id)}
        className="absolute top-1 right-1 bg-black/40 text-white hover:bg-black/60"
        aria-label="Xóa ảnh"
      >
        <XIcon />
      </Button>
    </div>
  );
}
