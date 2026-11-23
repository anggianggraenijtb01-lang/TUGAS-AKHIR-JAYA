import React from 'react';

interface UniLandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'on-gold' | 'light';
  showTagline?: boolean;
  iconOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const UniLandLogo: React.FC<UniLandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = false,
  iconOnly = false,
  className = '',
  style = {},
  onClick,
}) => {
  const dimensions = {
    sm: { iconSize: 28, fontSize: '1.05rem', subSize: '0.55rem', gap: '8px' },
    md: { iconSize: 36, fontSize: '1.25rem', subSize: '0.62rem', gap: '10px' },
    lg: { iconSize: 46, fontSize: '1.6rem', subSize: '0.72rem', gap: '12px' },
    xl: { iconSize: 58, fontSize: '2.05rem', subSize: '0.8rem', gap: '14px' },
  }[size];

  const isDarkSurface = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dimensions.gap,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Brand Monogram Icon */}
      <div
        style={{
          width: `${dimensions.iconSize}px`,
          height: `${dimensions.iconSize}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: '10px',
          overflow: 'hidden',
          background: isDarkSurface ? '#183C57' : '#102B3F',
          boxShadow: isDarkSurface
            ? '0 2px 10px rgba(198, 243, 107, 0.25)'
            : '0 2px 8px rgba(16, 43, 63, 0.18)',
        }}
      >
        <svg
          width={dimensions.iconSize * 0.72}
          height={dimensions.iconSize * 0.72}
          viewBox="0 0 32 32"
          fill="none"
        >
          {/* Stylized Modern U & Leaf Spark */}
          <path
            d="M8 8V18C8 22.4183 11.5817 26 16 26C20.4183 26 24 22.4183 24 18V8"
            stroke="#F8FAF7"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="24" cy="8" r="3.2" fill="#C6F36B" />
          <path
            d="M13 14L16 17L21 11"
            stroke="#C6F36B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Typography Block */}
      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: dimensions.fontSize,
              letterSpacing: '-0.025em',
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            {/* UNI- in Deep Navy (or white on dark) */}
            <span
              style={{
                color: isDarkSurface ? '#F8FAF7' : '#102B3F',
                fontWeight: 800,
              }}
            >
              UNI-
            </span>
            {/* LANDFARM in Fresh Lime on dark, or Deep Navy with Lime accent */}
            <span
              style={{
                color: isDarkSurface ? '#C6F36B' : '#102B3F',
                fontWeight: 800,
              }}
            >
              LANDFARM
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#C6F36B',
                marginLeft: '3px',
              }}
            />
          </div>
          {showTagline && (
            <span
              style={{
                fontSize: dimensions.subSize,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: isDarkSurface ? 'rgba(248, 250, 247, 0.72)' : '#557184',
                marginTop: '3px',
              }}
            >
              Ceritakan. Wujudkan. Bagikan.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
