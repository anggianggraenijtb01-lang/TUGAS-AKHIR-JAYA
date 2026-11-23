import { LandingPage, Section } from '../types';

/**
 * Generates a complete, self-contained, responsive HTML file
 * with embedded modern styles, Google Fonts, and WhatsApp checkout functionality.
 * This can be hosted anywhere (Netlify, Vercel, cPanel, GitHub Pages) or shared directly.
 */
export function generateStandaloneHtml(page: LandingPage): string {
  const sections = (page.sections || []).filter((s) => s.isVisible);
  const cleanWaNumber = (page.whatsappNumber || '081234567890')
    .replace(/[^0-9]/g, '')
    .replace(/^0/, '62');

  const defaultWaMessage = encodeURIComponent(
    page.whatsappMessage || `Halo ${page.businessName || 'Admin'}, saya tertarik untuk memesan produk Anda.`
  );

  const sectionsHtml = sections
    .map((sec) => {
      if (sec.sectionType === 'HERO') {
        const c = sec.contentJson;
        return `
    <section class="section hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          ${c.badge ? `<div class="badge">${c.badge}</div>` : ''}
          <h1 class="hero-title">${c.headline || ''}</h1>
          <p class="hero-sub">${c.subheadline || ''}</p>
          <div class="hero-actions">
            <a href="https://wa.me/${cleanWaNumber}?text=${defaultWaMessage}" target="_blank" class="btn btn-primary">
              💬 ${c.primaryCtaText || 'Pesan via WhatsApp'}
            </a>
            ${c.secondaryCtaText ? `<a href="#katalog" class="btn btn-secondary">${c.secondaryCtaText}</a>` : ''}
          </div>
        </div>
        ${
          c.heroImage
            ? `<div class="hero-image-wrap">
                 <img src="${c.heroImage}" alt="${c.headline || 'Hero'}" class="hero-image" loading="lazy" />
               </div>`
            : ''
        }
      </div>
    </section>`;
      }

      if (sec.sectionType === 'FEATURES') {
        const c = sec.contentJson;
        const items = (c.features || [])
          .map(
            (f: any) => `
          <div class="feature-card">
            <div class="feature-icon">${f.icon || '✨'}</div>
            <h3 class="feature-title">${f.title || ''}</h3>
            <p class="feature-desc">${f.desc || ''}</p>
          </div>`
          )
          .join('\n');

        return `
    <section class="section features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${c.title || 'Keunggulan Kami'}</h2>
          ${c.subtitle ? `<p class="section-subtitle">${c.subtitle}</p>` : ''}
        </div>
        <div class="features-grid">
          ${items}
        </div>
      </div>
    </section>`;
      }

      if (sec.sectionType === 'CATALOG') {
        const c = sec.contentJson;
        const items = (c.items || [])
          .map((item: any, idx: number) => {
            const itemWaMsg = encodeURIComponent(
              `Halo ${page.businessName || ''}, saya ingin memesan: ${item.name} (${item.price}). Mohon info stoknya.`
            );
            return `
          <div class="product-card" id="prod-${idx}">
            <div class="product-img-wrap">
              <img src="${item.image}" alt="${item.name}" class="product-img" loading="lazy" />
              ${item.badge ? `<span class="product-badge">${item.badge}</span>` : ''}
            </div>
            <div class="product-info">
              <h3 class="product-name">${item.name}</h3>
              <div class="product-price">${item.price}</div>
              <p class="product-desc">${item.desc || ''}</p>
              <a href="https://wa.me/${cleanWaNumber}?text=${itemWaMsg}" target="_blank" class="btn btn-primary btn-block">
                📲 Pesan via WhatsApp
              </a>
            </div>
          </div>`;
          })
          .join('\n');

        return `
    <section id="katalog" class="section catalog-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${c.title || 'Katalog Pilihan'}</h2>
          ${c.subtitle ? `<p class="section-subtitle">${c.subtitle}</p>` : ''}
        </div>
        <div class="catalog-grid">
          ${items}
        </div>
      </div>
    </section>`;
      }

      if (sec.sectionType === 'TESTIMONIALS') {
        const c = sec.contentJson;
        const items = (c.testimonials || [])
          .map(
            (t: any) => `
          <div class="testimonial-card">
            <div class="rating">★★★★★</div>
            <blockquote class="testimonial-quote">"${t.quote}"</blockquote>
            <div class="testimonial-author">
              <div class="author-avatar">${(t.author || 'P').charAt(0)}</div>
              <div>
                <div class="author-name">${t.author}</div>
                <div class="author-role">${t.role || 'Pelanggan'}</div>
              </div>
            </div>
          </div>`
          )
          .join('\n');

        return `
    <section class="section testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${c.title || 'Ulasan Pelanggan'}</h2>
          ${c.subtitle ? `<p class="section-subtitle">${c.subtitle}</p>` : ''}
        </div>
        <div class="testimonials-grid">
          ${items}
        </div>
      </div>
    </section>`;
      }

      if (sec.sectionType === 'FAQ') {
        const c = sec.contentJson;
        const items = (c.faqs || [])
          .map(
            (faq: any) => `
          <details class="faq-item">
            <summary class="faq-question">❓ ${faq.q}</summary>
            <div class="faq-answer">${faq.a}</div>
          </details>`
          )
          .join('\n');

        return `
    <section class="section faq-section">
      <div class="container narrow">
        <div class="section-header">
          <h2 class="section-title">${c.title || 'Tanya Jawab (FAQ)'}</h2>
          <p class="section-subtitle">Informasi penting seputar produk dan pemesanan.</p>
        </div>
        <div class="faq-list">
          ${items}
        </div>
      </div>
    </section>`;
      }

      if (sec.sectionType === 'GALLERY') {
        const c = sec.contentJson;
        const items = (c.images || [])
          .map(
            (img: any) => `
          <div class="gallery-item">
            <img src="${img.url}" alt="${img.caption || ''}" loading="lazy" />
            ${img.caption ? `<div class="gallery-caption">${img.caption}</div>` : ''}
          </div>`
          )
          .join('\n');

        return `
    <section class="section gallery-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${c.title || 'Dokumentasi Usaha'}</h2>
          ${c.subtitle ? `<p class="section-subtitle">${c.subtitle}</p>` : ''}
        </div>
        <div class="gallery-grid">
          ${items}
        </div>
      </div>
    </section>`;
      }

      if (sec.sectionType === 'CONTACT') {
        const c = sec.contentJson;
        return `
    <section class="section contact-section">
      <div class="container text-center">
        <h2 class="section-title">${c.title || 'Hubungi Kami Langsung'}</h2>
        ${c.address ? `<p class="contact-line">📍 ${c.address}</p>` : ''}
        <p class="contact-line">📞 WhatsApp: ${c.phone || cleanWaNumber} ${c.email ? `• ✉️ ${c.email}` : ''}</p>
        <div style="margin-top: 24px;">
          <a href="https://wa.me/${cleanWaNumber}?text=${defaultWaMessage}" target="_blank" class="btn btn-primary">
            💬 Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </section>`;
      }

      return '';
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.metaTitle || page.title || 'Website UMKM'}</title>
  <meta name="description" content="${page.metaDescription || page.description || 'Website resmi didukung oleh UniLandFarm AI'}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #10B981;
      --primary-hover: #059669;
      --accent-gold: #E5AC32;
      --bg-dark: #090D16;
      --bg-surface: #111827;
      --text-white: #F8FAFC;
      --text-muted: #94A3B8;
      --border-color: rgba(255, 255, 255, 0.08);
      --font-body: 'Plus Jakarta Sans', sans-serif;
      --font-display: 'Poppins', sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background-color: var(--bg-dark);
      color: var(--text-white);
      font-family: var(--font-body);
      line-height: 1.6;
      padding-bottom: 70px;
    }
    a { text-decoration: none; color: inherit; }
    img { max-width: 100%; display: block; }
    .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .container.narrow { max-width: 800px; }
    .text-center { text-align: center; }

    /* Header Nav */
    .site-nav {
      position: sticky; top: 0; z-index: 50;
      background: rgba(9, 13, 22, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 0;
    }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .nav-brand { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: #fff; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; border-radius: 9999px; font-weight: 700; font-size: 0.92rem;
      cursor: pointer; transition: all 0.2s; border: none;
    }
    .btn-primary { background: linear-gradient(135deg, #10B981, #059669); color: #fff; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4); }
    .btn-secondary { background: rgba(255, 255, 255, 0.08); color: #fff; border: 1px solid var(--border-color); }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
    .btn-block { width: 100%; }

    /* Badge */
    .badge {
      display: inline-block; padding: 6px 14px; border-radius: 9999px;
      font-size: 0.8rem; font-weight: 700; background: rgba(16, 185, 129, 0.15);
      color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); margin-bottom: 16px;
    }

    /* Section Global */
    .section { padding: 80px 0; }
    .section-header { text-align: center; max-width: 650px; margin: 0 auto 48px; }
    .section-title { font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; margin-bottom: 12px; }
    .section-subtitle { color: var(--text-muted); font-size: 1.05rem; }

    /* Hero */
    .hero-section {
      padding: 90px 0 70px;
      background: radial-gradient(circle at top, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
    }
    .hero-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 48px; align-items: center; }
    .hero-title { font-family: var(--font-display); font-size: clamp(2.2rem, 5vw, 3.4rem); line-height: 1.18; margin-bottom: 20px; }
    .hero-sub { font-size: 1.1rem; color: #CBD5E1; line-height: 1.7; margin-bottom: 32px; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }
    .hero-image-wrap { border-radius: 24px; overflow: hidden; border: 1px solid var(--border-color); box-shadow: 0 20px 50px rgba(0,0,0,0.6); max-height: 460px; }
    .hero-image { width: 100%; height: 100%; object-fit: cover; }

    /* Features */
    .features-section { background: rgba(17, 24, 39, 0.4); }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
    .feature-card { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); padding: 32px 24px; border-radius: 16px; text-align: center; }
    .feature-icon { font-size: 2.6rem; margin-bottom: 16px; }
    .feature-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
    .feature-desc { color: var(--text-muted); font-size: 0.9rem; }

    /* Catalog */
    .catalog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; }
    .product-card { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
    .product-img-wrap { height: 210px; position: relative; }
    .product-img { width: 100%; height: 100%; object-fit: cover; }
    .product-badge { position: absolute; top: 12px; left: 12px; background: #E5AC32; color: #142217; padding: 4px 10px; border-radius: 9999px; font-weight: 800; font-size: 0.75rem; }
    .product-info { padding: 22px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .product-name { font-size: 1.18rem; font-weight: 700; margin-bottom: 6px; }
    .product-price { font-size: 1.35rem; font-weight: 800; color: #FBBF24; margin-bottom: 10px; }
    .product-desc { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px; line-height: 1.5; }

    /* Testimonials */
    .testimonials-section { background: rgba(17, 24, 39, 0.5); }
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .testimonial-card { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); padding: 28px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between; }
    .rating { color: #FBBF24; font-size: 1.1rem; margin-bottom: 12px; }
    .testimonial-quote { font-style: italic; line-height: 1.6; margin-bottom: 18px; color: #E2E8F0; }
    .testimonial-author { display: flex; align-items: center; gap: 12px; }
    .author-avatar { width: 38px; height: 38px; border-radius: 50%; background: #10B981; display: flex; align-items: center; justify-content: center; font-weight: 800; }
    .author-name { font-weight: 700; font-size: 0.92rem; }
    .author-role { font-size: 0.78rem; color: var(--text-muted); }

    /* FAQ */
    .faq-list { display: flex; flex-direction: column; gap: 14px; }
    .faq-item { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px 24px; cursor: pointer; }
    .faq-question { font-weight: 700; font-size: 1rem; cursor: pointer; list-style: none; }
    .faq-answer { margin-top: 12px; color: #CBD5E1; font-size: 0.92rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; }

    /* Gallery */
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    .gallery-item { height: 180px; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid var(--border-color); }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
    .gallery-caption { position: absolute; bottom: 0; inset-inline: 0; padding: 6px 12px; background: rgba(0,0,0,0.7); font-size: 0.78rem; }

    /* Contact */
    .contact-section { border-top: 1px solid var(--border-color); }
    .contact-line { color: #CBD5E1; margin-bottom: 8px; font-size: 1.05rem; }

    /* Floating WhatsApp Button */
    .wa-fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 100;
      background: #25D366; color: #fff; padding: 14px 24px;
      border-radius: 9999px; font-weight: 800; font-size: 0.95rem;
      display: flex; align-items: center; gap: 8px;
      box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
      transition: all 0.2s;
    }
    .wa-fab:hover { transform: scale(1.05); }

    /* Footer */
    .site-footer { text-align: center; padding: 30px 0; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-color); }
  </style>
</head>
<body>
  <nav class="site-nav">
    <div class="container nav-inner">
      <div class="nav-brand">🌱 ${page.businessName || page.title}</div>
      <a href="https://wa.me/${cleanWaNumber}?text=${defaultWaMessage}" target="_blank" class="btn btn-primary" style="padding: 8px 18px; font-size: 0.82rem;">
        💬 Chat Penjual
      </a>
    </div>
  </nav>

  <main>
    ${sectionsHtml}
  </main>

  <a href="https://wa.me/${cleanWaNumber}?text=${defaultWaMessage}" target="_blank" class="wa-fab">
    <span>📲</span>
    <span>Pesan via WhatsApp</span>
  </a>

  <footer class="site-footer">
    <div class="container">
      © ${new Date().getFullYear()} ${page.businessName || page.title}. Dibuat dengan <strong>UniLandFarm AI</strong>.
    </div>
  </footer>
</body>
</html>`;
}

/**
 * Initiates browser download of the standalone HTML file.
 */
export function downloadStandaloneHtml(page: LandingPage): void {
  const html = generateStandaloneHtml(page);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${page.slug || 'website-umkm'}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
