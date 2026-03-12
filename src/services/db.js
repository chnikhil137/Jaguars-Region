import { supabase } from './supabase';

// Fetch all members from Supabase
export async function getUsers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('stars', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data || [];
}

// Add a new member to Supabase
export async function addUser(userData) {
  const newUser = {
    name: userData.name,
    role: userData.role || [],
    location: userData.location || 'Not Specified',
    bio: userData.bio || '',
    contact_email: userData.contact_email || '',
    contact_phone: userData.contact_phone || '',
    custom_links: userData.custom_links || [],
    stars: 0,
    user_id: userData.user_id || null
  };

  const { data, error } = await supabase
    .from('members')
    .upsert([newUser], { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Error adding member:', error);
    return null;
  }

  window.dispatchEvent(new Event('db_updated'));
  return data;
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
    console.error('Error updating member:', error);
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
  const { data, error } = await supabase.rpc('toggle_upvote', { target_member_id: memberId });
  
  if (error) {
    console.error('Error toggling upvote:', error);
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
    console.error('Error fetching user upvotes:', error);
    return [];
  }
  return data.map(v => v.member_id);
}

// Submit a lead application
export async function submitLead(leadData) {
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
    console.error('Error submitting lead:', error);
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
    console.error('Error fetching leads:', error);
    return [];
  }
  return data || [];
}

// Delete a member (admin only)
export async function deleteUser(memberId) {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('Error deleting member:', error);
    return false;
  }
  
  window.dispatchEvent(new Event('db_updated'));
  return true;
}
