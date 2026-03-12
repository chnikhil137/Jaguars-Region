import React from 'react';
import { motion } from 'framer-motion';
import './FilterBar.css';

export const ROLES_LIST = [
  'Actor', 'Actress', 'Music Director', 'Playback Singer', 'Director', 
  'Cinematographer', 'Social Media Manager', 'Marketing', 'Production', 
  'Graphical Designer', 'AI Creator', 'Scriptwriter', 'Colour Grading', 'Animations', 'CGI VFX', 'Other'
];

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-wrapper">
      <div className="filter-bar container">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
          onClick={() => onFilterChange('All')}
        >
          All
        </motion.button>
        {ROLES_LIST.map((role) => (
          <motion.button
            key={role}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`filter-pill ${activeFilter === role ? 'active' : ''}`}
            onClick={() => onFilterChange(role)}
          >
            {role}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
