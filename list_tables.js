
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listTables() {
  const { data, error } = await supabase.from('members').select('id').limit(1);
  if (error) console.log('Members table access error:', error);
  else console.log('Members table exists.');

  const { data: leads, error: lError } = await supabase.from('leads').select('id').limit(1);
  if (lError) console.log('Leads table access error:', lError);
  else console.log('Leads table exists.');

  // Check for other common names
  const common = ['users', 'profiles', 'jaguars', 'players'];
  for (const table of common) {
    const { error: e } = await supabase.from(table).select('id').limit(1);
    if (!e) console.log(`Table ${table} exists!`);
  }
}

listTables();
