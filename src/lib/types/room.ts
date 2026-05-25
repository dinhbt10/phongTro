// Kiểu dữ liệu phòng — khớp data model (design spec §7).
// Dùng chung cho admin (ghi) và public (đọc).

export type RoomStatus = "available" | "rented" | "hidden";

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  available: "Còn phòng",
  rented: "Hết phòng",
  hidden: "Đang ẩn",
};

export interface RoomImage {
  id: string;
  room_id: string;
  url: string;
  sort_order: number;
}

export interface Room {
  id: string;
  title: string;
  description: string | null;
  price: number; // VND/tháng
  area_m2: number | null;
  district: string; // slug (xem hanoi-districts)
  ward: string | null;
  address: string | null;
  room_type: string; // slug (xem room-types)
  deposit: number | null;
  electricity_price: number | null;
  water_price: number | null;
  service_fee: number | null;
  parking_fee: number | null;
  internet_fee: number | null;
  max_occupants: number | null;
  amenities: string[]; // slug[] (xem amenities)
  video_links: string[];
  contact_name: string | null;
  contact_phone: string | null;
  status: RoomStatus;
  featured: boolean;
  created_at: string;
  updated_at: string | null;
}

// Phòng kèm danh sách ảnh (đã sắp xếp theo sort_order).
export interface RoomWithImages extends Room {
  images: RoomImage[];
}

export type RoomSort = "newest" | "price_asc" | "price_desc";

// Bộ lọc tìm phòng — ánh xạ 1-1 với URL query của trang /phong.
export interface RoomFilters {
  q?: string;
  district?: string;
  room_type?: string;
  price_min?: number;
  price_max?: number;
  area_min?: number;
  amenities?: string[];
  sort?: RoomSort;
  page?: number;
}
