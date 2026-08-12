begin;

alter table public.collection_items
  drop constraint if exists collection_items_year_check,
  drop constraint if exists collection_items_country_check,
  drop constraint if exists collection_items_price_check,
  drop constraint if exists collection_items_description_check;

alter table public.collection_items
  add constraint collection_items_year_check
    check (trim(year) ~ '^[0-9]{1,4}$') not valid,
  add constraint collection_items_country_check
    check (char_length(trim(country)) between 1 and 60) not valid,
  add constraint collection_items_price_check
    check (
      case
        when trim(price) ~ '^(CAD \$|₹)[0-9]+(\.[0-9]{1,2})?$'
          then regexp_replace(trim(price), '^(CAD \$|₹)', '')::numeric > 0
        else false
      end
    ) not valid,
  add constraint collection_items_description_check
    check (char_length(trim(description)) between 10 and 200) not valid;

commit;
