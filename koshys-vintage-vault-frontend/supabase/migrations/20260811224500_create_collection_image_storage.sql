begin;

alter table public.collection_items
  add column if not exists image_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'collection-images',
  'collection-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin can upload collection images" on storage.objects;
create policy "Admin can upload collection images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'collection-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@koshysheritagevault.com'
);

drop policy if exists "Admin can update collection images" on storage.objects;
create policy "Admin can update collection images"
on storage.objects for update to authenticated
using (
  bucket_id = 'collection-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@koshysheritagevault.com'
)
with check (
  bucket_id = 'collection-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@koshysheritagevault.com'
);

drop policy if exists "Admin can delete collection images" on storage.objects;
create policy "Admin can delete collection images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'collection-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@koshysheritagevault.com'
);

commit;
