"use client";
// Phần 4: Media — ảnh (ImageUploader) + link video (VideoLinksInput)
import { type UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { VideoLinksInput } from "@/components/admin/video-links-input";
import { Label } from "@/components/ui/label";
import type { RoomFormValues } from "@/lib/validation/room-schema";

interface ImageItem { id: string; url: string }

interface Props {
  form: UseFormReturn<RoomFormValues>;
  images: ImageItem[];
  onImagesChange: (items: ImageItem[]) => void;
}

export function MediaSection({ form, images, onImagesChange }: Props) {
  const { watch, setValue } = form;
  const videoLinks: string[] = watch("video_links") ?? [];

  return (
    <Card>
      <CardHeader><CardTitle>Ảnh &amp; Video</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label>Ảnh phòng</Label>
          <ImageUploader value={images} onChange={onImagesChange} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Link video (YouTube, Facebook, TikTok…)</Label>
          <VideoLinksInput
            value={videoLinks}
            onChange={(links) => setValue("video_links", links, { shouldDirty: true })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
