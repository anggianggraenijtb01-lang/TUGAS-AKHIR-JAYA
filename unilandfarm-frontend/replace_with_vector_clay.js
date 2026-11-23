import fs from 'fs';
import path from 'path';

const heroPath = path.resolve('src/components/HeroLanding.tsx');
let content = fs.readFileSync(heroPath, 'utf8');

// 1. Add ClayElements imports at top
if (!content.includes("from './ClayElements'")) {
  content = content.replace(
    "import { LandingPage, TokenPackage, Template } from '../types';",
    `import { LandingPage, TokenPackage, Template } from '../types';
import {
  ClayStar,
  ClaySparkle,
  ClayLoopArrow,
  ClayLeafBranch,
  ClayLeafVine,
  ClayStarDivider,
  ClayBadge,
  ClayPaperAirplane,
  ClayFarmerCharacter,
  ClayAvocado,
  ClayStrawberry,
  ClayCorn,
  ClayVeggieCrate,
} from './ClayElements';`
  );
  console.log('ClayElements imported!');
}

// 2. Section 1 (Hero): Replace paper airplane image
content = content.replace(
  `<img
                  src="/assets/elements/paper_airplane.png"
                  alt="Paper Airplane"
                  className="clay-floating anim-bob"
                  style={{ top: '-38px', right: '20px', width: '65px', zIndex: 5 }}
                />`,
  `<ClayPaperAirplane
                  size={60}
                  className="clay-floating anim-bob"
                  style={{ top: '-42px', right: '15px', zIndex: 5 }}
                />`
);

// Section 1 Mockup surroundings:
const oldMockupDecorStart = '{/* 3D CLAY ASSETS (Exact from reference element sheet) */}';
const oldMockupDecorEnd = '<div className="floating-assistant-card">';

const newMockupDecor = `{/* 3D CLAY VECTOR ASSETS — Razor Sharp, Fully Handcrafted Vector Art */}
              {/* 1. Lush Green Leaf Branch peeking behind browser */}
              <ClayLeafBranch
                size={74}
                className="clay-floating anim-sway"
                style={{
                  top: '-45px',
                  right: '-18px',
                  zIndex: 1,
                  transform: 'rotate(25deg)',
                }}
              />

              {/* 2. 3D Chubby Orange Star (Left side of window) */}
              <ClayStar
                size={54}
                variant="orange"
                className="clay-floating anim-bob"
                style={{
                  top: '120px',
                  left: '-24px',
                  zIndex: 10,
                }}
              />

              {/* 3. 3D Chubby Gold Star / Sparkle (Right side resting on window edge) */}
              <ClayStar
                size={50}
                variant="gold"
                className="clay-floating anim-bob"
                style={{
                  top: '155px',
                  right: '-18px',
                  zIndex: 10,
                  animationDelay: '1.2s',
                }}
              />

              {/* 4. Real 3D Orange Looped Arrow Tube */}
              <ClayLoopArrow
                size={70}
                className="clay-floating"
                style={{
                  left: '-26px',
                  top: '190px',
                  zIndex: 10,
                  transform: 'rotate(-15deg)',
                }}
              />

              {/* 5. 3D Sparkle Burst (Top Left) */}
              <ClaySparkle
                size={44}
                color="#facc15"
                className="clay-floating anim-bob"
                style={{
                  top: '40px',
                  left: '-10px',
                  zIndex: 5,
                }}
              />

              {/* 6. Playful White Rays \\ | / (Top-Right of Window) */}
              <svg width="40" height="40" viewBox="0 0 40 40" style={{ position: 'absolute', top: '0px', right: '30px', zIndex: 4, stroke: '#ffffff', strokeWidth: '3.5', strokeLinecap: 'round', opacity: 0.95 }}>
                <line x1="8" y1="28" x2="2" y2="18" />
                <line x1="20" y1="26" x2="20" y2="10" />
                <line x1="32" y1="28" x2="38" y2="18" />
              </svg>

              {/* 7. Clay Badge: AI Generated (Bottom-Left) */}
              <ClayBadge
                type="ai-generated"
                className="clay-floating anim-bob"
                style={{
                  bottom: '75px',
                  left: '10px',
                  zIndex: 10,
                  pointerEvents: 'auto',
                }}
                onClick={() => onOpenAiWizard('Katering Berkah Nusantara')}
              />

              <div className="floating-assistant-card"`;

if (content.includes(oldMockupDecorStart)) {
  const sIdx = content.indexOf(oldMockupDecorStart);
  const eIdx = content.indexOf(oldMockupDecorEnd);
  content = content.slice(0, sIdx) + newMockupDecor + content.slice(eIdx + oldMockupDecorEnd.length);
  console.log('Hero mockup surroundings replaced with vector components!');
}

// Inside assistant card: replace badge_instant.png with ClayBadge
content = content.replace(
  '<img src="/assets/elements/badge_instant.png" alt="Instant" style={{ height: \'24px\' }} />',
  '<ClayBadge type="instant" style={{ padding: "4px 10px", fontSize: "0.72rem" }} />'
);

// 3. Section 2: Replace leaf_vine_branch.png with ClayLeafVine
content = content.replace(
  `<img src="/assets/elements/leaf_vine_branch.png" alt="Vine" style={{ height: '32px' }} />`,
  `<ClayLeafVine width={200} />`
);

// In Section 2 phone mockup: Clean up any old image tags
content = content.replace(
  `{/* Floating Clay Market Stall & Wooden Sign next to phone */}
              <img
                src="/assets/elements/market_stall.png"
                alt="Market Stall"
                className="clay-floating anim-bob"
                style={{
                  top: '15px',
                  left: '-45px',
                  width: '90px',
                  zIndex: 5,
                }}
              />
              <img
                src="/assets/elements/wooden_sign.png"
                alt="Local Fresh Organic"
                className="clay-floating anim-bob"
                style={{
                  bottom: '40px',
                  right: '-45px',
                  width: '78px',
                  zIndex: 5,
                  animationDelay: '1.5s',
                }}
              />
              <img
                src="/assets/elements/watering_can.png"
                alt="Watering Can"
                className="clay-floating anim-bob"
                style={{
                  top: '180px',
                  right: '-35px',
                  width: '64px',
                  zIndex: 5,
                  animationDelay: '0.8s',
                }}
              />`,
  `{/* Playful Floating Clay Stars & Leaves */}
              <ClayStar
                size={42}
                variant="gold"
                className="clay-floating anim-bob"
                style={{ top: '20px', left: '-30px', zIndex: 5 }}
              />
              <ClayStar
                size={38}
                variant="orange"
                className="clay-floating anim-bob"
                style={{ bottom: '50px', right: '-25px', zIndex: 5, animationDelay: '1s' }}
              />`
);

// In Section 2: Add ClayBadges to first 3 feature cards
content = content.replace(
  `                    <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
                      {feat.icon}
                    </div>`,
  `                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{feat.icon}</span>
                      {idx === 0 && <ClayBadge type="instant" style={{ fontSize: '0.68rem', padding: '3px 8px' }} />}
                      {idx === 1 && <ClayBadge type="ai-generated" style={{ fontSize: '0.68rem', padding: '3px 8px' }} />}
                      {idx === 3 && <ClayBadge type="popular" style={{ fontSize: '0.68rem', padding: '3px 8px' }} />}
                    </div>`
);

// 4. Section 3: Replace divider_star.png with ClayStarDivider
content = content.replace(
  `<img src="/assets/elements/divider_star.png" alt="Star Divider" style={{ maxWidth: '280px', height: '22px' }} />`,
  `<ClayStarDivider />`
);

// Template cards produce icons: Replace img tag with ClayAvocado, ClayStrawberry, etc.
content = content.replace(
  `<img
                    src={tpl.clayIcon}
                    alt=""
                    className="clay-floating anim-bob"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '40px',
                      zIndex: 3,
                    }}
                  />`,
  `<div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 3 }} className="anim-bob">
                    {tpl.id === 'tpl_1' && <ClayAvocado size={42} />}
                    {tpl.id === 'tpl_2' && <ClayStrawberry size={40} />}
                    {tpl.id === 'tpl_3' && <ClayCorn size={40} />}
                    {tpl.id === 'tpl_4' && <ClayVeggieCrate size={46} />}
                  </div>`
);

// 5. Section 4: Replace farmer image with ClayFarmerCharacter
content = content.replace(
  `<img
                  src="/assets/elements/farmer_character.png"
                  alt="Bersama Tumbuh Lebih Maju"
                  style={{
                    maxWidth: '240px',
                    filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.25))',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                  }}
                  className="anim-bob"
                  onClick={() => onOpenAiWizard(websiteName)}
                />`,
  `<ClayFarmerCharacter
                  onClick={() => onOpenAiWizard(websiteName)}
                  style={{ cursor: 'pointer' }}
                />`
);

// Near form submit: Replace seed_sack.png with ClayBadge instant
content = content.replace(
  `<img src="/assets/elements/seed_sack.png" alt="Seed" style={{ height: '36px' }} />`,
  `<ClayBadge type="instant" style={{ fontSize: '0.78rem', padding: '6px 12px' }} />`
);

fs.writeFileSync(heroPath, content, 'utf8');
console.log('HeroLanding.tsx updated with 100% pure vector clay components!');
