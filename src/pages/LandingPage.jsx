import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles, ArrowRight, Film, BookOpen, Wrench, Mail, Heart, Target, ChevronDown } from 'lucide-react';
import './LandingPage.css';

const desktopImages = [
  '/images/hero/desktop/desktop_1.jpeg'
];

const mobileImages = [
  '/images/hero/mobile/mobile_1.jpeg',
  '/images/hero/mobile/mobile_2.jpeg',
  '/images/hero/mobile/mobile_3.jpeg',
  '/images/hero/mobile/mobile_4.jpeg',
  '/images/hero/mobile/mobile_5.jpeg',
  '/images/hero/mobile/mobile_6.jpeg'
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Crossfade every 5 seconds
  useEffect(() => {
    const maxCount = Math.max(desktopImages.length, mobileImages.length);
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % maxCount);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page-wrapper">
      {/* ─── HERO SECTION ─── */}
      <section className="landing-page">
        {/* Background Slideshow */}
        <div className="landing-slideshow">
          {desktopImages.map((src, index) => (
            <div 
              key={`desktop-${index}`}
              className={`landing-slide desktop-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
          {mobileImages.map((src, index) => (
            <div 
              key={`mobile-${index}`}
              className={`landing-slide mobile-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
        
        <div className="landing-overlay" />

        <div className="landing-content">
          <h1 className="landing-title">Jaguars Region</h1>

          <p className="landing-tagline">
            The most <span className="highlight">aggressive</span> filmmaking community is here.
            Connect and collaborate with fellow filmmakers, be a <span className="highlight">better version</span> of
            yourself in filmmaking — with all the possibilities we have for you.
          </p>

          <div className="landing-cta-group">
            <button
              className="landing-btn landing-btn-primary"
              onClick={() => navigate('/directory')}
            >
              <Users size={20} />
              Connect with Jaguars
              <ArrowRight size={18} />
            </button>

            <button
              className="landing-btn landing-btn-secondary"
              onClick={() => navigate('/my-region')}
            >
              <Sparkles size={20} />
              My Jaguars Region
            </button>
          </div>

          <button 
            className="landing-scroll-hint"
            onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Scroll to learn more"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section className="about-section" id="about-section">
        <div className="about-inner">
          <div className="about-badge">
            <Film size={18} />
            <span>Our Mission</span>
          </div>
          
          <h2 className="about-heading">
            Collaborate. Connect. <span className="about-accent">Create.</span>
          </h2>
          
          <p className="about-narrative">
            Our main motto is to <strong>collaborate and connect all filmmakers together</strong>. 
            We provide the best tools and courses for the filmmaking community. Our ultimate 
            vision is that Jaguars Region will evolve into a <strong>full-fledged production house</strong>, 
            and future films will be born directly from this community.
          </p>

          <div className="about-pillars">
            <div className="about-pillar glass-panel">
              <div className="pillar-icon">
                <Heart size={28} />
              </div>
              <h3>Community First</h3>
              <p>A tight-knit network of filmmakers who support, inspire, and elevate each other across every stage of production.</p>
            </div>

            <div className="about-pillar glass-panel">
              <div className="pillar-icon">
                <BookOpen size={28} />
              </div>
              <h3>Learn & Grow</h3>
              <p>Exclusive courses and resources designed by industry professionals to sharpen your craft and unlock your potential.</p>
            </div>

            <div className="about-pillar glass-panel">
              <div className="pillar-icon">
                <Target size={28} />
              </div>
              <h3>Production House</h3>
              <p>Our ultimate goal — evolving into a production house where community-driven films come to life on the big screen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT / SUPPORT SECTION ─── */}
      <section className="contact-section">
        <div className="contact-inner">
          <div className="contact-card glass-panel">
            <div className="contact-icon-wrap">
              <Mail size={32} />
            </div>
            <h2>Need Help? Get in Touch.</h2>
            <p className="contact-desc">
              Have questions, doubts, or want to collaborate? Reach out to our team — we're here for you.
            </p>
            <a href="mailto:contact@jaguarsregion.in" className="contact-email-link">
              contact@jaguarsregion.in
            </a>
            <p className="contact-subtext">We typically respond within 24 hours.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
