import React, { useState, useRef, useEffect } from 'react';
import { LandingPage, Section, SectionType } from '../types';
import { executeMagicAi } from '../services/api';
import { downloadStandaloneHtml } from '../services/htmlExporter';
import { UniLandLogo } from './UniLandLogo';
import {
  GripVertical,
  MoveUp,
  MoveDown,
  Trash2,
  Copy,
  Plus,
  Eye,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  X,
  Layers,
  Settings,
  Palette,
  Search,
  UploadCloud,
  Globe,
  RefreshCw,
  LayoutGrid,
  Zap,
  Calendar,
  Shield,
  Loader2,
} from './icons/LucideIcons';

interface CmsEditorProps {
  page: LandingPage;
  onSavePage: (updatedPage: LandingPage) => void;
  onPublishPage: (pageId: string) => void;
  onOpenPublicView: (slug: string) => void;
  onBack: () => void;
  onPublishSuccess?: (publishedPage: LandingPage) => void;
}

// 9 Block Metadata Definitions
interface BlockMeta {
  type: SectionType;
  label: string;
  description: string;
  badge: string;
  createDefault: (sortOrder: number) => Section;
}

const INITIAL_BLOCK_DEFS: BlockMeta[] = [
  {
    type: 'HERO',
    label: 'Hero Utama',
    description: 'Header pembuka dengan judul besar, subjudul, dan tombol CTA utama.',
    badge: 'Utama',
    createDefault: (sortOrder) => ({
      id: `sec_hero_${Date.now()}`,
      sectionType: 'HERO',
      label: 'Hero Utama',
      sortOrder,
      isVisible: true,
      contentJson: {
        headline: 'Produk Segar Berkualitas dari Petani Lokal',
        subheadline: 'Dipetik matang, diproses higienis, dan dikirim langsung ke rumah Anda.',
        badgeText: '100% Produk Asli UMKM',
        buttonText: 'Pesan Sekarang',
        buttonLink: '#kontak',
        secondaryButtonText: 'Lihat Produk',
        secondaryButtonLink: '#katalog',
        alignment: 'center',
        bgType: 'gradient',
      },
    }),
  },
  {
    type: 'HEADING_TEXT',
    label: 'Heading & Teks',
    description: 'Judul bagian dan paragraf penjelasan narasi bisnis Anda.',
    badge: 'Teks',
    createDefault: (sortOrder) => ({
      id: `sec_text_${Date.now()}`,
      sectionType: 'HEADING_TEXT',
      label: 'Cerita & Profil',
      sortOrder,
      isVisible: true,
      contentJson: {
        title: 'Komitmen Kualitas Kami',
        subtitle: 'Tentang Usaha',
        paragraph:
          'Kami berkomitmen memberdayakan para petani lokal dengan menghasilkan produk pangan sehat tanpa bahan pengawet. Setiap proses diawasi langsung demi menjaga kepuasan pelanggan setia kami.',
        alignment: 'center',
      },
    }),
  },
  {
    type: 'IMAGE',
    label: 'Banner Gambar',
    description: 'Foto produk beresolusi tinggi atau showcase tempat produksi.',
    badge: 'Media',
    createDefault: (sortOrder) => ({
      id: `sec_img_${Date.now()}`,
      sectionType: 'IMAGE',
      label: 'Banner Visual',
      sortOrder,
      isVisible: true,
      contentJson: {
        imageUrl: '/assets/coffee_hero_bg.jpg',
        caption: 'Proses pemetikan hasil panen di lereng pegunungan.',
        altText: 'Foto Hasil Panen',
        rounded: true,
      },
    }),
  },
  {
    type: 'CTA_BUTTON',
    label: 'Tombol / CTA',
    description: 'Blok panggilan aksi cepat untuk mendorong pemesanan langsung.',
    badge: 'Aksi',
    createDefault: (sortOrder) => ({
      id: `sec_cta_${Date.now()}`,
      sectionType: 'CTA_BUTTON',
      label: 'Panggilan Aksi',
      sortOrder,
      isVisible: true,
      contentJson: {
        title: 'Siap Rasakan Kualitas Terbaik Hari Ini?',
        subtitle: 'Hubungi admin kami untuk penawaran spesial dan konsultasi produk.',
        buttonText: 'Konsultasi via WhatsApp',
        buttonLink: 'https://wa.me/6281234567890',
        note: 'Respon cepat dalam 5 menit pada jam kerja.',
        styleVariant: 'primary',
      },
    }),
  },
  {
    type: 'FEATURES',
    label: 'Kartu Fitur',
    description: '3 sampai 4 pilar keunggulan produk dan nilai tambah usaha Anda.',
    badge: 'Keunggulan',
    createDefault: (sortOrder) => ({
      id: `sec_feat_${Date.now()}`,
      sectionType: 'FEATURES',
      label: 'Keunggulan Kami',
      sortOrder,
      isVisible: true,
      contentJson: {
        title: 'Mengapa Memilih Produk Kami?',
        subtitle: 'Nilai Keunggulan',
        items: [
          {
            title: 'Kualitas Teruji',
            description: 'Disortir secara manual sebelum pengemasan higienis.',
          },
          {
            title: 'Harga Bersahabat',
            description: 'Langsung dari tangan pertama produsen tanpa perantara.',
          },
          {
            title: 'Pengiriman Aman',
            description: 'Kemasan berlapis garansi sampai dalam kondisi prima.',
          },
        ],
      },
    }),
  },
  {
    type: 'CATALOG',
    label: 'Galeri Produk',
    description: 'Katalog daftar produk unggulan lengkap dengan harga dan tombol beli.',
    badge: 'Katalog',
    createDefault: (sortOrder) => ({
      id: `sec_cat_${Date.now()}`,
      sectionType: 'CATALOG',
      label: 'Katalog Pilihan',
      sortOrder,
      isVisible: true,
      contentJson: {
        title: 'Pilihan Produk Terbaik',
        subtitle: 'Katalog Terkini',
        products: [
          {
            name: 'Paket Signature 250gr',
            price: 'Rp 65.000',
            description: 'Varian unggulan dengan aroma khas dan cita rasa lembut.',
          },
          {
            name: 'Paket Keluarga 500gr',
            price: 'Rp 115.000',
            description: 'Pilihan hemat untuk konsumsi harian keluarga dan kerabat.',
          },
          {
            name: 'Paket Bundling Spesial 1kg',
            price: 'Rp 210.000',
            description: 'Kemasan ekstra besar lengkap dengan pouch kedap udara.',
          },
        ],
      },
    }),
  },
  {
    type: 'PROMO_BANNER',
    label: 'Banner Promosi',
    description: 'Pemberitahuan diskon musiman, kode voucher, dan penawaran hemat.',
    badge: 'Promo',
    createDefault: (sortOrder) => ({
      id: `sec_promo_${Date.now()}`,
      sectionType: 'PROMO_BANNER',
      label: 'Promo Spesial',
      sortOrder,
      isVisible: true,
      contentJson: {
        badgePromo: 'PROMO TERBATAS',
        headline: 'Potongan 15% untuk Pemesanan Perdana',
        description: 'Gunakan kode promo saat chat WhatsApp dengan admin kami.',
        promoCode: 'UNILAND15',
        buttonText: 'Klaim Promo',
        buttonLink: 'https://wa.me/6281234567890?text=Halo%20saya%20ingin%20klaim%20UNILAND15',
      },
    }),
  },
  {
    type: 'CONTACT_WA',
    label: 'Kontak / WhatsApp',
    description: 'Integrasi kontak langsung, nomor WhatsApp, dan jam operasional.',
    badge: 'Kontak',
    createDefault: (sortOrder) => ({
      id: `sec_wa_${Date.now()}`,
      sectionType: 'CONTACT_WA',
      label: 'Kontak Pemesanan',
      sortOrder,
      isVisible: true,
      contentJson: {
        title: 'Hubungi Kami',
        subtitle: 'Layanan Pelanggan',
        whatsappNumber: '6281234567890',
        operatingHours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
        address: 'Jl. Agro Industri No. 45, Sentra UMKM Nusantara',
        buttonText: 'Chat WhatsApp Sekarang',
      },
    }),
  },
  {
    type: 'FOOTER',
    label: 'Footer Toko',
    description: 'Penutup halaman dengan informasi hak cipta dan navigasi penting.',
    badge: 'Footer',
    createDefault: (sortOrder) => ({
      id: `sec_foot_${Date.now()}`,
      sectionType: 'FOOTER',
      label: 'Footer Resmi',
      sortOrder,
      isVisible: true,
      contentJson: {
        businessName: 'Toko Resmi UMKM',
        tagline: 'Didukung oleh platform teknologi UNI-LANDFARM.',
        copyrightText: `© ${new Date().getFullYear()} Hak Cipta Dilindungi.`,
      },
    }),
  },
];

export const CmsEditor: React.FC<CmsEditorProps> = ({
  page: initialPage,
  onSavePage,
  onPublishPage,
  onOpenPublicView,
  onBack,
  onPublishSuccess,
}) => {
  // State manajemen halaman
  const [page, setPage] = useState<LandingPage>(initialPage);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'blocks' | 'settings'>('blocks');
  const [searchBlockQuery, setSearchBlockQuery] = useState('');

  // Sections list & selected block
  const sections = page.sections || [];
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    sections[0]?.id || ''
  );

  // Undo / Redo History Stack
  const [history, setHistory] = useState<Section[][]>([sections]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Unsaved changes tracking
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Drag and drop state
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState<number | null>(null);

  // Modals
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // AI copywriting modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState<'friendly' | 'profesional' | 'formal'>('friendly');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  // Helper untuk commit perubahan ke history
  const commitSectionsChange = (newSections: Section[]) => {
    const updatedSections = newSections.map((sec, idx) => ({ ...sec, sortOrder: idx }));
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedSections);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    const updatedPage: LandingPage = {
      ...page,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };
    setPage(updatedPage);
    setIsDirty(true);
  };

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevSections = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setPage({ ...page, sections: prevSections });
      setIsDirty(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextSections = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setPage({ ...page, sections: nextSections });
      setIsDirty(true);
    }
  };

  // Update selected section content
  const handleUpdateContentField = (field: string, value: any) => {
    if (!selectedSection) return;
    const updated = sections.map((sec) => {
      if (sec.id === selectedSection.id) {
        return {
          ...sec,
          contentJson: {
            ...sec.contentJson,
            [field]: value,
          },
        };
      }
      return sec;
    });
    commitSectionsChange(updated);
  };

  // Add block from palette
  const handleAddBlock = (blockMeta: BlockMeta) => {
    const newSection = blockMeta.createDefault(sections.length);
    const updated = [...sections, newSection];
    commitSectionsChange(updated);
    setSelectedSectionId(newSection.id);
    setIsAddBlockModalOpen(false);
    setSaveToast(`Blok "${blockMeta.label}" berhasil ditambahkan.`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Duplicate block
  const handleDuplicateBlock = (sectionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = sections.find((s) => s.id === sectionId);
    if (!target) return;
    const cloned: Section = {
      ...JSON.parse(JSON.stringify(target)),
      id: `sec_${target.sectionType.toLowerCase()}_${Date.now()}`,
      label: `${target.label || target.sectionType} (Salinan)`,
      sortOrder: target.sortOrder + 1,
    };
    const targetIdx = sections.findIndex((s) => s.id === sectionId);
    const updated = [...sections];
    updated.splice(targetIdx + 1, 0, cloned);
    commitSectionsChange(updated);
    setSelectedSectionId(cloned.id);
    setSaveToast('Blok berhasil diduplikasi.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Delete block
  const handleDeleteBlock = (sectionId: string) => {
    if (sections.length <= 1) {
      alert('Halaman setidaknya harus memiliki minimal 1 blok konten.');
      setDeleteConfirmId(null);
      return;
    }
    const updated = sections.filter((s) => s.id !== sectionId);
    commitSectionsChange(updated);
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(updated[0]?.id || '');
    }
    setDeleteConfirmId(null);
    setSaveToast('Blok telah dihapus.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Move block up / down
  const handleMoveBlock = (index: number, direction: 'up' | 'down', e?: React.MouseEvent) => {
    e?.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    commitSectionsChange(updated);
    setSelectedSectionId(moved.id);
  };

  // HTML5 Drag and drop handlers for canvas blocks
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSectionIndex !== index) {
      setDragOverSectionIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === dropIndex) {
      setDraggedSectionIndex(null);
      setDragOverSectionIndex(null);
      return;
    }
    const updated = [...sections];
    const [moved] = updated.splice(draggedSectionIndex, 1);
    updated.splice(dropIndex, 0, moved);
    commitSectionsChange(updated);
    setSelectedSectionId(moved.id);
    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
  };

  // Save Draft (Mempertahankan draft terpisah dari publish live)
  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSavePage(page);
      setIsDirty(false);
      setIsSaving(false);
      setSaveToast('Perubahan draft berhasil disimpan!');
      setTimeout(() => setSaveToast(null), 3000);
    }, 400);
  };

  // Publish Page with validation and confirmation
  const handleConfirmPublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const publishedPage: LandingPage = {
        ...page,
        publishStatus: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
      };
      setPage(publishedPage);
      onSavePage(publishedPage);
      onPublishPage(page.id);
      setIsPublishing(false);
      setIsPublishModalOpen(false);
      setIsDirty(false);
      setSaveToast('Website berhasil dipublikasikan secara live!');
      setTimeout(() => {
        setSaveToast(null);
        if (onPublishSuccess) {
          onPublishSuccess(publishedPage);
        }
      }, 700);
    }, 600);
  };

  // AI Magic Generator
  const handleAiCopywrite = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const currentHeadline =
        selectedSection?.contentJson?.headline ||
        selectedSection?.contentJson?.title ||
        page.title;
      const res = await executeMagicAi({
        text: `${currentHeadline} (${aiPrompt})`,
        landingPageId: page.id,
        mode: 'rephrase',
        tone: aiTone,
      });

      if (selectedSection?.contentJson?.headline !== undefined) {
        handleUpdateContentField('headline', res);
      } else if (selectedSection?.contentJson?.title !== undefined) {
        handleUpdateContentField('title', res);
      }
      setIsAiModalOpen(false);
      setAiPrompt('');
      setSaveToast('AI berhasil memperbarui salinan teks.');
      setTimeout(() => setSaveToast(null), 2500);
    } catch {
      if (selectedSection?.contentJson?.headline !== undefined) {
        handleUpdateContentField('headline', `${aiPrompt} — Kualitas Alami Terjamin`);
      }
      setIsAiModalOpen(false);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered block palette for left panel
  const filteredBlocks = INITIAL_BLOCK_DEFS.filter(
    (b) =>
      b.label.toLowerCase().includes(searchBlockQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchBlockQuery.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#FAF7F2',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#102B22',
      }}
    >
      {/* ============================================================
          TOP TOOLBAR (Clean, Single, Spacious)
          ============================================================ */}
      <header
        style={{
          height: '56px',
          background: '#102B22',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Left: Nav Back & Title (Logo removed per request) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={onBack}
            title="Kembali ke Dashboard"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <ArrowLeft size={15} />
            <span>Dashboard</span>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              {page.businessName || page.title}
            </span>
            <span style={{ color: '#8BA77A', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
              /{page.slug}
            </span>
          </div>
        </div>

        {/* Center: Viewport Switcher & Undo / Redo (Tablet & Draft status removed per request) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Undo / Redo Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '2px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Urungkan Perubahan (Undo)"
              style={{
                background: 'transparent',
                border: 'none',
                color: historyIndex > 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                padding: '5px 9px',
                borderRadius: '6px',
                cursor: historyIndex > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Undo2 size={14} />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Ulangi Perubahan (Redo)"
              style={{
                background: 'transparent',
                border: 'none',
                color:
                  historyIndex < history.length - 1
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.3)',
                padding: '5px 9px',
                borderRadius: '6px',
                cursor: historyIndex < history.length - 1 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Redo2 size={14} />
            </button>
          </div>

          {/* Viewport Switcher (Desktop & Mobile only) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '2px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              style={{
                background: viewport === 'desktop' ? '#1E3A2F' : 'transparent',
                color: viewport === 'desktop' ? '#F4C744' : '#94A3B8',
                border:
                  viewport === 'desktop'
                    ? '1px solid rgba(244, 199, 68, 0.3)'
                    : '1px solid transparent',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              style={{
                background: viewport === 'mobile' ? '#1E3A2F' : 'transparent',
                color: viewport === 'mobile' ? '#F4C744' : '#94A3B8',
                border:
                  viewport === 'mobile'
                    ? '1px solid rgba(244, 199, 68, 0.3)'
                    : '1px solid transparent',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Right: Actions (Ekspor HTML removed per request) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Pratinjau Public View */}
          <button
            type="button"
            onClick={() => onOpenPublicView(page.slug)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px 13px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Eye size={14} />
            <span>Pratinjau</span>
          </button>

          {/* Simpan Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            style={{
              background: '#1E3A2F',
              color: '#FFFFFF',
              border: '1px solid rgba(139, 167, 122, 0.4)',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            {isSaving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Draft'}</span>
          </button>

          {/* Publikasikan Button */}
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            style={{
              background: '#F4C744',
              color: '#102B22',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(244, 199, 68, 0.3)',
            }}
          >
            <Zap size={14} />
            <span>Publikasikan</span>
          </button>
        </div>
      </header>

      {/* Floating Save Toast */}
      {saveToast && (
        <div
          style={{
            position: 'fixed',
            top: '76px',
            right: '24px',
            zIndex: 1000,
            background: '#102B22',
            color: '#FFFFFF',
            border: '1px solid #8BA77A',
            borderRadius: '10px',
            padding: '10px 18px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} color="#F4C744" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ============================================================
          MAIN WORKSPACE: 3 COLUMNS (PALETTE | CANVAS | INSPECTOR)
          ============================================================ */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        {/* PANEL KIRI: DAFTAR BLOK & PALETTE */}
        <aside
          style={{
            width: '280px',
            background: '#FFFFFF',
            borderRight: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            zIndex: 20,
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* Header Panel Kiri */}
          <div style={{ padding: '16px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={17} color="#102B22" />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#102B22' }}>
                  Blok Konten
                </span>
              </div>
              <span
                style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                }}
              >
                {sections.length} Bagian
              </span>
            </div>

            {/* Search Blocks */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '6px 10px',
              }}
            >
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Cari jenis blok..."
                value={searchBlockQuery}
                onChange={(e) => setSearchBlockQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.8rem',
                  color: '#102B22',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Daftar Blok Tersedia (9 Block Types) */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#687A4D', marginBottom: '10px' }}>
              Pustaka Blok Siap Pakai
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredBlocks.map((block) => (
                <div
                  key={block.type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', block.type);
                  }}
                  onClick={() => handleAddBlock(block)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px dashed #CBD5E1',
                    background: '#FFFFFF',
                    cursor: 'grab',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#102B22';
                    e.currentTarget.style.background = '#FAF7F2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <div style={{ flex: 1, marginRight: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#102B22' }}>
                        {block.label}
                      </span>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: '#E2E8F0',
                          color: '#475569',
                        }}
                      >
                        {block.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                      {block.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    title="Tambah ke Canvas"
                    style={{
                      background: '#102B22',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Blok Yang Aktif di Halaman */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#687A4D', marginBottom: '10px' }}>
                Susunan Blok Saat Ini
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: selectedSectionId === sec.id ? '#FAF7F2' : '#F8FAFC',
                      border: selectedSectionId === sec.id ? '1.5px solid #102B22' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8' }}>
                        #{idx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: selectedSectionId === sec.id ? 700 : 500,
                          color: selectedSectionId === sec.id ? '#102B22' : '#334155',
                        }}
                      >
                        {sec.label || sec.sectionType}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={(e) => handleMoveBlock(idx, 'up', e)}
                        disabled={idx === 0}
                        title="Geser ke Atas"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: idx === 0 ? '#CBD5E1' : '#64748B',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          padding: '2px',
                        }}
                      >
                        <MoveUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleMoveBlock(idx, 'down', e)}
                        disabled={idx === sections.length - 1}
                        title="Geser ke Bawah"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: idx === sections.length - 1 ? '#CBD5E1' : '#64748B',
                          cursor: idx === sections.length - 1 ? 'not-allowed' : 'pointer',
                          padding: '2px',
                        }}
                      >
                        <MoveDown size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================
            AREA TENGAH: CANVAS VISUAL DRAG-AND-DROP (Fully Scrollable)
            ============================================================ */}
        <main
          style={{
            flex: 1,
            minHeight: 0,
            height: '100%',
            background: '#FAF7F2',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px 20px 100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const blockType = e.dataTransfer.getData('text/plain') as SectionType;
            const targetMeta = INITIAL_BLOCK_DEFS.find((b) => b.type === blockType);
            if (targetMeta) {
              handleAddBlock(targetMeta);
            }
          }}
        >
          {/* Canvas Wrapper dengan ukuran sesuai Viewport (Desktop / Mobile) */}
          <div
            style={{
              width: viewport === 'desktop' ? '100%' : '375px',
              maxWidth: viewport === 'desktop' ? '960px' : undefined,
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 12px 40px rgba(16, 43, 34, 0.08)',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              transition: 'width 0.25s ease, max-width 0.25s ease',
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              marginBottom: '40px',
            }}
          >
            {/* Browser Top Simulating Bar */}
            <div
              style={{
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#CBD5E1' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#CBD5E1' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#CBD5E1' }} />
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '3px 14px',
                  fontSize: '0.72rem',
                  color: '#64748B',
                  fontWeight: 600,
                  maxWidth: '320px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                https://unilandfarm.id/{page.slug}
              </div>

              <div style={{ width: '30px' }} />
            </div>

            {/* Render Canvas Sections */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {sections.map((sec, idx) => {
                const isSelected = selectedSectionId === sec.id;
                const isDragTarget = dragOverSectionIndex === idx;

                return (
                  <div
                    key={sec.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onClick={() => setSelectedSectionId(sec.id)}
                    style={{
                      position: 'relative',
                      border: isSelected ? '2.5px solid #102B22' : '2.5px solid transparent',
                      outline: isDragTarget ? '2px dashed #F4C744' : 'none',
                      background: isDragTarget ? '#FEFCE8' : 'transparent',
                      transition: 'border 0.15s ease, background 0.15s ease',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Action Bar Overlay on Selected Block */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '12px',
                          zIndex: 30,
                          background: '#102B22',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            paddingRight: '6px',
                            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#F4C744',
                          }}
                        >
                          {sec.label || sec.sectionType}
                        </span>

                        {/* Drag Handle */}
                        <span title="Tahan dan geser untuk memindahkan" style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                          <GripVertical size={14} color="#CBD5E1" />
                        </span>

                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={(e) => handleMoveBlock(idx, 'up', e)}
                          disabled={idx === 0}
                          title="Pindah ke Atas"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: idx === 0 ? 'rgba(255,255,255,0.3)' : '#FFFFFF',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            padding: '3px',
                          }}
                        >
                          <MoveUp size={13} />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={(e) => handleMoveBlock(idx, 'down', e)}
                          disabled={idx === sections.length - 1}
                          title="Pindah ke Bawah"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: idx === sections.length - 1 ? 'rgba(255,255,255,0.3)' : '#FFFFFF',
                            cursor: idx === sections.length - 1 ? 'not-allowed' : 'pointer',
                            padding: '3px',
                          }}
                        >
                          <MoveDown size={13} />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={(e) => handleDuplicateBlock(sec.id, e)}
                          title="Duplikasi Blok"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            padding: '3px',
                          }}
                        >
                          <Copy size={13} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(sec.id);
                          }}
                          title="Hapus Blok"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            padding: '3px',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}

                    {/* RENDER KONTEN BLOK SESUAI TIPE */}
                    <div style={{ pointerEvents: 'none' }}>
                      {/* 1. HERO */}
                      {sec.sectionType === 'HERO' && (
                        <div
                          style={{
                            padding: '56px 32px',
                            background: 'linear-gradient(135deg, #102B22 0%, #1E3A2F 60%, #152A22 100%)',
                            color: '#FFFFFF',
                            textAlign:
                              sec.contentJson?.alignment === 'left'
                                ? 'left'
                                : sec.contentJson?.alignment === 'right'
                                ? 'right'
                                : 'center',
                          }}
                        >
                          {sec.contentJson?.badgeText && (
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 14px',
                                borderRadius: '9999px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                color: '#F4C744',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                marginBottom: '14px',
                                border: '1px solid rgba(244, 199, 68, 0.3)',
                              }}
                            >
                              {sec.contentJson.badgeText}
                            </span>
                          )}
                          <h1
                            style={{
                              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                              fontWeight: 800,
                              margin: '0 0 14px',
                              lineHeight: 1.2,
                              color: '#FFFFFF',
                            }}
                          >
                            {sec.contentJson?.headline || 'Judul Utama Produk'}
                          </h1>
                          <p
                            style={{
                              fontSize: '0.92rem',
                              color: 'rgba(255, 255, 255, 0.85)',
                              maxWidth: '600px',
                              margin:
                                sec.contentJson?.alignment === 'left'
                                  ? '0 0 24px 0'
                                  : '0 auto 24px',
                              lineHeight: 1.6,
                            }}
                          >
                            {sec.contentJson?.subheadline || 'Subjudul penjelasan produk atau layanan unggulan Anda.'}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              gap: '12px',
                              justifyContent:
                                sec.contentJson?.alignment === 'left'
                                  ? 'flex-start'
                                  : 'center',
                              flexWrap: 'wrap',
                            }}
                          >
                            {sec.contentJson?.buttonText && (
                              <span
                                style={{
                                  background: '#F4C744',
                                  color: '#102B22',
                                  padding: '10px 22px',
                                  borderRadius: '8px',
                                  fontWeight: 800,
                                  fontSize: '0.86rem',
                                  boxShadow: '0 4px 12px rgba(244, 199, 68, 0.35)',
                                }}
                              >
                                {sec.contentJson.buttonText}
                              </span>
                            )}
                            {sec.contentJson?.secondaryButtonText && (
                              <span
                                style={{
                                  background: 'transparent',
                                  color: '#FFFFFF',
                                  padding: '10px 20px',
                                  borderRadius: '8px',
                                  fontWeight: 700,
                                  fontSize: '0.86rem',
                                  border: '1.5px solid rgba(255, 255, 255, 0.5)',
                                }}
                              >
                                {sec.contentJson.secondaryButtonText}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 2. HEADING_TEXT */}
                      {sec.sectionType === 'HEADING_TEXT' && (
                        <div
                          style={{
                            padding: '48px 36px',
                            background: '#FFFFFF',
                            textAlign:
                              sec.contentJson?.alignment === 'left' ? 'left' : 'center',
                          }}
                        >
                          {sec.contentJson?.subtitle && (
                            <div
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                color: '#687A4D',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                marginBottom: '6px',
                              }}
                            >
                              {sec.contentJson.subtitle}
                            </div>
                          )}
                          <h2
                            style={{
                              fontSize: '1.5rem',
                              fontWeight: 800,
                              color: '#102B22',
                              margin: '0 0 12px',
                            }}
                          >
                            {sec.contentJson?.title || 'Judul Bagian'}
                          </h2>
                          <p
                            style={{
                              fontSize: '0.88rem',
                              color: '#475569',
                              lineHeight: 1.65,
                              maxWidth: '680px',
                              margin:
                                sec.contentJson?.alignment === 'left'
                                  ? '0'
                                  : '0 auto',
                            }}
                          >
                            {sec.contentJson?.paragraph || 'Paragraf deskripsi tentang produk atau nilai usaha UMKM Anda.'}
                          </p>
                        </div>
                      )}

                      {/* 3. IMAGE */}
                      {sec.sectionType === 'IMAGE' && (
                        <div style={{ padding: '36px', background: '#FAF7F2', textAlign: 'center' }}>
                          <div
                            style={{
                              maxWidth: '720px',
                              margin: '0 auto',
                              borderRadius: sec.contentJson?.rounded !== false ? '14px' : '0',
                              overflow: 'hidden',
                              border: '1px solid #E2E8F0',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <img
                              src={sec.contentJson?.imageUrl || '/assets/coffee_hero_bg.jpg'}
                              alt={sec.contentJson?.altText || 'Media Showcase'}
                              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '380px', objectFit: 'cover' }}
                            />
                          </div>
                          {sec.contentJson?.caption && (
                            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '10px' }}>
                              {sec.contentJson.caption}
                            </p>
                          )}
                        </div>
                      )}

                      {/* 4. CTA_BUTTON */}
                      {sec.sectionType === 'CTA_BUTTON' && (
                        <div
                          style={{
                            padding: '44px 32px',
                            background: '#102B22',
                            color: '#FFFFFF',
                            textAlign: 'center',
                          }}
                        >
                          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px' }}>
                            {sec.contentJson?.title || 'Ayo Kembangkan Usahamu Hari Ini'}
                          </h3>
                          <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0 auto 20px', maxWidth: '520px' }}>
                            {sec.contentJson?.subtitle || 'Hubungi kami sekarang untuk informasi katalog dan harga spesial.'}
                          </p>
                          <span
                            style={{
                              display: 'inline-block',
                              background: '#F4C744',
                              color: '#102B22',
                              padding: '11px 26px',
                              borderRadius: '8px',
                              fontWeight: 800,
                              fontSize: '0.88rem',
                            }}
                          >
                            {sec.contentJson?.buttonText || 'Pesan via WhatsApp'}
                          </span>
                          {sec.contentJson?.note && (
                            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '8px' }}>
                              {sec.contentJson.note}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 5. FEATURES */}
                      {sec.sectionType === 'FEATURES' && (
                        <div style={{ padding: '48px 32px', background: '#FFFFFF', textAlign: 'center' }}>
                          {sec.contentJson?.subtitle && (
                            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#687A4D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                              {sec.contentJson.subtitle}
                            </div>
                          )}
                          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#102B22', margin: '0 0 28px' }}>
                            {sec.contentJson?.title || 'Keunggulan Kami'}
                          </h2>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            {(sec.contentJson?.items || []).map((it: any, i: number) => (
                              <div
                                key={i}
                                style={{
                                  background: '#FAF7F2',
                                  padding: '20px',
                                  borderRadius: '12px',
                                  border: '1px solid #E2E8F0',
                                  textAlign: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: 'rgba(16, 43, 34, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 10px',
                                  }}
                                >
                                  <Shield size={18} color="#102B22" />
                                </div>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#102B22', margin: '0 0 6px' }}>
                                  {it.title}
                                </h4>
                                <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                                  {it.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 6. CATALOG */}
                      {sec.sectionType === 'CATALOG' && (
                        <div style={{ padding: '48px 32px', background: '#FAF7F2', textAlign: 'center' }}>
                          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#102B22', margin: '0 0 6px' }}>
                            {sec.contentJson?.title || 'Katalog Produk'}
                          </h2>
                          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 28px' }}>
                            {sec.contentJson?.subtitle || 'Pilihan produk terbaik langsung dari sumbernya.'}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
                            {(sec.contentJson?.products || []).map((prod: any, i: number) => (
                              <div
                                key={i}
                                style={{
                                  background: '#FFFFFF',
                                  borderRadius: '12px',
                                  padding: '18px',
                                  border: '1px solid #E2E8F0',
                                  textAlign: 'left',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                                }}
                              >
                                <div style={{ height: '120px', borderRadius: '8px', background: '#F1F5F9', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <LayoutGrid size={28} color="#94A3B8" />
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#102B22', marginBottom: '4px' }}>
                                  {prod.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4, marginBottom: '12px' }}>
                                  {prod.description}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                                  <span style={{ fontWeight: 800, color: '#102B22', fontSize: '0.92rem' }}>
                                    {prod.price}
                                  </span>
                                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#102B22', background: '#F4C744', padding: '4px 10px', borderRadius: '6px' }}>
                                    Pesan
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 7. PROMO_BANNER */}
                      {sec.sectionType === 'PROMO_BANNER' && (
                        <div
                          style={{
                            padding: '36px 32px',
                            background: 'linear-gradient(135deg, #F4C744 0%, #EAB308 100%)',
                            color: '#102B22',
                            textAlign: 'center',
                          }}
                        >
                          <span style={{ display: 'inline-block', background: '#102B22', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', marginBottom: '8px' }}>
                            {sec.contentJson?.badgePromo || 'PROMO'}
                          </span>
                          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 6px', color: '#102B22' }}>
                            {sec.contentJson?.headline || 'Penawaran Diskon Khusus'}
                          </h3>
                          <p style={{ fontSize: '0.84rem', margin: '0 0 14px', color: '#1E293B' }}>
                            {sec.contentJson?.description}
                          </p>
                          {sec.contentJson?.promoCode && (
                            <span style={{ display: 'inline-block', border: '1.5px dashed #102B22', padding: '5px 14px', borderRadius: '6px', fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.05em' }}>
                              KODE: {sec.contentJson.promoCode}
                            </span>
                          )}
                        </div>
                      )}

                      {/* 8. CONTACT_WA */}
                      {sec.sectionType === 'CONTACT_WA' && (
                        <div style={{ padding: '44px 32px', background: '#FFFFFF', textAlign: 'center' }}>
                          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#102B22', margin: '0 0 6px' }}>
                            {sec.contentJson?.title || 'Hubungi Kami'}
                          </h2>
                          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 20px' }}>
                            {sec.contentJson?.subtitle || 'Layanan konsultasi dan pemesanan cepat via WhatsApp'}
                          </p>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#102B22', color: '#FFFFFF', padding: '11px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
                            <Zap size={16} color="#F4C744" />
                            <span>{sec.contentJson?.buttonText || 'Chat WhatsApp Sekarang'}</span>
                          </div>
                          {sec.contentJson?.operatingHours && (
                            <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '12px' }}>
                              {sec.contentJson.operatingHours}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 9. FOOTER */}
                      {sec.sectionType === 'FOOTER' && (
                        <div style={{ padding: '32px 24px', background: '#102B22', color: '#FFFFFF', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#FFFFFF', marginBottom: '4px' }}>
                            {sec.contentJson?.businessName || page.businessName || 'Toko Resmi UMKM'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '14px' }}>
                            {sec.contentJson?.tagline || 'Didukung oleh platform teknologi UNI-LANDFARM.'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                            {sec.contentJson?.copyrightText || `© ${new Date().getFullYear()} Hak Cipta Dilindungi.`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tombol Tambah Blok di Bawah Canvas */}
            <div style={{ padding: '24px', textAlign: 'center', background: '#FAF7F2', borderTop: '1px dashed #CBD5E1' }}>
              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(true)}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px dashed #102B22',
                  borderRadius: '10px',
                  padding: '10px 22px',
                  color: '#102B22',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                }}
              >
                <Plus size={16} />
                <span>Tambah Blok Baru ke Halaman</span>
              </button>
            </div>
          </div>
        </main>

        {/* ============================================================
            PANEL KANAN: INSPEKTOR PROPERTI BLOK
            ============================================================ */}
        <aside
          style={{
            width: '320px',
            background: '#FFFFFF',
            borderLeft: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            zIndex: 20,
            height: '100%',
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          {/* Header Panel Kanan */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={17} color="#102B22" />
              <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#102B22' }}>
                Properti Blok
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
              Sedang mengedit: <strong>{selectedSection?.label || selectedSection?.sectionType}</strong>
            </div>
          </div>

          {/* Form Properties */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              style={{
                width: '100%',
                background: '#FEFCE8',
                border: '1.5px solid #FDE047',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#854D0E',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} color="#854D0E" />
              <span>Bantu Tulis dengan AI</span>
            </button>

            {/* Input: Judul / Headline */}
            {(selectedSection?.contentJson?.headline !== undefined ||
              selectedSection?.contentJson?.title !== undefined) && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Judul Teks
                </label>
                <input
                  type="text"
                  value={
                    selectedSection.contentJson.headline !== undefined
                      ? selectedSection.contentJson.headline
                      : selectedSection.contentJson.title || ''
                  }
                  onChange={(e) => {
                    if (selectedSection.contentJson.headline !== undefined) {
                      handleUpdateContentField('headline', e.target.value);
                    } else {
                      handleUpdateContentField('title', e.target.value);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '0.84rem',
                    color: '#102B22',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#102B22')}
                  onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>
            )}

            {/* Input: Subjudul / Deskripsi */}
            {(selectedSection?.contentJson?.subheadline !== undefined ||
              selectedSection?.contentJson?.subtitle !== undefined ||
              selectedSection?.contentJson?.paragraph !== undefined) && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Deskripsi / Subjudul
                </label>
                <textarea
                  rows={4}
                  value={
                    selectedSection.contentJson.subheadline !== undefined
                      ? selectedSection.contentJson.subheadline
                      : selectedSection.contentJson.subtitle !== undefined
                      ? selectedSection.contentJson.subtitle
                      : selectedSection.contentJson.paragraph || ''
                  }
                  onChange={(e) => {
                    if (selectedSection.contentJson.subheadline !== undefined) {
                      handleUpdateContentField('subheadline', e.target.value);
                    } else if (selectedSection.contentJson.subtitle !== undefined) {
                      handleUpdateContentField('subtitle', e.target.value);
                    } else {
                      handleUpdateContentField('paragraph', e.target.value);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '0.82rem',
                    color: '#102B22',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: 1.5,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#102B22')}
                  onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>
            )}

            {/* Input: Tombol Aksi / Button Text */}
            {selectedSection?.contentJson?.buttonText !== undefined && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Teks Tombol Aksi
                </label>
                <input
                  type="text"
                  value={selectedSection.contentJson.buttonText || ''}
                  onChange={(e) => handleUpdateContentField('buttonText', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '0.84rem',
                    color: '#102B22',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Input: URL Tautan / WhatsApp Link */}
            {selectedSection?.contentJson?.buttonLink !== undefined && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Tautan Tombol (URL / WhatsApp)
                </label>
                <input
                  type="text"
                  placeholder="https://wa.me/6281234567890"
                  value={selectedSection.contentJson.buttonLink || ''}
                  onChange={(e) => handleUpdateContentField('buttonLink', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '0.82rem',
                    color: '#102B22',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Alignment Switcher */}
            {selectedSection?.contentJson?.alignment !== undefined && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Penyelarasan Teks
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => handleUpdateContentField('alignment', align)}
                      style={{
                        flex: 1,
                        padding: '7px 0',
                        borderRadius: '6px',
                        border:
                          selectedSection.contentJson.alignment === align
                            ? '1.5px solid #102B22'
                            : '1px solid #E2E8F0',
                        background:
                          selectedSection.contentJson.alignment === align
                            ? '#FAF7F2'
                            : '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        color:
                          selectedSection.contentJson.alignment === align
                            ? '#102B22'
                            : '#64748B',
                      }}
                    >
                      {align === 'left' ? 'Kiri' : align === 'center' ? 'Tengah' : 'Kanan'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image URL for IMAGE or HERO */}
            {selectedSection?.contentJson?.imageUrl !== undefined && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  URL Gambar
                </label>
                <input
                  type="text"
                  value={selectedSection.contentJson.imageUrl || ''}
                  onChange={(e) => handleUpdateContentField('imageUrl', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '0.82rem',
                    color: '#102B22',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleUpdateContentField('imageUrl', '/assets/coffee_hero_bg.jpg')}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      fontSize: '0.72rem',
                      borderRadius: '6px',
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                    }}
                  >
                    Preset Pegunungan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateContentField('imageUrl', '/assets/coffee_thumb.jpg')}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      fontSize: '0.72rem',
                      borderRadius: '6px',
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                    }}
                  >
                    Preset Biji Kopi
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions (Duplicate & Delete) */}
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleDuplicateBlock(selectedSection.id)}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '8px',
                  border: '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: '#102B22',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Copy size={14} />
                <span>Duplikasi Blok Ini</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(selectedSection.id)}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '8px',
                  border: '1.5px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.05)',
                  color: '#DC2626',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Trash2 size={14} />
                <span>Hapus Blok Ini</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ============================================================
          MODAL: TAMBAH BLOK BARU
          ============================================================ */}
      {isAddBlockModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(16, 43, 34, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsAddBlockModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#102B22', margin: 0 }}>
                  Pilih Blok Konten
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0' }}>
                  Pilih salah satu jenis blok di bawah untuk ditambahkan ke halaman toko Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {INITIAL_BLOCK_DEFS.map((block) => (
                <div
                  key={block.type}
                  onClick={() => handleAddBlock(block)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#102B22';
                    e.currentTarget.style.background = '#FAF7F2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#102B22' }}>
                      {block.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: '#E2E8F0',
                        color: '#334155',
                      }}
                    >
                      {block.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                    {block.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: KONFIRMASI HAPUS BLOK
          ============================================================ */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(16, 43, 34, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Trash2 size={24} color="#DC2626" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#102B22', margin: '0 0 8px' }}>
              Hapus Blok Konten?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 20px', lineHeight: 1.5 }}>
              Apakah Anda yakin ingin menghapus bagian ini dari halaman? Tindakan ini dapat dibatalkan melalui fitur Undo.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBlock(deleteConfirmId)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: KONFIRMASI PUBLIKASI LIVE
          ============================================================ */}
      {isPublishModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(16, 43, 34, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsPublishModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#FEFCE8',
                border: '1.5px solid #FDE047',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Zap size={26} color="#854D0E" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#102B22', margin: '0 0 8px' }}>
              Publikasikan ke Versi Live?
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '0 0 20px', lineHeight: 1.55 }}>
              Semua perubahan blok draft akan langsung diperbarui ke domain website publik Anda. Pelanggan dapat langsung melihat tampilan terbaru.
            </p>

            <div
              style={{
                background: '#FAF7F2',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '22px',
                textAlign: 'left',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ fontSize: '0.74rem', color: '#687A4D', fontWeight: 700, textTransform: 'uppercase' }}>
                Ringkasan Rilis
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#102B22', marginTop: '2px' }}>
                {sections.length} Blok Konten Siap Live
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                Slug: /{page.slug}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                disabled={isPublishing}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                disabled={isPublishing}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#F4C744',
                  color: '#102B22',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: isPublishing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isPublishing ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Menerbitkan...</span>
                  </>
                ) : (
                  <span>Publikasikan Sekarang</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: ASISTEN AI COPYWRITER
          ============================================================ */}
      {isAiModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(16, 43, 34, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsAiModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#854D0E" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#102B22', margin: 0 }}>
                  Asisten Tulis AI
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={15} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 16px', lineHeight: 1.5 }}>
              Ketik arahan atau pesan yang ingin disampaikan. AI Agentic akan merumuskan kalimat promosi yang menarik.
            </p>

            {/* Pilihan Nada Suara */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Gaya Bahasa / Tone
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['friendly', 'profesional', 'formal'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAiTone(t)}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      borderRadius: '8px',
                      border: aiTone === t ? '1.5px solid #102B22' : '1px solid #E2E8F0',
                      background: aiTone === t ? '#FAF7F2' : '#FFFFFF',
                      color: aiTone === t ? '#102B22' : '#64748B',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    {t === 'friendly' ? 'Ramah' : t === 'profesional' ? 'Profesional' : 'Formal'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Instruksi Kalimat
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Buatkan judul menarik untuk kopi robusta petani lereng gunung yang harum..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.84rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleAiCopywrite}
              disabled={isAiLoading || !aiPrompt.trim()}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: isAiLoading ? '#94A3B8' : '#102B22',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: isAiLoading || !aiPrompt.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isAiLoading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Sedang Menulis...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} color="#F4C744" />
                  <span>Hasilkan Kalimat</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
