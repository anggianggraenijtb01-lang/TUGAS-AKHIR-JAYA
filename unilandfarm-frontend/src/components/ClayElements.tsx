import React from 'react';

// ============================================================
// 1. REAL 3D PUFFY CLAY STAR
// ============================================================
interface ClayStarProps {
  size?: number;
  variant?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ClayStar: React.FC<ClayStarProps> = ({
  size = 54,
  variant: _variant = 'orange',
  className = '',
  style = {},
}) => {
  return (
    <img
      src="/assets/3d/star.png"
      alt="3D Clay Star"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        objectFit: 'contain',
        filter: 'drop-shadow(0 12px 22px rgba(0,0,0,0.28))',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// ============================================================
// 2. 3D GLOSSY YELLOW CLAY SPARKLE / STAR
// ============================================================
export const ClaySparkle: React.FC<{ size?: number; color?: string; className?: string; style?: React.CSSProperties }> = ({
  size = 46,
  color: _color = '#facc15',
  className = '',
  style = {},
}) => {
  return (
    <img
      src="/assets/3d/sparkling.png"
      alt="3D Sparkle"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        objectFit: 'contain',
        filter: 'drop-shadow(0 8px 18px rgba(245, 158, 11, 0.45))',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// ============================================================
// 3. 3D BURGUNDY / WINE DIAMOND STAR (Right side of hero mockup)
// ============================================================
export const ClayBurgundyDiamond: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 38,
  className = '',
  style = {},
}) => {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 40 46"
      fill="none"
      className={className}
      style={{
        display: 'inline-block',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <defs>
        <radialGradient id="burgundyGleam" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="45%" stopColor="#781d28" />
          <stop offset="85%" stopColor="#4c0e17" />
          <stop offset="100%" stopColor="#2c080d" />
        </radialGradient>
      </defs>
      {/* 4-point Diamond Star Shape */}
      <path
        d="M 20 2 C 22 14, 25 18, 38 23 C 25 28, 22 32, 20 44 C 18 32, 15 28, 2 23 C 15 18, 18 14, 20 2 Z"
        fill="url(#burgundyGleam)"
      />
      {/* Facet Highlights */}
      <path d="M 20 2 L 20 23 L 38 23 Z" fill="#ffffff" opacity="0.18" />
      <path d="M 20 23 L 20 44 L 2 23 Z" fill="#000000" opacity="0.2" />
      <circle cx="18" cy="18" r="2.5" fill="#ffffff" opacity="0.75" />
    </svg>
  );
};

// ============================================================
// 4. HAND-DRAWN DOODLE ARROW (Left Loop pointing to mockup)
// ============================================================
export const ClayDoodleArrowLeft: React.FC<{ style?: React.CSSProperties; className?: string }> = ({
  style = {},
  className = '',
}) => {
  return (
    <svg
      width="56"
      height="72"
      viewBox="0 0 56 72"
      fill="none"
      className={className}
      style={{
        display: 'inline-block',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Loop trajectory */}
      <path
        d="M 12 6 C 2 22, -2 42, 8 52 C 16 61, 30 56, 26 40 C 22 28, 10 34, 36 46"
        stroke="#4a2618"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead */}
      <path
        d="M 30 38 L 40 47 L 30 52"
        stroke="#4a2618"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================
// 5. HAND-DRAWN DOODLE ARROW (Right Swoop pointing to AI Assistant)
// ============================================================
export const ClayDoodleArrowRight: React.FC<{ style?: React.CSSProperties; className?: string }> = ({
  style = {},
  className = '',
}) => {
  return (
    <svg
      width="52"
      height="70"
      viewBox="0 0 52 70"
      fill="none"
      className={className}
      style={{
        display: 'inline-block',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Swoop downward */}
      <path
        d="M 28 6 C 36 22, 34 38, 20 58"
        stroke="#592518"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M 12 52 L 20 60 L 27 54"
        stroke="#592518"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================
// 6. DOODLE BURST RAYS
// ============================================================
export const ClayWhiteRays: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    style={{ display: 'inline-block', userSelect: 'none', pointerEvents: 'none', ...style }}
  >
    <line x1="8" y1="32" x2="2" y2="20" stroke="#faeed1" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="22" y1="28" x2="22" y2="10" stroke="#faeed1" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="36" y1="32" x2="42" y2="20" stroke="#faeed1" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export const ClayButterRays: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <svg
    width="42"
    height="36"
    viewBox="0 0 42 36"
    fill="none"
    style={{ display: 'inline-block', userSelect: 'none', pointerEvents: 'none', ...style }}
  >
    <line x1="10" y1="8" x2="4" y2="24" stroke="#faeed1" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="21" y1="6" x2="21" y2="26" stroke="#faeed1" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="32" y1="8" x2="38" y2="24" stroke="#faeed1" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

// ============================================================
// 7. BOTANICAL PETAL DECORATIONS WITH DETAILED LEAF VEINS (SERAT-SERAT DAUN)
// ============================================================
export const HeroBotanicalBottomLeft: React.FC = () => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '145px',
      height: '145px',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}
  >
    <g transform="translate(0, 200)">
      {/* Petal 1: Leftmost (-40 deg) */}
      <g transform="rotate(-40)">
        <ellipse cx="40" cy="-40" rx="28" ry="68" fill="#faeed1" opacity="0.95" />
        {/* Serat Daun (Leaf Veins) */}
        <path d="M 40 -8 L 40 -72" stroke="#4a652d" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
        <path d="M 40 -20 Q 30 -26 22 -24" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 40 -20 Q 50 -26 58 -24" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 40 -36 Q 28 -44 20 -40" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 40 -36 Q 52 -44 60 -40" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 40 -52 Q 32 -58 26 -54" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 40 -52 Q 48 -58 54 -54" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Petal 2: (-15 deg) */}
      <g transform="rotate(-15)">
        <ellipse cx="60" cy="-78" rx="26" ry="65" fill="#f8edd0" opacity="0.95" />
        {/* Serat Daun */}
        <path d="M 60 -42 L 60 -108" stroke="#4a652d" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
        <path d="M 60 -56 Q 50 -62 42 -60" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 60 -56 Q 70 -62 78 -60" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 60 -74 Q 48 -82 40 -78" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 60 -74 Q 72 -82 80 -78" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 60 -92 Q 52 -97 46 -94" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 60 -92 Q 68 -97 74 -94" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Petal 3: Center-Right (+15 deg) */}
      <g transform="rotate(15)">
        <ellipse cx="98" cy="-100" rx="24" ry="60" fill="#faeed1" opacity="0.92" />
        {/* Serat Daun */}
        <path d="M 98 -68 L 98 -128" stroke="#4a652d" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
        <path d="M 98 -82 Q 88 -88 82 -86" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 98 -82 Q 108 -88 114 -86" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 98 -98 Q 88 -106 82 -102" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 98 -98 Q 108 -106 114 -102" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 98 -114 Q 92 -118 86 -116" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M 98 -114 Q 104 -118 110 -116" stroke="#4a652d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Petal 4: Right (+40 deg) */}
      <g transform="rotate(40)">
        <ellipse cx="125" cy="-85" rx="22" ry="54" fill="#f7eac7" opacity="0.88" />
        {/* Serat Daun */}
        <path d="M 125 -58 L 125 -112" stroke="#4a652d" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M 125 -72 Q 116 -78 110 -76" stroke="#4a652d" strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
        <path d="M 125 -72 Q 134 -78 140 -76" stroke="#4a652d" strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
        <path d="M 125 -88 Q 116 -94 112 -92" stroke="#4a652d" strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
        <path d="M 125 -88 Q 134 -94 138 -92" stroke="#4a652d" strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Base bulb */}
      <circle cx="0" cy="0" r="75" fill="#f6e7c2" opacity="0.95" />
    </g>
  </svg>
);

export const HeroBotanicalBottomRight: React.FC = () => (
  <svg
    viewBox="0 0 700 280"
    fill="none"
    style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 'clamp(360px, 48vw, 750px)',
      height: 'auto',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    {/* Smooth sweeping cream hill transitioning seamlessly into Section 2 */}
    <path
      d="M 700 0 C 530 35, 400 120, 220 190 C 100 235, 30 260, 0 280 L 700 280 Z"
      fill="#faeed1"
    />

    {/* Clean, smooth organic transition hill into Section 2 */}
    <ellipse cx="610" cy="80" rx="18" ry="36" transform="rotate(-30 610 80)" fill="#f6e7c2" opacity="0.6" />
    <ellipse cx="320" cy="220" rx="14" ry="28" transform="rotate(45 320 220)" fill="#f6e7c2" opacity="0.5" />
  </svg>
);

// ============================================================
// 8. REAL 3D ICONS COMPONENT (Loaded from web)
// ============================================================
export interface Real3DIconProps {
  name:
    | 'star'
    | 'sparkling'
    | 'rocket'
    | 'flash-on'
    | 'shopping-bag'
    | 'chat-message'
    | 'idea'
    | 'trophy'
    | 'whatsapp'
    | 'bot'
    | 'compass'
    | 'crown'
    | 'fire'
    | 'clock'
    | 'checked-checkbox'
    | 'checkmark'
    | 'globe'
    | 'qr-code'
    | 'wallet'
    | 'discount'
    | 'cash-in-hand'
    | 'bar-chart'
    | 'link'
    | 'sprout'
    | 'carrot'
    | 'restaurant'
    | 'confetti'
    | 'shield'
    | 'search';
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Real3DIcon: React.FC<Real3DIconProps> = ({
  name,
  size = 48,
  className = '',
  style = {},
}) => {
  return (
    <img
      src={`/assets/3d/${name}.png`}
      alt={`3D ${name}`}
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        objectFit: 'contain',
        filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.22))',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// ============================================================
// 9. REAL 3D CLAY BADGES (Tactile Convex Claymorphic Pill)
// ============================================================
interface ClayBadgeProps {
  type: 'ai-generated' | 'instant' | 'popular' | 'new';
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  type,
  onClick,
  style = {},
  className = '',
}) => {
  const configs = {
    'ai-generated': {
      bg: '#faeed1',
      border: '1.5px solid rgba(255, 255, 255, 0.9)',
      color: '#2a3518',
      boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
      icon: '',
      text: 'AI Generated',
    },
    instant: {
      bg: 'linear-gradient(145deg, #fef08a 0%, #eab308 100%)',
      border: '2px solid rgba(253, 224, 71, 0.85)',
      color: '#713f12',
      boxShadow:
        '0 8px 18px rgba(234, 179, 8, 0.4), inset 0 3px 5px rgba(255,255,255,0.7), inset 0 -3px 5px rgba(161,98,7,0.35)',
      icon: '⚡',
      text: 'Instant',
    },
    popular: {
      bg: 'linear-gradient(145deg, #ff8c5a 0%, #ff5722 100%)',
      border: '2px solid rgba(255, 120, 68, 0.85)',
      color: '#ffffff',
      boxShadow:
        '0 8px 18px rgba(255, 87, 34, 0.4), inset 0 3px 5px rgba(255,255,255,0.5), inset 0 -3px 5px rgba(185,28,28,0.35)',
      icon: '🔥',
      text: 'Popular',
    },
    new: {
      bg: 'linear-gradient(145deg, #ef4444 0%, #dc2626 100%)',
      border: '2px solid rgba(248, 113, 113, 0.85)',
      color: '#ffffff',
      boxShadow:
        '0 8px 18px rgba(220, 38, 38, 0.4), inset 0 3px 5px rgba(255,255,255,0.5)',
      icon: '+',
      text: 'New',
    },
  };

  const cfg = configs[type];

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: cfg.icon ? '6px' : '0',
        padding: '7px 20px',
        borderRadius: '9999px',
        background: cfg.bg,
        border: cfg.border,
        color: cfg.color,
        fontWeight: 800,
        fontSize: '0.86rem',
        boxShadow: cfg.boxShadow,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style,
      }}
    >
      {cfg.icon && <span>{cfg.icon}</span>}
      <span>{cfg.text}</span>
    </div>
  );
};

// ============================================================
// 10. REAL 3D CLAY LEAF BRANCH
// ============================================================
export const ClayLeafBranch: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 78,
  className = '',
  style = {},
}) => {
  return (
    <img
      src="/assets/3d/leaves_3d.png"
      alt="3D Clay Leaves"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        objectFit: 'contain',
        filter: 'drop-shadow(0 14px 26px rgba(0,0,0,0.3))',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

// ============================================================
// 11. 3D CLAY LOOP ARROW (Alternative thick tube)
// ============================================================
export const ClayLoopArrow: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 72,
  className = '',
  style = {},
}) => {
  return <ClayDoodleArrowLeft style={style} className={className} />;
};

// ============================================================
// 12. 3D CLAY VINE DIVIDER
// ============================================================
export const ClayLeafVine: React.FC<{ width?: number | string; style?: React.CSSProperties }> = ({
  width = 180,
  style = {},
}) => {
  return (
    <svg
      width={width}
      height="42"
      viewBox="0 0 180 42"
      fill="none"
      style={{ display: 'inline-block', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))', ...style }}
    >
      <path
        d="M 8 22 Q 55 12, 100 24 T 172 20"
        stroke="#475f24"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M 32 18 C 26 8, 42 6, 46 17 Z" fill="#698b31" />
      <path d="M 72 19 C 68 30, 84 32, 86 21 Z" fill="#7fa63b" />
      <path d="M 118 23 C 112 12, 128 10, 132 22 Z" fill="#698b31" />
      <path d="M 152 20 C 148 30, 162 30, 164 21 Z" fill="#7fa63b" />
      <circle cx="172" cy="20" r="4" fill="#ff6b35" />
    </svg>
  );
};

// ============================================================
// 13. 3D CLAY STAR DIVIDER BAR
// ============================================================
export const ClayStarDivider: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        width: '100%',
        maxWidth: '340px',
        margin: '0 auto',
        ...style,
      }}
    >
      <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'linear-gradient(to right, transparent, #ebdcc5)' }} />
      <ClayStar size={32} />
      <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'linear-gradient(to left, transparent, #ebdcc5)' }} />
    </div>
  );
};

// ============================================================
// 14. 3D CLAY PAPER AIRPLANE
// ============================================================
export const ClayPaperAirplane: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 58,
  className = '',
  style = {},
}) => {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 100 80"
      className={className}
      style={{
        display: 'inline-block',
        filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.25))',
        ...style,
      }}
    >
      <defs>
        <linearGradient id="planeGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="planeGradWing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path
        d="M 10 65 Q 25 72, 40 60 T 60 52"
        fill="none"
        stroke="#fde047"
        strokeWidth="3.5"
        strokeDasharray="4 4"
        opacity="0.85"
      />
      <polygon points="50,15 95,30 55,65 62,42" fill="url(#planeGradMain)" />
      <polygon points="50,15 95,30 72,38" fill="url(#planeGradWing)" />
      <polygon points="62,42 75,40 55,65" fill="#b45309" opacity="0.6" />
    </svg>
  );
};

// ============================================================
// 15. REAL 3D CLAY FARMER
// ============================================================
export const ClayFarmerCharacter: React.FC<{ onClick?: () => void; style?: React.CSSProperties }> = ({
  onClick,
  style = {},
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '18px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
    >
      <img
        src="/assets/3d/farmer_3d.png"
        alt="3D Young Farmer"
        style={{
          width: '210px',
          height: '210px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 18px 32px rgba(0,0,0,0.32))',
          transition: 'transform 0.3s ease',
        }}
        className="anim-bob"
      />
      <div
        style={{
          background: 'linear-gradient(145deg, #fef08a 0%, #facc15 100%)',
          border: '3px solid #ffffff',
          borderRadius: '24px',
          padding: '16px 24px',
          boxShadow:
            '0 12px 28px rgba(0,0,0,0.22), inset 0 3px 5px rgba(255,255,255,0.7), inset 0 -3px 5px rgba(161,98,7,0.25)',
          position: 'relative',
          maxWidth: '220px',
        }}
        className="anim-bob"
      >
        <div
          style={{
            position: 'absolute',
            left: '-12px',
            top: '36px',
            width: '0',
            height: '0',
            borderTop: '9px solid transparent',
            borderBottom: '9px solid transparent',
            borderRight: '14px solid #facc15',
          }}
        />
        <div
          style={{
            fontWeight: 900,
            fontSize: '1.08rem',
            lineHeight: 1.35,
            color: '#5c2d0c',
            fontFamily: "'Fredoka', sans-serif",
          }}
        >
          Bersama Tumbuh Lebih Maju 🌱
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 16. HARVEST PRODUCE & PRODUCE HELPERS
// ============================================================
export const ClayAvocado: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 42, style = {} }) => (
  <Real3DIcon name="sprout" size={size} style={style} />
);

export const ClayStrawberry: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 40, style = {} }) => (
  <Real3DIcon name="carrot" size={size} style={style} />
);

export const ClayCorn: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 40, style = {} }) => (
  <Real3DIcon name="trophy" size={size} style={style} />
);

export const ClayVeggieCrate: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 46, style = {} }) => (
  <Real3DIcon name="shopping-bag" size={size} style={style} />
);
