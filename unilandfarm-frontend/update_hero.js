import fs from 'fs';
import path from 'path';

const heroPath = path.resolve('src/components/HeroLanding.tsx');
let content = fs.readFileSync(heroPath, 'utf8');

// 1. In Hero Section: Replace floating-chubby-star down to floating-assistant-card
const heroTargetStart = '{/* 3D CHUBBY ORANGE STAR (Left side of window) */}';
const heroTargetEnd = '<div className="floating-assistant-card">';

const heroRepl = `{/* 3D CLAY ASSETS (Exact from reference element sheet) */}
              {/* 1. Lush Green Leaf Branch peeking behind browser */}
              <img
                src="/assets/elements/leaf_branch_lush.png"
                alt="Leaf"
                className="clay-floating anim-sway"
                style={{
                  top: '-45px',
                  right: '-18px',
                  width: '75px',
                  zIndex: 1,
                  transform: 'rotate(25deg)',
                }}
              />

              {/* 2. 3D Chubby Orange Star (Left side of window) */}
              <img
                src="/assets/elements/star_puffy_orange.png"
                alt="3D Star"
                className="clay-floating anim-bob"
                style={{
                  top: '120px',
                  left: '-24px',
                  width: '54px',
                  zIndex: 10,
                }}
              />

              {/* 3. 3D Chubby Yellow Star / Sparkle (Right side resting on window edge) */}
              <img
                src="/assets/elements/star_sparkle_3d.png"
                alt="3D Sparkle"
                className="clay-floating anim-bob"
                style={{
                  top: '155px',
                  right: '-18px',
                  width: '52px',
                  zIndex: 10,
                  animationDelay: '1.2s',
                }}
              />

              {/* 4. Real 3D Orange Looped Arrow */}
              <img
                src="/assets/elements/arrow_orange_loop.png"
                alt="Arrow"
                className="clay-floating"
                style={{
                  left: '-26px',
                  top: '190px',
                  width: '72px',
                  zIndex: 10,
                  transform: 'rotate(-15deg)',
                }}
              />

              {/* 5. 3D Sparkle Burst (Top Left) */}
              <img
                src="/assets/elements/sparkle_burst.png"
                alt="Burst"
                className="clay-floating anim-bob"
                style={{
                  top: '40px',
                  left: '-10px',
                  width: '42px',
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
              <img
                src="/assets/elements/badge_ai_generated.png"
                alt="AI Generated"
                className="clay-floating anim-bob"
                style={{
                  bottom: '75px',
                  left: '10px',
                  height: '42px',
                  zIndex: 10,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
                onClick={() => onOpenAiWizard('Katering Berkah Nusantara')}
              />

              <div className="floating-assistant-card"`;

if (content.includes(heroTargetStart)) {
  const startIdx = content.indexOf(heroTargetStart);
  const endIdx = content.indexOf(heroTargetEnd);
  content = content.slice(0, startIdx) + heroRepl + content.slice(endIdx + heroTargetEnd.length);
  console.log('Hero section updated!');
} else {
  console.log('Hero target start not found');
}

// 2. Add paper airplane above URL input
if (content.includes('<div className="url-cta-bar">') && !content.includes('paper_airplane.png')) {
  content = content.replace(
    '<div className="url-cta-bar">',
    `<div style={{ position: 'relative' }}>
                <img
                  src="/assets/elements/paper_airplane.png"
                  alt="Paper Airplane"
                  className="clay-floating anim-bob"
                  style={{ top: '-38px', right: '20px', width: '65px', zIndex: 5 }}
                />
                <div className="url-cta-bar">`
  );
  content = content.replace(
    '</button>\n              </div>\n            </div>',
    `</button>
              </div>
              </div>
            </div>`
  );
  console.log('URL input paper airplane added!');
}

// 3. Section 2 (Fitur & Keunggulan): Add vine branch divider and market stall/wooden sign
if (content.includes('Semua kebutuhan website kamu, sekarang lebih mudah dengan teknologi Agentic AI.')) {
  content = content.replace(
    'Semua kebutuhan website kamu, sekarang lebih mudah dengan teknologi Agentic AI.\n              </p>',
    `Semua kebutuhan website kamu, sekarang lebih mudah dengan teknologi Agentic AI.
              </p>
              <div style={{ marginBottom: '28px', opacity: 0.9 }}>
                <img src="/assets/elements/leaf_vine_branch.png" alt="Vine" style={{ height: '32px' }} />
              </div>`
  );
  console.log('Vine branch added to Section 2!');
}

// In Section 2 phone mockup: Add Market Stall, Wooden Sign and Watering can
if (content.includes('<div className="bio-phone-frame">') && !content.includes('market_stall.png')) {
  content = content.replace(
    '<div style={{ display: \'flex\', justifyContent: \'center\', position: \'relative\' }}>\n              <div className="bio-phone-frame">',
    `<div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              {/* Floating Clay Market Stall & Wooden Sign next to phone */}
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
              />
              <div className="bio-phone-frame">`
  );
  console.log('Market stall, sign, and watering can added to Section 2!');
}

// 4. Section 3 (Template Showcase): Add Divider Star and Harvest produce to cards
if (content.includes('Pilih Template Favorit Kamu') && !content.includes('divider_star.png')) {
  content = content.replace(
    'Pilih Template Favorit Kamu\n            </h2>',
    `Pilih Template Favorit Kamu
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <img src="/assets/elements/divider_star.png" alt="Star Divider" style={{ maxWidth: '280px', height: '22px' }} />
            </div>`
  );
  console.log('Star divider added to Section 3!');
}

// 5. Section 4 (Setup Form): Add the cute farmer character with speech bubble
if (content.includes('{/* Bottom organic leaf illustration */}') && !content.includes('farmer_character.png')) {
  content = content.replace(
    `{/* Bottom organic leaf illustration */}
              <div style={{ marginTop: '50px', opacity: 0.85 }}>
                <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                  <ellipse cx="40" cy="50" rx="30" ry="18" transform="rotate(-25 40 50)" fill="#445929" />
                  <ellipse cx="75" cy="45" rx="35" ry="16" transform="rotate(20 75 45)" fill="#3b4d24" />
                </svg>
              </div>`,
    `{/* 3D Cute Young Farmer Illustration with Speech Bubble "Bersama Tumbuh Lebih Maju" */}
              <div style={{ marginTop: '36px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
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
                />
              </div>`
  );
  console.log('Farmer character added to Section 4!');
}

// Near setup form submit button: Add seed sack
if (content.includes('Mulai Setup Website →') && !content.includes('seed_sack.png')) {
  content = content.replace(
    '<button\n                      type="submit"\n                      className="btn btn-orange"\n                      style={{ padding: \'8px 22px\', fontWeight: 800 }}\n                    >\n                      Mulai Setup Website →\n                    </button>',
    `<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src="/assets/elements/seed_sack.png" alt="Seed" style={{ height: '36px' }} />
                      <button
                        type="submit"
                        className="btn btn-orange"
                        style={{ padding: '8px 22px', fontWeight: 800 }}
                      >
                        Mulai Setup Website →
                      </button>
                    </div>`
  );
  console.log('Seed sack added near submit button!');
}

fs.writeFileSync(heroPath, content, 'utf8');
console.log('All elements successfully integrated into HeroLanding.tsx!');
