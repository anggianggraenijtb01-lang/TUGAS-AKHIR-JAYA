import fs from 'fs';
import path from 'path';

const heroPath = path.resolve('src/components/HeroLanding.tsx');
let content = fs.readFileSync(heroPath, 'utf8');

// Add clayIcon to each template item
content = content.replace(
  `                id: 'tpl_1',
                title: 'Modern Dark Pro',
                category: 'E-Commerce / Toko Online',
                img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
                previewHeadline: 'Produk Lokal Berkualitas',
              },kaja 
                id: 'tpl_2',
                title: 'Fresh Minimal',
                category: 'Pendidikan / Edukasi',
                img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80',
                previewHeadline: 'Kelas Online untuk Masa Depan',
              },
              {
                id: 'tpl_3',
                title: 'Creative Pastel',
                category: 'Bisnis Kreatif / F&B',
                img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
                previewHeadline: 'Good Vibes Only & Tasty',
              },
              {
                id: 'tpl_4',
                title: 'Tech Modern',
                category: 'Berita / Portal Digital',
                img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
                previewHeadline: 'Update Terbaru Dunia Teknologi',
              },`,
  `                id: 'tpl_1',
                title: 'Modern Dark Pro',
                category: 'E-Commerce / Toko Online',
                img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
                previewHeadline: 'Produk Lokal Berkualitas',
                clayIcon: '/assets/elements/avocado.png',
              },
              {
                id: 'tpl_2',
                title: 'Fresh Minimal',
                category: 'Pendidikan / Edukasi',
                img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80',
                previewHeadline: 'Kelas Online untuk Masa Depan',
                clayIcon: '/assets/elements/strawberry.png',
              },
              {
                id: 'tpl_3',
                title: 'Creative Pastel',
                category: 'Bisnis Kreatif / F&B',
                img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
                previewHeadline: 'Good Vibes Only & Tasty',
                clayIcon: '/assets/elements/corn.png',
              },
              {
                id: 'tpl_4',
                title: 'Tech Modern',
                category: 'Berita / Portal Digital',
                img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
                previewHeadline: 'Update Terbaru Dunia Teknologi',
                clayIcon: '/assets/elements/veggie_crate.png',
              },`
);

// Render the clay icon in thumbnail
if (content.includes('{/* Thumbnail Header Mockup */}')) {
  content = content.replace(
    `<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%)' }} />`,
    `<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%)' }} />
                  <img
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
                  />`
  );
  console.log('Template clay icons rendered!');
}

fs.writeFileSync(heroPath, content, 'utf8');
console.log('Template icons updated successfully!');
