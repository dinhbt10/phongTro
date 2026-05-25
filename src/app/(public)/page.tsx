import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedRooms, getLatestRooms } from "@/lib/rooms/room-fetchers";
import { SITE_CONFIG } from "@/lib/constants/site-config";
import { RoomCard } from "@/components/rooms/room-card";
import { QuickSearch } from "@/components/rooms/quick-search";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.brand} — Tìm phòng nhanh`,
  description: SITE_CONFIG.slogan,
};

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedRooms(6),
    getLatestRooms(6),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background px-4 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {SITE_CONFIG.brand}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground sm:text-lg">
          {SITE_CONFIG.slogan}
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <QuickSearch />
        </div>
      </section>

      {/* Featured rooms */}
      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Phòng nổi bật</h2>
            <Link href="/phong" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
        </section>
      )}

      {/* Latest rooms */}
      {latest.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Phòng mới nhất</h2>
            <Link href="/phong" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
        </section>
      )}

      {/* Empty CTA when no rooms yet */}
      {featured.length === 0 && latest.length === 0 && (
        <section className="flex flex-col items-center gap-4 px-4 py-24 text-center">
          <p className="text-muted-foreground">Chưa có phòng nào được đăng.</p>
          <Link href="/phong" className={buttonVariants({ size: "lg" })}>
            Khám phá danh sách phòng
          </Link>
        </section>
      )}
    </div>
  );
}
