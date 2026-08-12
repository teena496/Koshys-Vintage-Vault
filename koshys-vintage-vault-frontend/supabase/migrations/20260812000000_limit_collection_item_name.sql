begin;

alter table public.collection_items
  drop constraint if exists collection_items_name_check;

alter table public.collection_items
  add constraint collection_items_name_check
  check (char_length(trim(name)) between 1 and 40)
  not valid;

commit;
