// ============================================================
// UNI-LANDFARM — Type Definitions
// AI-Powered Micro-Web & Digital Presence Management Platform
// ============================================================

export type UserRole = 'CLIENT' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type PublishStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SUSPENDED';

export type SectionType =
  | 'HERO'
  | 'HEADING_TEXT'
  | 'IMAGE'
  | 'CTA_BUTTON'
  | 'FEATURES'
  | 'CATALOG'
  | 'PROMO_BANNER'
  | 'CONTACT_WA'
  | 'FOOTER'
  | 'TESTIMONIALS'
  | 'FAQ'
  | 'CONTACT'
  | 'GALLERY'
  | 'PRICING_TABLE'
  | 'CUSTOM';

export type PaymentMethod =
  | 'VIRTUAL_ACCOUNT'
  | 'QRIS'
  | 'MANUAL_TRANSFER'
  | 'MIDTRANS'
  | 'XENDIT'
  | 'VA'
  | 'MANUAL';

export type TransactionStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'REFUNDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  businessName?: string;
  phoneNumber?: string;
  tokenBalance: number;
  createdAt?: string;
}

export interface Section {
  id: string;
  landingPageId?: string;
  sectionType: SectionType;
  label: string;
  sortOrder: number;
  isVisible: boolean;
  contentJson: Record<string, any>;
  styleJson?: Record<string, any>;
}

export interface LandingPage {
  id: string;
  userId: string;
  templateId?: string;
  title: string;
  slug: string;
  publishStatus: PublishStatus;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  businessName?: string;
  category?: string;
  description?: string;
  tone?: string;
  theme?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  viewCount: number;
  uniqueVisitors: number;
  tokenConsumed: number;
  createdAt: string;
  updatedAt: string;
  sections?: Section[];
}

export type MicroWeb = LandingPage;

export interface MicroWebVersion {
  id: string;
  microWebId: string;
  versionNumber: number;
  snapshot: LandingPage;
  createdAt: string;
  commitMessage?: string;
}

export interface AIProposal {
  id: string;
  microWebId: string;
  summary: string;
  proposedChanges: {
    sectionId?: string;
    sectionType?: SectionType;
    action: 'ADD' | 'MODIFY' | 'DELETE' | 'REORDER';
    field?: string;
    oldValue?: any;
    newValue?: any;
  }[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  proposalId?: string;
  proposal?: AIProposal;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  thumbnailUrl?: string;
  sectionsJson: Section[];
  tokenCost: number;
  isActive: boolean;
  usageCount: number;
}

export interface TokenPackage {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  isPopular?: boolean;
  description: string;
  features: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  invoiceCode: string;
  packageName: string;
  tokenAmount: number;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  proofImageUrl?: string;
  adminNote?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'PROMO' | 'WARNING' | 'SYSTEM' | 'TRANSACTION' | 'AI_RESULT';
  readStatus: 'UNREAD' | 'READ';
  createdAt: string;
  actionUrl?: string;
}

export interface AiGenerateRequest {
  businessName: string;
  category: string;
  description: string;
  tone: 'profesional' | 'friendly' | 'fun' | 'formal' | 'casual';
  templateId?: string;
}

export interface MagicRephraseRequest {
  text: string;
  landingPageId: string;
  mode?: 'rephrase' | 'extend' | 'shorten' | 'tone';
  tone?: 'profesional' | 'friendly' | 'fun' | 'formal' | 'casual';
}

export type BillingInterval = 'monthly' | 'yearly';

export interface PlanLimits {
  websites: number | 'unlimited';
  publishedWebsites?: number;
  tokens: number;
  aiTokensIncluded?: number;
  templates: 'basic' | 'all';
  customDomain: boolean;
  scheduler: boolean;
  exportHtml: boolean;
  prioritySupport: boolean;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: PlanLimits;
  isPopular?: boolean;
  isFree?: boolean;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'CANCELLED';
  billingInterval: BillingInterval;
  startsAt: string;
  expiresAt: string;
  renewalMode: 'MANUAL' | 'AUTO';
}

export interface Order {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  orderReference: string;
  amount: number;
  currency: 'IDR';
  billingInterval: BillingInterval;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  createdAt: string;
  expiredAt?: string;
  proofImageUrl?: string;
}
