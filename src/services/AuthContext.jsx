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
    let initialized = false;

    // Safety timeout: Ensure loading screen clears eventually (max 3s)
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth initialization timed out, clearing loading state.");
        setLoading(false);
      }
    }, 3000);

    const initialize = async (session) => {
      if (!mounted || initialized) return;
      initialized = true;
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser);
      } else {
        setMemberProfile(null);
      }
      if (mounted) {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    // 1. Listen for auth state changes (includes INITIAL_SESSION event)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === 'INITIAL_SESSION') {
          initialize(session);
        } else {
          // For subsequent auth changes (sign in, sign out, token refresh)
          const currentUser = session?.user || null;
          setUser(currentUser);
          if (currentUser) {
            await loadProfile(currentUser);
          } else {
            setMemberProfile(null);
          }
        }
      }
    );

    // 2. Fallback: if onAuthStateChange doesn't fire quickly, use getSession
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && !initialized) initialize(session);
    });

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
