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
    stars: 0
  };

  const { data, error } = await supabase
    .from('members')
    .insert([newUser])
    .select()
    .single();

  if (error) {
    console.error('Error adding member:', error);
    return null;
  }

  // Dispatch event so other components can react
  window.dispatchEvent(new Event('db_updated'));
  return data;
}

// Upvote a member
export async function upvoteUser(userId) {
  // First get current stars
  const { data: member, error: fetchError } = await supabase
    .from('members')
    .select('stars')
    .eq('id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching member for upvote:', fetchError);
    return;
  }

  const { error: updateError } = await supabase
    .from('members')
    .update({ stars: (member.stars || 0) + 1 })
    .eq('id', userId);

  if (updateError) {
    console.error('Error upvoting member:', updateError);
    return;
  }

  window.dispatchEvent(new Event('db_updated'));
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
