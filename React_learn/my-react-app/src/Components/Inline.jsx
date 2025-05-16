import React from 'react';

export default function Inline() {
  const heading = {
    fontSize: '72px',
    color: "orange"
  }

  return (
    <div>
      <h1 style={heading}>This is an inline element</h1> {/* ✅ FIXED */}
      <h2 style={{ color: "red" }}>This is red text</h2>
    </div>
  );
}
