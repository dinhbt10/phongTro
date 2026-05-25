// Loại hình phòng/nhà cho thuê. `slug` ổn định, dùng cho filter + enum DB.

export interface RoomTypeOption {
  slug: string;
  label: string;
}

export const ROOM_TYPES: RoomTypeOption[] = [
  { slug: "khep-kin", label: "Phòng trọ khép kín" },
  { slug: "chung-cu-mini", label: "Chung cư mini (CCMN)" },
  { slug: "nha-nguyen-can", label: "Nhà nguyên căn" },
  { slug: "o-ghep", label: "Ở ghép" },
  { slug: "studio", label: "Studio / Officetel" },
];

export const ROOM_TYPE_LABEL_BY_SLUG: Record<string, string> = Object.fromEntries(
  ROOM_TYPES.map((t) => [t.slug, t.label]),
);

export function getRoomTypeLabel(slug: string | null | undefined): string {
  if (!slug) return "";
  return ROOM_TYPE_LABEL_BY_SLUG[slug] ?? slug;
}

export const ROOM_TYPE_SLUGS = ROOM_TYPES.map((t) => t.slug);
