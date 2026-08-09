import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';



const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const bucket = formData.get('bucket') || 'discovering_bali_images';
    const filePath = formData.get('filePath');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabase = getSupabase();
    
    // Upload directly using service role key (bypasses RLS completely!)
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      upsert: true,
      cacheControl: '3600'
    });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload server error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
