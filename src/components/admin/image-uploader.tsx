"use client";
// Chọn nhiều ảnh → nén → upload Supabase Storage → preview + kéo-thả sắp xếp.
import { useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import imageCompression from "browser-image-compression";
import { UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SortableImageThumb } from "./sortable-image-thumb";

interface ImageItem {
  id: string; // uuid — stable sort key
  url: string;
}

interface ImageUploaderProps {
  value: ImageItem[];
  onChange: (items: ImageItem[]) => void;
}

const COMPRESS_OPTIONS = { maxSizeMB: 0.8, maxWidthOrHeight: 1600, useWebWorker: true };
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const validFiles = Array.from(files).filter((f) => ALLOWED_TYPES.includes(f.type));
    if (!validFiles.length) { toast.error("Chỉ hỗ trợ JPG, PNG, WebP"); return; }

    setUploading(true);
    const supabase = createClient();
    const newItems: ImageItem[] = [];

    try {
      for (const file of validFiles) {
        const compressed = await imageCompression(file, COMPRESS_OPTIONS);
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("room-images")
          .upload(path, compressed, { contentType: file.type });
        if (upErr) { toast.error(`Upload thất bại: ${upErr.message}`); continue; }
        const { data: { publicUrl } } = supabase.storage.from("room-images").getPublicUrl(path);
        newItems.push({ id: crypto.randomUUID(), url: publicUrl });
      }
      if (newItems.length) onChange([...value, ...newItems]);
    } catch (err) {
      toast.error("Lỗi khi xử lý ảnh");
      console.error(err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = value.findIndex((i) => i.id === active.id);
    const newIdx = value.findIndex((i) => i.id === over.id);
    onChange(arrayMove(value, oldIdx, newIdx));
  };

  const remove = (id: string) => onChange(value.filter((i) => i.id !== id));

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-2">
              {value.map((item, idx) => (
                <SortableImageThumb key={item.id} id={item.id} url={item.url} index={idx} onRemove={remove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <UploadCloudIcon />
          {uploading ? "Đang tải lên…" : "Chọn ảnh"}
        </Button>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG / PNG / WebP · tối đa 0.8 MB/ảnh sau nén · ảnh đầu tiên là ảnh bìa
        </p>
      </div>
    </div>
  );
}
