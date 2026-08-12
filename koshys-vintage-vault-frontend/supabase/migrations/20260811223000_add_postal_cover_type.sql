begin;

alter table public.collection_items
  drop constraint if exists collection_items_type_check;

alter table public.collection_items
  add constraint collection_items_type_check
  check (type in ('stamp', 'coin', 'postal_cover'));

commit;
