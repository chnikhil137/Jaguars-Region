import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Instagram, Globe, X, Link as LinkIcon, MapPin, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../services/AuthContext';
import './DirectoryCard.css';

export default function DirectoryCard({ user, isUpvoted, onUpvote }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const isOwnCard = currentUser && user.user_id === currentUser.id;
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const formatUrl = (url) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.toLowerCase().startsWith('javascript:')) return '#';
    return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
  };

  return (
    <>
      {/* Zero State / Grid View */}
      <motion.div 
        className="directory-card glass-panel" 
        onClick={toggleExpand}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <div className="card-header">
          <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'}}>
              <h3>{user.name}</h3>
              <div className="card-star-badge">
                <Star size={14} fill="var(--color-accent-main)" color="var(--color-accent-main)" />
                <span>{Math.max(0, user.stars || 0)}</span>
              </div>
            </div>
            {user.location && user.location !== 'Not Specified' && (
              <div style={{display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '8px'}}>
                <MapPin size={12} /> {user.location}
              </div>
            )}
            <div className="role-tags">
              {Array.isArray(user.role) && user.role.slice(0, 2).map((r, i) => (
                <span key={i} className="role-tag">{r}</span>
              ))}
              {Array.isArray(user.role) && user.role.length > 2 && (
                <span className="role-tag">+{user.role.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Profile Modal */}
      <AnimatePresence>
      {isExpanded && (
        <div className="modal-overlay" onClick={toggleExpand}>
          <motion.div 
            className="modal-content glass-panel" 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button className="close-button" onClick={toggleExpand}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <div className="modal-title">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2>{user.name} {isOwnCard && <span className="own-badge">(You)</span>}</h2>
                  <div className="star-rating profile-star-rating" onClick={() => onUpvote(user.id)}>
                    <Star size={20} fill={isUpvoted ? "var(--color-accent-main)" : "none"} color={isUpvoted ? "var(--color-accent-main)" : "var(--color-text-muted)"} />
                    <span>{Math.max(0, user.stars || 0)}</span>
                  </div>
                </div>
                
                <div className="demographics-row">
                  {user.location && user.location !== 'Not Specified' && (
                    <div className="demographic-item">
                      <MapPin size={14} /> {user.location}
                    </div>
                  )}
                  {user.gender && (
                    <div className="demographic-item">
                      <User size={14} /> {user.gender}
                    </div>
                  )}
                  {user.language && (
                    <div className="demographic-item language-item" title={user.language}>
                      <MessageSquare size={14} /> <span>{user.language}</span>
                    </div>
                  )}
                </div>

                <div className="role-tags">
                  {Array.isArray(user.role) && user.role.map((r, i) => (
                    <span key={i} className="role-tag">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-body">
              <h4 className="section-title">Bio</h4>
              <p className="bio-text">{user.bio || 'No bio provided.'}</p>

              {isOwnCard && (
                <button className="btn btn-primary edit-profile-btn" onClick={() => navigate('/dashboard')}>
                   Edit Profile
                </button>
              )}

              <h4 className="section-title">Connect</h4>
              <div className="contact-links">
                {user.contact_email && (
                  <a href={`mailto:${user.contact_email}`} className="contact-btn email">
                    <Mail size={18} /> Email
                  </a>
                )}
                {user.contact_phone && (
                  <a href={`tel:${user.contact_phone}`} className="contact-btn phone">
                    <Phone size={18} /> Call
                  </a>
                )}
                {user.social_links?.instagram && (
                  <a href={formatUrl(user.social_links.instagram)} target="_blank" rel="noopener noreferrer" className="contact-btn instagram">
                    <Instagram size={18} /> Instagram
                  </a>
                )}
                {user.social_links?.portfolio && (
                  <a href={formatUrl(user.social_links.portfolio)} target="_blank" rel="noopener noreferrer" className="contact-btn portfolio">
                    <Globe size={18} /> Portfolio
                  </a>
                )}
                {user.custom_links && user.custom_links.map((link, idx) => (
                  <a key={idx} href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" className="contact-btn external">
                    <LinkIcon size={18} /> {link.title || 'Link'}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </>
  );
}
