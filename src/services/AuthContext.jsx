import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load member profile for authenticated user
  const loadProfile = async (authUser) => {
    if (!authUser) {
      setMemberProfile(null);
      return;
    }
    const { data } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', authUser.id)
      .single();
    setMemberProfile(data || null);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      loadProfile(currentUser).then(() => setLoading(false));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        await loadProfile(currentUser);
      }
    );

    return () => subscription.unsubscribe();
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
