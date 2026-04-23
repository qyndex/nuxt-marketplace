-- ============================================================
-- Nuxt Marketplace — Initial Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- categories
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name  TEXT NOT NULL,
  slug  TEXT NOT NULL UNIQUE
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_all" ON public.categories
  FOR SELECT USING (true);

-- ============================================================
-- listings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.listings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url   TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT '',
  seller_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Full-text search index
CREATE INDEX IF NOT EXISTS listings_fts_idx
  ON public.listings
  USING GIN (to_tsvector('english', title || ' ' || description));

-- Trigram index for fast ILIKE search
CREATE INDEX IF NOT EXISTS listings_title_trgm_idx
  ON public.listings USING GIN (title gin_trgm_ops);

CREATE POLICY "listings_select_active" ON public.listings
  FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "listings_insert_own" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "listings_update_own" ON public.listings
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "listings_delete_own" ON public.listings
  FOR DELETE USING (auth.uid() = seller_id);

-- ============================================================
-- cart_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_items_own" ON public.cart_items
  USING (auth.uid() = user_id);

CREATE POLICY "cart_items_insert_own" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total      NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  status     TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_buyer_own" ON public.orders
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ============================================================
-- order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE SET NULL,
  price      NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity   INT NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_buyer_own" ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own" ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );

-- ============================================================
-- Trigger: keep profiles updated_at fresh
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Trigger: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
