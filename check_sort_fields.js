
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspect() {
  const { data: members, error } = await supabase.from('members').select('id, name, created_at, stars');
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Members with dates:`);
  members.forEach(m => {
    console.log(`- ${m.name}: ${m.created_at} (Stars: ${m.stars})`);
  });
}

inspect();
