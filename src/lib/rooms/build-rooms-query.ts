// Xây dựng Supabase query từ filter URL và fetch danh sách phòng công khai.
import { createClient } from "@/lib/supabase/server";
import type { RoomFilters, RoomSort, RoomWithImages } from "@/lib/types/room";

const PAGE_SIZE = 12;

/** Parse searchParams từ URL → RoomFilters */
export function parseRoomFilters(
  searchParams: Record<string, string | string[] | undefined>,
): RoomFilters {
  const str = (key: string) => {
    const v = searchParams[key];
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  };
  const num = (key: string) => {
    const v = str(key);
    if (!v) return undefined;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  const amenitiesRaw = str("amenities");
  const amenities = amenitiesRaw
    ? amenitiesRaw.split(",").filter(Boolean)
    : undefined;

  const sortRaw = str("sort");
  const validSorts: RoomSort[] = ["newest", "price_asc", "price_desc"];
  const sort = validSorts.includes(sortRaw as RoomSort)
    ? (sortRaw as RoomSort)
    : undefined;

  return {
    q: str("q"),
    district: str("district"),
    room_type: str("room_type"),
    price_min: num("price_min"),
    price_max: num("price_max"),
    area_min: num("area_min"),
    amenities: amenities?.length ? amenities : undefined,
    sort,
    page: num("page") ?? 1,
  };
}

export interface FetchRoomsResult {
  rooms: RoomWithImages[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Fetch phòng công khai (RLS loại hidden tự động). */
export async function fetchRooms(filters: RoomFilters): Promise<FetchRoomsResult> {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("rooms")
    .select("*, images:room_images(*)", { count: "exact" });

  if (filters.price_min != null) query = query.gte("price", filters.price_min);
  if (filters.price_max != null) query = query.lte("price", filters.price_max);
  if (filters.district) query = query.eq("district", filters.district);
  if (filters.room_type) query = query.eq("room_type", filters.room_type);
  if (filters.area_min != null) query = query.gte("area_m2", filters.area_min);
  if (filters.amenities?.length) query = query.contains("amenities", filters.amenities);
  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,address.ilike.%${filters.q}%`,
    );
  }

  // Sắp xếp
  if (filters.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;

  // Sắp xếp ảnh theo sort_order
  const rooms: RoomWithImages[] = (data ?? []).map((r) => ({
    ...r,
    images: [...(r.images ?? [])].sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
    ),
  }));

  const total = count ?? 0;
  return {
    rooms,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}
