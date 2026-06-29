import React from 'react';

// Cute Cartoon Apple SVG
export const AppleSVG: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C52 10 60 5 62 12C63.5 17 56 22 50 25" stroke="#4caf50" strokeWidth="6" strokeLinecap="round" />
    <path d="M35 15C22 25 15 45 20 65C25 85 45 92 50 85C55 92 75 85 80 65C85 45 78 25 65 15C57 9 50 16 50 15C50 16 43 9 35 15Z" fill="#ff5252" />
    <path d="M72 32C78 40 76 56 70 65" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// Cute Cartoon Space Rocket SVG
export const RocketSVG: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wings */}
    <path d="M15 80C10 90 5 100 15 105C30 110 35 85 35 80H15Z" fill="#ff5252" />
    <path d="M85 80C90 90 95 100 85 105C70 110 65 85 65 80H85Z" fill="#ff5252" />
    {/* Body */}
    <path d="M50 5C25 35 25 70 25 95C25 100 75 100 75 95C75 70 75 35 50 5Z" fill="#f5f5f5" />
    <path d="M50 5C62.5 20 75 35 75 95H50V5Z" fill="#e0e0e0" />
    {/* Window */}
    <circle cx="50" cy="50" r="14" fill="#00e5ff" stroke="#ffffff" strokeWidth="4" />
    <path d="M42 42C48 38 52 38 58 42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    {/* Nose cone */}
    <path d="M50 5C38 21 28.5 35 28.5 45C38.5 45 61.5 45 71.5 45C71.5 35 62 21 50 5Z" fill="#ff5252" />
  </svg>
);

// Flame SVG for Rocket Thruster
export const FlameSVG: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 60 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 0C48 20 60 45 60 60C60 75 48 80 30 80C12 80 0 75 0 60C0 45 12 20 30 0Z" fill="#ff9100" />
    <path d="M30 20C40 35 48 50 48 60C48 70 40 73 30 73C20 73 12 70 12 60C12 50 20 35 30 20Z" fill="#ffea00" />
  </svg>
);

// High-polish Star SVG
export const CustomStarSVG: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 2L63.5 35.5L98 38L71 60L79.5 95L50 76.5L20.5 95L29 60L2 38L36.5 35.5L50 2Z" fill="#ffd54f" stroke="#ffb300" strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 12V70L30 83L36 56L16 38L42 36L50 12Z" fill="#fff176" opacity="0.6" />
  </svg>
);

// Golden Trophy SVG
export const CustomTrophySVG: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20H80V50C80 65 65 75 50 75C35 75 20 65 20 50V20Z" fill="#ffd54f" stroke="#ffb300" strokeWidth="4" />
    <path d="M35 75H65V85H35V75Z" fill="#ffb300" />
    <path d="M25 85H75V95H25V85Z" fill="#78909c" />
    <path d="M20 30H10V45C10 50 20 52 20 52V30Z" stroke="#ffb300" strokeWidth="6" strokeLinecap="round" />
    <path d="M80 30H90V45C90 50 80 52 80 52V30Z" stroke="#ffb300" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// Bright Rainbow SVG
export const RainbowSVG: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 60A50 50 0 0 1 110 60" stroke="#ff5252" strokeWidth="8" strokeLinecap="round" />
    <path d="M20 60A40 40 0 0 1 100 60" stroke="#ffb74d" strokeWidth="8" strokeLinecap="round" />
    <path d="M30 60A30 30 0 0 1 90 60" stroke="#fff176" strokeWidth="8" strokeLinecap="round" />
    <path d="M40 60A20 20 0 0 1 80 60" stroke="#81c784" strokeWidth="8" strokeLinecap="round" />
    <path d="M50 60A10 10 0 0 1 70 60" stroke="#4fc3f7" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

// Mascot Dinosaur SVG (with expression variations)
export const MascotSVG: React.FC<{ expression?: 'happy' | 'thinking' | 'excited'; className?: string }> = ({
  expression = 'happy',
  className = 'w-24 h-24',
}) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back Spikes */}
      <path d="M25 25L15 35L28 42L22 55L35 60" fill="#ffb74d" />
      {/* Body / Head */}
      <path d="M30 85C25 55 35 25 60 25C80 25 85 45 80 65C75 85 45 90 30 85Z" fill="#81c784" />
      {/* Cheeks */}
      <circle cx="50" cy="55" r="6" fill="#ff8a65" opacity="0.6" />
      <circle cx="74" cy="55" r="6" fill="#ff8a65" opacity="0.6" />

      {/* Expression Eyes */}
      {expression === 'happy' && (
        <>
          <path d="M48 45C48 42 54 42 54 45" stroke="#2c3e50" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 45C68 42 74 42 74 45" stroke="#2c3e50" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {expression === 'thinking' && (
        <>
          <line x1="48" y1="45" x2="56" y2="45" stroke="#2c3e50" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 47C68 44 74 44 74 47" stroke="#2c3e50" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {expression === 'excited' && (
        <>
          <circle cx="51" cy="45" r="4" fill="#2c3e50" />
          <circle cx="71" cy="45" r="4" fill="#2c3e50" />
          {/* Sparkles */}
          <path d="M85 20L88 28L96 31L88 34L85 42L82 34L74 31L82 28L85 20Z" fill="#ffd54f" />
        </>
      )}

      {/* Mouth */}
      {expression === 'excited' ? (
        <path d="M56 62C56 68 68 68 68 62H56Z" fill="#ff5252" stroke="#2c3e50" strokeWidth="3" />
      ) : (
        <path d="M58 64C62 67 66 64 66 64" stroke="#2c3e50" strokeWidth="4" strokeLinecap="round" />
      )}
    </svg>
  );
};

// Map names/ids to avatar designs
export const AvatarSVG: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-16 h-16' }) => {
  const colorMap: Record<string, string> = {
    '🐯': '#ffb74d', // Tiger
    'fox': '#ff8a65', // Fox
    'lion': '#ffb74d', // Lion
    'frog': '#81c784', // Frog
    'koala': '#b0bec5', // Koala
    'panda': '#f5f5f5', // Panda
    'monkey': '#a1887f', // Monkey
    'unicorn': '#e1bee7', // Unicorn
  };

  const color = colorMap[name.toLowerCase()] || '#4fc3f7';

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle cx="50" cy="50" r="46" fill={color} opacity="0.3" stroke={color} strokeWidth="3" />
      {/* Cute Head Circle */}
      <circle cx="50" cy="52" r="30" fill={color} stroke="#374151" strokeWidth="4" />
      
      {/* Animal Specific Features */}
      {name === '🐯' && (
        <>
          {/* Tiger Ears */}
          <circle cx="28" cy="28" r="10" fill="#e65100" stroke="#374151" strokeWidth="4" />
          <circle cx="72" cy="28" r="10" fill="#e65100" stroke="#374151" strokeWidth="4" />
          {/* Stripes */}
          <path d="M30 45H40" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 45H60" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
        </>
      )}

      {/* General Cute Face Detail */}
      {/* General Cute Face Detail */}
      <circle cx="42" cy="48" r="3" fill="#374151" />
      <circle cx="58" cy="48" r="3" fill="#374151" />
      <path d="M47 58C49 60 51 60 53 58" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

// Fruit Basket SVG (for counting by 5s)
export const BasketSVG: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10C35 10 30 25 30 35H70C70 25 65 10 50 10Z" stroke="#8d6e63" strokeWidth="6" />
    <path d="M20 35H80V45C80 65 70 85 50 85C30 85 20 65 20 45V35Z" fill="#a1887f" stroke="#8d6e63" strokeWidth="4" />
    <path d="M25 45L75 75M75 45L25 75" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" />
    {/* Apples peeking out */}
    <circle cx="40" cy="35" r="10" fill="#ff5252" />
    <circle cx="50" cy="30" r="10" fill="#ff7043" />
    <circle cx="60" cy="35" r="10" fill="#ff5252" />
  </svg>
);

// Wooden Crate SVG (for counting by 10s)
export const CrateSVG: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="70" height="70" rx="10" fill="#b0bec5" stroke="#78909c" strokeWidth="5" />
    <rect x="22" y="22" width="56" height="56" rx="6" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="4" />
    <path d="M15 15L85 85M85 15L15 85" stroke="#78909c" strokeWidth="4" />
    <circle cx="50" cy="50" r="18" fill="#ffd54f" stroke="#ffb300" strokeWidth="3" />
    <text x="50" y="56" textAnchor="middle" fill="#795548" fontSize="20" fontWeight="900">10</text>
  </svg>
);

// Toy Delivery Truck SVG (for counting by 100s)
export const TruckSVG: React.FC<{ className?: string }> = ({ className = 'w-24 h-20' }) => (
  <svg viewBox="0 0 120 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Truck Bed */}
    <rect x="10" y="15" width="70" height="50" rx="6" fill="#ffb74d" stroke="#f57c00" strokeWidth="4" />
    {/* Cab */}
    <path d="M80 30H100L112 50V65H80V30Z" fill="#4fc3f7" stroke="#0288d1" strokeWidth="4" />
    {/* Window */}
    <path d="M92 36H100L108 48H92V36Z" fill="#ffffff" />
    {/* Wheels */}
    <circle cx="30" cy="72" r="12" fill="#374151" stroke="#1f2937" strokeWidth="4" />
    <circle cx="30" cy="72" r="4" fill="#ffffff" />
    <circle cx="85" cy="72" r="12" fill="#374151" stroke="#1f2937" strokeWidth="4" />
    <circle cx="85" cy="72" r="4" fill="#ffffff" />
    {/* Badge */}
    <rect x="25" y="28" width="40" height="24" rx="4" fill="#ffffff" />
    <text x="45" y="45" textAnchor="middle" fill="#f57c00" fontSize="14" fontWeight="900">100</text>
  </svg>
);

