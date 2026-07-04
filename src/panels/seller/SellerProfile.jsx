import { useState, useEffect } from 'react';
import { Store, User, KeyRound } from 'lucide-react';
import { getAccount, updateAccount, changePassword } from '../../api/accountApi';
import { getMySeller } from '../../api/sellerApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/dashboard/ToastProvider';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { Skeleton } from '../../components/dashboard/Skeleton';

const SellerProfile = () => {
  const { updateUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [account, setAccount] = useState({ name: '', email: '', phone: '' });
  const [savingAccount, setSavingAccount] = useState(false);

  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    Promise.all([
      getAccount(),
      getMySeller().catch(() => null),
    ]).then(([acc, s]) => {
      setAccount({ name: acc.name || '', email: acc.email || '', phone: acc.phone || '' });
      setSeller(s);
    }).catch((e) => toast.error(e.response?.data?.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [toast]);

  const saveAccount = async () => {
    if (!account.name.trim()) { toast.error('Name is required.'); return; }
    setSavingAccount(true);
    try {
      const updated = await updateAccount({ name: account.name, phone: account.phone });
      updateUser({ name: updated.name });
      toast.success('Profile updated.');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not update profile.');
    } finally {
      setSavingAccount(false);
    }
  };

  const savePassword = async () => {
    if (pwd.newPassword.length < 6) { toast.error('New password must be at least 6 characters.'); return; }
    if (pwd.newPassword !== pwd.confirm) { toast.error('Passwords do not match.'); return; }
    setSavingPwd(true);
    try {
      await changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed.');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not change password.');
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) return <div className="dash-card"><div className="dash-card__body"><Skeleton height={180} /></div></div>;

  return (
    <div className="dash-grid-2" style={{ alignItems: 'start' }}>
      {/* Shop + account */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {seller && (
          <div className="dash-card">
            <div className="dash-card__head"><h3 className="dash-card__title"><Store size={16} style={{ verticalAlign: -2, marginRight: 6 }} />Shop</h3></div>
            <div className="dash-card__body">
              <div className="profile-row"><span>Shop Name</span><strong>{seller.shopName}</strong></div>
              <div className="profile-row"><span>Status</span><StatusBadge status={seller.status} /></div>
              {seller.gstin && <div className="profile-row"><span>GSTIN</span><strong>{seller.gstin}</strong></div>}
              {seller.phone && <div className="profile-row"><span>Business Phone</span><strong>{seller.phone}</strong></div>}
            </div>
          </div>
        )}

        <div className="dash-card">
          <div className="dash-card__head"><h3 className="dash-card__title"><User size={16} style={{ verticalAlign: -2, marginRight: 6 }} />Profile</h3></div>
          <div className="dash-card__body">
            <div className="dash-field">
              <label className="dash-field__label">Full Name</label>
              <input className="dash-input" value={account.name} onChange={e => setAccount(a => ({ ...a, name: e.target.value }))} />
            </div>
            <div className="dash-field">
              <label className="dash-field__label">Email</label>
              <input className="dash-input" value={account.email} disabled />
            </div>
            <div className="dash-field">
              <label className="dash-field__label">Phone</label>
              <input className="dash-input" value={account.phone} onChange={e => setAccount(a => ({ ...a, phone: e.target.value }))} />
            </div>
            <button className="dash-btn dash-btn--primary" onClick={saveAccount} disabled={savingAccount}>
              {savingAccount ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="dash-card">
        <div className="dash-card__head"><h3 className="dash-card__title"><KeyRound size={16} style={{ verticalAlign: -2, marginRight: 6 }} />Change Password</h3></div>
        <div className="dash-card__body">
          <div className="dash-field">
            <label className="dash-field__label">Current Password</label>
            <input className="dash-input" type="password" value={pwd.currentPassword} onChange={e => setPwd(p => ({ ...p, currentPassword: e.target.value }))} />
          </div>
          <div className="dash-field">
            <label className="dash-field__label">New Password</label>
            <input className="dash-input" type="password" value={pwd.newPassword} onChange={e => setPwd(p => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <div className="dash-field">
            <label className="dash-field__label">Confirm New Password</label>
            <input className="dash-input" type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} />
          </div>
          <button className="dash-btn dash-btn--primary" onClick={savePassword} disabled={savingPwd}>
            {savingPwd ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
