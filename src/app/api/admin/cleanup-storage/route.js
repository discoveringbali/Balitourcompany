import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export async function POST(req) {
  try {
    const supabase = getSupabase();
    const bucket = 'discovering_bali_images';

    // 1. Fetch all used images from listings
    const { data: listings } = await supabase.from('listings').select('thumbnail_image, metadata');
    
    // 2. Fetch all used images from homepage_settings
    const { data: settings } = await supabase.from('homepage_settings').select('campaign_video, campaign_youtube_link, metadata');

    const usedPaths = new Set();
    const extractPath = (url) => {
      if (!url) return null;
      const parts = url.split(`/public/${bucket}/`);
      return parts.length === 2 ? parts[1] : null;
    };

    // Collect paths from listings
    if (listings) {
      listings.forEach(listing => {
        if (listing.thumbnail_image) {
          const path = extractPath(listing.thumbnail_image);
          if (path) usedPaths.add(path);
        }
        if (listing.metadata?.gallery_images) {
          listing.metadata.gallery_images.forEach(img => {
            const path = extractPath(img);
            if (path) usedPaths.add(path);
          });
        }
      });
    }

    // Collect paths from homepage_settings
    if (settings && settings[0]) {
      const s = settings[0];
      if (s.campaign_video) {
        const path = extractPath(s.campaign_video);
        if (path) usedPaths.add(path);
      }
      if (s.metadata) {
        // assuming scooter/spa images are in metadata
        Object.values(s.metadata).forEach(val => {
          if (val && typeof val === 'object' && val.image) {
            const path = extractPath(val.image);
            if (path) usedPaths.add(path);
          }
        });
      }
    }

    // 3. List all files in Supabase Storage
    const folders = ['cover_images', 'gallery', 'campaigns'];
    let deletedCount = 0;

    for (const folder of folders) {
      const { data: files, error } = await supabase.storage.from(bucket).list(folder, { limit: 1000 });
      if (error || !files) continue;

      const pathsToDelete = [];
      for (const file of files) {
        if (file.name === '.emptyFolderPlaceholder') continue;
        const fullPath = `${folder}/${file.name}`;
        
        if (!usedPaths.has(fullPath)) {
          pathsToDelete.push(fullPath);
        }
      }

      if (pathsToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage.from(bucket).remove(pathsToDelete);
        if (!deleteError) {
          deletedCount += pathsToDelete.length;
        }
      }
    }

    return NextResponse.json({ success: true, deletedCount }, { status: 200 });
  } catch (error) {
    console.error("Cleanup server error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
