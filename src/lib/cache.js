import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

export const getHomepageListings = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, slug, type, title, location, base_price, duration, category, rating, reviews, status, main_image, gallery_images, description, highlights, included, excluded, what_to_bring, faq, policies, is_hero_campaign, campaign_title, campaign_description, campaign_label, is_best_trip_pinned, pricing_tiers(*), itineraries(*)')
        .eq('status', 'Active');
      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
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
      const { data, error } = await supabase.from('listings').select('*').eq('status', 'Active');
      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
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
