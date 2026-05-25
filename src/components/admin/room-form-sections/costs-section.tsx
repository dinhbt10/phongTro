"use client";
// Phần 2: Chi phí (đặt cọc, điện, nước, dịch vụ…)
import { type UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RoomFormValues } from "@/lib/validation/room-schema";

interface Props { form: UseFormReturn<RoomFormValues> }

type CostKey = "deposit" | "electricity_price" | "water_price" | "service_fee" | "parking_fee" | "internet_fee";
const COST_FIELDS: { key: CostKey; label: string; placeholder: string }[] = [
  { key: "deposit",           label: "Đặt cọc (đ)",          placeholder: "1000000" },
  { key: "electricity_price", label: "Tiền điện (đ/kWh)",    placeholder: "3500" },
  { key: "water_price",       label: "Tiền nước (đ/m³)",     placeholder: "15000" },
  { key: "service_fee",       label: "Phí dịch vụ (đ/tháng)", placeholder: "100000" },
  { key: "parking_fee",       label: "Phí gửi xe (đ/tháng)", placeholder: "100000" },
  { key: "internet_fee",      label: "Tiền internet (đ/tháng)", placeholder: "100000" },
];

export function CostsSection({ form }: Props) {
  const { register } = form;
  return (
    <Card>
      <CardHeader><CardTitle>Chi phí</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {COST_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type="number"
              min={0}
              placeholder={placeholder}
              {...register(key)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
