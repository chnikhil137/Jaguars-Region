
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log('Checking Members...');
  const { data: members, error: mError } = await supabase.from('members').select('id, name, user_id');
  if (mError) {
    console.error('Members Error:', mError);
  } else {
    console.log(`Found ${members.length} members:`, members);
  }

  console.log('\nChecking Leads...');
  const { data: leads, error: lError } = await supabase.from('leads').select('id, name');
  if (lError) {
    console.error('Leads Error:', lError);
  } else {
    console.log(`Found ${leads.length} leads:`, leads);
  }
}

check();
