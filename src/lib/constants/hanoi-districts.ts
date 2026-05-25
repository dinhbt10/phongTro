// Danh sách quận/huyện/thị xã Hà Nội dùng cho dropdown khu vực và filter.
// `slug` là hợp đồng ổn định với URL query — KHÔNG đổi sau khi đã có dữ liệu.

export interface DistrictOption {
  slug: string;
  label: string;
}

export const HANOI_DISTRICTS: DistrictOption[] = [
  // 12 quận nội thành
  { slug: "ba-dinh", label: "Ba Đình" },
  { slug: "hoan-kiem", label: "Hoàn Kiếm" },
  { slug: "tay-ho", label: "Tây Hồ" },
  { slug: "long-bien", label: "Long Biên" },
  { slug: "cau-giay", label: "Cầu Giấy" },
  { slug: "dong-da", label: "Đống Đa" },
  { slug: "hai-ba-trung", label: "Hai Bà Trưng" },
  { slug: "hoang-mai", label: "Hoàng Mai" },
  { slug: "thanh-xuan", label: "Thanh Xuân" },
  { slug: "nam-tu-liem", label: "Nam Từ Liêm" },
  { slug: "bac-tu-liem", label: "Bắc Từ Liêm" },
  { slug: "ha-dong", label: "Hà Đông" },
  // Thị xã
  { slug: "son-tay", label: "Sơn Tây" },
  // Huyện
  { slug: "ba-vi", label: "Ba Vì" },
  { slug: "chuong-my", label: "Chương Mỹ" },
  { slug: "dan-phuong", label: "Đan Phượng" },
  { slug: "dong-anh", label: "Đông Anh" },
  { slug: "gia-lam", label: "Gia Lâm" },
  { slug: "hoai-duc", label: "Hoài Đức" },
  { slug: "me-linh", label: "Mê Linh" },
  { slug: "my-duc", label: "Mỹ Đức" },
  { slug: "phu-xuyen", label: "Phú Xuyên" },
  { slug: "phuc-tho", label: "Phúc Thọ" },
  { slug: "quoc-oai", label: "Quốc Oai" },
  { slug: "soc-son", label: "Sóc Sơn" },
  { slug: "thach-that", label: "Thạch Thất" },
  { slug: "thanh-oai", label: "Thanh Oai" },
  { slug: "thanh-tri", label: "Thanh Trì" },
  { slug: "thuong-tin", label: "Thường Tín" },
  { slug: "ung-hoa", label: "Ứng Hòa" },
];

export const DISTRICT_LABEL_BY_SLUG: Record<string, string> = Object.fromEntries(
  HANOI_DISTRICTS.map((d) => [d.slug, d.label]),
);

export function getDistrictLabel(slug: string | null | undefined): string {
  if (!slug) return "";
  return DISTRICT_LABEL_BY_SLUG[slug] ?? slug;
}

export const DISTRICT_SLUGS = HANOI_DISTRICTS.map((d) => d.slug);
