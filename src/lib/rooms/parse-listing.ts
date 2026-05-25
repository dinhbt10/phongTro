// Phân tích tin rao (free text) → các trường form. Theo quy tắc, không dùng AI.
import { HANOI_DISTRICTS, DISTRICT_SLUGS } from "@/lib/constants/hanoi-districts";
import { ROOM_TYPE_SLUGS } from "@/lib/constants/room-types";
import { AMENITY_SLUGS } from "@/lib/constants/amenities";
import {
  AREA_ALIASES,
  ROOM_TYPE_KEYWORDS,
  AMENITY_KEYWORDS,
} from "./listing-keywords";

export interface ParsedListing {
  title?: string;
  description?: string;
  price?: number;
  area_m2?: number;
  district?: string;
  address?: string;
  room_type?: string;
  amenities?: string[];
  contact_phone?: string;
  filledLabels: string[];
}

/** Bỏ dấu tiếng Việt + thường hóa để so khớp từ khóa. */
export function normalizeVi(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Tìm slug dài-khớp-nhất trong map theo nội dung đã normalize. */
function matchLongest(
  normalizedText: string,
  map: Record<string, string>,
): string | undefined {
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const k of keys) if (normalizedText.includes(k)) return map[k];
  return undefined;
}

/** Bóc giá tiền từ 1 đoạn text. lenient=true cho phép số trần (vd "2500000"). */
function parsePriceFrom(text: string, lenient: boolean): number | undefined {
  const n = normalizeVi(text);
  // 2.5tr / 2,5 trieu
  let m = n.match(/(\d+[.,]\d+)\s*(?:tr|trieu)\b/);
  if (m) return Math.round(parseFloat(m[1].replace(",", ".")) * 1_000_000);
  // 2tr5 / 3 tr 2  (số sau tr = phần lẻ của triệu)
  m = n.match(/(\d+)\s*(?:tr|trieu)\s*(\d{1,3})\b/);
  if (m) {
    const main = parseInt(m[1], 10) * 1_000_000;
    const frac = parseInt(m[2], 10) * Math.pow(10, 6 - m[2].length);
    return Math.round(main + frac);
  }
  // 3tr / 3 trieu
  m = n.match(/(\d+)\s*(?:tr|trieu)\b/);
  if (m) return parseInt(m[1], 10) * 1_000_000;
  // 500k
  m = n.match(/(\d{2,5})\s*k\b/);
  if (m) return parseInt(m[1], 10) * 1000;
  // số có phân tách: 2.500.000 / 2,500,000
  m = n.match(/(\d{1,3}(?:[.,]\d{3})+)/);
  if (m) {
    const v = parseInt(m[1].replace(/[.,]/g, ""), 10);
    if (v >= 300_000 && v <= 200_000_000) return v;
  }
  // số trần lớn (chỉ khi lenient — vd dòng "Giá: 2500000")
  if (lenient) {
    m = n.match(/(\d{6,9})/);
    if (m) {
      const v = parseInt(m[1], 10);
      if (v >= 300_000 && v <= 200_000_000) return v;
    }
  }
  return undefined;
}

function parsePhone(text: string): string | undefined {
  // SĐT VN: bắt đầu bằng 0, 10 số (cho phép dấu cách/chấm xen giữa).
  const m = text.match(/0\d[\d\s.]{7,12}\d/);
  if (!m) return undefined;
  const digits = m[0].replace(/\D/g, "");
  return /^0\d{9,10}$/.test(digits) ? digits : undefined;
}

function parseAddress(lines: string[]): string | undefined {
  const line = lines.find((l) => /d\s*\/?\s*c\b|dia chi/.test(normalizeVi(l)));
  if (!line) return undefined;
  return line
    .replace(/^[^\p{L}\d]+/u, "") // bỏ emoji/khoảng trắng đầu dòng
    .replace(/^(d\s*\/?\s*c|dia chi|địa chỉ|đ\/?c)\s*[:\-.]?\s*/i, "")
    .trim() || undefined;
}

export function parseListing(text: string): ParsedListing {
  const lines = text.split(/\r?\n/);
  const normAll = normalizeVi(text);
  const filled: string[] = [];
  const out: ParsedListing = { filledLabels: filled };

  // Tiêu đề = dòng không rỗng đầu tiên (giữ nguyên emoji + dấu).
  const firstIdx = lines.findIndex((l) => l.trim() !== "");
  if (firstIdx >= 0) {
    out.title = lines[firstIdx].trim();
    filled.push("Tiêu đề");
  }

  // Mô tả = phần còn lại → HTML <p> từng dòng.
  const restHtml = lines
    .slice(firstIdx + 1)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `<p>${escapeHtml(l)}</p>`)
    .join("");
  if (restHtml) {
    out.description = restHtml;
    filled.push("Mô tả");
  }

  // Giá: ưu tiên dòng có "gia"; nếu không, quét toàn bộ (không lenient để né SĐT).
  const giaLine = lines.find((l) => normalizeVi(l).includes("gia"));
  const price = giaLine
    ? parsePriceFrom(giaLine, true)
    : parsePriceFrom(text, false);
  if (price) {
    out.price = price;
    filled.push("Giá");
  }

  // Diện tích
  const am = text.match(/(\d+(?:[.,]\d+)?)\s*m\s*(?:2|²)/i);
  if (am) {
    out.area_m2 = parseFloat(am[1].replace(",", "."));
    filled.push("Diện tích");
  }

  // Khu vực (quận/huyện) — gộp alias + tên quận chính thức, ưu tiên khớp dài nhất.
  const districtMap: Record<string, string> = { ...AREA_ALIASES };
  for (const d of HANOI_DISTRICTS) districtMap[normalizeVi(d.label)] = d.slug;
  const district = matchLongest(normAll, districtMap);
  if (district && DISTRICT_SLUGS.includes(district)) {
    out.district = district;
    filled.push("Khu vực");
  }

  // Loại phòng
  const roomType = matchLongest(normAll, ROOM_TYPE_KEYWORDS);
  if (roomType && ROOM_TYPE_SLUGS.includes(roomType)) {
    out.room_type = roomType;
    filled.push("Loại phòng");
  }

  // Địa chỉ
  const address = parseAddress(lines);
  if (address) {
    out.address = address;
    filled.push("Địa chỉ");
  }

  // Tiện ích (gom tất cả từ khóa khớp)
  const amenities = new Set<string>();
  for (const [k, slug] of Object.entries(AMENITY_KEYWORDS)) {
    if (normAll.includes(k) && AMENITY_SLUGS.includes(slug)) amenities.add(slug);
  }
  if (amenities.size > 0) {
    out.amenities = [...amenities];
    filled.push(`Tiện ích (${amenities.size})`);
  }

  // SĐT
  const phone = parsePhone(text);
  if (phone) {
    out.contact_phone = phone;
    filled.push("SĐT");
  }

  return out;
}
