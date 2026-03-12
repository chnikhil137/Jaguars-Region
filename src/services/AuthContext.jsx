import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load member profile for authenticated user
  const loadProfile = async (authUser) => {
    try {
      if (!authUser) {
        setMemberProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', authUser.id)
        .limit(1);
      
      if (error) throw error;
      setMemberProfile(data && data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error("Profile load error:", err);
      setMemberProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout: Ensure loading screen clears eventually (max 8s)
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth initialization timed out, clearing loading state.");
        setLoading(false);
      }
    }, 8000);

    // Initial check and subscription
    // onAuthStateChange fires for the INITIAL_SESSION in Supabase v2
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        // We only want to set loading to false AFTER we at least tried 
        // to load the profile, or if there is no user
        await loadProfile(currentUser);
        
        if (mounted) {
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = () => loadProfile(user);

  const value = {
    user,
    memberProfile,
    loading,
    refreshProfile,
    isAuthenticated: !!user,
    hasProfile: !!memberProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
