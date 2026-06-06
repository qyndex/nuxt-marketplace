-- ============================================================
-- Nuxt Marketplace — Seed Data
-- Run after migration: supabase db reset
-- ============================================================

-- Categories
INSERT INTO public.categories (id, name, slug) VALUES
  ('57eb3b71-6d12-5556-b1b8-245c49be9f90', 'Kitchen', 'kitchen'),
  ('3e8e220a-6f19-391a-9cc2-970461580c3f', 'Fashion', 'fashion'),
  ('be7b14ca-2c0c-29c6-cd4d-195e5fc82831', 'Games', 'games'),
  ('d55c1ccf-ca53-9880-d038-694ab8077f9e', 'Home', 'home'),
  ('4b36b1d7-4c0a-15b3-9a0c-84076088eec8', 'Stationery', 'stationery'),
  ('d5ee8a4b-41d3-ec0f-0c51-670bc28e6e88', 'Art', 'art'),
  ('29f9322f-b5d8-b177-acfb-0199851301b1', 'Electronics', 'electronics'),
  ('446b3fd4-d7b8-99c7-1a4a-5311352b8ccf', 'Outdoors', 'outdoors')
ON CONFLICT (slug) DO NOTHING;

-- Demo seller profiles (auth users must be created separately or via Supabase dashboard)
-- These UUIDs match test users seeded via supabase auth admin
-- Seed auth.users first (profiles.id FKs to auth.users); trigger creates the profiles.
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, instance_id, aud, role) values
  ('b6462d9f-e06a-d0e7-8c57-88f1959b5793','pottery@example.com',crypt('password123',gen_salt('bf')),now(),'{"display_name":"PotteryStudio"}'::jsonb,now(),now(),'00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('194d6d6b-e1c3-2d73-9778-92c011ee2ae8','retrowear@example.com',crypt('password123',gen_salt('bf')),now(),'{"display_name":"RetroWear"}'::jsonb,now(),now(),'00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('d38dc791-a9aa-6c50-3b04-d6375efbde60','woodworks@example.com',crypt('password123',gen_salt('bf')),now(),'{"display_name":"WoodWorks"}'::jsonb,now(),now(),'00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('474e9b4b-8bf3-0f8e-11c2-c4feb8174d11','greenthumb@example.com',crypt('password123',gen_salt('bf')),now(),'{"display_name":"GreenThumb"}'::jsonb,now(),now(),'00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('0cd1d8d7-0fe6-bd97-1920-32703814e06a','bindery@example.com',crypt('password123',gen_salt('bf')),now(),'{"display_name":"BinderyArts"}'::jsonb,now(),now(),'00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('b0830b83-1df6-bafb-ada9-9ff7f8d4ed6e','wicklab@example.com',crypt('password123',gen_salt('bf')),now(),'{"display_name":"WickLab"}'::jsonb,now(),now(),'00000000-0000-0000-0000-000000000000','authenticated','authenticated')
on conflict (id) do nothing;

INSERT INTO public.profiles (id, email, display_name) VALUES
  ('b6462d9f-e06a-d0e7-8c57-88f1959b5793', 'pottery@example.com', 'PotteryStudio'),
  ('194d6d6b-e1c3-2d73-9778-92c011ee2ae8', 'retrowear@example.com', 'RetroWear'),
  ('d38dc791-a9aa-6c50-3b04-d6375efbde60', 'woodworks@example.com', 'WoodWorks'),
  ('474e9b4b-8bf3-0f8e-11c2-c4feb8174d11', 'greenthumb@example.com', 'GreenThumb'),
  ('0cd1d8d7-0fe6-bd97-1920-32703814e06a', 'bindery@example.com', 'BinderyArts'),
  ('b0830b83-1df6-bafb-ada9-9ff7f8d4ed6e', 'wicklab@example.com', 'WickLab')
ON CONFLICT (id) DO NOTHING;

-- Sample Listings
INSERT INTO public.listings (id, title, description, price, image_url, category, seller_id, status) VALUES
  (
    'b42994a3-029e-bfff-0070-bfe0a1078d93',
    'Handcrafted Ceramic Mug',
    'Hand-thrown ceramic mug with a speckled glaze, holds 12oz. Dishwasher safe. Each piece is unique.',
    34.99,
    'https://placehold.co/480x360?text=Ceramic+Mug',
    'kitchen',
    'b6462d9f-e06a-d0e7-8c57-88f1959b5793',
    'active'
  ),
  (
    'b8c1072e-f5f3-87f4-9a45-02c3ca7a07e0',
    'Vintage Denim Jacket',
    'Classic vintage denim jacket, lightly worn condition. Size M. Perfect for layering.',
    89.99,
    'https://placehold.co/480x360?text=Denim+Jacket',
    'fashion',
    '194d6d6b-e1c3-2d73-9778-92c011ee2ae8',
    'active'
  ),
  (
    '5b8d50e2-45f6-1451-fc61-12de1ec10da4',
    'Wooden Chess Set',
    'Handmade walnut and maple chess board with weighted felted pieces. Board size 18"x18".',
    124.99,
    'https://placehold.co/480x360?text=Chess+Set',
    'games',
    'd38dc791-a9aa-6c50-3b04-d6375efbde60',
    'active'
  ),
  (
    '1d58110e-132d-2908-93e4-9a4873b70496',
    'Succulent Arrangement',
    'Curated succulent arrangement in a terracotta pot. Low maintenance, perfect for any desk.',
    29.99,
    'https://placehold.co/480x360?text=Succulents',
    'home',
    '474e9b4b-8bf3-0f8e-11c2-c4feb8174d11',
    'active'
  ),
  (
    '94e8aef6-c182-a2ba-d367-76d3bbdbf8c4',
    'Leather Journal',
    'Hand-bound A5 leather journal, 200 pages of 100gsm acid-free paper. Lay-flat binding.',
    44.99,
    'https://placehold.co/480x360?text=Leather+Journal',
    'stationery',
    '0cd1d8d7-0fe6-bd97-1920-32703814e06a',
    'active'
  ),
  (
    'a0ce2762-4fa4-3377-bd1c-9e39c9d16a9a',
    'Hand-poured Soy Candle',
    'All-natural soy wax candle with cedarwood and vanilla scent. 8oz, 50-hour burn time.',
    24.99,
    'https://placehold.co/480x360?text=Soy+Candle',
    'home',
    'b0830b83-1df6-bafb-ada9-9ff7f8d4ed6e',
    'active'
  ),
  (
    '50e07a3d-a0ca-69f9-4cf4-1c4835040aca',
    'Watercolor Print — Mountain Dawn',
    'Original watercolor print, limited edition of 50. Printed on 300gsm archival paper. 8"x10".',
    59.99,
    'https://placehold.co/480x360?text=Watercolor+Print',
    'art',
    'b6462d9f-e06a-d0e7-8c57-88f1959b5793',
    'active'
  ),
  (
    '02dc2a3c-8ad2-802b-ce25-e3b920400756',
    'Macramé Wall Hanging',
    'Hand-knotted cotton macramé wall hanging. 24" wide x 36" long. Natural off-white color.',
    79.99,
    'https://placehold.co/480x360?text=Macrame',
    'home',
    '474e9b4b-8bf3-0f8e-11c2-c4feb8174d11',
    'active'
  ),
  (
    '0229ed4d-1f37-fac2-b70d-ab8aaca31a0f',
    'Enamel Pin Set — Forest Animals',
    'Set of 5 hard enamel pins: fox, bear, owl, deer, rabbit. Gold plated, locking back.',
    18.99,
    'https://placehold.co/480x360?text=Enamel+Pins',
    'art',
    '194d6d6b-e1c3-2d73-9778-92c011ee2ae8',
    'active'
  ),
  (
    '577617b3-90ef-ed3c-adfd-f8148b188ba1',
    'Cedar Wood Cutting Board',
    'Edge-grain cedar cutting board with juice groove. 12"x18". Food-safe finish.',
    54.99,
    'https://placehold.co/480x360?text=Cutting+Board',
    'kitchen',
    'd38dc791-a9aa-6c50-3b04-d6375efbde60',
    'active'
  )
ON CONFLICT (id) DO NOTHING;
