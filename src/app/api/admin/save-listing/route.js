import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { generateTourReviews } from '@/lib/reviews-generator';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { safeDbPayload, tiersToInsert, itinsToInsert, id } = body;

    const supabase = getSupabase();

    // 0. Auto-generate reviews for new tours
    if (!safeDbPayload.reviews_count || safeDbPayload.reviews_count === 0) {
      const reviewCount = Math.floor(Math.random() * (70 - 45 + 1)) + 45; // 45 to 70
      const generatedReviews = generateTourReviews(safeDbPayload.title, safeDbPayload.location, reviewCount);
      
      const newMetadata = safeDbPayload.metadata || {};
      newMetadata.reviewsList = generatedReviews;
      
      safeDbPayload.metadata = newMetadata;
      safeDbPayload.reviews_count = reviewCount;
      safeDbPayload.rating = 5;
    }

    // 1. Upsert Listing
    const { error: listingError } = await supabase.from('listings').upsert(safeDbPayload);
    if (listingError) {
      console.error("Listing save error:", listingError);
      return NextResponse.json({ error: listingError.message }, { status: 400 });
    }

    // 2. Upsert Pricing Tiers
    await supabase.from('pricing_tiers').delete().eq('listing_id', id);
    if (tiersToInsert && tiersToInsert.length > 0) {
      const { error: tiersError } = await supabase.from('pricing_tiers').insert(tiersToInsert);
      if (tiersError) console.error("Tiers save error:", tiersError);
    }

    // 3. Upsert Itineraries
    await supabase.from('itineraries').delete().eq('listing_id', id);
    if (itinsToInsert && itinsToInsert.length > 0) {
      const { error: itinsError } = await supabase.from('itineraries').insert(itinsToInsert);
      if (itinsError) console.error("Itineraries save error:", itinsError);
    }

    // Revalidate the Next.js cache for the main website
    revalidateTag('listings');

    // Asynchronously trigger storage cleanup (fire and forget)
    // We construct the absolute URL based on the request
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    fetch(`${protocol}://${host}/api/admin/cleanup-storage`, { method: 'POST' }).catch(e => console.error(e));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Save listing server error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
