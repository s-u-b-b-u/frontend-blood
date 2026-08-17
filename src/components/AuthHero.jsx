import React from 'react';
import loginImage from '../assets/login-page-imgae.webp';

export default function AuthHero() {
  return (
    <div className="auth-hero" style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Hero Visual Image Only */}
      <div className="auth-hero-body">
        <div className="auth-hero-image-wrapper">
          <img 
            src={loginImage} 
            alt="Life-saving blood management network illustration" 
            className="auth-hero-image"
          />
        </div>
      </div>
    </div>
  );
}
