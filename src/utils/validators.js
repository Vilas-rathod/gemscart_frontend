// Lightweight, dependency-free validators shared across forms.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value = '') => EMAIL_RE.test(value.trim());

// Accepts common Indian formats: +91 98765 43210, 09876543210, 9876543210, etc.
// Normalises to the 10-digit subscriber number for validation.
export const normalizePhone = (value = '') => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};

export const isValidPhone = (value = '') => {
  const num = normalizePhone(value);
  // Indian mobile numbers are 10 digits and start with 6–9.
  return /^[6-9]\d{9}$/.test(num);
};

export const isValidPincode = (value = '') => /^[1-9]\d{5}$/.test(value.trim());

export const isNotEmpty = (value = '') => value.trim().length > 0;

export const isValidCardNumber = (value = '') => {
  const digits = value.replace(/\s+/g, '');
  return /^\d{13,19}$/.test(digits);
};

export const isValidExpiry = (value = '') => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim());

export const isValidCvv = (value = '') => /^\d{3,4}$/.test(value.trim());

export const isValidUpi = (value = '') => /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(value.trim());
