// Tiện ích phòng (chọn nhiều). `slug` ổn định, lưu trong mảng `amenities` (DB)
// và dùng cho filter "chứa tất cả". Icon là tên icon của lucide-react.

export interface AmenityOption {
  slug: string;
  label: string;
  icon: string;
}

export const AMENITIES: AmenityOption[] = [
  { slug: "khong-chung-chu", label: "Không chung chủ", icon: "DoorOpen" },
  { slug: "dieu-hoa", label: "Điều hòa", icon: "AirVent" },
  { slug: "nong-lanh", label: "Nóng lạnh", icon: "ShowerHead" },
  { slug: "wifi", label: "Wifi", icon: "Wifi" },
  { slug: "gac-xep", label: "Gác xép", icon: "Layers" },
  { slug: "ban-cong", label: "Ban công", icon: "Fence" },
  { slug: "tu-lanh", label: "Tủ lạnh", icon: "Refrigerator" },
  { slug: "may-giat", label: "Máy giặt", icon: "WashingMachine" },
  { slug: "bep", label: "Bếp", icon: "CookingPot" },
  { slug: "thang-may", label: "Thang máy", icon: "MoveVertical" },
  { slug: "cho-de-xe", label: "Chỗ để xe", icon: "Bike" },
  { slug: "khoa-van-tay", label: "Khóa vân tay", icon: "Fingerprint" },
  { slug: "gio-giac-tu-do", label: "Giờ giấc tự do", icon: "Clock" },
  { slug: "camera", label: "Camera an ninh", icon: "Cctv" },
  { slug: "nuoi-pet", label: "Nuôi pet", icon: "PawPrint" },
  { slug: "full-noi-that", label: "Full nội thất", icon: "Sofa" },
];

export const AMENITY_LABEL_BY_SLUG: Record<string, string> = Object.fromEntries(
  AMENITIES.map((a) => [a.slug, a.label]),
);

export function getAmenityLabel(slug: string): string {
  return AMENITY_LABEL_BY_SLUG[slug] ?? slug;
}

export const AMENITY_SLUGS = AMENITIES.map((a) => a.slug);
