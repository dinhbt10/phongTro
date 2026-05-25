// Cấu hình thông tin thương hiệu và liên hệ — chỉnh sửa 1 nơi, dùng toàn app.
export const SITE_CONFIG = {
  brand: "Phòng Trọ Hà Nội",
  slogan: "Tìm phòng trọ ưng ý tại Hà Nội — nhanh, dễ, tiết kiệm",
  phone: "0843782559",
  zalo: "0843782559",
  facebook: "https://www.facebook.com/profile.php?id=100088818657555",
  area: "Hà Nội",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;
