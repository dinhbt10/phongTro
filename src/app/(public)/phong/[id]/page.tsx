import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoneIcon } from "lucide-react";
import { getRoomById, getRelatedRooms } from "@/lib/rooms/room-fetchers";
import { formatPrice, formatPriceMonth, formatArea, stripHtml } from "@/lib/format";
import { getDistrictLabel } from "@/lib/constants/hanoi-districts";
import { getRoomTypeLabel } from "@/lib/constants/room-types";
import { getAmenityLabel } from "@/lib/constants/amenities";
import { SITE_CONFIG } from "@/lib/constants/site-config";
import { ROOM_STATUS_LABEL } from "@/lib/types/room";
import { RoomGallery } from "@/components/rooms/room-gallery";
import { VideoEmbed } from "@/components/rooms/video-embed";
import { ShareButtons } from "@/components/rooms/share-buttons";
import { RoomMap } from "@/components/rooms/room-map";
import { AmenityIcon } from "@/components/rooms/amenity-icon";
import { RoomCard } from "@/components/rooms/room-card";
import { StickyContactBar } from "@/components/rooms/sticky-contact-bar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) return { title: "Không tìm thấy phòng" };
  const metaDesc =
    stripHtml(room.description).slice(0, 160) ||
    `${formatPriceMonth(room.price)} — ${getDistrictLabel(room.district)}`;
  return {
    title: room.title,
    description: metaDesc,
    openGraph: {
      title: room.title,
      description: metaDesc,
      images: room.images[0] ? [{ url: room.images[0].url }] : [],
    },
  };
}

const COST_LABELS: { key: string; label: string }[] = [
  { key: "deposit",           label: "Đặt cọc" },
  { key: "electricity_price", label: "Tiền điện" },
  { key: "water_price",       label: "Tiền nước" },
  { key: "service_fee",       label: "Phí dịch vụ" },
  { key: "parking_fee",       label: "Phí gửi xe" },
  { key: "internet_fee",      label: "Tiền internet" },
];

export default async function RoomDetailPage({ params }: Props) {
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) notFound();

  const relatedRooms = await getRelatedRooms(room.district, id);

  const costRows = COST_LABELS.filter(
    ({ key }) => room[key as keyof typeof room] != null,
  );

  // Chuỗi địa chỉ để hiện bản đồ (chỉ hiện khi có địa chỉ chi tiết).
  const mapQuery = [
    room.address,
    room.ward,
    getDistrictLabel(room.district),
    "Hà Nội",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 md:pb-8">
      <RoomGallery images={room.images} />

      <div className="mt-6 flex flex-col gap-6">
        {/* Title + price + status */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-2xl font-bold leading-snug">{room.title}</h1>
            {room.status !== "available" && (
              <Badge variant="outline">{ROOM_STATUS_LABEL[room.status]}</Badge>
            )}
          </div>
          <p className="text-2xl font-bold text-primary">{formatPriceMonth(room.price)}</p>
        </div>

        <Separator />

        {/* Meta info */}
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex gap-2"><dt className="text-muted-foreground">Khu vực:</dt><dd>{getDistrictLabel(room.district)}{room.ward ? `, ${room.ward}` : ""}</dd></div>
          {room.address && <div className="flex gap-2 sm:col-span-2"><dt className="text-muted-foreground">Địa chỉ:</dt><dd>{room.address}</dd></div>}
          <div className="flex gap-2"><dt className="text-muted-foreground">Loại phòng:</dt><dd>{getRoomTypeLabel(room.room_type)}</dd></div>
          {room.area_m2 && <div className="flex gap-2"><dt className="text-muted-foreground">Diện tích:</dt><dd>{formatArea(room.area_m2)}</dd></div>}
          {room.max_occupants && <div className="flex gap-2"><dt className="text-muted-foreground">Số người tối đa:</dt><dd>{room.max_occupants} người</dd></div>}
        </dl>

        {/* Bản đồ vị trí (tự động theo địa chỉ đã nhập) */}
        {room.address && (
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Vị trí trên bản đồ</h2>
            <RoomMap address={mapQuery} />
          </div>
        )}

        {/* Amenities */}
        {room.amenities.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Tiện ích</h2>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((slug) => (
                <Badge key={slug} variant="secondary" className="gap-1.5">
                  <AmenityIcon slug={slug} className="size-3.5" />
                  {getAmenityLabel(slug)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Costs */}
        {costRows.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Chi phí</h2>
            <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {costRows.map(({ key, label }) => (
                <div key={key} className="flex justify-between border-b py-1 last:border-0 sm:col-auto">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium">{formatPrice(room[key as keyof typeof room] as number)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Description (rich text HTML do admin soạn — nội dung tin cậy) */}
        {room.description && (
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Mô tả</h2>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: room.description }}
            />
          </div>
        )}

        {/* Videos */}
        {room.video_links.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold">Video</h2>
            {room.video_links.map((url, i) => <VideoEmbed key={i} url={url} />)}
          </div>
        )}

        <Separator />

        {/* Liên hệ — LUÔN dùng số tổng; khách liên hệ qua đây, admin điều phối sau */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">Liên hệ xem phòng</h2>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${SITE_CONFIG.phone}`} className={buttonVariants({ size: "sm" })}>
              <PhoneIcon /> Gọi {SITE_CONFIG.phone}
            </a>
            <a
              href={`https://zalo.me/${SITE_CONFIG.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Zalo
            </a>
          </div>
        </div>

        {/* Share */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Chia sẻ</h2>
          <ShareButtons />
        </div>

        {/* Phòng tương tự */}
        {relatedRooms.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Phòng tương tự</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedRooms.map((r) => (
                  <RoomCard key={r.id} room={r} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Thanh liên hệ cố định (mobile only) — luôn dùng số tổng */}
      <StickyContactBar />
    </div>
  );
}
