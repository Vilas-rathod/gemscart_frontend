import { useEffect, useRef, useState, useCallback } from 'react';
import { ShieldCheck, Smartphone, CheckCircle2, RefreshCw } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { sendOtp, verifyOtp, OTP_CONFIG } from '../../api/otpApi';
import { isValidPhone, normalizePhone } from '../../utils/validators';
import './MobileVerification.css';

/* ── Segmented OTP input ── */
const OtpInput = ({ length, value, onChange, disabled }) => {
  const refs = useRef([]);
  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  const setDigit = (i, d) => {
    const next = value.split('');
    next[i] = d;
    onChange(next.join('').replace(/\s/g, '').slice(0, length));
  };

  const handleChange = (i) => (e) => {
    const d = e.target.value.replace(/\D/g, '').slice(-1);
    if (!d) return;
    setDigit(i, d);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i) => (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[i]) {
        setDigit(i, '');
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        setDigit(i - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="otp-boxes" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="otp-box"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digits[i].trim()}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
};

const MobileVerification = ({ isOpen, onClose, defaultPhone = '', onVerified }) => {
  const [phase, setPhase] = useState('phone'); // 'phone' | 'otp' | 'done'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);          // network in-flight (blocks duplicates)
  const [expirySeconds, setExpirySeconds] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);

  const { codeLength } = OTP_CONFIG;

  // Reset all state each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setPhase('phone');
      setPhone(normalizePhone(defaultPhone));
      setCode('');
      setDevCode(null);
      setError('');
      setBusy(false);
      setExpirySeconds(0);
      setResendSeconds(0);
    }
  }, [isOpen, defaultPhone]);

  // Single 1s ticker drives both the expiry and resend countdowns.
  useEffect(() => {
    if (phase !== 'otp') return undefined;
    const id = setInterval(() => {
      setExpirySeconds((s) => (s > 0 ? s - 1 : 0));
      setResendSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const requestOtp = useCallback(async () => {
    if (busy) return; // prevent duplicate OTP requests
    setError('');
    setBusy(true);
    try {
      const res = await sendOtp(phone);
      setDevCode(res.devCode || null);
      setExpirySeconds(res.expiresIn);
      setResendSeconds(res.resendIn);
      setCode('');
      setPhase('otp');
    } catch (err) {
      setError(err.message || 'Could not send the code. Please try again.');
    } finally {
      setBusy(false);
    }
  }, [busy, phone]);

  const submitOtp = useCallback(async () => {
    if (busy || code.length !== codeLength) return; // prevent duplicate verify
    setError('');
    setBusy(true);
    try {
      const { phone: verifiedPhone } = await verifyOtp(phone, code);
      setPhase('done');
      // Brief success state, then hand back to the caller.
      setTimeout(() => onVerified?.(verifiedPhone), 900);
    } catch (err) {
      const msg = err.message || 'Verification failed. Please try again.';
      setError(msg);
      if (/expire/i.test(msg)) setExpirySeconds(0);
    } finally {
      setBusy(false);
    }
  }, [busy, code, codeLength, phone, onVerified]);

  const phoneValid = isValidPhone(phone);
  const expired = phase === 'otp' && expirySeconds === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Your Mobile Number" size="sm">
      <div className="mobile-verify">
        {phase === 'phone' && (
          <>
            <div className="mobile-verify__hero">
              <ShieldCheck size={40} strokeWidth={1.4} />
            </div>
            <p className="mobile-verify__lead">
              To confirm your Cash on Delivery order, we&apos;ll send a one-time
              password to your mobile number.
            </p>
            <label className="mobile-verify__label" htmlFor="verify-phone">Mobile Number</label>
            <div className="mobile-verify__phone-field">
              <span className="mobile-verify__cc">+91</span>
              <input
                id="verify-phone"
                className="mobile-verify__phone-input"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                autoFocus
              />
            </div>
            {phone.length > 0 && !phoneValid && (
              <p className="mobile-verify__hint mobile-verify__hint--error">
                Enter a valid 10-digit Indian mobile number.
              </p>
            )}
            {error && <p className="mobile-verify__error">{error}</p>}
            <Button
              variant="gold"
              size="lg"
              fullWidth
              onClick={requestOtp}
              loading={busy}
              disabled={!phoneValid}
              className="mobile-verify__cta"
            >
              Send OTP
            </Button>
          </>
        )}

        {phase === 'otp' && (
          <>
            <div className="mobile-verify__hero">
              <Smartphone size={40} strokeWidth={1.4} />
            </div>
            <p className="mobile-verify__lead">
              Enter the {codeLength}-digit code sent to <strong>+91 {phone}</strong>.
              <button type="button" className="mobile-verify__change" onClick={() => setPhase('phone')}>
                Change
              </button>
            </p>

            {devCode && (
              <p className="mobile-verify__demo">
                Demo mode — your OTP is <strong>{devCode}</strong>
                <span> (a real SMS gateway replaces this in production)</span>
              </p>
            )}

            <OtpInput length={codeLength} value={code} onChange={(v) => { setCode(v); setError(''); }} disabled={busy || expired} />

            <div className="mobile-verify__timer">
              {expired
                ? <span className="mobile-verify__timer--expired">Code expired</span>
                : <span>Code expires in {expirySeconds}s</span>}
            </div>

            {error && <p className="mobile-verify__error">{error}</p>}

            <Button
              variant="gold"
              size="lg"
              fullWidth
              onClick={submitOtp}
              loading={busy}
              disabled={code.length !== codeLength || expired}
              className="mobile-verify__cta"
            >
              Verify &amp; Continue
            </Button>

            <button
              type="button"
              className="mobile-verify__resend"
              onClick={requestOtp}
              disabled={busy || resendSeconds > 0}
            >
              <RefreshCw size={14} />
              {resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : 'Resend code'}
            </button>
          </>
        )}

        {phase === 'done' && (
          <div className="mobile-verify__done">
            <CheckCircle2 size={56} strokeWidth={1.4} />
            <h4>Mobile Verified</h4>
            <p>+91 {phone} confirmed. Placing your order…</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MobileVerification;
