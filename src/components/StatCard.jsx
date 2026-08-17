import React from 'react';
import Skeleton from './Skeleton';

export default function StatCard({ title, value, subtitle, icon, iconColor, valueColor, loading = false }) {
  if (loading) {
    return (
      <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Skeleton height="16px" width="60%" />
        <Skeleton height="32px" width="40%" />
        <Skeleton height="14px" width="80%" />
      </div>
    );
  }

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {icon && <div className="stat-card-icon" style={{ color: iconColor || 'var(--text-secondary)' }}>{icon}</div>}
      </div>

      <div className="stat-card-value" style={{ color: valueColor || 'var(--text-main)' }}>
        {value}
      </div>

      {subtitle && (
        <div className="stat-card-subtitle">
          {subtitle}
        </div>
      )}
    </div>
  );
}
