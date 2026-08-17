import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Dynamic scroll listener for floating glassmorphism transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for tracking active section on Landing Page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      if (window.scrollY < 250) {
        setActiveSection('');
      }
    };

    const handleObserver = (entries) => {
      if (window.scrollY < 250) {
        setActiveSection('');
        return;
      }
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-20% 0px -50% 0px',
      threshold: 0.15
    });

    window.addEventListener('scroll', handleScroll);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, [location.pathname]);

  // Fetch unread notification count if logged in
  useEffect(() => {
    if (user) {
      api.getUnreadNotificationCount()
        .then(data => setUnreadCount(data.unread_count || data.count || 0))
        .catch(() => setUnreadCount(0));
    }
  }, [user]);

  const isPublic = !user || location.pathname === '/';

  // Define text-only nav links per role or public state
  const getNavLinks = () => {
    if (isPublic && !user) {
      return [
        { to: '/#how-it-works', label: 'How It Works', sectionId: 'how-it-works' },
        { to: '/#services', label: 'Services', sectionId: 'services' },
        { to: '/#presence', label: 'Regional Presence', sectionId: 'presence' },
        { to: '/#reviews', label: 'Impact Stories', sectionId: 'reviews' },
      ];
    }

    switch (user?.role) {
      case 'HOSPITAL':
        return [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/dashboard/inventory', label: 'Inventory' },
          { to: '/dashboard/requests', label: 'Requests' },
          { to: '/dashboard/transfers', label: 'Transfers' },
        ];
      case 'BLOOD_BANK':
        return [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/dashboard/inventory', label: 'Unit Inventory' },
          { to: '/dashboard/donations', label: 'Donations' },
          { to: '/dashboard/transfers', label: 'Transfers' },
        ];
      case 'DONOR':
        return [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/dashboard/donations', label: 'My Donations' },
        ];
      case 'ADMIN':
        return [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/dashboard/organizations', label: 'Organizations' },
          { to: '/dashboard/users', label: 'Users' },
          { to: '/dashboard/audit-logs', label: 'Audit Logs' },
        ];
      default:
        return [{ to: '/dashboard', label: 'Dashboard' }];
    }
  };

  const navLinks = getNavLinks();

  const getInitials = () => {
    if (!user) return 'U';
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  const handleSmoothScroll = (e, sectionId) => {
    e.preventDefault();
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        
        {/* Left: Brand */}
        <div className="navbar-brand-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="navbar-logo">🩸</div>
          <span className="navbar-title">BloodLink</span>
        </div>

        {/* Middle: Text-Only Navigation Links */}
        <nav className="navbar-links">
          {navLinks.map((link) => (
            link.to.startsWith('/#') ? (
              <a 
                key={link.to} 
                href={link.to.replace('/', '')} 
                className={`navbar-link ${activeSection === link.sectionId ? 'active' : ''}`}
                onClick={(e) => handleSmoothScroll(e, link.sectionId)}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard'}
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            )
          ))}
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              {/* Notification Bell Icon */}
              <button
                type="button"
                className="navbar-icon-btn"
                onClick={() => navigate('/dashboard/notifications')}
                aria-label="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && <span className="navbar-badge">{unreadCount}</span>}
              </button>

              {/* Profile Avatar Icon */}
              <button
                type="button"
                className="navbar-profile-avatar"
                onClick={() => navigate('/dashboard/profile')}
                aria-label="User Profile"
                title="User Profile & Settings"
              >
                {getInitials()}
              </button>
            </>
          ) : (
            <>
              <button 
                type="button" 
                className="table-action-outline"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                onClick={() => navigate('/login')}
              >
                Log In
              </button>
              <button 
                type="button" 
                className="btn-primary-large"
                style={{ padding: '8px 18px', fontSize: '0.85rem', width: 'auto', marginTop: 0 }}
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
