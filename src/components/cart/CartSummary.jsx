import { Link } from 'react-router-dom';
import { Shield, Truck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';
import './CartSummary.css';

const CartSummary = () => {
  const { subtotal, discount, shipping, total, coupon } = useCart();

  const rows = [
    { label: 'Subtotal', value: formatPrice(subtotal) },
    coupon && { label: `Discount (${coupon.code} −${coupon.percent}%)`, value: `−${formatPrice(discount)}`, highlight: true },
    { label: shipping === 0 ? 'Shipping (Free)' : 'Shipping', value: shipping === 0 ? 'FREE' : formatPrice(shipping) },
  ].filter(Boolean);

  return (
    <div className="cart-summary">
      <h3 className="cart-summary__title">Order Summary</h3>

      <div className="cart-summary__rows">
        {rows.map(({ label, value, highlight }) => (
          <div key={label} className={`cart-summary__row ${highlight ? 'highlight' : ''}`}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="cart-summary__total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <p className="cart-summary__tax">Inclusive of all taxes</p>

      <Link to="/checkout" className="cart-summary__checkout-btn">
        Proceed to Checkout
      </Link>

      <Link to="/shop" className="cart-summary__continue">
        ← Continue Shopping
      </Link>

      <div className="cart-summary__trust">
        <div className="cart-summary__trust-item">
          <Shield size={14} />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="cart-summary__trust-item">
          <Truck size={14} />
          <span>Free shipping on orders above ₹50,000</span>
        </div>
      </div>

      <div className="cart-summary__payments">
        {['Visa', 'Mastercard', 'UPI', 'Net Banking', 'EMI'].map(p => (
          <span key={p} className="cart-summary__payment-chip">{p}</span>
        ))}
      </div>
    </div>
  );
};

export default CartSummary;
