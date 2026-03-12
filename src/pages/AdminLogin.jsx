import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import './Admin.css';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Hardcoded auth check per client specs
    setTimeout(() => {
      if (email === 'chnikhil137@gmail.com' && password === 'Nikhilch@031106') {
        onLogin();
      } else {
        setError('Invalid admin credentials.');
      }
      setIsLoading(false);
    }, 500);
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
