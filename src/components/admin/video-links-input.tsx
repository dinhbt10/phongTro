"use client";
// Nhập danh sách link video động (thêm/xóa hàng).
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VideoLinksInputProps {
  value: string[];
  onChange: (links: string[]) => void;
}

export function VideoLinksInput({ value, onChange }: VideoLinksInputProps) {
  const update = (idx: number, val: string) => {
    const next = [...value];
    next[idx] = val;
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const add = () => onChange([...value, ""]);

  return (
    <div className="flex flex-col gap-2">
      {value.map((link, idx) => (
        <div key={idx} className="flex gap-2">
          <Input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={link}
            onChange={(e) => update(idx, e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(idx)}
            aria-label="Xóa link"
          >
            <TrashIcon />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="w-fit"
      >
        <PlusIcon />
        Thêm link video
      </Button>
    </div>
  );
}
