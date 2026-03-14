import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  // Try signing in using admin credentials to get an active user_id
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: process.env.VITE_ADMIN_EMAIL,
    password: process.env.VITE_ADMIN_PASSWORD
  });

  if (authError) {
    console.error('Auth Error:', authError);
    return;
  }
  const userId = authData.user.id;
  console.log('Got user id:', userId);

  const newUser = {
    name: "Test User",
    role: ["Director"],
    location: "Test Location",
    gender: "Male",
    language: "English",
    bio: "Test bio here",
    contact_email: "test@example.com",
    contact_phone: "1234567890",
    custom_links: [],
    stars: 0,
    user_id: userId
  };

  const { data, error } = await supabase
    .from('members')
    .upsert([newUser], { onConflict: 'user_id' })
    .select()
    .single();
    
  if (error) {
    console.error('Insert Error Detail:', error);
  } else {
    console.log('Insert Success:', data);
  }
}

testInsert();
