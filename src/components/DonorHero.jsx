import React from 'react';
import heroImg from '../assets/blood-donation.jfif';

export function formatBloodGroupShortCode(donorProfile, bloodGroupsList = []) {
  if (!donorProfile) return 'O-';

  let raw = '';
  if (donorProfile.blood_group?.code) raw = donorProfile.blood_group.code;
  else if (donorProfile.blood_group_code) raw = donorProfile.blood_group_code;
  else if (donorProfile.blood_group?.name) raw = donorProfile.blood_group.name;
  else if (donorProfile.blood_group_name) raw = donorProfile.blood_group_name;
  else raw = donorProfile.blood_group_id || donorProfile.blood_group || '';

  // If UUID string, match in reference list
  if (typeof raw === 'string' && raw.includes('-') && raw.length > 20) {
    if (Array.isArray(bloodGroupsList) && bloodGroupsList.length > 0) {
      const match = bloodGroupsList.find(g => g.id === raw);
      if (match) raw = match.code || match.name || '';
    }
  }

  // Convert to short code (A-, A+, O-, O+, B-, B+, AB-, AB+)
  if (typeof raw === 'string') {
    const s = raw.trim().toUpperCase();
    if (s.includes('O_NEG') || s.includes('O-NEG') || s.includes('O NEGATIVE') || s === 'O-') return 'O-';
    if (s.includes('O_POS') || s.includes('O-POS') || s.includes('O POSITIVE') || s === 'O+') return 'O+';
    if (s.includes('A_NEG') || s.includes('A-NEG') || s.includes('A NEGATIVE') || s === 'A-') return 'A-';
    if (s.includes('A_POS') || s.includes('A-POS') || s.includes('A POSITIVE') || s === 'A+') return 'A+';
    if (s.includes('B_NEG') || s.includes('B-NEG') || s.includes('B NEGATIVE') || s === 'B-') return 'B-';
    if (s.includes('B_POS') || s.includes('B-POS') || s.includes('B POSITIVE') || s === 'B+') return 'B+';
    if (s.includes('AB_NEG') || s.includes('AB-NEG') || s.includes('AB NEGATIVE') || s === 'AB-') return 'AB-';
    if (s.includes('AB_POS') || s.includes('AB-POS') || s.includes('AB POSITIVE') || s === 'AB+') return 'AB+';

    let cleaned = s.replace('_NEG', '-').replace('_POS', '+')
                   .replace(' NEGATIVE', '-').replace(' POSITIVE', '+')
                   .replace('-NEGATIVE', '-').replace('-POSITIVE', '+');
    if (cleaned.length <= 4) return cleaned;
  }

  return 'O-';
}

export default function DonorHero({ donorProfile, user, bloodGroups = [], donations = [] }) {
  // STRICT BACKEND DATA: Retrieve full name or email directly from API user/profile object
  const name = donorProfile?.full_name || (user?.email ? user.email.split('@')[0] : 'Donor');
  const bloodGroupShort = formatBloodGroupShortCode(donorProfile, bloodGroups);

  // REAL BACKEND DATA CALCULATIONS
  const totalDonations = Array.isArray(donations) ? donations.length : (donorProfile?.total_donations || 0);
  const totalVolume = Array.isArray(donations) && donations.length > 0 
    ? donations.reduce((acc, curr) => acc + (curr.volume_ml || 450), 0)
    : totalDonations * 450;
  const livesSaved = totalDonations * 3;

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '36px 40px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1.5px solid #e2e8f0',
      boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.04)',
      background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '36px',
      alignItems: 'center'
    }}>
      
      {/* LEFT COLUMN: HERO CONTENT & BACKEND METRICS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* WELCOME MESSAGE FROM BACKEND API DATA */}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.8rem',
            fontWeight: '900',
            color: 'var(--text-main)',
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
            margin: 0
          }}>
            Welcome Back, {name}!
          </h1>
        </div>

        {/* STATUS BADGES BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: '#a71e24',
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(167, 30, 36, 0.25)'
          }}>
            🩸 {bloodGroupShort}
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #a7f3d0',
            color: 'var(--success-main)',
            fontWeight: '700',
            fontSize: '0.8rem'
          }}>
            ✓ Verified Lifesaver
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: 'var(--text-main)'
          }}>
            <span style={{ color: 'var(--success-main)' }}>✓</span> Eligible Today
          </span>
        </div>

        {/* INTEGRATED METRIC CARDS COMPUTED FROM BACKEND DONATION DATA */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          paddingTop: '18px',
          borderTop: '1.5px dashed #e2e8f0'
        }}>
          <div style={{ padding: '14px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Collections
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '2px' }}>
              {totalDonations}
            </div>
          </div>

          <div style={{ padding: '14px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Volume Donated
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '900', color: '#a71e24', marginTop: '2px' }}>
              {totalVolume.toLocaleString()} mL
            </div>
          </div>

          <div style={{ padding: '14px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Lives Saved
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '900', color: 'var(--success-main)', marginTop: '2px' }}>
              {livesSaved}
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: CLEAN BLOOD DONATION IMAGE */}
      <div style={{ position: 'relative', height: '100%', minHeight: '270px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
        <img 
          src={heroImg} 
          alt="Blood Donation Lifesaver" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

    </div>
  );
}
