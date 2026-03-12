import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film } from 'lucide-react';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/home';
  const isSplash = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute || isSplash) return null;

  return (
    <header className="header glass-panel">
      <div className="container header-container">
        <Link to="/" className="logo">
          <h1>Jaguars Region</h1>
        </Link>
        
        {isHome && (
          <Link to="/register" className="btn btn-primary cta-button">
            Be a Jaguar, join our film community
          </Link>
        )}
      </div>
    </header>
  );
}
