import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../services/store';
import { useAuth } from '../services/AuthContext';
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { ROLES_LIST } from './FilterBar';
import './OnboardingFlow.css';

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { registerUser } = useStore();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customRole, setCustomRole] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    role: [],
    location: '',
    bio: '',
    email: '',
    phone: '',
    links: [{ title: 'Portfolio / Website', url: '' }] 
  });

  const handleRoleToggle = (selectedRole) => {
    setFormData(prev => {
      const roles = [...prev.role];
      if (roles.includes(selectedRole)) {
        return { ...prev, role: roles.filter(r => r !== selectedRole) };
      } else {
        return { ...prev, role: [...roles, selectedRole] };
      }
    });
  };

  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { title: '', url: '' }]
    }));
  };

  const handleUpdateLink = (index, field, value) => {
    setFormData(prev => {
      const newLinks = [...prev.links];
      newLinks[index][field] = value;
      return { ...prev, links: newLinks };
    });
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Process custom role
    const finalRoles = [...formData.role];
    if (finalRoles.includes('Other') && customRole.trim()) {
      // Replace 'Other' with the custom role they typed
      const otherIndex = finalRoles.indexOf('Other');
      finalRoles[otherIndex] = customRole.trim();
    }

    // Filter out empty links
    const validLinks = formData.links.filter(l => l.url.trim() !== '');

    const finalData = {
      name: formData.name,
      role: finalRoles,
      location: formData.location,
      bio: formData.bio,
      contact_email: formData.email,
      contact_phone: formData.phone,
      custom_links: validLinks,
      user_id: user?.id || null
    };

    try {
      await registerUser(finalData);
      await refreshProfile();
      navigate('/joined', { state: { success: true } });
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong joining: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.name.trim().length > 2 && formData.role.length > 0 && 
                       (!formData.role.includes('Other') || customRole.trim() !== '') &&
                       formData.location.trim().length > 2;
  const isStep2Valid = formData.bio.length >= 10;
  const isStep3Valid = formData.email.includes('@');

  return (
    <div className="onboarding-container">
      <div className="onboarding-card glass-panel">
        
        {/* Navigation & Progress */}
        <div className="onboarding-header">
          {step > 1 ? (
            <button className="back-button" onClick={handlePrev} type="button">
              <ArrowLeft size={20} /> Back
            </button>
          ) : (
            <button className="back-button" onClick={() => navigate('/home')} type="button">
              <ArrowLeft size={20} /> Cancel
            </button>
          )}
          
          <div className="progress-indicator">
            <span className={`dot ${step >= 1 ? 'active' : ''}`}></span>
            <span className={`line ${step >= 2 ? 'active' : ''}`}></span>
            <span className={`dot ${step >= 2 ? 'active' : ''}`}></span>
            <span className={`line ${step >= 3 ? 'active' : ''}`}></span>
            <span className={`dot ${step >= 3 ? 'active' : ''}`}></span>
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="step-content">
              <h2>Create Your Jaguar Profile</h2>
              
              <div className="form-group" style={{marginTop: '1.5rem'}}>
                <label htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Christopher Nolan"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input 
                  type="text" 
                  id="location" 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                  placeholder="e.g. Los Angeles, CA or London, UK"
                  required
                />
              </div>

              <div className="form-group">
                <label>Primary Roles *</label>
                <p className="help-text">Select your roles below.</p>
                <div className="role-selector">
                  {ROLES_LIST.map(role => (
                    <button
                      key={role}
                      type="button"
                      className={`role-toggle ${formData.role.includes(role) ? 'selected' : ''}`}
                      onClick={() => handleRoleToggle(role)}
                    >
                      {formData.role.includes(role) && <CheckCircle2 size={16} className="check-icon" />}
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {formData.role.includes('Other') && (
                <div className="form-group slide-in">
                  <label htmlFor="customRole">What is your role? *</label>
                  <input 
                    type="text" 
                    id="customRole" 
                    value={customRole} 
                    onChange={(e) => setCustomRole(e.target.value)} 
                    placeholder="Type your specific role..."
                    required
                  />
                </div>
              )}

              <button 
                type="button" 
                className="btn btn-primary step-btn" 
                disabled={!isStep1Valid}
                onClick={handleNext}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Bio */}
          {step === 2 && (
            <div className="step-content slide-in">
              <h2>Your Profile</h2>
              <p className="step-desc">How should you be displayed on our profile?</p>

              <div className="form-group">
                <label htmlFor="bio">Bio *</label>
                <textarea 
                  id="bio"
                  rows="6"
                  maxLength="500"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Talk about your experience, style, and passion for filmmaking..."
                  required
                />
                <span className="char-count">{formData.bio.length} / 500</span>
              </div>

              <button 
                type="button" 
                className="btn btn-primary step-btn" 
                disabled={!isStep2Valid}
                onClick={handleNext}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 3: Connect & Additional Links */}
          {step === 3 && (
            <div className="step-content slide-in">
              <h2>Connectivity</h2>
              <p className="step-desc">How do you want persons to contact you?</p>

              {/* Primary Contact */}
              <div className="form-group">
                <label htmlFor="email">Primary Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="hello@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="+1 234 567 8900"
                />
              </div>

              <hr style={{borderColor: 'var(--color-border)', margin: '2rem 0'}} />
              
              <h3 style={{marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--color-accent-main)'}}>
                Links & Portfolio
              </h3>
              <p className="help-text">This will be displayed on your profile. Portfolio website is very important. You can add multiple links here (Instagram, YouTube, etc).</p>

              {formData.links.map((link, index) => (
                <div key={index} className="link-entry-group">
                  <div className="link-inputs">
                    <input 
                      type="text" 
                      placeholder="Title (e.g. Portfolio, Instagram)" 
                      value={link.title}
                      onChange={(e) => handleUpdateLink(index, 'title', e.target.value)}
                    />
                    <input 
                      type="url" 
                      placeholder="URL (https://...)" 
                      value={link.url}
                      onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                    />
                  </div>
                  {index > 0 && (
                    <button type="button" className="remove-link-btn" onClick={() => handleRemoveLink(index)}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              <button type="button" className="btn btn-outline" onClick={handleAddLink} style={{marginBottom: '1.5rem', width: '100%'}}>
                <Plus size={18} /> Add Another Link
              </button>

              <button 
                type="submit" 
                className="btn btn-primary step-btn" 
                disabled={!isStep3Valid || isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Become a Jaguar'}
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
