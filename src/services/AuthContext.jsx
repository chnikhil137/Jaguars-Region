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

    async function initializeAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const currentUser = session?.user || null;
        if (mounted) {
          setUser(currentUser);
          await loadProfile(currentUser);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        const currentUser = session?.user || null;
        setUser(currentUser);
        await loadProfile(currentUser);
        setLoading(false); // Ensure loading is off if event triggers early
      }
    );

    return () => {
      mounted = false;
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
