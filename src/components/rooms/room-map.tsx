// Bản đồ vị trí phòng — Google Maps embed (không cần API key) dựa theo địa chỉ.
// Dùng tham số ?q=<địa chỉ>&output=embed: Google tự geocode chuỗi địa chỉ.
interface RoomMapProps {
  /** Chuỗi địa chỉ đầy đủ để tìm trên bản đồ, vd "Ngõ 10 Xuân Thủy, Cầu Giấy, Hà Nội" */
  address: string;
}

export function RoomMap({ address }: RoomMapProps) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    address,
  )}&z=16&output=embed`;

  return (
    <div className="overflow-hidden rounded-xl border">
      <iframe
        title={`Bản đồ vị trí: ${address}`}
        src={src}
        width="100%"
        height="320"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full"
      />
    </div>
  );
}
