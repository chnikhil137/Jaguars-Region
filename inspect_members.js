
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspect() {
  const { data: members, error } = await supabase.from('members').select('*');
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Inspecting ${members.length} members:`);
  members.forEach(m => {
    console.log(`- ${m.name} (ID: ${m.id})`);
    console.log(`  Role: ${JSON.stringify(m.role)} (type: ${typeof m.role})`);
    console.log(`  User ID: ${m.user_id}`);
    if (!Array.isArray(m.role)) {
      console.log(`  !!! ROLE IS NOT AN ARRAY !!!`);
    }
  });
}

inspect();
