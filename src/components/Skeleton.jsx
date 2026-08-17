import React from 'react';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}
