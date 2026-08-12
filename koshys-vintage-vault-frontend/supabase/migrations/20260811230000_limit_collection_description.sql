begin;

alter table public.collection_items
  drop constraint if exists collection_items_description_check;

alter table public.collection_items
  add constraint collection_items_description_check
  check (char_length(trim(description)) between 1 and 200)
  not valid;

commit;
