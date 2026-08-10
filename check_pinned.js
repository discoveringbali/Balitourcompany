require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('listings').select('id, title, data');
  const pinned = data.filter(d => d.data.isCampaignPinned === true);
  console.log("Pinned:", pinned.length);
}
check();
