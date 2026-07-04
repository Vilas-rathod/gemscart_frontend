import { useState, useEffect, useCallback } from 'react';
import { Store, Check, X, Power } from 'lucide-react';
import { getSellers, approveSeller, rejectSeller, activateSeller, deactivateSeller } from '../../api/adminApi';
import DataTable from '../../components/dashboard/DataTable';
import EmptyState from '../../components/dashboard/EmptyState';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useToast } from '../../components/dashboard/ToastProvider';
import { useConfirm } from '../../components/dashboard/ConfirmProvider';

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'];

const AdminSellers = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getSellers(filter === 'ALL' ? undefined : filter)
      .then(setSellers)
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load sellers.'))
      .finally(() => setLoading(false));
  }, [filter, toast]);

  useEffect(() => { load(); }, [load]);

  const act = async (seller, fn, label, opts = {}) => {
    if (opts.confirm && !(await confirm(opts.confirm))) return;
    setBusy(seller.id);
    try {
      const updated = await fn(seller.id);
      setSellers(list => list.map(s => s.id === seller.id ? updated : s));
      toast.success(`${seller.shopName} ${label}.`);
      // If the filter no longer matches, refresh.
      if (filter !== 'ALL' && updated.status !== filter) load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed.');
    } finally {
      setBusy(null);
    }
  };

  const columns = [
    { key: 'shop', header: 'Shop', render: s => (
      <div>
        <div className="dash-table__cell-strong">{s.shopName}</div>
        <div style={{ fontSize: 12, color: '#8a8a8a' }}>{s.gstin || 'No GSTIN'}</div>
      </div>
    ) },
    { key: 'owner', header: 'Owner', render: s => (
      <div>
        <div>{s.userName || '—'}</div>
        <div style={{ fontSize: 12, color: '#8a8a8a' }}>{s.userEmail}</div>
      </div>
    ) },
    { key: 'phone', header: 'Phone', render: s => s.phone || '—' },
    { key: 'status', header: 'Status', render: s => <StatusBadge status={s.status} /> },
    { key: 'actions', header: 'Actions', align: 'right', render: s => {
      const disabled = busy === s.id;
      return (
        <div className="dash-cell-actions">
          {s.status === 'PENDING' && (
            <>
              <button className="dash-btn dash-btn--gold dash-btn--sm" disabled={disabled}
                onClick={() => act(s, approveSeller, 'approved')}><Check size={14} /> Approve</button>
              <button className="dash-btn dash-btn--danger dash-btn--sm" disabled={disabled}
                onClick={() => act(s, rejectSeller, 'rejected', { confirm: { title: 'Reject seller?', message: `Reject ${s.shopName}'s application?`, confirmLabel: 'Reject', danger: true } })}><X size={14} /> Reject</button>
            </>
          )}
          {s.status === 'APPROVED' && (
            <button className="dash-btn dash-btn--danger dash-btn--sm" disabled={disabled}
              onClick={() => act(s, deactivateSeller, 'deactivated', { confirm: { title: 'Deactivate seller?', message: `${s.shopName} will lose seller access until reactivated.`, confirmLabel: 'Deactivate', danger: true } })}><Power size={14} /> Deactivate</button>
          )}
          {(s.status === 'SUSPENDED' || s.status === 'REJECTED') && (
            <button className="dash-btn dash-btn--ghost dash-btn--sm" disabled={disabled}
              onClick={() => act(s, activateSeller, 'activated')}><Power size={14} /> Activate</button>
          )}
        </div>
      );
    } },
  ];

  return (
    <div className="dash-card">
      <div className="dash-card__head">
        <h3 className="dash-card__title">Sellers</h3>
        <div className="dash-tabs">
          {FILTERS.map(f => (
            <button key={f} className={`dash-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f[0] + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={sellers}
        loading={loading}
        empty={<EmptyState icon={Store} title="No sellers" message="Seller applications will appear here." />}
      />
    </div>
  );
};

export default AdminSellers;
