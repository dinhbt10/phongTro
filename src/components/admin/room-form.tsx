"use client";
// Form thêm/sửa phòng — react-hook-form + zod, gọi server actions.
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { roomSchema, coerceRoomValues, type RoomFormValues, type CoercedRoomValues } from "@/lib/validation/room-schema";
import { createRoom, updateRoom } from "@/app/admin/(protected)/phong/room-actions";
import type { RoomWithImages } from "@/lib/types/room";
import { Button } from "@/components/ui/button";
import { ListingParser } from "@/components/admin/listing-parser";
import type { ParsedListing } from "@/lib/rooms/parse-listing";
import { MainInfoSection } from "./room-form-sections/main-info-section";
import { CostsSection } from "./room-form-sections/costs-section";
import { AmenitiesSection } from "./room-form-sections/amenities-section";
import { MediaSection } from "./room-form-sections/media-section";
import { ContactStatusSection } from "./room-form-sections/contact-status-section";

interface ImageItem { id: string; url: string }

interface RoomFormProps {
  room?: RoomWithImages;
  roomId?: string;
}

function buildDefaultValues(room?: RoomWithImages): Partial<RoomFormValues> {
  if (!room) return { amenities: [], video_links: [], status: "available", featured: false };
  return {
    title: room.title,
    description: room.description ?? "",
    price: room.price,
    area_m2: room.area_m2 ?? undefined,
    district: room.district,
    ward: room.ward ?? "",
    address: room.address ?? "",
    room_type: room.room_type,
    deposit: room.deposit ?? undefined,
    electricity_price: room.electricity_price ?? undefined,
    water_price: room.water_price ?? undefined,
    service_fee: room.service_fee ?? undefined,
    parking_fee: room.parking_fee ?? undefined,
    internet_fee: room.internet_fee ?? undefined,
    max_occupants: room.max_occupants ?? undefined,
    amenities: room.amenities ?? [],
    video_links: room.video_links ?? [],
    contact_name: room.contact_name ?? "",
    contact_phone: room.contact_phone ?? "",
    status: room.status,
    featured: room.featured,
  };
}

export function RoomForm({ room, roomId }: RoomFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!roomId;

  // Images state (separate from form — urls only passed at submit)
  const [images, setImages] = useState<ImageItem[]>(
    () => (room?.images ?? []).map((img) => ({ id: img.id, url: img.url })),
  );

  const form = useForm<RoomFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(roomSchema) as any,
    defaultValues: buildDefaultValues(room),
  });

  // Điền form từ kết quả phân tích tin rao.
  const applyParsed = (p: ParsedListing) => {
    if (p.title) form.setValue("title", p.title, { shouldDirty: true });
    if (p.description) form.setValue("description", p.description, { shouldDirty: true });
    if (p.price !== undefined) form.setValue("price", p.price, { shouldDirty: true });
    if (p.area_m2 !== undefined) form.setValue("area_m2", p.area_m2, { shouldDirty: true });
    if (p.district) form.setValue("district", p.district, { shouldDirty: true });
    if (p.address) form.setValue("address", p.address, { shouldDirty: true });
    if (p.room_type) form.setValue("room_type", p.room_type, { shouldDirty: true });
    if (p.amenities?.length) form.setValue("amenities", p.amenities, { shouldDirty: true });
    if (p.contact_phone) form.setValue("contact_phone", p.contact_phone, { shouldDirty: true });
    if (p.filledLabels.length) {
      toast.success("Đã phân tích & điền: " + p.filledLabels.join(", "));
    } else {
      toast.info("Chưa nhận diện được thông tin nào — bạn nhập tay nhé.");
    }
  };

  const onSubmit = (values: RoomFormValues) => {
    const coerced = coerceRoomValues(values) as CoercedRoomValues;
    const urls = images.map((i) => i.url);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateRoom(roomId!, coerced, urls);
          toast.success("Đã cập nhật phòng");
        } else {
          await createRoom(coerced, urls);
          toast.success("Đã thêm phòng mới");
        }
        router.push("/admin");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <ListingParser onApply={applyParsed} />
      <MainInfoSection form={form} />
      <CostsSection form={form} />
      <AmenitiesSection form={form} />
      <MediaSection form={form} images={images} onImagesChange={setImages} />
      <ContactStatusSection form={form} />

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang lưu…" : isEdit ? "Lưu thay đổi" : "Thêm phòng"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
          disabled={isPending}
        >
          Hủy
        </Button>
      </div>
    </form>
  );
}
