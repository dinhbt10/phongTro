"use client";
// Phần 1: Thông tin chính (tiêu đề, loại, giá, khu vực, mô tả…)
import { Controller, type UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { HANOI_DISTRICTS } from "@/lib/constants/hanoi-districts";
import { ROOM_TYPES } from "@/lib/constants/room-types";
import type { RoomFormValues } from "@/lib/validation/room-schema";

interface Props { form: UseFormReturn<RoomFormValues> }

const selectCls =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50";

export function MainInfoSection({ form }: Props) {
  const { register, formState: { errors } } = form;
  return (
    <Card>
      <CardHeader><CardTitle>Thông tin chính</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 flex flex-col gap-1">
          <Label htmlFor="title">Tiêu đề *</Label>
          <Input id="title" {...register("title")} placeholder="Phòng trọ khép kín Cầu Giấy…" />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="room_type">Loại phòng *</Label>
          <select id="room_type" {...register("room_type")} className={selectCls}>
            <option value="">-- Chọn loại --</option>
            {ROOM_TYPES.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
          </select>
          {errors.room_type && <p className="text-xs text-destructive">{errors.room_type.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="district">Quận/huyện *</Label>
          <select id="district" {...register("district")} className={selectCls}>
            <option value="">-- Chọn quận/huyện --</option>
            {HANOI_DISTRICTS.map((d) => <option key={d.slug} value={d.slug}>{d.label}</option>)}
          </select>
          {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="price">Giá thuê (đ/tháng) *</Label>
          <Input id="price" type="number" min={0} {...register("price")} placeholder="3500000" />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="area_m2">Diện tích (m²)</Label>
          <Input id="area_m2" type="number" min={0} step="0.1" {...register("area_m2")} placeholder="25" />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="ward">Phường/xã</Label>
          <Input id="ward" {...register("ward")} placeholder="Dịch Vọng Hậu" />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="max_occupants">Số người tối đa</Label>
          <Input id="max_occupants" type="number" min={1} {...register("max_occupants")} placeholder="2" />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <Input id="address" {...register("address")} placeholder="Ngõ 10 Xuân Thủy, Cầu Giấy" />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <Label>Mô tả</Label>
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Mô tả chi tiết về phòng…"
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
