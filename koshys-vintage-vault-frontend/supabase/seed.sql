-- Sample inventory for exercising collection pagination (12 items per page).
-- Safe to run repeatedly: matching sample names are not inserted twice.

with sample_items as (
  select
    'stamp'::text as type,
    'Sample Heritage Stamp ' || lpad(number::text, 2, '0') as name,
    (1840 + number * 7)::text as year,
    (array['Canada', 'India', 'United Kingdom', 'France'])[1 + ((number - 1) % 4)] as country,
    (array['Common', 'Uncommon', 'Rare', 'Very Rare'])[1 + ((number - 1) % 4)] as rarity,
    case when number % 2 = 0 then 'CAD $' || (18 + number * 3)::text else '₹' || (450 + number * 75)::text end as price,
    'Sample stamp added to verify search, filters, responsive cards, and pagination.' as description,
    (array['/stamp-penny-black.png', '/stamp-blue-mauritius.png', '/stamp-inverted-jenny.png'])[1 + ((number - 1) % 3)] as image_url,
    now() - (number || ' minutes')::interval as created_at
  from generate_series(1, 16) as number

  union all

  select
    'coin',
    'Sample Historic Coin ' || lpad(number::text, 2, '0'),
    (1760 + number * 9)::text,
    (array['Canada', 'India', 'United States', 'Italy'])[1 + ((number - 1) % 4)],
    (array['Common', 'Uncommon', 'Rare', 'Very Rare'])[1 + ((number - 1) % 4)],
    case when number % 2 = 0 then 'CAD $' || (25 + number * 4)::text else '₹' || (600 + number * 90)::text end,
    'Sample coin added to verify search, filters, responsive cards, and pagination.',
    '/coins-collection.png',
    now() - ((number + 20) || ' minutes')::interval
  from generate_series(1, 16) as number

  union all

  select
    'postal_cover',
    'Sample Postal Cover ' || lpad(number::text, 2, '0'),
    (1880 + number * 6)::text,
    (array['Canada', 'India', 'Australia', 'Germany'])[1 + ((number - 1) % 4)],
    (array['Common', 'Uncommon', 'Rare', 'Very Rare'])[1 + ((number - 1) % 4)],
    case when number % 2 = 0 then 'CAD $' || (20 + number * 5)::text else '₹' || (500 + number * 80)::text end,
    'Sample postal cover added to verify search, filters, responsive cards, and pagination.',
    '/postal-covers-collection.png',
    now() - ((number + 40) || ' minutes')::interval
  from generate_series(1, 16) as number
)
insert into public.collection_items (
  type,
  name,
  year,
  country,
  rarity,
  price,
  description,
  image_url,
  created_at,
  updated_at
)
select
  sample.type,
  sample.name,
  sample.year,
  sample.country,
  sample.rarity,
  sample.price,
  sample.description,
  sample.image_url,
  sample.created_at,
  sample.created_at
from sample_items as sample
where not exists (
  select 1
  from public.collection_items as existing
  where existing.type = sample.type
    and existing.name = sample.name
);
