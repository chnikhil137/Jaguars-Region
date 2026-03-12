import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Success from './pages/Success';
import SplashScreen from './pages/SplashScreen';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import RecruitmentPopup from './components/RecruitmentPopup';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

const ProtectedRoute = ({ children, requireProfile = false }) => {
  const { user, memberProfile, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (requireProfile && !memberProfile) return <Navigate to="/register" replace />;
  
  return children;
};

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <RecruitmentPopup />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SplashScreen />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Routes that only require being logged in */}
              <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
              <Route path="/joined" element={<ProtectedRoute><Success /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              
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
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
