-- ============================================================
-- Nuxt Marketplace — Seed Data
-- Run after migration: supabase db reset
-- ============================================================

-- Categories
INSERT INTO public.categories (id, name, slug) VALUES
  ('cat-0001-0000-0000-000000000001', 'Kitchen', 'kitchen'),
  ('cat-0001-0000-0000-000000000002', 'Fashion', 'fashion'),
  ('cat-0001-0000-0000-000000000003', 'Games', 'games'),
  ('cat-0001-0000-0000-000000000004', 'Home', 'home'),
  ('cat-0001-0000-0000-000000000005', 'Stationery', 'stationery'),
  ('cat-0001-0000-0000-000000000006', 'Art', 'art'),
  ('cat-0001-0000-0000-000000000007', 'Electronics', 'electronics'),
  ('cat-0001-0000-0000-000000000008', 'Outdoors', 'outdoors')
ON CONFLICT (slug) DO NOTHING;

-- Demo seller profiles (auth users must be created separately or via Supabase dashboard)
-- These UUIDs match test users seeded via supabase auth admin
INSERT INTO public.profiles (id, email, display_name) VALUES
  ('seller-001-0000-0000-000000000001', 'pottery@example.com', 'PotteryStudio'),
  ('seller-002-0000-0000-000000000002', 'retrowear@example.com', 'RetroWear'),
  ('seller-003-0000-0000-000000000003', 'woodworks@example.com', 'WoodWorks'),
  ('seller-004-0000-0000-000000000004', 'greenthumb@example.com', 'GreenThumb'),
  ('seller-005-0000-0000-000000000005', 'bindery@example.com', 'BinderyArts'),
  ('seller-006-0000-0000-000000000006', 'wicklab@example.com', 'WickLab')
ON CONFLICT (id) DO NOTHING;

-- Sample Listings
INSERT INTO public.listings (id, title, description, price, image_url, category, seller_id, status) VALUES
  (
    'lst-00001-000-0000-000000000001',
    'Handcrafted Ceramic Mug',
    'Hand-thrown ceramic mug with a speckled glaze, holds 12oz. Dishwasher safe. Each piece is unique.',
    34.99,
    'https://placehold.co/480x360?text=Ceramic+Mug',
    'kitchen',
    'seller-001-0000-0000-000000000001',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000002',
    'Vintage Denim Jacket',
    'Classic vintage denim jacket, lightly worn condition. Size M. Perfect for layering.',
    89.99,
    'https://placehold.co/480x360?text=Denim+Jacket',
    'fashion',
    'seller-002-0000-0000-000000000002',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000003',
    'Wooden Chess Set',
    'Handmade walnut and maple chess board with weighted felted pieces. Board size 18"x18".',
    124.99,
    'https://placehold.co/480x360?text=Chess+Set',
    'games',
    'seller-003-0000-0000-000000000003',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000004',
    'Succulent Arrangement',
    'Curated succulent arrangement in a terracotta pot. Low maintenance, perfect for any desk.',
    29.99,
    'https://placehold.co/480x360?text=Succulents',
    'home',
    'seller-004-0000-0000-000000000004',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000005',
    'Leather Journal',
    'Hand-bound A5 leather journal, 200 pages of 100gsm acid-free paper. Lay-flat binding.',
    44.99,
    'https://placehold.co/480x360?text=Leather+Journal',
    'stationery',
    'seller-005-0000-0000-000000000005',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000006',
    'Hand-poured Soy Candle',
    'All-natural soy wax candle with cedarwood and vanilla scent. 8oz, 50-hour burn time.',
    24.99,
    'https://placehold.co/480x360?text=Soy+Candle',
    'home',
    'seller-006-0000-0000-000000000006',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000007',
    'Watercolor Print — Mountain Dawn',
    'Original watercolor print, limited edition of 50. Printed on 300gsm archival paper. 8"x10".',
    59.99,
    'https://placehold.co/480x360?text=Watercolor+Print',
    'art',
    'seller-001-0000-0000-000000000001',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000008',
    'Macramé Wall Hanging',
    'Hand-knotted cotton macramé wall hanging. 24" wide x 36" long. Natural off-white color.',
    79.99,
    'https://placehold.co/480x360?text=Macrame',
    'home',
    'seller-004-0000-0000-000000000004',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000009',
    'Enamel Pin Set — Forest Animals',
    'Set of 5 hard enamel pins: fox, bear, owl, deer, rabbit. Gold plated, locking back.',
    18.99,
    'https://placehold.co/480x360?text=Enamel+Pins',
    'art',
    'seller-002-0000-0000-000000000002',
    'active'
  ),
  (
    'lst-00001-000-0000-000000000010',
    'Cedar Wood Cutting Board',
    'Edge-grain cedar cutting board with juice groove. 12"x18". Food-safe finish.',
    54.99,
    'https://placehold.co/480x360?text=Cutting+Board',
    'kitchen',
    'seller-003-0000-0000-000000000003',
    'active'
  )
ON CONFLICT (id) DO NOTHING;
