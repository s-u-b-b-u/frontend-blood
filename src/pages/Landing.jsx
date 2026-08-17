import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import bloodDonationImg from '../assets/blood-donation.jfif';
import bloodStorageImg from '../assets/blood-storage.jfif';
import servicesBg from '../assets/services_hero_bg.png';
import doctorImg from '../assets/doctor1.jfif';
import donorImg from '../assets/donor1.jfif';
import recieverImg from '../assets/reciever1.jpg';

export default function Landing() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('All');
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Reviews Data (50/50 Split Model)
  const reviews = [
    {
      id: 1,
      name: 'Dr. Aris Thorne',
      role: 'Emergency Medical Director',
      badge: '🏥 Healthcare Professional',
      image: doctorImg,
      quote: '"BloodLink\'s real-time emergency stock search saved critical trauma patients during urgent surgeries when seconds counted."'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      role: 'Voluntary Blood Donor',
      badge: '❤️ 12-Time Donor',
      image: donorImg,
      quote: '"Scheduling my donation took under two minutes. Knowing my unit reached a patient in need is the best feeling in the world."'
    },
    {
      id: 3,
      name: 'Ananya Sharma',
      role: 'Recipient Family',
      badge: '🙏 Lifesaving Recipient',
      image: recieverImg,
      quote: '"When my mother needed rare O-negative blood in an emergency, BloodLink coordinated a rapid dispatch within 20 minutes."'
    }
  ];

  const currentReview = reviews[activeReviewIndex];

  // Regional Stats Data
  const stateData = {
    All: { name: 'All India', donors: '5,604,326', centers: '4,572', upcomingCamps: '279', campsOrganised: '270,096' },
    Maharashtra: { name: 'Maharashtra', donors: '842,100', centers: '680', upcomingCamps: '45', campsOrganised: '42,100' },
    Delhi: { name: 'Delhi (NCR)', donors: '620,400', centers: '410', upcomingCamps: '32', campsOrganised: '31,800' },
    Karnataka: { name: 'Karnataka', donors: '590,300', centers: '450', upcomingCamps: '28', campsOrganised: '29,400' },
    TamilNadu: { name: 'Tamil Nadu', donors: '610,200', centers: '490', upcomingCamps: '30', campsOrganised: '33,200' },
    UttarPradesh: { name: 'Uttar Pradesh', donors: '780,500', centers: '610', upcomingCamps: '41', campsOrganised: '38,900' },
    Gujarat: { name: 'Gujarat', donors: '510,800', centers: '410', upcomingCamps: '26', campsOrganised: '26,500' },
    WestBengal: { name: 'West Bengal', donors: '480,200', centers: '380', upcomingCamps: '22', campsOrganised: '23,100' },
    Kerala: { name: 'Kerala', donors: '370,126', centers: '320', upcomingCamps: '18', campsOrganised: '19,096' }
  };

  const currentStats = stateData[selectedState] || stateData.All;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      
      {/* Shared Dynamic Glassmorphic Navbar */}
      <Navbar />

      {/* SECTION 1: FULL PAGE WIDTH & 100VH HERO SECTION */}
      <section style={{ width: '100%', minHeight: '100vh', backgroundColor: '#a71e24', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        
        {/* Right Side Background Image */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%', zIndex: 1 }}>
          <img 
            src={bloodDonationImg} 
            alt="Blood Donation" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left center', display: 'block' }} 
          />
        </div>

        {/* Left Side Crimson Curved Panel */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          width: '46%', 
          height: '100%',
          backgroundColor: '#a71e24', 
          borderTopRightRadius: '180px 100%', 
          borderBottomRightRadius: '180px 100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justify: 'center', 
          padding: '60px 4vw 60px max(4vw, calc((100vw - 1200px) / 2 + 20px))', 
          color: '#ffffff'
        }}>
          
          <div style={{ maxWidth: '520px' }}>
            <h1 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: 'clamp(2.2rem, 4.2vw, 3.25rem)', 
              fontWeight: '900', 
              color: '#ffffff', 
              lineHeight: '1.1', 
              letterSpacing: '-0.02em', 
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              BE THE REASON<br />
              SOMEONE LIVES<br />
              TOMORROW.
            </h1>

            {/* White Divider Line */}
            <div style={{ width: '60px', height: '3.5px', backgroundColor: '#ffffff', marginBottom: '18px', borderRadius: '2px' }}></div>

            <blockquote style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', fontStyle: 'italic', fontWeight: 'var(--weight-medium)', color: '#ffffff', lineHeight: '1.4', marginBottom: '16px', borderLeft: '3px solid #ffffff', paddingLeft: '14px' }}>
              "Heroes don't always wear capes. Sometimes, they just roll up a sleeve and give the gift of life."
            </blockquote>

            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5', marginBottom: '28px' }}>
              One donation takes 15 minutes and saves up to 3 lives. Join thousands of voluntary donors across our emergency network.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <button 
                type="button" 
                style={{
                  padding: '14px 32px',
                  backgroundColor: '#ffffff',
                  color: '#a71e24',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 'var(--weight-bold)',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease'
                }}
                onClick={() => navigate('/register')}
              >
                Register as a Lifesaver
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em' }}>
              www.bloodlink.org
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 2: HOW DONATION WORKS (100VH Viewport Height) */}
      <section id="how-it-works" className="flow-card-fullwidth" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 4vw' }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Header */}
          <div style={{ maxWidth: '600px', margin: '0 auto 64px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'var(--weight-extrabold)', color: '#a71e24', marginBottom: '12px' }}>
              How Donation Works
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Register, get a quick health check, and donate—a simple process to help save lives.
            </p>
          </div>

          {/* Connected Flow Line Layout */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* Stage 1 */}
            <div className="flow-stage-item">
              <div className="flow-icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)' }}>
                Registration Process
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.55', maxWidth: '240px' }}>
                Sign up and schedule your first donation with ease
              </p>
            </div>

            {/* Pulsing Dashed Flow Line 1 */}
            <div className="flow-connector-line"></div>

            {/* Stage 2 */}
            <div className="flow-stage-item">
              <div className="flow-icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)' }}>
                Health Screening
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.55', maxWidth: '240px' }}>
                A simple check-up to ensure you're ready to donate
              </p>
            </div>

            {/* Pulsing Dashed Flow Line 2 */}
            <div className="flow-connector-line"></div>

            {/* Stage 3 */}
            <div className="flow-stage-item">
              <div className="flow-icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)' }}>
                Donation Day
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.55', maxWidth: '240px' }}>
                Relax as our professional staff guide you through
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: PLATFORM SERVICES (100VH Viewport Height) */}
      <section id="services" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Services Dark Fluid Hero Banner */}
        <div style={{ 
          flex: '1.3', 
          width: '100%', 
          position: 'relative', 
          backgroundImage: `linear-gradient(135deg, rgba(167, 30, 36, 0.92) 0%, rgba(15, 23, 42, 0.95) 100%), url(${servicesBg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          padding: '80px 4vw 60px max(4vw, calc((100vw - 1200px) / 2 + 20px))', 
          display: 'flex', 
          alignItems: 'flex-end'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'var(--weight-bold)', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              BloodLink Platform Capabilities
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', fontWeight: '900', color: '#ffffff', lineHeight: '1.1', marginTop: '6px', letterSpacing: '-0.02em' }}>
              Services
            </h2>
          </div>
        </div>

        {/* Connected 3-Column White Card Grid */}
        <div id="service-cards" style={{ 
          flex: '1', 
          width: '100%', 
          backgroundColor: '#ffffff', 
          borderTop: '1.5px solid #e2e8f0', 
          borderBottom: '1.5px solid #e2e8f0', 
          boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.06)', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
        }}>
          
          {/* Column 01 */}
          <div style={{ padding: '48px 4vw max(48px, calc((100vw - 1200px)/6)) max(4vw, calc((100vw - 1200px)/2 + 20px))', borderRight: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a71e24', display: 'inline-block' }}></span>
              01
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)', lineHeight: '1.3' }}>
              Real-Time Emergency Stock Matching
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
              Instant regional search connecting hospitals with nearby compatible blood banks to eliminate critical blood dispatch delays.
            </p>
          </div>

          {/* Column 02 */}
          <div style={{ padding: '48px 4vw', borderRight: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a71e24', display: 'inline-block' }}></span>
              02
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)', lineHeight: '1.3' }}>
              Certified Unit Life Cycle Tracking
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
              Comprehensive unit status transitions (`COLLECTED` ➔ `UNDER_TESTING` ➔ `AVAILABLE`) ensuring 100% safety & compliance.
            </p>
          </div>

          {/* Column 03 */}
          <div style={{ padding: '48px max(4vw, calc((100vw - 1200px)/2 + 20px)) 48px 4vw', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a71e24', display: 'inline-block' }}></span>
              03
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)', lineHeight: '1.3' }}>
              Voluntary Donor Portal & Drives
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
              Empowering voluntary donors with eligibility checking, appointment scheduling, and real-time local shortage notifications.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION 4: NATIONWIDE PRESENCE & REGIONAL NETWORK (Equal 50/50 Split Layout) */}
      <section id="presence" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 4vw', backgroundColor: 'var(--bg-canvas)' }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column (50% Width) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 'var(--weight-extrabold)', color: '#a71e24', lineHeight: '1.15' }}>
                Nationwide Presence.<br />Ensuring Accessibility Across India.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>
                A Connected Network of Certified Blood Centers Serving Every State and District
              </p>
            </div>

            {/* 4 Smoke-White Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🩸</span> Total Donor Registration
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 'var(--weight-extrabold)', color: '#a71e24', marginTop: '8px' }}>
                  5,604,326
                </div>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🩸</span> Total Blood Centers
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', marginTop: '8px' }}>
                  4,572
                </div>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🏥</span> Total Upcoming Camps
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 'var(--weight-extrabold)', color: '#a71e24', marginTop: '8px' }}>
                  279
                </div>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🏛️</span> Camps Organised
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', marginTop: '8px' }}>
                  270,096
                </div>
              </div>

            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              * Official nationwide network registry data updated live from connected blood banks.
            </div>
          </div>

          {/* Right Column (50% Width - Full Fill Image) */}
          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '420px', borderRadius: '24px', overflow: 'hidden', border: '1.5px solid #e2e8f0', boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.08)' }}>
            <img 
              src={bloodStorageImg} 
              alt="Certified Blood Storage Network" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
            />
          </div>

        </div>
      </section>

      {/* SECTION 5: USER REVIEWS & IMPACT STORIES CAROUSEL (Screen-Edge Arrow Controls) */}
      <section id="reviews" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 4vw', backgroundColor: '#ffffff', borderTop: '1.5px solid #e2e8f0', borderBottom: '1.5px solid #e2e8f0', position: 'relative' }}>
        
        {/* Left Screen-Edge Navigation Arrow Button */}
        <button 
          type="button" 
          style={{
            position: 'absolute',
            left: '3vw',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 10,
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}
          onClick={() => setActiveReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
          aria-label="Previous Review"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Right Screen-Edge Navigation Arrow Button */}
        <button 
          type="button" 
          style={{
            position: 'absolute',
            right: '3vw',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 10,
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}
          onClick={() => setActiveReviewIndex((prev) => (prev + 1) % reviews.length)}
          aria-label="Next Review"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <div style={{ maxWidth: '820px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '540px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'var(--weight-bold)', color: '#a71e24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Real Impact • Real Stories
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', marginTop: '6px' }}>
              Trusted Across the Network
            </h2>
          </div>

          {/* Consistent Aspect-Ratio 50% / 50% Review Card */}
          <div style={{ 
            width: '100%', 
            maxWidth: '820px', 
            aspectRatio: '16 / 7.5',
            minHeight: '340px',
            borderRadius: '24px', 
            overflow: 'hidden', 
            border: '1.5px solid #e2e8f0', 
            boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.08)', 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            backgroundColor: '#ffffff'
          }}>
            
            {/* Left 50% Column: Absolute Positioned Image Fill */}
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              <img 
                src={currentReview.image} 
                alt={currentReview.name} 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center top', 
                  display: 'block' 
                }} 
              />
            </div>

            {/* Right 50% Column: Flex Stretch Content */}
            <div style={{ padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'inline-flex', padding: '5px 12px', borderRadius: 'var(--radius-full)', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', width: 'fit-content', fontSize: '0.75rem', fontWeight: 'bold', color: '#a71e24' }}>
                  {currentReview.badge}
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)', fontWeight: 'var(--weight-medium)', color: 'var(--text-main)', lineHeight: '1.5', fontStyle: 'italic', margin: 0 }}>
                  {currentReview.quote}
                </p>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1.5px solid #e2e8f0' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', margin: 0 }}>
                  {currentReview.name}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', marginTop: '2px' }}>
                  {currentReview.role}
                </div>
              </div>
            </div>

          </div>

          {/* Slide Dots Indicator */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {reviews.map((rev, idx) => (
              <div 
                key={rev.id} 
                onClick={() => setActiveReviewIndex(idx)}
                style={{ 
                  width: idx === activeReviewIndex ? '28px' : '10px', 
                  height: '10px', 
                  borderRadius: 'var(--radius-full)', 
                  backgroundColor: idx === activeReviewIndex ? '#a71e24' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: EMERGENCY CALL-TO-ACTION BANNER (100VH Viewport Height) */}
      <section style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 4vw', backgroundColor: 'var(--bg-canvas)' }}>
        <div style={{ maxWidth: '840px', width: '100%', padding: '64px 40px', backgroundColor: '#ffffff', borderRadius: '28px', border: '1.5px solid #fecdd3', boxShadow: '0 12px 36px -4px rgba(167, 30, 36, 0.08)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', marginBottom: '12px' }}>
            One Donation Can Save Up To 3 Lives Today.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 32px', lineHeight: '1.65' }}>
            Join thousands of voluntary blood donors nationwide. Register in under 2 minutes and make a life-changing difference.
          </p>
          <button 
            type="button" 
            className="btn-primary-large"
            style={{ width: 'auto', padding: '16px 36px', fontSize: '1.05rem', marginTop: 0, backgroundColor: '#a71e24' }}
            onClick={() => navigate('/register')}
          >
            Register as Voluntary Donor
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ width: '100%', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '40px 4vw' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🩸</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)' }}>BloodLink Network</span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} BloodLink Network. All rights reserved. • Lifesaving Emergency Coordination.
          </div>
        </div>
      </footer>

    </div>
  );
}
