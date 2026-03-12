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
        {isHome && !isLoggedIn && (
          <Link to="/auth" className="cta-link">
            ✦ Be a Jaguar — join our film community →
          </Link>
        )}
        {isHome && isLoggedIn && !hasProfile && (
          <Link to="/register" className="cta-link">
            ✦ Complete your Jaguars profile →
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/dashboard" className="dash-link">
            <User size={16} /> My Profile
          </Link>
        )}
      </div>
    </header>
  );
}
