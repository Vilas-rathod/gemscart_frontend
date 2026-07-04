import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, Truck, ShieldCheck, Lock, Phone, MapPin, User as UserIcon, BadgeCheck, Wallet,
} from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import MobileVerification from '../components/checkout/MobileVerification';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getEstimatedDelivery } from '../utils/helpers';
import { getBuyNow, clearBuyNow } from '../utils/buyNow';
import {
  isValidEmail, isValidPhone, isValidPincode, isNotEmpty, normalizePhone,
} from '../utils/validators';
import * as orderApi from '../api/orderApi';
import { track, ACTIVITY } from '../api/activityApi';
import './Checkout.css';

const DRAFT_KEY = 'luxe_checkout';
const COD_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 299;

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '', password: '',
  address: '', city: '', state: '', pincode: '',
};

const loadDraft = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
    // Never persist the password.
    return saved ? { ...EMPTY_FORM, ...saved, password: '' } : EMPTY_FORM;
  } catch {
    return EMPTY_FORM;
  }
};

const Checkout = () => {
  const { items: cartItems, coupon, dispatch } = useCart();
  const { isAuthenticated, user, register } = useAuth();

  const [order, setOrder] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [form, setForm] = useState(loadDraft);

  const submittingRef = useRef(false);
  const orderAfterVerifyRef = useRef(false); // true = verification was triggered by "Order Now"
  const delivery = getEstimatedDelivery();

  // Buy-now (from "Order Now") takes precedence over the cart.
  const buyNow = getBuyNow();
  const isBuyNow = !!buyNow;
  const orderItems = isBuyNow ? [buyNow] : cartItems;

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = isBuyNow || !coupon ? 0 : Math.round(subtotal * (coupon.percent / 100));
  const shipping = orderItems.length === 0 ? 0 : subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const codFee = orderItems.length === 0 ? 0 : COD_FEE;
  const total = subtotal - discount + shipping + codFee;

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [k]: value }));
    setErrors(prev => (prev[k] ? { ...prev, [k]: undefined } : prev));
    if (k === 'phone') setPhoneVerified(false);
  };

  // Prefill from the logged-in user; persist a non-sensitive draft otherwise.
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(f => ({
        ...f,
        email: f.email || user.email || '',
        firstName: f.firstName || (user.name ? user.name.split(' ')[0] : ''),
        lastName: f.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const { password, ...draft } = form;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [form]);

  const validate = () => {
    const e = {};
    if (!isNotEmpty(form.firstName)) e.firstName = 'Required';
    if (!isNotEmpty(form.lastName)) e.lastName = 'Required';
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!isValidPhone(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!isNotEmpty(form.address)) e.address = 'Required';
    if (!isNotEmpty(form.city)) e.city = 'Required';
    if (!isNotEmpty(form.state)) e.state = 'Required';
    if (!isValidPincode(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    if (!isAuthenticated && (form.password || '').length < 6) e.password = 'Choose a password (min 6 characters)';
    return e;
  };

  const placeOrder = useCallback(async () => {
    const created = await orderApi.createOrder({
      items: orderItems.map(i => ({ productId: i.id, size: i.size, quantity: i.quantity })),
      shippingAddress: {
        firstName: form.firstName, lastName: form.lastName, email: form.email, phone: normalizePhone(form.phone),
        address: form.address, city: form.city, state: form.state, pincode: form.pincode,
      },
      paymentMethod: 'COD',
      phoneVerified: true,
      couponCode: isBuyNow ? undefined : coupon?.code,
    });
    if (!isBuyNow) await dispatch({ type: 'CLEAR_CART' });
    clearBuyNow();
    localStorage.removeItem(DRAFT_KEY);
    track(ACTIVITY.CHECKOUT, created?.orderNumber || created?.id);
    setOrder(created);
  }, [orderItems, form, isBuyNow, coupon, dispatch]);

  // Guest → create a real account (so they can log in later) → place order.
  const finalizeOrder = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setError('');
    setProcessing(true);
    try {
      if (!isAuthenticated) {
        try {
          await register({
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            password: form.password,
            phone: normalizePhone(form.phone),
          });
        } catch (err) {
          if (err.response?.status === 409) {
            setError('An account with this email already exists. Please log in to place your order.');
          } else {
            setError(err.response?.data?.message || 'Could not create your account. Please try again.');
          }
          return; // stop — do not place the order
        }
      }
      await placeOrder();
    } catch (err) {
      setError(err.response?.data?.message || 'We could not place your order. Please try again.');
    } finally {
      setProcessing(false);
      submittingRef.current = false;
    }
  }, [isAuthenticated, register, form, placeOrder]);

  const openVerify = (placeAfter) => {
    orderAfterVerifyRef.current = placeAfter;
    setVerifyOpen(true);
  };

  const handleOrderNow = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (!phoneVerified) { openVerify(true); return; } // anti-fake gate → place order after verifying
    finalizeOrder();
  };

  const handleVerified = useCallback((verifiedPhone) => {
    setPhoneVerified(true);
    setForm(f => ({ ...f, phone: verifiedPhone }));
    setVerifyOpen(false);
    if (orderAfterVerifyRef.current) {
      orderAfterVerifyRef.current = false;
      finalizeOrder();
    }
  }, [finalizeOrder]);

  /* ── Success ── */
  if (order) {
    return (
      <div className="checkout-success">
        <div className="checkout-success__icon"><CheckCircle size={64} strokeWidth={1} /></div>
        <h1 className="display-md checkout-success__title">Order Confirmed!</h1>
        <p className="checkout-success__sub">
          Thank you, {form.firstName}. Your Cash on Delivery order is confirmed and will be
          delivered to {form.city} by <strong>{delivery.label}</strong>. Pay ₹{order.total ?? total} in cash on arrival.
        </p>
        <p className="checkout-success__order-id">Order ID: LUXE-{order.id} · {formatPrice(order.total ?? total)}</p>
        <div className="checkout-success__actions">
          <Link to="/" className="checkout-success__btn">Continue Shopping</Link>
          {isAuthenticated && <Link to="/profile" className="checkout-success__btn checkout-success__btn--ghost">Track Order</Link>}
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (orderItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h1 className="display-sm">Your bag is empty</h1>
        <p>Add something beautiful before checking out.</p>
        <Link to="/shop" className="checkout-success__btn">Browse Collection</Link>
      </div>
    );
  }

  return (
    <main className="checkout-page checkout-page--single">
      <div className="container">
        <h1 className="checkout-page__title display-md">Secure Checkout</h1>

        {/* Login / register banner (top) */}
        {isAuthenticated ? (
          <div className="checkout-account-bar checkout-account-bar--in">
            <BadgeCheck size={16} />
            <span>Logged in as <strong>{user?.email}</strong></span>
          </div>
        ) : (
          <div className="checkout-account-bar">
            <span>Already have an account?</span>
            <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="checkout-account-bar__link">
              Log in for faster checkout →
            </Link>
          </div>
        )}

        <div className="checkout-page__layout">
          {/* ── Form (single page) ── */}
          <div className="checkout-form">
            {/* Contact */}
            <section className="checkout-block">
              <h3 className="checkout-block__title"><Phone size={17} /> Contact</h3>
              <div className="checkout-form__grid">
                <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="priya@email.com" className="checkout-form__full" />
                <div className="checkout-form__full checkout-phone-row">
                  <Input
                    label="Mobile Number" type="tel" value={form.phone} onChange={set('phone')}
                    error={errors.phone} placeholder="98765 43210"
                    hint={phoneVerified ? undefined : 'We verify this with an OTP to confirm your COD order.'}
                  />
                  {phoneVerified ? (
                    <span className="checkout-verify-pill checkout-verify-pill--ok"><BadgeCheck size={15} /> Verified</span>
                  ) : (
                    <button
                      type="button"
                      className="checkout-verify-pill"
                      onClick={() => (isValidPhone(form.phone) ? openVerify(false) : setErrors(e => ({ ...e, phone: 'Enter a valid 10-digit mobile number' })))}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section className="checkout-block">
              <h3 className="checkout-block__title"><MapPin size={17} /> Delivery Address</h3>
              <div className="checkout-form__grid">
                <Input label="First Name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} placeholder="Priya" />
                <Input label="Last Name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} placeholder="Sharma" />
                <Input label="Address" value={form.address} onChange={set('address')} error={errors.address} placeholder="Flat / House no., Street, Landmark" className="checkout-form__full" />
                <Input label="City" value={form.city} onChange={set('city')} error={errors.city} placeholder="Mumbai" />
                <Input label="State" value={form.state} onChange={set('state')} error={errors.state} placeholder="Maharashtra" />
                <Input label="Pincode" value={form.pincode} onChange={set('pincode')} error={errors.pincode} placeholder="400001" />
              </div>
            </section>

            {/* Create account (guests only) */}
            {!isAuthenticated && (
              <section className="checkout-block">
                <h3 className="checkout-block__title"><UserIcon size={17} /> Create Your Account</h3>
                <p className="checkout-block__note">
                  We&apos;ll set up your account with these details so you can track this order and
                  log in faster next time.
                </p>
                <Input
                  label="Create Password" type="password" value={form.password} onChange={set('password')}
                  error={errors.password} placeholder="At least 6 characters" className="checkout-form__full"
                />
              </section>
            )}

            {/* Payment */}
            <section className="checkout-block">
              <h3 className="checkout-block__title"><Wallet size={17} /> Payment</h3>
              <div className="checkout-cod-card">
                <div className="checkout-cod-card__radio"><span /></div>
                <div className="checkout-cod-card__body">
                  <p className="checkout-cod-card__title">Cash on Delivery <span className="checkout-cod-card__tag">Available</span></p>
                  <p className="checkout-cod-card__sub">Pay in cash when your jewellery arrives. A ₹{COD_FEE} handling fee applies.</p>
                </div>
                <Truck size={20} className="checkout-cod-card__icon" />
              </div>
            </section>

            {/* Delivery ETA + confirm */}
            <div className="checkout-delivery-eta">
              <Truck size={18} />
              <span>Estimated delivery: <strong>{delivery.label}</strong></span>
            </div>

            {isBuyNow && phoneVerified && (
              <div className="checkout-verify-banner checkout-verify-banner--ok">
                <CheckCircle size={16} />
                <span>Mobile <strong>+91 {normalizePhone(form.phone)}</strong> verified — your order is ready to confirm.</span>
              </div>
            )}

            <label className="checkout-confirm-check">
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
              <span>I confirm my delivery details are correct and I&apos;ll be available to receive this Cash on Delivery order.</span>
            </label>

            {error && <p className="checkout-cod-note checkout-cod-note--error">{error}</p>}

            <Button
              variant="gold" size="lg" fullWidth
              onClick={handleOrderNow}
              loading={processing}
              disabled={!confirmed || processing}
              className="checkout-order-btn"
            >
              {processing ? 'Placing Order…' : `Order Now — ${formatPrice(total)}`}
            </Button>

            <p className="checkout-secure-note"><Lock size={13} /> Mobile-verified · Cash on Delivery · No advance payment</p>
          </div>

          {/* ── Order Summary ── */}
          <div className="checkout-sidebar">
            <h3 className="checkout-sidebar__title">Order Summary</h3>
            {orderItems.map(item => (
              <div key={`${item.id}-${item.size}`} className="checkout-sidebar__item">
                <img src={item.images?.[0]} alt={item.name} className="checkout-sidebar__item-img" />
                <div className="checkout-sidebar__item-info">
                  <p className="checkout-sidebar__item-name">{item.name}</p>
                  <p className="checkout-sidebar__item-meta">Qty: {item.quantity} {item.size ? `· ${item.size}` : ''}</p>
                </div>
                <span className="checkout-sidebar__item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="checkout-sidebar__totals">
              <div className="checkout-sidebar__row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="checkout-sidebar__row highlight"><span>Discount</span><span>−{formatPrice(discount)}</span></div>}
              <div className="checkout-sidebar__row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="checkout-sidebar__row"><span>COD Handling</span><span>{formatPrice(codFee)}</span></div>
              <div className="checkout-sidebar__total"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <div className="checkout-sidebar__trust">
              <div><ShieldCheck size={14} /> BIS Hallmarked & Certified</div>
              <div><Truck size={14} /> 15-Day Easy Returns</div>
            </div>
          </div>
        </div>
      </div>

      <MobileVerification
        isOpen={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        defaultPhone={form.phone}
        onVerified={handleVerified}
      />
    </main>
  );
};

export default Checkout;
