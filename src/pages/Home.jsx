import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useStore } from '../services/store';
import { useAuth } from '../services/AuthContext';
import { toggleUpvote, getUserUpvotes } from '../services/db';
import FilterBar from '../components/FilterBar';
import DirectoryCard from '../components/DirectoryCard';

export default function Home() {
  const { users, isLoading: storeLoading } = useStore();
  const { user: currentUser, memberProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userUpvotes, setUserUpvotes] = useState([]);

  useEffect(() => {
    const fetchUpvotes = async () => {
      const upvotedIds = await getUserUpvotes();
      setUserUpvotes(upvotedIds);
    };
    fetchUpvotes();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (activeFilter !== 'All') {
      filtered = users.filter(user => user.role.includes(activeFilter));
    }
    
    // Custom sort: My card first, then by stars/date
    const sorted = [...filtered].sort((a, b) => {
      if (currentUser) {
        if (a.user_id === currentUser.id) return -1;
        if (b.user_id === currentUser.id) return 1;
      }
      return (b.stars || 0) - (a.stars || 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setFilteredUsers(sorted);
  }, [users, activeFilter, currentUser]);

  const handleUpvote = async (memberId) => {
    const added = await toggleUpvote(memberId);
    if (added !== null) {
      if (added) {
        setUserUpvotes(prev => [...prev, memberId]);
      } else {
        setUserUpvotes(prev => prev.filter(id => id !== memberId));
      }
    }
  };

  return (
    <div className="home-page animate-fade-in">
      <FilterBar 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div id="connect-with-jaguars" style={{ marginBottom: '2rem', textAlign: 'center', paddingTop: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem', background: 'linear-gradient(to right, #fff, var(--color-accent-main))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Connect with Jaguars
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.6rem', lineHeight: '1.5', maxWidth: '600px', margin: '0.6rem auto 0 auto' }}>
            Dive into the most aggressive film community. Discover powerful members, connect over shared visions, and collaborate to create cinematic masterpieces.
          </p>
        </div>

        {currentUser && !memberProfile && (
          <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--color-accent-main)', background: 'rgba(255, 68, 68, 0.05)' }}>
            <div>
              <h3 style={{color: 'var(--color-accent-main)', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Plus size={20} /> Create Your Profile
              </h3>
              <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)'}}>You are logged in, but you haven't joined the directory yet.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => navigate('/register')} style={{ padding: '0.6rem 1.2rem' }}>
                 Become a Jaguar
              </button>
            </div>
          </div>
        )}

        {storeLoading ? (
          <div className="masonry-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ height: '1.2rem', width: '60%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', animation: 'homeSkelShimmer 1.5s ease-in-out infinite' }} />
                  <div style={{ height: '0.8rem', width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', animation: 'homeSkelShimmer 1.5s ease-in-out 0.2s infinite' }} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <div style={{ height: '1.5rem', width: '4rem', background: 'rgba(255,255,255,0.04)', borderRadius: '9999px', animation: 'homeSkelShimmer 1.5s ease-in-out 0.4s infinite' }} />
                    <div style={{ height: '1.5rem', width: '5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '9999px', animation: 'homeSkelShimmer 1.5s ease-in-out 0.6s infinite' }} />
                  </div>
                </div>
                <style>{`@keyframes homeSkelShimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
              </div>
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="masonry-grid">

            {filteredUsers.map(user => (
              <DirectoryCard 
                key={user.id} 
                user={user} 
                isUpvoted={userUpvotes.includes(user.id)}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <h3>No Jaguars found for this role.</h3>
            <p>Be the first to join Jaguars Region as a {activeFilter}!</p>
          </div>
        )}
      </div>
    </div>
  );
}
