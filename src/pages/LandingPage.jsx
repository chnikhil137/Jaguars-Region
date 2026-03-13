import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles, ArrowRight } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Decorative orbs */}
      <div className="landing-deco-orb landing-deco-orb--1" />
      <div className="landing-deco-orb landing-deco-orb--2" />

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
