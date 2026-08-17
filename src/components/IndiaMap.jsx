import React, { useState } from 'react';

export default function IndiaMap({ selectedState, onSelectState }) {
  const [hoveredState, setHoveredState] = useState(null);

  // Helper to determine path color fill
  const getFill = (stateKey) => {
    if (selectedState === stateKey || hoveredState === stateKey) {
      return '#fecdd3'; // Soft crimson tint
    }
    return '#cbd5e1'; // Clean slate map fill
  };

  const getStroke = (stateKey) => {
    if (selectedState === stateKey || hoveredState === stateKey) {
      return '#a71e24'; // Active crimson border
    }
    return '#ffffff';
  };

  const getStrokeWidth = (stateKey) => {
    if (selectedState === stateKey || hoveredState === stateKey) {
      return '2.5';
    }
    return '1.5';
  };

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Selected State Badge Tooltip */}
      <div style={{
        position: 'absolute',
        top: '0px',
        right: '0px',
        backgroundColor: '#ffffff',
        border: '1.5px solid #a71e24',
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 4px 14px rgba(167, 30, 36, 0.12)',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        color: '#a71e24',
        zIndex: 10
      }}>
        📍 State: {hoveredState || selectedState}
      </div>

      {/* Accurate High-Fidelity India Map Vector SVG */}
      <svg 
        viewBox="0 0 600 680" 
        style={{ 
          width: '100%', 
          maxHeight: '480px', 
          filter: 'drop-shadow(0 12px 24px rgba(15, 23, 42, 0.08))' 
        }}
      >
        <g id="india-map-paths">

          {/* Jammu, Kashmir & Ladakh (Far North) */}
          <path 
            d="M 230 40 Q 250 15 285 20 Q 330 35 340 75 Q 315 105 275 115 Q 240 100 230 70 Z" 
            fill={getFill('North')}
            stroke={getStroke('North')}
            strokeWidth={getStrokeWidth('North')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('Delhi')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('Delhi')}
          >
            <title>Jammu & Kashmir / Delhi NCR</title>
          </path>

          {/* Punjab & Himachal */}
          <path 
            d="M 235 115 Q 275 115 315 105 Q 305 150 255 155 Q 230 140 235 115 Z" 
            fill={getFill('Delhi')}
            stroke={getStroke('Delhi')}
            strokeWidth={getStrokeWidth('Delhi')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('Delhi')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('Delhi')}
          >
            <title>Delhi NCR / Punjab</title>
          </path>

          {/* Rajasthan (West) */}
          <path 
            d="M 140 165 Q 225 155 255 155 Q 265 240 215 275 Q 145 255 140 165 Z" 
            fill={getFill('Gujarat')}
            stroke={getStroke('Gujarat')}
            strokeWidth={getStrokeWidth('Gujarat')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('Gujarat')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('Gujarat')}
          >
            <title>Rajasthan</title>
          </path>

          {/* Gujarat (West Coastal Peninsular) */}
          <path 
            d="M 105 275 Q 165 270 205 285 Q 195 345 155 355 Q 95 330 105 275 Z" 
            fill={getFill('Gujarat')}
            stroke={getStroke('Gujarat')}
            strokeWidth={getStrokeWidth('Gujarat')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('Gujarat')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('Gujarat')}
          >
            <title>Gujarat</title>
          </path>

          {/* Uttar Pradesh & Uttarakhand */}
          <path 
            d="M 255 155 Q 365 145 385 205 Q 335 255 265 240 Z" 
            fill={getFill('UttarPradesh')}
            stroke={getStroke('UttarPradesh')}
            strokeWidth={getStrokeWidth('UttarPradesh')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('UttarPradesh')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('UttarPradesh')}
          >
            <title>Uttar Pradesh</title>
          </path>

          {/* Madhya Pradesh (Central Heart) */}
          <path 
            d="M 205 285 Q 335 255 375 315 Q 315 375 195 355 Z" 
            fill={getFill('Maharashtra')}
            stroke={getStroke('Maharashtra')}
            strokeWidth={getStrokeWidth('Maharashtra')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('Maharashtra')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('Maharashtra')}
          >
            <title>Madhya Pradesh</title>
          </path>

          {/* MAHARASHTRA (Highlighted State in e-RaktKosh Reference Image!) */}
          <path 
            d="M 175 365 Q 315 370 335 435 Q 275 480 185 450 Q 155 405 175 365 Z" 
            fill={getFill('Maharashtra')}
            stroke={getStroke('Maharashtra')}
            strokeWidth={getStrokeWidth('Maharashtra')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('Maharashtra')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('Maharashtra')}
          >
            <title>Maharashtra</title>
          </path>

          {/* Maharashtra Map Label Box (e-RaktKosh Screenshot Style!) */}
          <g transform="translate(205, 405)" style={{ pointerEvents: 'none' }}>
            <rect x="-10" y="-18" width="114" height="30" rx="8" fill="#ffffff" stroke="#a71e24" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.15))" />
            <text x="5" y="2" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#a71e24">Maharashtra</text>
          </g>

          {/* Karnataka & Goa */}
          <path 
            d="M 185 450 Q 275 480 265 570 Q 205 560 185 450 Z" 
            fill={getFill('Karnataka')}
            stroke={getStroke('Karnataka')}
            strokeWidth={getStrokeWidth('Karnataka')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('Karnataka')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('Karnataka')}
          >
            <title>Karnataka</title>
          </path>

          {/* Andhra Pradesh & Telangana */}
          <path 
            d="M 275 435 Q 355 415 335 520 L 265 570 Z" 
            fill={getFill('TamilNadu')}
            stroke={getStroke('TamilNadu')}
            strokeWidth={getStrokeWidth('TamilNadu')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('TamilNadu')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('TamilNadu')}
          >
            <title>Andhra Pradesh / Telangana</title>
          </path>

          {/* Tamil Nadu & Kerala (Southern Tip) */}
          <path 
            d="M 225 570 L 295 560 L 265 655 L 215 625 Z" 
            fill={getFill('Kerala')}
            stroke={getStroke('Kerala')}
            strokeWidth={getStrokeWidth('Kerala')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('Kerala')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('Kerala')}
          >
            <title>Tamil Nadu & Kerala</title>
          </path>

          {/* Bihar & Jharkhand */}
          <path 
            d="M 365 205 Q 435 215 415 280 L 335 255 Z" 
            fill={getFill('WestBengal')}
            stroke={getStroke('WestBengal')}
            strokeWidth={getStrokeWidth('WestBengal')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('WestBengal')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('WestBengal')}
          >
            <title>Bihar & Jharkhand</title>
          </path>

          {/* West Bengal & Odisha */}
          <path 
            d="M 375 315 Q 435 295 415 390 L 335 415 Z" 
            fill={getFill('WestBengal')}
            stroke={getStroke('WestBengal')}
            strokeWidth={getStrokeWidth('WestBengal')}
            style={{ cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={() => setHoveredState('WestBengal')}
            onMouseLeave={() => setHoveredState(null)}
            onClick={() => onSelectState('WestBengal')}
          >
            <title>West Bengal & Odisha</title>
          </path>

          {/* North East States */}
          <path 
            d="M 445 195 Q 525 185 535 255 Q 465 285 435 245 Z" 
            fill="#e2e8f0" 
            stroke="#ffffff" 
            strokeWidth="1.5"
          >
            <title>North Eastern Region</title>
          </path>

        </g>
      </svg>
    </div>
  );
}
