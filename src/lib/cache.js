import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

export const getHomepageListings = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, slug, type, title, location, base_price, duration, category, rating, reviews_count, status, thumbnail_image, is_hero_campaign, campaign_title, campaign_description, campaign_label, metadata, pricing_tiers(*), itineraries(*)')
        .eq('status', 'Active');
      if (error || !data || data.length === 0) {
        return [];
      }
      return data.map(d => ({
        id: d.id,
        slug: d.slug,
        type: d.type,
        service: d.type,
        title: d.title,
        location: d.location,
        price: d.base_price,
        duration: d.duration,
        category: d.category,
        rating: d.rating,
        reviews: d.reviews_count,
        status: d.status,
        image: d.thumbnail_image,
        isCampaignPinned: d.is_hero_campaign,
        campaignTitle: d.campaign_title,
        campaignDescription: d.campaign_description,
        campaignLabel: d.campaign_label,
        tourTiers: d.pricing_tiers ? d.pricing_tiers.map(pt => ({ pax: pt.min_pax, price: pt.price })) : [],
        itinerary: d.itineraries || [],
        ...(d.metadata || {}),
        gallery_images: d.metadata?.gallery_images || [],
        description: d.metadata?.description || "",
        highlights: d.metadata?.highlights || "",
        faq: d.metadata?.faq || [],
        isBestTripPinned: d.metadata?.is_best_trip_pinned || false,
        pricingType: d.metadata?.pricingType || "Per Person",
        groupPricingMode: d.metadata?.groupPricingMode || "flat",
        groupPrice: d.metadata?.groupPrice || d.base_price,
        minGroupPax: d.metadata?.minGroupPax || 1,
        maxGroupPax: d.metadata?.maxGroupPax || 12,
        groupTiers: d.metadata?.groupTiers || []
      }));
    } catch {
      return [];
    }
  },
  ['homepage-listings'],
  { revalidate: 3600, tags: ['listings'] }
);

export const getActiveListings = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, slug, type, title, location, base_price, duration, category, rating, reviews_count, status, thumbnail_image, is_hero_campaign, campaign_title, campaign_description, campaign_label, metadata, pricing_tiers(*), itineraries(*)')
        .eq('status', 'Active');
      if (error || !data || data.length === 0) {
        return [];
      }
      return data.map(d => ({
        id: d.id,
        slug: d.slug,
        type: d.type,
        service: d.type,
        title: d.title,
        location: d.location,
        price: d.base_price,
        duration: d.duration,
        category: d.category,
        rating: d.rating,
        reviews: d.reviews_count,
        status: d.status,
        image: d.thumbnail_image,
        isCampaignPinned: d.is_hero_campaign,
        campaignTitle: d.campaign_title,
        campaignDescription: d.campaign_description,
        campaignLabel: d.campaign_label,
        tourTiers: d.pricing_tiers ? d.pricing_tiers.map(pt => ({ pax: pt.min_pax, price: pt.price })) : [],
        itinerary: d.itineraries || [],
        ...(d.metadata || {}),
        gallery_images: d.metadata?.gallery_images || [],
        description: d.metadata?.description || "",
        highlights: d.metadata?.highlights || "",
        faq: d.metadata?.faq || [],
        isBestTripPinned: d.metadata?.is_best_trip_pinned || false,
        pricingType: d.metadata?.pricingType || "Per Person",
        groupPricingMode: d.metadata?.groupPricingMode || "flat",
        groupPrice: d.metadata?.groupPrice || d.base_price,
        minGroupPax: d.metadata?.minGroupPax || 1,
        maxGroupPax: d.metadata?.maxGroupPax || 12,
        groupTiers: d.metadata?.groupTiers || []
      }));
    } catch {
      return [];
    }
  },
  ['active-listings'],
  { revalidate: 3600, tags: ['listings'] }
);

export const getPublishedBlogs = unstable_cache(
  async (limit = 4) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, image, category, created_at, meta_description, content')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },
  ['published-blogs'],
  { revalidate: 3600, tags: ['blogs'] }
);

export const getHomepageSettings = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('campaign_video, campaign_youtube_link, campaign_recommendation, campaign_ig_link, campaign_recommendation_2, campaign_ig_link_2')
        .eq('id', 1)
        .single();
      if (error || !data) {
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  ['homepage-settings'],
  { revalidate: 3600, tags: ['homepage_settings'] }
);
