import React from 'react';

const Logo: React.FC<{ className?: string; iconOnly?: boolean }> = ({ className = 'w-auto h-8', iconOnly = false }) => (
  <svg
    className={className}
    viewBox={iconOnly ? "0 0 50 50" : "0 0 280 50"}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Findaphotographer Logo"
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>

    {/* Icon Part */}
    <g transform={iconOnly ? "translate(25, 25)" : "translate(25, 25)"}>
      <circle cx="0" cy="0" r="22" fill="url(#logo-gradient)" opacity="0.2" />
      <path
        d="M -11.95 -18.02 A 22 22 0 0 1 11.95 -18.02 L 6.83 -3.01 A 12 12 0 0 0 -6.83 -3.01 Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M 21.35 -4.92 A 22 22 0 0 1 9.4 19.98 L 2.06 9.81 A 12 12 0 0 0 11.58 -1.2 Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M -9.4 19.98 A 22 22 0 0 1 -21.35 -4.92 L -11.58 -1.2 A 12 12 0 0 0 -2.06 9.81 Z"
        fill="url(#logo-gradient)"
      />
      <circle cx="0" cy="0" r="5" fill="#0D1117" />
      <circle cx="0" cy="0" r="3" fill="white" />
    </g>

    {/* Text Part */}
    {!iconOnly && (
        <text
          x="55"
          y="33"
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="white"
        >
          Findaphotographer
        </text>
    )}
  </svg>
);

export default Logo;