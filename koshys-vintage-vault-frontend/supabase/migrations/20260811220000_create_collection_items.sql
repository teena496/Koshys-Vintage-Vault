begin;

create table if not exists public.collection_items (
  id bigint generated always as identity primary key,
  type text not null check (type in ('stamp', 'coin')),
  name text not null check (char_length(trim(name)) between 1 and 160),
  year text not null check (char_length(trim(year)) between 1 and 40),
  country text not null check (char_length(trim(country)) between 1 and 100),
  rarity text not null check (
    rarity in ('Common', 'Uncommon', 'Rare', 'Very Rare', 'Extremely Rare', 'Unique')
  ),
  price text not null check (char_length(trim(price)) between 1 and 100),
  description text not null check (char_length(trim(description)) between 1 and 5000),
  image_url text not null check (char_length(trim(image_url)) between 1 and 2048),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collection_items_type_idx
  on public.collection_items (type);

create index if not exists collection_items_created_at_idx
  on public.collection_items (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_collection_items_updated_at on public.collection_items;

create trigger set_collection_items_updated_at
before update on public.collection_items
for each row execute function public.set_updated_at();

alter table public.collection_items enable row level security;

grant select on public.collection_items to anon, authenticated;
grant insert, update, delete on public.collection_items to authenticated;
grant usage, select on sequence public.collection_items_id_seq to authenticated;

drop policy if exists "Collection items are publicly readable" on public.collection_items;
create policy "Collection items are publicly readable"
on public.collection_items
for select
to anon, authenticated
using (true);

drop policy if exists "Admin can add collection items" on public.collection_items;
create policy "Admin can add collection items"
on public.collection_items
for insert
to authenticated
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@koshysheritagevault.com'
  and created_by = auth.uid()
);

drop policy if exists "Admin can update collection items" on public.collection_items;
create policy "Admin can update collection items"
on public.collection_items
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@koshysheritagevault.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@koshysheritagevault.com');

drop policy if exists "Admin can delete collection items" on public.collection_items;
create policy "Admin can delete collection items"
on public.collection_items
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@koshysheritagevault.com');

commit;
