import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { User } from 'lucide-react';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/home';
  const isSplash = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/auth';

  // Hide header on splash, admin, and auth pages
  if (isAdminRoute || isSplash || isAuthPage) return null;

  let auth = null;
  try {
    auth = useAuth();
  } catch (e) {
    // AuthProvider not ready yet
  }

  const isLoggedIn = auth?.isAuthenticated;
  const hasProfile = auth?.hasProfile;

  return (
    <header className="header glass-panel">
      <div className="container header-container">
        {isLoggedIn && (
          <>
            <Link to="/home" className="header-logo" style={{ textDecoration: 'none', color: 'var(--color-accent-main)', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>
              JAGUARS REGION
            </Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/dashboard" className="dash-link">
                <User size={16} /> My Profile
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
