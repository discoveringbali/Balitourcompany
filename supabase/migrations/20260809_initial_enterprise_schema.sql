-- ==============================================================
-- HIGH-END ENTERPRISE DATABASE ARCHITECTURE FOR BALANCE ISLAND
-- ==============================================================
-- Designed for massive scale, lightning-fast queries, and high reliability.
-- Features: Proper ENUM types, UUIDs, soft-deletes, automatic updated_at triggers, and highly optimized B-Tree indexes.

-- Create custom ENUM types for data integrity and storage efficiency
CREATE TYPE public.service_type AS ENUM ('Tour', 'Scooter', 'Spa');
CREATE TYPE public.listing_status AS ENUM ('Draft', 'Active', 'Archived');
CREATE TYPE public.pricing_mode AS ENUM ('Per Person', 'Per Group', 'Per Vehicle', 'Fixed');

-- 1. COMPANIES (Partners)
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    logo_url TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. LISTINGS (Core services: Tours, Scooters, Spas)
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    type public.service_type NOT NULL,
    status public.listing_status NOT NULL DEFAULT 'Draft',
    
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    duration TEXT,
    category TEXT,
    
    -- Denormalized stats for ultra-fast listing feeds (avoiding expensive real-time aggregations)
    rating NUMERIC(3, 2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    
    -- Media
    thumbnail_image TEXT,
    
    -- Campaign Settings (for homepage hero section)
    is_hero_campaign BOOLEAN DEFAULT false,
    campaign_title TEXT,
    campaign_description TEXT,
    campaign_label TEXT,
    campaign_video_url TEXT,
    campaign_youtube_url TEXT,
    
    -- JSONB for flexible extensions (avoids constant schema migrations for minor feature additions)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. PRICING TIERS
CREATE TABLE public.pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    tier_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    min_pax INTEGER,
    max_pax INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ITINERARIES
CREATE TABLE public.itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    time_label TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. REVIEWS
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_image TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 6. BOOKINGS
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    booking_date DATE NOT NULL,
    pax INTEGER NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- HIGH-PERFORMANCE INDEXES
-- Critical for enterprise scale. Automatically optimizes query plans for filters and joins.
-- =========================================================================
CREATE INDEX idx_listings_slug ON public.listings(slug);
CREATE INDEX idx_listings_company_id ON public.listings(company_id);
-- Partial index: only indexes non-deleted rows, making active feed queries lightning fast
CREATE INDEX idx_listings_status_type ON public.listings(status, type) WHERE deleted_at IS NULL;
-- Partial index: instantly fetch hero campaigns without scanning the whole table
CREATE INDEX idx_listings_campaign ON public.listings(is_hero_campaign) WHERE is_hero_campaign = true AND deleted_at IS NULL;

CREATE INDEX idx_pricing_listing_id ON public.pricing_tiers(listing_id);
CREATE INDEX idx_itineraries_listing_id ON public.itineraries(listing_id);
CREATE INDEX idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX idx_bookings_listing_id ON public.bookings(listing_id);

-- =========================================================================
-- TRIGGERS FOR AUTOMATIC 'UPDATED_AT' TIMESTAMPS
-- =========================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_companies
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trigger_update_listings
BEFORE UPDATE ON public.listings
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trigger_update_bookings
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
