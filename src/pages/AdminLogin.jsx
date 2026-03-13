import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';
import './Admin.css';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check for existing session on mount
  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === ADMIN_EMAIL) {
        // If they have the correct session, we still ask for the admin password 
        // to maintain the "Access Control" layer, OR we can auto-login
        // For now, let's at least pre-fill the email
        setEmail('chnikhil137@gmail.com');
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      if (cleanEmail !== ADMIN_EMAIL) {
        throw new Error('Unrecognised personnel.');
      }

      // 1. First, check if we already have a session for this user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email !== cleanEmail) {
        // We must authenticate with Supabase so RLS allows fetching users and leads
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });
        
        if (signInError) {
          if (signInError.status === 400) {
            throw new Error('Invalid credentials. If you use Google to sign in, please use the "Login with Google" button below.');
          }
          throw signInError;
        }
      }

      // 2. Maintain the hardcoded check for the central unit UI
      if (cleanPassword === ADMIN_PASSWORD) {
        onLogin();
      } else {
        throw new Error('Access Denied: Invalid admin password.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-login-card glass-panel">
        <button className="back-btn" onClick={() => navigate('/')}>
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

        <div className="auth-divider" style={{margin: '1.5rem 0'}}>
          <span>OR</span>
        </div>

        <button type="button" className="auth-google-btn" onClick={handleGoogleLogin} disabled={isLoading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
          Continue with Google Admin
        </button>
      </div>
    </div>
  );
}
