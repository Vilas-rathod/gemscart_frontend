/**
 * Mobile OTP verification (anti-fake-order / COD gate).
 *
 * Primary path calls the real auth-service endpoints:
 *   POST /api/auth/otp/send   { phone }      -> { phone, expiresIn, resendIn, devCode }
 *   POST /api/auth/otp/verify { phone, code} -> { verified, phone }
 *
 * If the backend is unreachable (network error — e.g. running the frontend
 * standalone with `npm run dev`), it transparently falls back to a client-side
 * mock so the checkout flow can still be exercised end-to-end. Any real HTTP
 * error from the backend (400/409/…) is surfaced to the caller as-is.
 */
import axiosClient from './axiosClient';
import { normalizePhone } from '../utils/validators';

export const OTP_CONFIG = {
  ttlSeconds: 300,
  resendCooldownSeconds: 30,
  codeLength: 6,
};

const isNetworkError = (err) => !err.response; // no HTTP response => couldn't reach backend

const toMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

/* ── Client-side mock (fallback only) ─────────────────────────────────── */
const mockStore = new Map();
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const genCode = () => String(Math.floor(100000 + Math.random() * 900000));

const mockSend = async (phone) => {
  await delay(600);
  const code = genCode();
  mockStore.set(phone, { code, expiresAt: Date.now() + OTP_CONFIG.ttlSeconds * 1000 });
  // eslint-disable-next-line no-console
  console.info(`[otpApi:mock] Demo OTP for +91 ${phone}: ${code}`);
  return {
    phone,
    expiresIn: OTP_CONFIG.ttlSeconds,
    resendIn: OTP_CONFIG.resendCooldownSeconds,
    devCode: code,
  };
};

const mockVerify = async (phone, code) => {
  await delay(500);
  const rec = mockStore.get(phone);
  if (!rec) throw new Error('Your session expired. Please request a new code.');
  if (Date.now() > rec.expiresAt) { mockStore.delete(phone); throw new Error('This code has expired. Please request a new one.'); }
  if (String(code).trim() !== rec.code) throw new Error('Incorrect code. Please try again.');
  mockStore.delete(phone);
  return { verified: true, phone };
};

/* ── Public API ───────────────────────────────────────────────────────── */
export const sendOtp = async (rawPhone) => {
  const phone = normalizePhone(rawPhone);
  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }
  try {
    const { data } = await axiosClient.post('/auth/otp/send', { phone });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mockSend(phone);
    throw new Error(toMessage(err, 'Could not send the code. Please try again.'));
  }
};

export const verifyOtp = async (rawPhone, code) => {
  const phone = normalizePhone(rawPhone);
  try {
    const { data } = await axiosClient.post('/auth/otp/verify', { phone, code });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mockVerify(phone, code);
    throw new Error(toMessage(err, 'Verification failed. Please try again.'));
  }
};
