const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://jnpyxizujvtbvqyvewbd.supabase.co";
const supabaseKey = "sb_publishable_tpd3e-1kI6yxwZDGZpnd6A_ePwq2JMd";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('blogs')
    .select('title, slug, content')
    .limit(10);
    
  if (error) console.error("Error:", error);
  else {
    const target = data.find(d => d.title.includes("Bali Travel Itinerary"));
    console.log(target?.content.substring(1340, 2500));
  }
}
run();
