import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, UserPlus, Star } from 'lucide-react';
import { submitLead } from '../services/db';
import './RecruitmentPopup.css';

export default function RecruitmentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    roleInterest: 'Co-founder',
    experience: ''
  });

  useEffect(() => {
    // Only trigger on /home
    if (location.pathname !== '/home') return;

    // Reset if previously closed, but show again on fresh visit
    const hasClosedPopup = sessionStorage.getItem('jaguars_popup_dismissed');
    if (hasClosedPopup) return;

    // Show after exactly 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('jaguars_popup_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.experience) return;

    await submitLead(formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      closePopup();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={closePopup}>
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <>
            <div className="popup-header">
              <Star size={32} className="popup-icon" />
              <h2>Join the Elite Core</h2>
              <p>We are actively looking for Co-founders and Individual Department Leads to help steer the Jaguars Region. Individual leads needed across all departments.</p>
            </div>

            <form onSubmit={handleSubmit} className="popup-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Christopher Nolan"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Contact Info (Email/Phone) *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="hello@example.com"
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Role of Interest</label>
                <select 
                  value={formData.roleInterest}
                  onChange={e => setFormData({...formData, roleInterest: e.target.value})}
                  className="popup-select"
                >
                  <option value="Co-founder">Co-founder</option>
                  <option value="Individual Department Lead">Individual Department Lead</option>
                </select>
              </div>

              <div className="form-group">
                <label>Previous Film Industry Experience *</label>
                <textarea 
                  required 
                  rows="3"
                  placeholder="Detail your experience, connections, or major projects..."
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                ></textarea>
                <span className="help-text">We'll review your background and get in touch.</span>
              </div>

              <button type="submit" className="btn btn-primary popup-submit">
                <UserPlus size={18} /> Apply for Elite Team
              </button>
            </form>
          </>
        ) : (
          <div className="popup-success">
            <div className="success-icon-wrap">
              <Star size={48} />
            </div>
            <h2>Application Received</h2>
            <p>Thank you, {formData.name}. We will review your extensive background and be in touch regarding Elite positioning soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
