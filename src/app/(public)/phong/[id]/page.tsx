import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoomById, getRelatedRooms } from "@/lib/rooms/room-fetchers";
import { formatPrice, formatPriceMonth, formatArea, stripHtml, maskPhones } from "@/lib/format";
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
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) return { title: "Không tìm thấy phòng" };
  const metaDesc =
    maskPhones(stripHtml(room.description), SITE_CONFIG.phone).slice(0, 160) ||
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
              dangerouslySetInnerHTML={{
                __html: maskPhones(room.description, SITE_CONFIG.phone),
              }}
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

        {/* Liên hệ xem phòng — Facebook + Zalo (khách inbox, admin điều phối) */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">Liên hệ xem phòng</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={SITE_CONFIG.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1877F2] px-5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
            <a
              href={`https://zalo.me/${SITE_CONFIG.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border-2 border-[#0068FF] px-5 text-sm font-semibold text-[#0068FF] transition-colors hover:bg-[#0068FF]/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                <path d="M12 2C6.477 2 2 5.94 2 10.8c0 2.77 1.46 5.24 3.75 6.86-.13.99-.6 2.3-1.3 3.34-.16.24.04.55.32.49 1.86-.42 3.3-1.06 4.2-1.57.88.2 1.8.31 2.73.31 5.523 0 10-3.94 10-8.8C22 5.94 17.523 2 12 2z" />
              </svg>
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
