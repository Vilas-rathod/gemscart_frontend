import { useState } from 'react';
import { CheckCircle, Package, CreditCard, MapPin } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import './Checkout.css';

const STEPS = [
  { id: 'address',  label: 'Delivery',  Icon: MapPin },
  { id: 'payment',  label: 'Payment',   Icon: CreditCard },
  { id: 'confirm',  label: 'Confirm',   Icon: Package },
];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [ordered, setOrdered] = useState(false);
  const { items, subtotal, discount, shipping, total } = useCart();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    cardNumber: '', cardName: '', expiry: '', cvv: '',
    paymentMethod: 'card'
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (ordered) {
    return (
      <div className="checkout-success">
        <div className="checkout-success__icon">
          <CheckCircle size={64} strokeWidth={1} />
        </div>
        <h1 className="display-md checkout-success__title">Order Placed!</h1>
        <p className="checkout-success__sub">
          Thank you, {form.firstName}. Your jewellery is being prepared with care and will be delivered to {form.city} within 5–7 business days.
        </p>
        <p className="checkout-success__order-id">Order ID: LUXE-{Date.now().toString().slice(-6)}</p>
        <a href="/" className="checkout-success__btn">Continue Shopping</a>
      </div>
    );
  }

  return (
    <main className="checkout-page">
      <div className="container">
        <h1 className="checkout-page__title display-md">Checkout</h1>

        {/* Step Indicator */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="checkout-step__circle">
                <s.Icon size={16} />
              </div>
              <span className="checkout-step__label label-uppercase">{s.label}</span>
              {i < STEPS.length - 1 && <div className="checkout-step__line" />}
            </div>
          ))}
        </div>

        <div className="checkout-page__layout">
          {/* Form */}
          <div className="checkout-form">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="checkout-form__section">
                <h3 className="checkout-form__title">Delivery Address</h3>
                <div className="checkout-form__grid">
                  <Input label="First Name" value={form.firstName} onChange={set('firstName')} placeholder="Priya" />
                  <Input label="Last Name"  value={form.lastName}  onChange={set('lastName')}  placeholder="Sharma" />
                  <Input label="Email"      type="email" value={form.email} onChange={set('email')} placeholder="priya@email.com" className="checkout-form__full" />
                  <Input label="Phone"      type="tel"  value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className="checkout-form__full" />
                  <Input label="Address"   value={form.address}  onChange={set('address')}  placeholder="123, Marine Drive" className="checkout-form__full" />
                  <Input label="City"      value={form.city}     onChange={set('city')}     placeholder="Mumbai" />
                  <Input label="State"     value={form.state}    onChange={set('state')}    placeholder="Maharashtra" />
                  <Input label="Pincode"   value={form.pincode}  onChange={set('pincode')}  placeholder="400001" />
                </div>
                <Button variant="primary" size="lg" onClick={() => setStep(1)} className="checkout-form__next">
                  Continue to Payment →
                </Button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="checkout-form__section">
                <h3 className="checkout-form__title">Payment Method</h3>

                <div className="checkout-payment-methods">
                  {[
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'upi',  label: 'UPI' },
                    { id: 'cod',  label: 'Cash on Delivery' },
                  ].map(m => (
                    <label key={m.id} className={`checkout-payment-method ${form.paymentMethod === m.id ? 'active' : ''}`}>
                      <input type="radio" name="payment" value={m.id} checked={form.paymentMethod === m.id} onChange={set('paymentMethod')} />
                      {m.label}
                    </label>
                  ))}
                </div>

                {form.paymentMethod === 'card' && (
                  <div className="checkout-form__grid">
                    <Input label="Card Number"  value={form.cardNumber} onChange={set('cardNumber')} placeholder="4242 4242 4242 4242" className="checkout-form__full" />
                    <Input label="Name on Card" value={form.cardName}   onChange={set('cardName')}   placeholder="Priya Sharma" className="checkout-form__full" />
                    <Input label="Expiry (MM/YY)" value={form.expiry}  onChange={set('expiry')}    placeholder="12/28" />
                    <Input label="CVV"            value={form.cvv}     onChange={set('cvv')}       placeholder="•••" type="password" />
                  </div>
                )}

                {form.paymentMethod === 'upi' && (
                  <Input label="UPI ID" value={form.upiId} onChange={set('upiId')} placeholder="yourname@upi" className="checkout-form__full" />
                )}

                {form.paymentMethod === 'cod' && (
                  <p className="checkout-cod-note">A small convenience fee of ₹49 applies for Cash on Delivery orders.</p>
                )}

                <div className="checkout-form__btns">
                  <button className="checkout-form__back" onClick={() => setStep(0)}>← Back</button>
                  <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                    Review Order →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="checkout-form__section">
                <h3 className="checkout-form__title">Order Confirmation</h3>

                <div className="checkout-confirm">
                  <div className="checkout-confirm__group">
                    <h4 className="label-uppercase checkout-confirm__label">Delivering To</h4>
                    <p>{form.firstName} {form.lastName}</p>
                    <p>{form.address}, {form.city} – {form.pincode}</p>
                    <p>{form.phone} · {form.email}</p>
                  </div>
                  <div className="checkout-confirm__group">
                    <h4 className="label-uppercase checkout-confirm__label">Payment</h4>
                    <p>{form.paymentMethod === 'card' ? `Card ending ****${form.cardNumber.slice(-4)}` : form.paymentMethod === 'upi' ? `UPI: ${form.upiId}` : 'Cash on Delivery'}</p>
                  </div>
                </div>

                <div className="checkout-items-preview">
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}`} className="checkout-item-row">
                      <img src={item.images[0]} alt={item.name} />
                      <div>
                        <p className="checkout-item-name">{item.name}</p>
                        <p className="checkout-item-meta">Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ''}</p>
                      </div>
                      <span className="checkout-item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="checkout-form__btns">
                  <button className="checkout-form__back" onClick={() => setStep(1)}>← Back</button>
                  <Button variant="gold" size="lg" onClick={() => setOrdered(true)}>
                    Place Order — {formatPrice(total)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <h3 className="checkout-sidebar__title">Order Summary</h3>
            {items.map(item => (
              <div key={`${item.id}-${item.size}`} className="checkout-sidebar__item">
                <img src={item.images[0]} alt={item.name} className="checkout-sidebar__item-img" />
                <div className="checkout-sidebar__item-info">
                  <p className="checkout-sidebar__item-name">{item.name}</p>
                  <p className="checkout-sidebar__item-meta">Qty: {item.quantity}</p>
                </div>
                <span className="checkout-sidebar__item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="checkout-sidebar__totals">
              <div className="checkout-sidebar__row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="checkout-sidebar__row highlight"><span>Discount</span><span>−{formatPrice(discount)}</span></div>}
              <div className="checkout-sidebar__row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="checkout-sidebar__total"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
