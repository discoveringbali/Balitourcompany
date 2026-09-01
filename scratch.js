const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://jnpyxizujvtbvqyvewbd.supabase.co";
const supabaseKey = "sb_publishable_tpd3e-1kI6yxwZDGZpnd6A_ePwq2JMd";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('blogs').select('title, slug');
  console.log(data);
}
run();
