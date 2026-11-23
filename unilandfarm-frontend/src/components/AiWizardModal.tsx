import React, { useState } from 'react';
import { AiGenerateRequest, LandingPage, Template } from '../types';
import { generateLandingPageAi } from '../services/api';

interface AiWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onPageGenerated: (newPage: LandingPage) => void;
  userTokenBalance: number;
  initialBusinessName?: string;
}

export const AiWizardModal: React.FC<AiWizardModalProps> = ({
  isOpen,
  onClose,
  templates,
  onPageGenerated,
  userTokenBalance,
  initialBusinessName,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<AiGenerateRequest>({
    businessName: initialBusinessName || '',
    category: 'Perkebunan & Kopi',
    description: '',
    tone: 'friendly',
    templateId: 'tpl_kopi',
  });

  React.useEffect(() => {
    if (initialBusinessName) {
      setFormData((prev) => ({ ...prev, businessName: initialBusinessName }));
    }
  }, [initialBusinessName, isOpen]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  if (!isOpen) return null;

  const quickExamples = [
    {
      name: 'Kopi Robusta Lereng Slamet',
      cat: 'Perkebunan & Kopi',
      desc: 'Biji kopi robusta petik merah asli lereng Gunung Slamet di ketinggian 1.200 mdpl. Disangrai dengan profil medium-dark menghasilkan aroma karamel dan dark chocolate yang pekat tanpa asam berlebih.',
      tone: 'friendly' as const,
      tpl: 'tpl_kopi',
    },
    {
      name: 'Hijau Hydro Farm',
      cat: 'Pertanian Modern',
      desc: 'Sayuran segar hidroponik bebas pestisida kimia sintetis seperti selada romaine, pakcoy, dan kale. Dipanen segar setiap pagi dan dikirim langsung ke rumah tangga dan restoran sehat.',
      tone: 'profesional' as const,
      tpl: 'tpl_hidroponik',
    },
    {
      name: 'Madu Hutan Randu Liar',
      cat: 'Peternakan & Herbal',
      desc: 'Madu murni nektar bunga randu dari lebah liar hutan Jepara. Murni tanpa campuran gula atau pemanasan, berkhasiat menjaga imunitas dan meredakan batuk tenggorokan.',
      tone: 'friendly' as const,
      tpl: 'tpl_madu',
    },
  ];

  const handleFillExample = (ex: typeof quickExamples[0]) => {
    setFormData({
      businessName: ex.name,
      category: ex.cat,
      description: ex.desc,
      tone: ex.tone,
      templateId: ex.tpl,
    });
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setStep(4);

    // Simulated multi-step progress bar
    setGenerationStep(1);
    await new Promise((r) => setTimeout(r, 600));
    setGenerationStep(2);
    await new Promise((r) => setTimeout(r, 800));
    setGenerationStep(3);
    await new Promise((r) => setTimeout(r, 800));
    setGenerationStep(4);

    try {
      const generatedPage = await generateLandingPageAi(formData);
      setIsGenerating(false);
      onPageGenerated(generatedPage);
      onClose();
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '32px' }}>
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>✨</span>
            <div>
              <h3 style={{ fontSize: '1.35rem', lineHeight: 1.2 }}>
                AI Landing Page Builder
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Ditenagai Gemini 1.5 Flash • Mengkonsumsi 10 Token
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost"
            style={{ fontSize: '1.2rem', padding: '4px 10px' }}
          >
            ✕
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        {step < 4 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '28px',
            }}
          >
            {[
              { num: 1, label: 'Profil Usaha' },
              { num: 2, label: 'Cerita Produk' },
              { num: 3, label: 'Tone & Desain' },
            ].map((s) => (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: step === s.num ? '#34d399' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background:
                      step === s.num
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border:
                      step === s.num
                        ? '1px solid #10b981'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  {s.num}
                </div>
                <span>{s.label}</span>
                {s.num < 3 && (
                  <span style={{ opacity: 0.3, margin: '0 4px' }}>•</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============================================================
            STEP 1: Profil Usaha
            ============================================================ */}
        {step === 1 && (
          <div>
            {/* Quick Fill Chips */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                💡 Klik contoh cepat UMKM agribisnis:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {quickExamples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleFillExample(ex)}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nama Usaha / Merek Produk *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Kopi Robusta Lereng Slamet"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori Usaha *</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Perkebunan & Kopi">Perkebunan & Kopi</option>
                <option value="Pertanian Modern">Pertanian Hidroponik & Organik</option>
                <option value="Peternakan & Olahan">Peternakan & Olahan Madu/Susu</option>
                <option value="Olahan Pangan">Olahan Pangan & Camilan Lokal</option>
                <option value="Florist & Bibit Tanaman">Florist & Bibit Tanaman Unggul</option>
                <option value="Kerajinan Tangan">Kerajinan Desa & Eco-craft</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                disabled={!formData.businessName.trim()}
                onClick={() => setStep(2)}
                className="btn btn-primary"
                style={{ opacity: formData.businessName.trim() ? 1 : 0.5 }}
              >
                Lanjut ke Deskripsi
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 2: Cerita Produk & Keunggulan
            ============================================================ */}
        {step === 2 && (
          <div>
            <div className="form-group">
              <label className="form-label">
                Deskripsikan Produk, Rasa, atau Keunggulan Usaha Anda *
              </label>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Jelaskan apa yang membuat produk Anda istimewa, cara pembuatan, atau manfaat untuk pembeli.
              </p>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Contoh: Biji kopi robusta dipetik merah 100% dari ketinggian 1.200 mdpl..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <div
                style={{
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  color: formData.description.length >= 20 ? '#34d399' : '#f87171',
                  marginTop: '4px',
                }}
              >
                {formData.description.length} karakter (minimal 20 karakter)
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '24px',
              }}
            >
              <button onClick={() => setStep(1)} className="btn btn-secondary">
                Kembali
              </button>
              <button
                disabled={formData.description.trim().length < 20}
                onClick={() => setStep(3)}
                className="btn btn-primary"
                style={{
                  opacity: formData.description.trim().length >= 20 ? 1 : 0.5,
                }}
              >
                Pilih Tone & Desain
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 3: Tone & Desain
            ============================================================ */}
        {step === 3 && (
          <div>
            <div className="form-group">
              <label className="form-label">Gaya Bahasa (Tone of Voice)</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: '8px',
                  marginTop: '6px',
                }}
              >
                {[
                  { id: 'friendly', label: '😊 Ramah & Hangat', desc: 'Cocok untuk jualan personal' },
                  { id: 'profesional', label: '👔 Profesional', desc: 'B2B & Sertifikasi mutu' },
                  { id: 'fun', label: '🎉 Santai & Ceria', desc: 'Camilan & anak muda' },
                  { id: 'formal', label: '🏛️ Resmi / Edukatif', desc: 'Koperasi & lembaga tani' },
                ].map((t) => (
                  <div
                    key={t.id}
                    onClick={() =>
                      setFormData({ ...formData, tone: t.id as any })
                    }
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background:
                        formData.tone === t.id
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(255, 255, 255, 0.04)',
                      border:
                        formData.tone === t.id
                          ? '1px solid #10b981'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {t.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label">Template Awal</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginTop: '8px',
                }}
              >
                {templates.slice(0, 4).map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() =>
                      setFormData({ ...formData, templateId: tpl.id })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: '8px',
                      background:
                        formData.templateId === tpl.id
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(255, 255, 255, 0.04)',
                      border:
                        formData.templateId === tpl.id
                          ? '1px solid #10b981'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={tpl.thumbnailUrl}
                        alt={tpl.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                        {tpl.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {tpl.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <button onClick={() => setStep(2)} className="btn btn-secondary">
                Kembali
              </button>

              <button
                onClick={handleStartGeneration}
                className="btn btn-lg btn-magic"
                style={{ gap: '10px' }}
              >
                <span>✨</span>
                Mulai Racik Landing Page!
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 4: Live Processing Animation
            ============================================================ */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                animation: 'pulseWa 2s infinite',
              }}
            >
              ✨
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
              Gemini AI Sedang Meracik Landing Page Anda
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
              Menyusun kata-kata persuasif, katalog produk, dan layout siap jualan...
            </p>

            <div
              style={{
                maxWidth: '420px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'left',
              }}
            >
              {[
                { s: 1, label: 'Menganalisis profil usaha & audiens target...' },
                { s: 2, label: 'Menyusun struktur copywriting AIDA & headline...' },
                { s: 3, label: 'Merancang katalog produk, paket & testimoni...' },
                { s: 4, label: 'Menyambungkan konfigurasi WhatsApp Sticky CTA...' },
              ].map((item) => {
                const isDone = generationStep > item.s;
                const isCurrent = generationStep === item.s;
                return (
                  <div
                    key={item.s}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.85rem',
                      color: isDone
                        ? '#34d399'
                        : isCurrent
                        ? '#ffffff'
                        : 'var(--text-muted)',
                      fontWeight: isCurrent ? 700 : 400,
                    }}
                  >
                    <span>{isDone ? '✅' : isCurrent ? '⏳' : '⚪'}</span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
