import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Clock, XCircle, ArrowRight } from 'lucide-react';
import { applyAsSeller, getMySeller } from '../../api/sellerApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/dashboard/ToastProvider';
import { Skeleton } from '../../components/dashboard/Skeleton';
import '../../components/dashboard/dashboard.css';
import './seller-apply.css';

const SellerApply = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ shopName: '', gstin: '', phone: '', description: '' });
  const [errors, setErrors] = useState({});

  // A seller who lands here goes straight to the dashboard.
  useEffect(() => {
    if (user?.role === 'SELLER' || user?.role === 'ADMIN') { navigate('/seller', { replace: true }); return; }
    getMySeller()
      .then(setSeller)
      .catch(() => setSeller(null))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: undefined })); };

  const submit = async () => {
    const er = {};
    if (!form.shopName.trim()) er.shopName = 'Shop name is required';
    setErrors(er);
    if (Object.keys(er).length) return;
    setSubmitting(true);
    try {
      const created = await applyAsSeller(form);
      setSeller(created);
      toast.success('Application submitted! Our team will review it shortly.');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not submit your application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="apply-wrap"><div className="apply-card"><Skeleton height={200} /></div></div>;
  }

  // Already applied → show status
  if (seller) {
    const pending = seller.status === 'PENDING';
    const rejected = seller.status === 'REJECTED';
    return (
      <div className="apply-wrap">
        <div className="apply-card apply-card--status">
          <div className={`apply-status-icon ${rejected ? 'rejected' : 'pending'}`}>
            {rejected ? <XCircle size={40} /> : <Clock size={40} />}
          </div>
          <h1>{rejected ? 'Application Not Approved' : 'Application Under Review'}</h1>
          <p>
            {rejected
              ? 'Unfortunately your seller application was not approved. Please contact support for details.'
              : `Thanks for applying, ${seller.shopName}. Our team is reviewing your application and you'll get seller access once approved.`}
          </p>
          <p className="apply-status-meta">Status: <strong>{seller.status}</strong></p>
          <Link to="/" className="dash-btn dash-btn--ghost">Back to Store</Link>
        </div>
      </div>
    );
  }

  // Apply form
  return (
    <div className="apply-wrap">
      <div className="apply-card">
        <div className="apply-hero"><Store size={34} /></div>
        <h1>Become a Seller</h1>
        <p className="apply-sub">Start selling your jewellery to thousands of customers on LUXE. Tell us about your shop to get started.</p>

        <div className="dash-field">
          <label className="dash-field__label">Shop / Brand Name *</label>
          <input className="dash-input" value={form.shopName} onChange={set('shopName')} placeholder="e.g. Priya's Fine Jewels" />
          {errors.shopName && <span className="dash-field__error">{errors.shopName}</span>}
        </div>
        <div className="dash-grid-2">
          <div className="dash-field">
            <label className="dash-field__label">GSTIN (optional)</label>
            <input className="dash-input" value={form.gstin} onChange={set('gstin')} placeholder="22AAAAA0000A1Z5" />
          </div>
          <div className="dash-field">
            <label className="dash-field__label">Business Phone</label>
            <input className="dash-input" value={form.phone} onChange={set('phone')} placeholder="98765 43210" />
          </div>
        </div>
        <div className="dash-field">
          <label className="dash-field__label">About your shop (optional)</label>
          <textarea className="dash-textarea" value={form.description} onChange={set('description')} placeholder="Handcrafted gold & diamond jewellery since 2010…" />
        </div>

        <button className="dash-btn dash-btn--gold" style={{ width: '100%', marginTop: 8 }} onClick={submit} disabled={submitting}>
          {submitting ? 'Submitting…' : <>Submit Application <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
};

export default SellerApply;
