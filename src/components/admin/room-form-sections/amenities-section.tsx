"use client";
// Phần 3: Tiện ích (toggle buttons)
import { type UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AMENITIES } from "@/lib/constants/amenities";
import { AmenityIcon } from "@/components/rooms/amenity-icon";
import type { RoomFormValues } from "@/lib/validation/room-schema";
import { cn } from "@/lib/utils";

interface Props { form: UseFormReturn<RoomFormValues> }

export function AmenitiesSection({ form }: Props) {
  const { watch, setValue } = form;
  const selected: string[] = watch("amenities") ?? [];

  const toggle = (slug: string) => {
    if (selected.includes(slug)) {
      setValue("amenities", selected.filter((s) => s !== slug), { shouldDirty: true });
    } else {
      setValue("amenities", [...selected, slug], { shouldDirty: true });
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Tiện ích</CardTitle></CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => {
            const active = selected.includes(a.slug);
            return (
              <Button
                key={a.slug}
                type="button"
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => toggle(a.slug)}
                className={cn("gap-1.5", active && "ring-2 ring-primary/30")}
              >
                <AmenityIcon slug={a.slug} className="size-3.5" />
                {a.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
