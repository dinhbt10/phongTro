import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site-config";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Giới thiệu" };

export default function GioiThieuPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Giới thiệu</h1>

      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
        <p className="text-lg font-medium text-foreground">{SITE_CONFIG.slogan}</p>

        <p>
          <strong>{SITE_CONFIG.brand}</strong> là dịch vụ hỗ trợ tìm phòng trọ
          chuyên nghiệp tại khu vực {SITE_CONFIG.area}. Chúng tôi cung cấp kho
          phòng trọ đa dạng — từ phòng khép kín, không chung chủ, chung cư mini
          đến nhà nguyên căn — với đầy đủ thông tin ảnh thực tế, video, giá cả
          và tiện ích.
        </p>

        <p>
          Mục tiêu của chúng tôi là giúp khách hàng tìm được phòng phù hợp
          <strong> nhanh nhất</strong> — lọc ngay theo giá, khu vực, loại hình
          và tiện ích mà không mất thời gian liên hệ nhiều nơi.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8">Cam kết của chúng tôi</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Thông tin phòng trung thực, ảnh thực tế, không photoshop.</li>
          <li>Cập nhật trạng thái phòng liên tục — biết ngay phòng còn trống hay đã thuê.</li>
          <li>Hỗ trợ tư vấn miễn phí qua điện thoại và Zalo.</li>
          <li>Không phát sinh chi phí ẩn với người tìm phòng.</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-8">Khu vực hoạt động</h2>
        <p>
          Chúng tôi chuyên phòng trọ tại <strong>{SITE_CONFIG.area}</strong> —
          bao phủ tất cả các quận nội thành và các huyện lân cận.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/phong" className={buttonVariants({ size: "lg" })}>
          Tìm phòng ngay
        </Link>
        <Link href="/lien-he" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Liên hệ tư vấn
        </Link>
      </div>
    </div>
  );
}
