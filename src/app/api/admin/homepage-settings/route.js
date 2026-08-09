import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidateTag, revalidatePath } from 'next/cache';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export async function POST(req) {
  try {
    const payload = await req.json();
    const supabase = getSupabase();

    // Upsert directly using service role key (bypasses RLS)
    const { error } = await supabase.from('homepage_settings').upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error("Homepage settings save error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateTag('homepage_settings');
    revalidatePath('/');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Homepage settings server error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
