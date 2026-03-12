import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';
import './Admin.css';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const cleanEmail = email.trim();
      if (cleanEmail !== 'cheichill137@gmail.com') {
        throw new Error('Unrecognised personnel.');
      }

      // We must authenticate with Supabase so RLS allows fetching users and leads
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password.trim()
      });
      
      if (signInError) {
        if (signInError.status === 400) {
          throw new Error('Invalid credentials or account does not exist.');
        }
        throw signInError;
      }

      // Maintain the hardcoded check for the central unit UI
      if (password.trim() === 'Nikhilch@031106') {
        onLogin();
      } else {
        await supabase.auth.signOut();
        throw new Error('Access Denied: Invalid admin password.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-login-card glass-panel">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} /> Back to Directory
        </button>
        
        <div className="admin-header">
          <div className="lock-icon-wrap">
            <Lock size={32} />
          </div>
          <h2>Admin Access</h2>
          <p>Authorised personnel only.</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-form">
          <div className="form-group">
            <label>Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@jaguars.com"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Access Central Unit'}
          </button>
        </form>
      </div>
    </div>
  );
}
