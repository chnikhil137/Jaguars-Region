import React, { useState, useEffect } from 'react';
import { useStore } from '../services/store';
import FilterBar from '../components/FilterBar';
import DirectoryCard from '../components/DirectoryCard';

export default function Home() {
  const { users, isLoading } = useStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    let filtered = users;
    if (activeFilter !== 'All') {
      filtered = users.filter(user => user.role.includes(activeFilter));
    }
    // Sort primarily by creation date (newest first)
    const sorted = [...filtered].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setFilteredUsers(sorted);
  }, [users, activeFilter]);

  return (
    <div className="home-page animate-fade-in">
      <FilterBar 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #fff, var(--color-accent-main))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Connect with Jaguars
          </h2>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="masonry-grid">
            {filteredUsers.map(user => (
              <DirectoryCard key={user.id} user={user} />
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
