"use client";
// Bộ lọc phòng URL-driven — desktop sidebar + mobile Sheet.
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";
import { HANOI_DISTRICTS } from "@/lib/constants/hanoi-districts";
import { ROOM_TYPES } from "@/lib/constants/room-types";
import { AMENITIES } from "@/lib/constants/amenities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AmenityIcon } from "./amenity-icon";
import { cn } from "@/lib/utils";
import type { RoomFilters } from "@/lib/types/room";

const selectCls =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus:border-ring";

interface Props { filters: RoomFilters }

export function RoomFilters({ filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [q, setQ] = useState(filters.q ?? "");

  // Debounce text search
  useEffect(() => {
    const id = setTimeout(() => pushFilter("q", q || null), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const pushFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) { params.set(key, value); } else { params.delete(key); }
      params.delete("page");
      router.replace(`/phong?${params.toString()}`);
    },
    [router, searchParams],
  );

  const toggleAmenity = (slug: string) => {
    const current = (filters.amenities ?? []);
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    const params = new URLSearchParams(searchParams.toString());
    if (next.length) { params.set("amenities", next.join(",")); } else { params.delete("amenities"); }
    params.delete("page");
    router.replace(`/phong?${params.toString()}`);
  };

  const clearAll = () => { setQ(""); router.replace("/phong"); };

  const hasFilters = !!(filters.q || filters.district || filters.room_type ||
    filters.price_min || filters.price_max || filters.area_min || filters.amenities?.length);

  const content = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label>Tìm kiếm</Label>
        <Input placeholder="Tên phòng, địa chỉ…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Quận/huyện</Label>
        <select className={selectCls} value={filters.district ?? ""} onChange={(e) => pushFilter("district", e.target.value || null)}>
          <option value="">Tất cả</option>
          {HANOI_DISTRICTS.map((d) => <option key={d.slug} value={d.slug}>{d.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Loại phòng</Label>
        <select className={selectCls} value={filters.room_type ?? ""} onChange={(e) => pushFilter("room_type", e.target.value || null)}>
          <option value="">Tất cả</option>
          {ROOM_TYPES.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Giá thuê (đ/tháng)</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Từ" min={0} defaultValue={filters.price_min ?? ""}
            onBlur={(e) => pushFilter("price_min", e.target.value || null)} />
          <Input type="number" placeholder="Đến" min={0} defaultValue={filters.price_max ?? ""}
            onBlur={(e) => pushFilter("price_max", e.target.value || null)} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Diện tích tối thiểu (m²)</Label>
        <Input type="number" placeholder="Ví dụ: 20" min={0} defaultValue={filters.area_min ?? ""}
          onBlur={(e) => pushFilter("area_min", e.target.value || null)} />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Sắp xếp</Label>
        <select className={selectCls} value={filters.sort ?? "newest"} onChange={(e) => pushFilter("sort", e.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tiện ích</Label>
        <div className="flex flex-wrap gap-1.5">
          {AMENITIES.map((a) => {
            const active = (filters.amenities ?? []).includes(a.slug);
            return (
              <Button key={a.slug} type="button" size="xs"
                variant={active ? "default" : "outline"}
                onClick={() => toggleAmenity(a.slug)}
                className={cn("gap-1", active && "ring-1 ring-primary/30")}
              >
                <AmenityIcon slug={a.slug} className="size-3" />
                {a.label}
              </Button>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 text-muted-foreground">
          <XIcon className="size-3.5" /> Xóa bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">{content}</aside>

      {/* Mobile trigger */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger render={<Button variant="outline" size="sm" />}>
            <SlidersHorizontalIcon /> Bộ lọc{hasFilters ? " *" : ""}
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader><SheetTitle>Bộ lọc tìm phòng</SheetTitle></SheetHeader>
            <div className="overflow-y-auto p-4 pb-8">{content}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
