import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
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
        <div style={{ marginBottom: '2rem', textAlign: 'center', paddingTop: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem', background: 'linear-gradient(to right, #fff, var(--color-accent-main))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
            Connect with Jaguars
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Browse our film community directory</p>
        </div>

        {filteredUsers.length > 0 || (!authLoading && !memberProfile) ? (
          <div className="masonry-grid">
            {/* Show "Join" card for logged in users without a profile */}
            {currentUser && !memberProfile && (
              <motion.div 
                className="directory-card join-card glass-panel"
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.02, y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ cursor: 'pointer', border: '2px dashed var(--color-accent-main)', background: 'rgba(255, 68, 68, 0.05)' }}
              >
                <div className="card-header" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                   <div style={{ marginBottom: '1rem', color: 'var(--color-accent-main)' }}>
                     <Plus size={40} />
                   </div>
                   <h3 style={{ color: 'var(--color-accent-main)' }}>Become a Jaguar</h3>
                   <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                     Create your profile to join the most aggressive film community.
                   </p>
                </div>
              </motion.div>
            )}

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
