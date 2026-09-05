import HomeClient from './HomeClient';
import { getHomepageListings, getPublishedBlogs, getHomepageSettings } from '@/lib/cache';

// Cache this page for 1 hour (3600 seconds) on the CDN
export const revalidate = 3600;

export default async function Page() {

  const listingsData = await getHomepageListings();
  
  const initialListings = (listingsData || []).map(d => {
    let parsedImage = d.image;
    if (Array.isArray(d.image)) {
      parsedImage = d.image[0] || "";
    } else if (typeof d.image === 'string') {
      try {
        const parsed = JSON.parse(d.image);
        if (Array.isArray(parsed)) parsedImage = parsed[0] || "";
      } catch (e) {}
    }
    return {
      ...d,
      image: parsedImage,
      service: d.originalService || d.type
    };
  });

  // Fetch blogs
  const initialBlogs = await getPublishedBlogs(4);

  // Fetch settings
  const settingsData = await getHomepageSettings();

  const initialSettings = settingsData ? {
    campaignVideo: settingsData.campaign_video || "",
    campaignYoutubeLink: settingsData.campaign_youtube_link || "",
    campaignRecommendation: settingsData.campaign_recommendation || "",
    campaignIgLink: settingsData.campaign_ig_link || "",
    campaignRecommendation2: settingsData.campaign_recommendation_2 || "",
    campaignIgLink2: settingsData.campaign_ig_link_2 || ""
  } : null;

  const initialCampaigns = settingsData?.metadata?.campaigns || null;
  const initialFlashSale = settingsData?.metadata?.flashSale || null;

  return (
    <HomeClient 
      initialListings={initialListings || []} 
      initialBlogs={initialBlogs || []} 
      initialSettings={initialSettings} 
      initialCampaigns={initialCampaigns}
      initialFlashSale={initialFlashSale}
    />
  );
}
