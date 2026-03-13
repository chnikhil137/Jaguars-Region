import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles, ArrowRight } from 'lucide-react';
import './LandingPage.css';

const desktopImages = [
  '/images/hero/desktop/desktop_1.jpeg',
  '/images/hero/desktop/desktop_2.jpeg',
  '/images/hero/desktop/desktop_3.jpeg',
  '/images/hero/desktop/desktop_4.jpeg',
  '/images/hero/desktop/desktop_5.jpeg',
  '/images/hero/desktop/desktop_6.jpeg'
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
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % desktopImages.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
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
      
      {/* Dark gradient overlay to ensure text is perfectly readable against varied images */}
      <div className="landing-overlay" />

      <div className="landing-content">
        <h1 className="landing-title">Jaguars Region</h1>
        <div className="landing-accent-line" />

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
      </div>
    </div>
  );
}
