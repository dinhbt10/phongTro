"use client";
// Bộ lọc phía client cho bảng admin: tìm kiếm theo tên/khu vực + lọc trạng thái.
import { SearchIcon } from "lucide-react";
import type { RoomStatus } from "@/lib/types/room";
import { Input } from "@/components/ui/input";

export type StatusFilter = RoomStatus | "all";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "available", label: "Còn phòng" },
  { value: "rented", label: "Hết phòng" },
  { value: "hidden", label: "Ẩn" },
];

export function AdminRoomFilters({ search, onSearchChange, statusFilter, onStatusChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tiêu đề, khu vực, địa chỉ…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        className="h-9 rounded-md border bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
