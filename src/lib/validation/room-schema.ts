// Zod schema cho form phòng — dùng chung admin create + update.
// RoomFormValues = kiểu INPUT (form fields, string for numbers) để RHF type-safe.
// RoomFormOutput = kiểu sau transform (gửi lên server).
import { z } from "zod";
import { DISTRICT_SLUGS } from "@/lib/constants/hanoi-districts";
import { ROOM_TYPE_SLUGS } from "@/lib/constants/room-types";
import { AMENITY_SLUGS } from "@/lib/constants/amenities";

export const roomSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional().nullable(),

  // Giá: input là string (từ <input type="number">) nhưng validate >= 0
  price: z.string().or(z.number()).refine(
    (v) => { const n = Number(v); return !isNaN(n) && n >= 0; },
    "Giá phải >= 0",
  ),

  area_m2: z.string().or(z.number()).nullable().optional(),

  district: z.enum(DISTRICT_SLUGS as [string, ...string[]], {
    error: "Vui lòng chọn quận/huyện",
  }),

  ward: z.string().optional().nullable(),
  address: z.string().optional().nullable(),

  room_type: z.enum(ROOM_TYPE_SLUGS as [string, ...string[]], {
    error: "Vui lòng chọn loại phòng",
  }),

  deposit: z.string().or(z.number()).nullable().optional(),
  electricity_price: z.string().or(z.number()).nullable().optional(),
  water_price: z.string().or(z.number()).nullable().optional(),
  service_fee: z.string().or(z.number()).nullable().optional(),
  parking_fee: z.string().or(z.number()).nullable().optional(),
  internet_fee: z.string().or(z.number()).nullable().optional(),
  max_occupants: z.string().or(z.number()).nullable().optional(),

  amenities: z.array(z.enum(AMENITY_SLUGS as [string, ...string[]])).default([]),
  video_links: z.array(z.string().url("Link video không hợp lệ")).default([]),

  contact_name: z.string().optional().nullable(),
  contact_phone: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => !v || v === "" || /^(0|\+84)\d{8,10}$/.test(v),
      "Số điện thoại không hợp lệ",
    ),

  status: z.enum(["available", "rented", "hidden"]).default("available"),
  featured: z.boolean().default(false),
});

export type RoomFormValues = z.infer<typeof roomSchema>;

/** Values after coerceRoomValues() — all numeric fields are proper numbers/null. */
export type CoercedRoomValues = Omit<RoomFormValues, "price" | "area_m2" | "deposit" | "electricity_price" | "water_price" | "service_fee" | "parking_fee" | "internet_fee" | "max_occupants"> & {
  price: number;
  area_m2: number | null;
  deposit: number | null;
  electricity_price: number | null;
  water_price: number | null;
  service_fee: number | null;
  parking_fee: number | null;
  internet_fee: number | null;
  max_occupants: number | null;
};

// Helper: coerce form values → safe numbers for DB insert
function toIntOrNull(v: string | number | null | undefined): number | null {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return isNaN(n) ? null : Math.round(n);
}

function toPositiveNumOrNull(v: string | number | null | undefined): number | null {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return isNaN(n) || n <= 0 ? null : n;
}

export function coerceRoomValues(values: RoomFormValues) {
  return {
    ...values,
    price: Math.round(Number(values.price)),
    area_m2: toPositiveNumOrNull(values.area_m2),
    deposit: toIntOrNull(values.deposit),
    electricity_price: toIntOrNull(values.electricity_price),
    water_price: toIntOrNull(values.water_price),
    service_fee: toIntOrNull(values.service_fee),
    parking_fee: toIntOrNull(values.parking_fee),
    internet_fee: toIntOrNull(values.internet_fee),
    max_occupants: toIntOrNull(values.max_occupants),
  };
}
