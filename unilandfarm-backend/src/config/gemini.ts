import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerationConfig,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { env } from './env';

// ============================================================
// Google AI Studio (Gemini) — Konfigurasi Terpusat
// ============================================================

// Inisialisasi Google Generative AI client dengan API Key
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// ============================================================
// Safety Settings — Sesuaikan untuk konten bisnis UMKM
// ============================================================
const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// ============================================================
// Generation Config — Model untuk Generate Landing Page (JSON output)
// ============================================================
const pageGenerationConfig: GenerationConfig = {
  temperature: 0.8,       // Sedikit kreatif tapi tetap konsisten
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,  // Cukup untuk full landing page JSON
  responseMimeType: 'application/json', // Paksa output selalu JSON valid
};

// ============================================================
// Generation Config — Model untuk AI Magic Button (text assistant)
// ============================================================
const textAssistantConfig: GenerationConfig = {
  temperature: 0.9,       // Lebih kreatif untuk rephrase/extend
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: 'text/plain',
};

// ============================================================
// Factory Functions — Dapatkan model yang sudah dikonfigurasi
// ============================================================

/**
 * Mendapatkan model Gemini untuk generate full landing page.
 * Selalu menghasilkan output JSON terstruktur.
 */
export const getPageGeneratorModel = (): GenerativeModel => {
  return genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    generationConfig: pageGenerationConfig,
    safetySettings: safetySetting,
  });
};

/**
 * Mendapatkan model Gemini untuk AI Magic Button (text assistant).
 * Menghasilkan plain text untuk rephrase, extend, shorten, change tone.
 */
export const getTextAssistantModel = (): GenerativeModel => {
  return genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    generationConfig: textAssistantConfig,
    safetySettings: safetySetting,
  });
};

/**
 * Helper: Parse JSON dari response Gemini dengan aman.
 * Menangani kasus di mana Gemini menambahkan markdown code block.
 *
 * @param text - Raw text response dari Gemini
 * @returns Parsed JSON object
 * @throws Error jika parsing gagal
 */
export const parseGeminiJson = <T = unknown>(text: string): T => {
  // Hapus markdown fences jika ada (```json ... ```)
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(
      `Gagal mem-parsing JSON dari Gemini. Raw response:\n${text.slice(0, 500)}...`
    );
  }
};

export { genAI };
export default genAI;
