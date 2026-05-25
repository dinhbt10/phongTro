-- ============================================================================
-- Schema cho Web Quản Lý & Tìm Phòng Trọ (Hà Nội)
-- Chạy toàn bộ file này trong: Supabase Dashboard > SQL Editor > New query > Run
-- An toàn chạy lại nhiều lần (idempotent).
-- ============================================================================

-- ---------- Bảng rooms ----------
create table if not exists public.rooms (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  description        text,
  price              integer not null default 0,        -- VND/tháng
  area_m2            numeric,
  district           text not null,                     -- slug quận/huyện
  ward               text,
  address            text,
  room_type          text not null,                     -- slug loại hình
  deposit            integer,
  electricity_price  integer,
  water_price        integer,
  service_fee        integer,
  parking_fee        integer,
  internet_fee       integer,
  max_occupants      integer,
  amenities          text[] not null default '{}',      -- slug[] tiện ích
  video_links        text[] not null default '{}',
  contact_name       text,
  contact_phone      text,
  status             text not null default 'available'
                     check (status in ('available', 'rented', 'hidden')),
  featured           boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz
);

-- ---------- Bảng room_images ----------
create table if not exists public.room_images (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references public.rooms(id) on delete cascade,
  url         text not null,
  sort_order  integer not null default 0
);

-- ---------- Index (tăng tốc lọc/tìm) ----------
create index if not exists idx_rooms_price       on public.rooms (price);
create index if not exists idx_rooms_district    on public.rooms (district);
create index if not exists idx_rooms_room_type   on public.rooms (room_type);
create index if not exists idx_rooms_status      on public.rooms (status);
create index if not exists idx_rooms_created_at  on public.rooms (created_at desc);
create index if not exists idx_rooms_amenities   on public.rooms using gin (amenities);
create index if not exists idx_room_images_room  on public.room_images (room_id, sort_order);

-- ---------- Trigger tự cập nhật updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_rooms_updated_at on public.rooms;
create trigger trg_rooms_updated_at
  before update on public.rooms
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS (Row Level Security): công khai ĐỌC phòng không ẩn, chỉ admin GHI
-- ============================================================================
alter table public.rooms       enable row level security;
alter table public.room_images enable row level security;

-- rooms: anon/khách chỉ đọc phòng status != 'hidden'
drop policy if exists "public read visible rooms" on public.rooms;
create policy "public read visible rooms" on public.rooms
  for select using (status <> 'hidden');

-- rooms: user đã đăng nhập (admin) toàn quyền (thấy cả phòng ẩn)
drop policy if exists "authenticated manage rooms" on public.rooms;
create policy "authenticated manage rooms" on public.rooms
  for all to authenticated using (true) with check (true);

-- room_images: khách đọc ảnh của phòng không ẩn
drop policy if exists "public read images of visible rooms" on public.room_images;
create policy "public read images of visible rooms" on public.room_images
  for select using (
    exists (
      select 1 from public.rooms r
      where r.id = room_id and r.status <> 'hidden'
    )
  );

-- room_images: admin toàn quyền
drop policy if exists "authenticated manage images" on public.room_images;
create policy "authenticated manage images" on public.room_images
  for all to authenticated using (true) with check (true);

-- ============================================================================
-- Storage: bucket "room-images" (đọc công khai, ghi cần đăng nhập)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('room-images', 'room-images', true)
on conflict (id) do nothing;

drop policy if exists "public read room images" on storage.objects;
create policy "public read room images" on storage.objects
  for select using (bucket_id = 'room-images');

drop policy if exists "authenticated upload room images" on storage.objects;
create policy "authenticated upload room images" on storage.objects
  for insert to authenticated with check (bucket_id = 'room-images');

drop policy if exists "authenticated update room images" on storage.objects;
create policy "authenticated update room images" on storage.objects
  for update to authenticated using (bucket_id = 'room-images');

drop policy if exists "authenticated delete room images" on storage.objects;
create policy "authenticated delete room images" on storage.objects
  for delete to authenticated using (bucket_id = 'room-images');
