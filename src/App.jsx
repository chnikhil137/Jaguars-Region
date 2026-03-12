import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Success from './pages/Success';
import SplashScreen from './pages/SplashScreen';
import Header from './components/Header';
import RecruitmentPopup from './components/RecruitmentPopup';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  // Simple auth state lifted up for the admin route
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  return (
    <Router>
      <div className="app-container">
        <Header />
        <RecruitmentPopup />
        <main>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
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
    </Router>
  );
}

export default App;
