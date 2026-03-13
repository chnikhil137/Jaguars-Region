import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { supabase } from '../services/supabase';
import { ROLES_LIST } from '../components/FilterBar';
import { User, Save, LogOut, Plus, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user, memberProfile, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [customRole, setCustomRole] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    role: [],
    location: '',
    bio: '',
    contact_email: '',
    contact_phone: '',
    custom_links: [{ title: '', url: '' }]
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (memberProfile) {
      setFormData({
        name: memberProfile.name || '',
        role: memberProfile.role || [],
        location: memberProfile.location || '',
        bio: memberProfile.bio || '',
        contact_email: memberProfile.contact_email || '',
        contact_phone: memberProfile.contact_phone || '',
        custom_links: memberProfile.custom_links?.length > 0 
          ? memberProfile.custom_links 
          : [{ title: '', url: '' }]
      });
    }
  }, [memberProfile, user, loading, navigate]);

  const handleRoleToggle = (role) => {
    setFormData(prev => {
      const roles = [...prev.role];
      if (roles.includes(role)) {
        return { ...prev, role: roles.filter(r => r !== role) };
      }
      return { ...prev, role: [...roles, role] };
    });
  };

  const handleAddCustomRole = () => {
    if (customRole.trim() && !formData.role.includes(customRole.trim())) {
      setFormData(prev => ({
        ...prev,
        role: [...prev.role, customRole.trim()]
      }));
      setCustomRole('');
    }
  };

  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      custom_links: [...prev.custom_links, { title: '', url: '' }]
    }));
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      custom_links: prev.custom_links.filter((_, i) => i !== index)
    }));
  };

  const handleLinkChange = (index, field, value) => {
    setFormData(prev => {
      const links = [...prev.custom_links];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, custom_links: links };
    });
  };

  const handleSave = async () => {
    if (!memberProfile) return;
    setSaving(true);
    setSaved(false);

    const cleanedLinks = formData.custom_links.filter(l => l.title && l.url);

    const { error } = await supabase
      .from('members')
      .update({
        name: formData.name,
        role: formData.role,
        location: formData.location,
        bio: formData.bio,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        custom_links: cleanedLinks
      })
      .eq('id', memberProfile.id)
      .eq('user_id', user.id);

    if (!error) {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Loading your profile...</div>
      </div>
    );
  }

  if (!memberProfile) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>No Profile Yet</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Complete your registration to create your Jaguars profile.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Complete Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card glass-panel">
        <div className="dashboard-top-bar">
          <button className="dash-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Directory
          </button>
          <button className="dash-signout-btn" onClick={handleSignOut}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="dashboard-header">
          <div className="dash-avatar">
            <User size={32} />
          </div>
          <div>
            <h1>Your Profile</h1>
            <p className="dash-email">{user?.email}</p>
          </div>
        </div>

        <div className="dashboard-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Roles / Skills</label>
            <div className="role-selector">
              {ROLES_LIST.map(role => (
                <button
                  key={role}
                  type="button"
                  className={`role-toggle ${formData.role.includes(role) ? 'selected' : ''}`}
                  onClick={() => handleRoleToggle(role)}
                >
                  {formData.role.includes(role) && <CheckCircle2 size={14} />}
                  {role}
                </button>
              ))}
            </div>
            <div className="custom-role-row">
              <input
                type="text"
                placeholder="Add custom role..."
                value={customRole}
                onChange={e => setCustomRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomRole())}
              />
              <button type="button" className="btn btn-primary" onClick={handleAddCustomRole} style={{ padding: '0.5rem 1rem' }}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder="City, Country"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell the community about yourself..."
              maxLength={300}
            />
            <span className="char-count">{formData.bio.length}/300</span>
          </div>

          <div className="form-group">
            <label>Email (Public)</label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={e => setFormData({...formData, contact_email: e.target.value})}
              placeholder="public@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.contact_phone}
              onChange={e => setFormData({...formData, contact_phone: e.target.value})}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="form-group">
            <label>Links & Social</label>
            {formData.custom_links.map((link, i) => (
              <div key={i} className="link-entry-group">
                <div className="link-inputs">
                  <input
                    type="text"
                    placeholder="Label (e.g. Portfolio)"
                    value={link.title}
                    onChange={e => handleLinkChange(i, 'title', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link.url}
                    onChange={e => handleLinkChange(i, 'url', e.target.value)}
                  />
                </div>
                {formData.custom_links.length > 1 && (
                  <button type="button" className="remove-link-btn" onClick={() => handleRemoveLink(i)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-link-btn" onClick={handleAddLink}>
              <Plus size={16} /> Add Link
            </button>
          </div>

          <button
            className="btn btn-primary save-btn"
            onClick={handleSave}
            disabled={saving || !formData.name}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
