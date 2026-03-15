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
      console.error("Profile load error:", import.meta.env.DEV ? err : "Auth error");
      setMemberProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout: Ensure loading screen clears eventually (max 3s)
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth initialization timed out, clearing loading state.");
        setLoading(false);
      }
    }, 3000);

    // Use ONLY onAuthStateChange for session management.
    // Do NOT call getSession() separately — this causes lock contention
    // and the "broken by another request with stale option" error.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          // Defer profile load to avoid blocking auth state change
          // Use setTimeout to break out of the onAuthStateChange callback
          // which holds the navigator lock
          setTimeout(async () => {
            if (mounted) {
              await loadProfile(currentUser);
              if (mounted) {
                setLoading(false);
                clearTimeout(timeout);
              }
            }
          }, 0);
        } else {
          setMemberProfile(null);
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

  const refreshProfile = async () => {
    // Get fresh user to avoid stale session issues
    const { data: { user: freshUser } } = await supabase.auth.getUser();
    if (freshUser) {
      setUser(freshUser);
      await loadProfile(freshUser);
    }
  };

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
