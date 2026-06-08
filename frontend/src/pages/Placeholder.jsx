import React from 'react';

const Placeholder = ({ title }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
      <h1 className="text-2xl" style={{ color: 'white', marginBottom: '16px' }}>{title || "Coming Soon"}</h1>
      <p>This page is currently under construction. Check back later!</p>
    </div>
  );
};

export default Placeholder;
