import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

export const getHomepageListings = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, type, title, location, price, duration, category, rating, reviews, status, image, company_name, originalService:data->originalService, isCampaignPinned:data->isCampaignPinned, campaignTitle:data->campaignTitle, campaignDescription:data->campaignDescription, campaignLabel:data->campaignLabel, campaignVideo:data->campaignVideo, campaignYoutubeLink:data->campaignYoutubeLink, campaignRecommendation:data->campaignRecommendation, campaignIgLink:data->campaignIgLink, isBestTripPinned:data->isBestTripPinned, spaSetting:data->spaSetting, tourTiers:data->tourTiers, groupTiers:data->groupTiers, minGroupPax:data->minGroupPax, maxGroupPax:data->maxGroupPax, groupPricingMode:data->groupPricingMode, allInclusiveTiers:data->allInclusiveTiers, allInclusiveSurcharge:data->allInclusiveSurcharge, pricingType:data->pricingType, min60:data->min60, min90:data->min90, min120:data->min120, dailyPrice:data->dailyPrice, weeklyPrice:data->weeklyPrice, monthlyPrice:data->monthlyPrice, badge:data->badge')
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
