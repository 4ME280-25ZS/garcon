-- Supabase setup for Wishlist prototype
-- Run these statements in Supabase SQL editor

-- 1) enable uuid generator if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) reservations table (one reservation per item)
CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text UNIQUE NOT NULL,
  reserved_by text,
  reserved_at timestamptz DEFAULT now()
);

-- 3) RPC: atomic reserve
CREATE OR REPLACE FUNCTION public.reserve_item(p_item_id text, p_name text)
RETURNS TABLE(success boolean) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.reservations(item_id, reserved_by) VALUES (p_item_id, p_name);
  RETURN QUERY SELECT true;
EXCEPTION WHEN unique_violation THEN
  RETURN QUERY SELECT false;
END;
$$;

-- 4) RPC: release
CREATE OR REPLACE FUNCTION public.release_item(p_item_id text)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  DELETE FROM public.reservations WHERE item_id = p_item_id;
$$;

-- 5) Grants for anon (prototype)
GRANT EXECUTE ON FUNCTION public.reserve_item(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.release_item(text) TO anon;
GRANT SELECT ON public.reservations TO anon;

-- Done. After running, frontend can call RPCs 'reserve_item' and 'release_item'.
