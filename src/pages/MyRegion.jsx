import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, BookOpen, Wrench, ArrowLeft, Clock } from 'lucide-react';
import './MyRegion.css';

export default function MyRegion() {
  const navigate = useNavigate();

  return (
    <div className="myregion-page">
      <div className="myregion-content">
        <div className="myregion-icon">
          <Rocket size={36} />
        </div>

        <h1 className="myregion-title">My Jaguars Region</h1>
        <p className="myregion-subtitle">
          We're building something powerful for filmmakers. Your personal space to learn, grow, and sharpen your craft is coming soon.
        </p>

        <div className="myregion-features">
          <div className="myregion-feature">
            <BookOpen size={22} className="myregion-feature-icon" />
            <p className="myregion-feature-text">
              <strong>Exclusive Courses</strong> — Master filmmaking techniques from industry professionals.
            </p>
          </div>
          <div className="myregion-feature">
            <Wrench size={22} className="myregion-feature-icon" />
            <p className="myregion-feature-text">
              <strong>Creative Tools</strong> — Tools designed to make you a better version of yourself in filmmaking.
            </p>
          </div>
          <div className="myregion-feature">
            <Rocket size={22} className="myregion-feature-icon" />
            <p className="myregion-feature-text">
              <strong>Community Projects</strong> — Collaborate on real film projects with fellow Jaguars.
            </p>
          </div>
        </div>

        <div className="myregion-badge">
          <Clock size={16} />
          Coming Soon
        </div>

        <div>
          <button className="myregion-back-btn" onClick={() => navigate('/home')}>
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
