// Hàm định dạng số/đơn vị hiển thị cho UI — tái sử dụng toàn app.

/** Định dạng giá tiền: 3500000 → "3.500.000 đ" */
export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "";
  return value.toLocaleString("vi-VN") + " đ";
}

/** Định dạng giá tiền theo tháng: 3500000 → "3.500.000 đ/tháng" */
export function formatPriceMonth(value: number | null | undefined): string {
  if (value == null) return "";
  return value.toLocaleString("vi-VN") + " đ/tháng";
}

/** Định dạng diện tích: 25 → "25 m²" */
export function formatArea(value: number | null | undefined): string {
  if (value == null) return "";
  return `${value} m²`;
}

/** Bỏ thẻ HTML, trả về text thuần (dùng cho meta description từ nội dung rich text). */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Thay MỌI số điện thoại (VN) trong text/HTML bằng số liên hệ tổng.
 * Mục đích: ẩn số gốc trong mô tả/tin đã dán — khách luôn liên hệ qua số của shop.
 * Khớp dạng bắt đầu 0 hoặc +84, 9–11 chữ số (cho phép cách/chấm/gạch xen giữa).
 * Không đụng tới giá tiền (vì giá không bắt đầu bằng 0/+84).
 */
export function maskPhones(
  text: string | null | undefined,
  replacement: string,
): string {
  if (!text) return "";
  return text.replace(/(?:\+84|0)(?:[\s.\-]?\d){8,10}/g, replacement);
}
