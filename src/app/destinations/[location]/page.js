import DestinationClient from './DestinationClient';
import { getHomepageListings } from '@/lib/cache';

// Cache for 1 hour
export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const loc = resolvedParams.location || '';
  const capitalized = loc.charAt(0).toUpperCase() + loc.slice(1).replace(/-/g, ' ');
  return {
    title: `Things to do in ${capitalized} | Best Tours & Travel Guide`,
    description: `Discover the best things to do in ${capitalized}, Bali. Read our ultimate travel guide and book top-rated tours, private drivers, and experiences.`,
  };
}

export default async function DestinationPage({ params }) {
  const resolvedParams = await params;
  const loc = (resolvedParams.location || '').replace(/-/g, ' ');
  
  // Fetch listings to get tours matching this location
  const listingsData = await getHomepageListings();
  const allListings = (listingsData || []).map(d => {
    let parsedImage = d.image;
    let allImages = [];
    if (Array.isArray(d.image)) {
      allImages = d.image;
      parsedImage = d.image[0] || "";
    } else if (typeof d.image === 'string') {
      try {
        const parsed = JSON.parse(d.image);
        if (Array.isArray(parsed)) {
          allImages = parsed;
          parsedImage = parsed[0] || "";
        }
      } catch (e) {}
    }
    return {
      ...d,
      image: parsedImage,
      images: (allImages.length > 0 ? allImages : (d.gallery_images && d.gallery_images.length > 0 ? [parsedImage, ...d.gallery_images] : [parsedImage])),
      service: d.originalService || d.type
    };
  });

  return <DestinationClient locationSlug={loc} allListings={allListings} />;
}
