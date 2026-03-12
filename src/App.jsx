import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
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
              <Route path="/" element={<SplashScreen />} />
              <Route path="/home" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/joined" element={<Success />} />
              
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
