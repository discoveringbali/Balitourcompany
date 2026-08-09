import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { safeDbPayload, tiersToInsert, itinsToInsert, id } = body;

    const supabase = getSupabase();

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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Save listing server error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
