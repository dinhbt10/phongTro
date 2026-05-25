// Map amenity slug → lucide icon component. Fallback về Check nếu không tìm thấy.
import {
  AirVent,
  ShowerHead,
  Wifi,
  Layers,
  Fence,
  Refrigerator,
  WashingMachine,
  CookingPot,
  MoveVertical,
  Bike,
  Fingerprint,
  Clock,
  Cctv,
  PawPrint,
  Sofa,
  DoorOpen,
  Check,
  type LucideProps,
} from "lucide-react";
import type { ElementType } from "react";

const ICON_MAP: Record<string, ElementType> = {
  "khong-chung-chu": DoorOpen,
  "dieu-hoa": AirVent,
  "nong-lanh": ShowerHead,
  wifi: Wifi,
  "gac-xep": Layers,
  "ban-cong": Fence,
  "tu-lanh": Refrigerator,
  "may-giat": WashingMachine,
  bep: CookingPot,
  "thang-may": MoveVertical,
  "cho-de-xe": Bike,
  "khoa-van-tay": Fingerprint,
  "gio-giac-tu-do": Clock,
  camera: Cctv,
  "nuoi-pet": PawPrint,
  "full-noi-that": Sofa,
};

interface AmenityIconProps extends LucideProps {
  slug: string;
}

export function AmenityIcon({ slug, ...props }: AmenityIconProps) {
  const Icon = ICON_MAP[slug] ?? Check;
  return <Icon {...props} />;
}
