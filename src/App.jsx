import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import MyRegion from './pages/MyRegion';
import Register from './pages/Register';
import Success from './pages/Success';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import RecruitmentPopup from './components/RecruitmentPopup';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

const ProtectedRoute = ({ children, requireProfile = false, redirectIfProfile = false }) => {
  const { user, memberProfile, loading } = useAuth();
  
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid rgba(229,9,20,0.2)', borderTopColor: '#E50914', borderRadius: '50%', animation: 'protectedSpin 0.6s linear infinite' }} />
        <span style={{ color: '#666', fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Jaguars Region</span>
      </div>
      <style>{`@keyframes protectedSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  if (requireProfile && !memberProfile) return <Navigate to="/register" replace />;
  if (redirectIfProfile && memberProfile) return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="app-container">
            <Header />
            <RecruitmentPopup />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Backwards compat redirect */}
                <Route path="/home" element={<Navigate to="/" replace />} />
                
                {/* Routes that only require being logged in */}
                <Route path="/register" element={<ProtectedRoute redirectIfProfile><Register /></ProtectedRoute>} />
                <Route path="/joined" element={<ProtectedRoute><Success /></ProtectedRoute>} />
                <Route path="/directory" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/my-region" element={<ProtectedRoute><MyRegion /></ProtectedRoute>} />
                
                {/* Routes that require being logged in AND having a profile */}
                <Route path="/dashboard" element={<ProtectedRoute requireProfile><Dashboard /></ProtectedRoute>} />
                
                {/* Secret Admin Route */}
                <Route 
                  path="/admin" 
                  element={
                    isAdminAuthenticated ? 
                    <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} /> : 
                    <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
                  } 
                />
                
                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
