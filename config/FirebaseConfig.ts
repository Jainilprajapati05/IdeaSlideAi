/// <reference types="vite/client" />

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAI,
  getGenerativeModel,
  getLiveGenerativeModel,
  GoogleAIBackend,
  ResponseModality,
  type GenerativeModel,
} from "firebase/ai";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: "ideaslideai.firebaseapp.com",
  projectId: "ideaslideai",
  storageBucket: "ideaslideai.firebasestorage.app",
  messagingSenderId: "1062393945218",
  appId: "1:1062393945218:web:5a8b48a1c5899d9106289b",
  measurementId: "G-JMTT5PHKFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(app);

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const GeminiAiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });






// Create a streaming-compatible GenerativeModel instance
export const GeminiAiStreamingModel = getGenerativeModel(ai, {
  // Gemini 1.5 is retired; use a supported streaming-capable model
  model: "gemini-2.0-flash"
});

// Optional lower-cost/fallback model for free-tier-friendly usage
export const GeminiAiStreamingModelLite = getGenerativeModel(ai, {
  model: "gemini-2.0-flash-lite"
});

// Live API model (if needed for real-time features)
export const GeminiAiLiveModel = getLiveGenerativeModel(ai, {
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseModalities: [ResponseModality.TEXT],
  },
});

// Simple retry helper with backoff for rate limits and transient errors
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const RETRYABLE_STATUS = new Set([429, 500, 502, 503]);

const extractStatus = (err: unknown) => {
  const anyErr = err as { status?: number; code?: number; cause?: { status?: number } };
  return anyErr?.status ?? anyErr?.code ?? anyErr?.cause?.status;
};

/**
 * Wraps model.generateContent with retries/backoff for 429/5xx.
 * Surfaces a readable error when retries are exhausted (useful for UI to display).
 */
export const generateContentWithRetry = async (
  model: GenerativeModel,
  prompt: string,
  maxRetries = 2,
  fallbackModel?: GenerativeModel
) => {
  let attempt = 0;
  let backoff = 1500;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await model.generateContent(prompt);
    } catch (err: unknown) {
      const status = extractStatus(err);
      const isRetryable = status && RETRYABLE_STATUS.has(Number(status));

      if (isRetryable && attempt < maxRetries) {
        await sleep(backoff);
        attempt += 1;
        backoff = Math.min(backoff * 2, 12000);
        continue;
      }

      if (status === 429 && fallbackModel) {
        // Try a single fallback model before giving up (useful when free-tier is 0)
        try {
          return await fallbackModel.generateContent(prompt);
        } catch (fallbackErr) {
          const enrichedError = new Error(
            "Gemini rate limit exceeded. Please wait or upgrade quota."
          );
          (enrichedError as any).cause = fallbackErr;
          throw enrichedError;
        }
      }

      const enrichedError = new Error(
        status === 429
          ? "Gemini rate limit exceeded. Please wait or upgrade quota."
          : "Gemini request failed. Please try again."
      );
      (enrichedError as any).cause = err;
      throw enrichedError;
    }
  }
};


