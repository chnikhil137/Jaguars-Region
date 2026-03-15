import { supabase } from './supabase';

// Fetch all members from Supabase
export async function getUsers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('stars', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching members:', import.meta.env.DEV ? error : 'Internal server error');
    return [];
  }
  return data || [];
}

// Rate limiting cache
const rateLimitCache = {};

const checkRateLimit = (key, limitMs = 3000) => {
  const now = Date.now();
  if (rateLimitCache[key] && (now - rateLimitCache[key]) < limitMs) {
    return false; // Rate limited
  }
  rateLimitCache[key] = now;
  return true;
};

// Add a new member to Supabase
export async function addUser(userData) {
  if (!checkRateLimit('addUser', 5000)) {
    console.warn('Rate limit exceeded for addUser');
    return null;
  }

  // Always get fresh user to avoid stale session errors
  const { data: { user: freshUser }, error: userError } = await supabase.auth.getUser();
  if (userError || !freshUser) {
    throw new Error('Authentication expired. Please refresh the page and try again.');
  }

  const newUser = {
    name: userData.name,
    role: userData.role || [],
    location: userData.location || 'Not Specified',
    gender: userData.gender || '',
    language: userData.language || '',
    bio: userData.bio || '',
    contact_email: userData.contact_email || '',
    contact_phone: userData.contact_phone || '',
    custom_links: userData.custom_links || [],
    stars: 0,
    user_id: freshUser.id // Use fresh user ID, not potentially stale one
  };

  // Attempt upsert with retry on auth errors
  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { data, error } = await supabase
      .from('members')
      .upsert([newUser], { onConflict: 'user_id' })
      .select()
      .single();

    if (!error) {
      window.dispatchEvent(new Event('db_updated'));
      return data;
    }

    lastError = error;
    
    // If it's an auth/session error, try refreshing the session once
    if (attempt === 0 && (error.message?.includes('JWT') || error.code === 'PGRST301' || error.message?.includes('stale'))) {
      console.warn('Session error during addUser, refreshing session...');
      await supabase.auth.refreshSession();
      continue;
    }
    
    break; // Non-auth error, don't retry
  }

  console.error('Error adding member:', import.meta.env.DEV ? lastError : 'Internal server error');
  throw new Error(lastError?.message || 'Error adding member to database');
}

// Update a member's profile
export async function updateUser(memberId, updates) {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single();

  if (error) {
    console.error('Error updating member:', import.meta.env.DEV ? error : 'Internal server error');
    return null;
  }

  window.dispatchEvent(new Event('db_updated'));
  return data;
}

// Get member profile by auth user ID
export async function getMemberByAuthId(authId) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', authId)
    .single();

  if (error) {
    return null;
  }
  return data;
}

// Toggle upvote (1 per user)
export async function toggleUpvote(memberId) {
  if (!checkRateLimit(`upvote_${memberId}`, 1500)) {
    console.warn('Rate limit exceeded for toggleUpvote');
    return null;
  }
  const { data, error } = await supabase.rpc('toggle_upvote', { target_member_id: memberId });
  
  if (error) {
    console.error('Error toggling upvote:', import.meta.env.DEV ? error : 'Internal server error');
    return null;
  }

  window.dispatchEvent(new Event('db_updated'));
  return data; // Returns true if added, false if removed
}

// Fetch upvotes for the current user to show active state
export async function getUserUpvotes() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('member_upvotes')
    .select('member_id')
    .eq('voter_id', user.id);

  if (error) {
    console.error('Error fetching user upvotes:', import.meta.env.DEV ? error : 'Internal server error');
    return [];
  }
  return data.map(v => v.member_id);
}

// Submit a lead application
export async function submitLead(leadData) {
  if (!checkRateLimit('submitLead', 10000)) {
    console.warn('Rate limit exceeded for submitLead');
    return null;
  }
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: leadData.name,
      contact: leadData.contact,
      role_interest: leadData.roleInterest,
      experience: leadData.experience
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting lead:', import.meta.env.DEV ? error : 'Internal server error');
    return null;
  }
  return data;
}

// Fetch all leads (admin only)
export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', import.meta.env.DEV ? error : 'Internal server error');
    return [];
  }
  return data || [];
}

// Delete own profile (user deletes their own member entry)
export async function deleteOwnProfile() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('Auth error during delete:', authError);
    return false;
  }

  // Try RPC function first (bypasses RLS via SECURITY DEFINER)
  const { error: rpcError } = await supabase.rpc('delete_own_profile');
  
  if (!rpcError) {
    window.dispatchEvent(new Event('db_updated'));
    return true;
  }

  // Fallback: direct delete by user_id
  console.warn('RPC delete failed, trying direct delete:', rpcError.message);
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting profile:', import.meta.env.DEV ? error : 'Internal server error');
    return false;
  }
  
  window.dispatchEvent(new Event('db_updated'));
  return true;
}

// Delete a member by ID (admin only)
export async function deleteUser(memberId) {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('Error deleting member:', import.meta.env.DEV ? error : 'Internal server error');
    return false;
  }
  
  window.dispatchEvent(new Event('db_updated'));
  return true;
}
