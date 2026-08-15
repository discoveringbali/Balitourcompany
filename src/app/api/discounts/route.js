import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data } = await supabase.from('homepage_settings').select('metadata').eq('id', 1).single();
    const discounts = data?.metadata?.discounts || [];
    return NextResponse.json(discounts);
  } catch (error) {
    console.error("Discounts API GET Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req) {
  try {
    const payload = await req.json();
    const supabase = getSupabase();
    
    const { data: currentData } = await supabase.from('homepage_settings').select('metadata').eq('id', 1).single();
    const newMetadata = { ...(currentData?.metadata || {}), discounts: payload };
    
    const { error } = await supabase.from('homepage_settings').upsert({ id: 1, metadata: newMetadata }, { onConflict: 'id' });
    
    if (error) {
       console.error("Save Discounts Error:", error);
       return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Discounts API POST Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
