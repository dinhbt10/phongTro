"use client";
// Ô "Dán tin rao → tự phân tích & điền form" cho trang thêm/sửa phòng.
import { useState } from "react";
import { SparklesIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { parseListing, type ParsedListing } from "@/lib/rooms/parse-listing";

interface ListingParserProps {
  onApply: (parsed: ParsedListing) => void;
}

export function ListingParser({ onApply }: ListingParserProps) {
  const [text, setText] = useState("");

  const handleParse = () => {
    if (!text.trim()) return;
    onApply(parseListing(text));
  };

  return (
    <Card className="border-dashed bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" /> Dán tin rao để tự điền
        </CardTitle>
        <CardDescription>
          Dán nguyên nội dung tin (giá, địa chỉ, tiện ích, SĐT…) rồi bấm
          &quot;Phân tích&quot; — hệ thống tự nhận diện và điền vào các ô bên
          dưới. Bạn nhớ kiểm tra lại trước khi lưu.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={
            "Ví dụ:\n🌆CHO THUÊ CCMN TẠI MỸ ĐÌNH\n💵Giá: 2.5Tr\n📍D/c: số 65 ngõ 63 Lê Đức Thọ\n⏰Không chung chủ, khoá vân tay\n📲LH: 0976340686"
          }
        />
        <div>
          <Button type="button" onClick={handleParse} disabled={!text.trim()}>
            <SparklesIcon /> Phân tích &amp; điền
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
