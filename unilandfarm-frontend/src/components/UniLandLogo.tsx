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
  // Dimension mapping
  const dimensions = {
    sm: { iconSize: 30, fontSize: '1.05rem', subSize: '0.52rem', gap: '9px' },
    md: { iconSize: 38, fontSize: '1.25rem', subSize: '0.62rem', gap: '11px' },
    lg: { iconSize: 48, fontSize: '1.65rem', subSize: '0.72rem', gap: '14px' },
    xl: { iconSize: 64, fontSize: '2.1rem', subSize: '0.82rem', gap: '16px' },
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
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <img
          src="/assets/unilandfarm_monogram_transparent.png"
          alt="UNI-LANDFARM Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: isDarkSurface
              ? 'drop-shadow(0 2px 8px rgba(110, 136, 84, 0.45))'
              : 'drop-shadow(0 2px 6px rgba(35, 55, 38, 0.2))',
          }}
        />
      </div>

      {/* Brand Typography Block */}
      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: dimensions.fontSize,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            {/* UNI- in forest green (or white on dark) */}
            <span
              style={{
                color: isDarkSurface ? '#F7F5EE' : '#233726',
                fontWeight: 800,
              }}
            >
              UNI-
            </span>
            {/* LANDFARM in moss / olive green */}
            <span
              style={{
                color: isDarkSurface ? '#8EB571' : '#6E8854',
                fontWeight: 800,
              }}
            >
              LANDFARM
            </span>
          </div>
          {showTagline && (
            <span
              style={{
                fontSize: dimensions.subSize,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: isDarkSurface ? 'rgba(247, 245, 238, 0.65)' : '#62685E',
                marginTop: '3px',
              }}
            >
              Digitalisasi UMKM &amp; Agrobisnis
            </span>
          )}
        </div>
      )}
    </div>
  );
};

