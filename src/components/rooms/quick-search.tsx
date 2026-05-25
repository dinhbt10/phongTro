"use client";
// Form tìm nhanh trên trang chủ — GET submit sang /phong.
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { HANOI_DISTRICTS } from "@/lib/constants/hanoi-districts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const selectCls =
  "h-8 flex-1 rounded-lg border border-input bg-background px-2.5 py-1 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50";

export function QuickSearch() {
  const router = useRouter();
  const qRef = useRef<HTMLInputElement>(null);
  const districtRef = useRef<HTMLSelectElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = qRef.current?.value.trim();
    const district = districtRef.current?.value;
    if (q) params.set("q", q);
    if (district) params.set("district", district);
    router.push(`/phong${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <Input
        ref={qRef}
        type="search"
        placeholder="Tìm phòng theo tên, địa chỉ…"
        className="sm:w-64"
      />
      <select ref={districtRef} className={selectCls} defaultValue="">
        <option value="">Tất cả quận/huyện</option>
        {HANOI_DISTRICTS.map((d) => (
          <option key={d.slug} value={d.slug}>{d.label}</option>
        ))}
      </select>
      <Button type="submit" size="default">
        <SearchIcon /> Tìm ngay
      </Button>
    </form>
  );
}
