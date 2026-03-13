import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { User, Users, Home, Sparkles } from 'lucide-react';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const isSplash = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/auth';
  const isLanding = location.pathname === '/home';

  // Hide header on splash, admin, auth, and landing pages
  if (isAdminRoute || isSplash || isAuthPage || isLanding) return null;

  let auth = null;
  try {
    auth = useAuth();
  } catch (e) {
    // AuthProvider not ready yet
  }

  const isLoggedIn = auth?.isAuthenticated;

  return (
    <header className="header glass-panel">
      <div className="container header-container">
        {isLoggedIn && (
          <>
            <Link to="/home" className="header-logo" style={{ textDecoration: 'none', color: 'var(--color-accent-main)', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>
              JAGUARS REGION
            </Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/directory" className="dash-link">
                <Users size={16} /> Directory
              </Link>
              <Link to="/my-region" className="dash-link">
                <Sparkles size={16} /> Region
              </Link>
              <Link to="/dashboard" className="dash-link">
                <User size={16} /> Profile
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
