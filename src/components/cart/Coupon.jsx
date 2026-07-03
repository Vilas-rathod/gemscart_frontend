import { useState } from 'react';
import { Tag, X, CheckCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import './Coupon.css';

const VALID_COUPONS = {
  'LUXE10':  { percent: 10, label: '10% off your order' },
  'BRIDE20': { percent: 20, label: '20% off bridal collection' },
  'FIRST15': { percent: 15, label: '15% off your first order' },
};

const Coupon = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { coupon, dispatch } = useCart();

  const apply = () => {
    const upper = code.trim().toUpperCase();
    if (VALID_COUPONS[upper]) {
      dispatch({ type: 'APPLY_COUPON', payload: { code: upper, ...VALID_COUPONS[upper] } });
      setError('');
      setCode('');
    } else {
      setError('Invalid coupon code. Try LUXE10, BRIDE20 or FIRST15.');
    }
  };

  const remove = () => dispatch({ type: 'REMOVE_COUPON' });

  if (coupon) {
    return (
      <div className="coupon coupon--applied">
        <CheckCircle size={16} className="coupon__check" />
        <div className="coupon__info">
          <span className="coupon__code">{coupon.code}</span>
          <span className="coupon__label">{coupon.label}</span>
        </div>
        <button className="coupon__remove" onClick={remove} aria-label="Remove coupon">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="coupon">
      <div className="coupon__field">
        <Tag size={14} className="coupon__icon" />
        <input
          type="text"
          className="coupon__input"
          placeholder="Enter coupon code"
          value={code}
          onChange={e => { setCode(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && apply()}
        />
        <button className="coupon__apply-btn" onClick={apply}>Apply</button>
      </div>
      {error && <p className="coupon__error">{error}</p>}
    </div>
  );
};

export default Coupon;
