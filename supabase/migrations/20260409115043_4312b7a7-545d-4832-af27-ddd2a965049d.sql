
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price numeric DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percentage integer DEFAULT NULL;
