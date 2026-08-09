-- Enable RLS just to be safe
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since admin dashboard is the only one using it right now)
CREATE POLICY "Allow public all on listings" ON public.listings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on pricing_tiers" ON public.pricing_tiers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on itineraries" ON public.itineraries FOR ALL USING (true) WITH CHECK (true);
