"use client";
// Phần 5: Liên hệ & trạng thái (contact, status, featured)
import { type UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { RoomFormValues } from "@/lib/validation/room-schema";

interface Props { form: UseFormReturn<RoomFormValues> }

const selectCls =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50";

export function ContactStatusSection({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const featured = watch("featured") ?? false;

  return (
    <Card>
      <CardHeader><CardTitle>Liên hệ &amp; Trạng thái</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="contact_name">Tên liên hệ</Label>
          <Input id="contact_name" {...register("contact_name")} placeholder="Anh Minh" />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="contact_phone">Số điện thoại</Label>
          <Input id="contact_phone" type="tel" {...register("contact_phone")} placeholder="0912345678" />
          {errors.contact_phone && (
            <p className="text-xs text-destructive">{errors.contact_phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="status">Trạng thái</Label>
          <select id="status" {...register("status")} className={selectCls}>
            <option value="available">Còn phòng</option>
            <option value="rented">Hết phòng</option>
            <option value="hidden">Đang ẩn</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-5">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={(checked) =>
              setValue("featured", checked === true, { shouldDirty: true })
            }
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Phòng nổi bật (hiện trang chủ)
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
