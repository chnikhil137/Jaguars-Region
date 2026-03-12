import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';
import './Success.css';

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user didn't just register, bounce them to home
    if (!location.state?.success) {
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div className="success-page animate-fade-in">
      <div className="container">
        <div className="success-card glass-panel">
          <div className="success-icon-wrapper">
            <CheckCircle className="success-icon" size={64} />
          </div>
          
          <h1 className="success-title">Welcome to the Jaguars!</h1>
          <p className="success-subtitle">
            Your profile has been successfully created. You are now officially part of the most dynamic film production community.
          </p>

          <div className="cta-box">
            <h3 style={{color: '#ff4444'}}>MANDATORY FINAL STEP: Join WhatsApp</h3>
            <p>You must compulsorily join the WhatsApp community to officially become a part of Jaguars Region and have your profile displayed.</p>
            
            <a href="https://chat.whatsapp.com/LSALJx4UyIA2KKyrBT7EEY" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <MessageCircle size={20} />
              Join WhatsApp Community
            </a>
          </div>

          <div className="return-link">
            <Link to="/" className="back-home-link">
              Return to Directory <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        
        {/* Toast notification component implicitly handled here for simplicity */}
        <div className="toast glass-panel toast-success">
          <CheckCircle size={18} /> Profile created successfully.
        </div>
      </div>
    </div>
  );
}
