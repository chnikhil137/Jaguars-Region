import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide footer on auth and admin pages
  const hiddenPaths = ['/auth', '/admin'];
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.startsWith('/admin'))) {
    return null;
  }

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">JAGUARS REGION</div>
          <p className="footer-desc">
            The most aggressive filmmaking community. Connect with fellow filmmakers, learn, grow, and create cinematic masterpieces together.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <span className="footer-links-title">Navigate</span>
          <button className="footer-link" onClick={() => navigate('/')}>Home</button>
          <button className="footer-link" onClick={() => navigate('/directory')}>Connect with Jaguars</button>
          <button className="footer-link" onClick={() => navigate('/my-region')}>My Jaguars Region</button>
          <button className="footer-link" onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }) || navigate('/')}>About Us</button>
        </div>

        {/* Account + Contact */}
        <div className="footer-links">
          <span className="footer-links-title">Account</span>
          <button className="footer-link" onClick={() => navigate('/dashboard')}>My Profile</button>
          <button className="footer-link" onClick={() => navigate('/register')}>Become a Jaguar</button>
        </div>

        <div className="footer-links">
          <span className="footer-links-title">Support</span>
          <a href="mailto:contact@jaguarsregion.in" className="footer-link footer-email-link">
            <Mail size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            contact@jaguarsregion.in
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copyright">
          © {new Date().getFullYear()} Jaguars Region. All rights reserved.
        </span>
        <span className="footer-tagline">Built for filmmakers, by filmmakers.</span>
      </div>
    </footer>
  );
}
