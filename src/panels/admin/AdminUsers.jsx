import { useState, useEffect, useCallback } from 'react';
import { Users, Ban, CheckCircle2 } from 'lucide-react';
import { getUsers, blockUser, unblockUser, updateUserRole } from '../../api/adminApi';
import DataTable from '../../components/dashboard/DataTable';
import EmptyState from '../../components/dashboard/EmptyState';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useToast } from '../../components/dashboard/ToastProvider';
import { useConfirm } from '../../components/dashboard/ConfirmProvider';

const FILTERS = ['ALL', 'CUSTOMER', 'SELLER', 'ADMIN'];
const ROLES = ['CUSTOMER', 'SELLER', 'ADMIN'];

const AdminUsers = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getUsers(filter === 'ALL' ? undefined : filter)
      .then(setUsers)
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load users.'))
      .finally(() => setLoading(false));
  }, [filter, toast]);

  useEffect(() => { load(); }, [load]);

  const patch = (u, updated) => setUsers(list => list.map(x => x.id === u.id ? updated : x));

  const toggleBlock = async (u) => {
    if (u.active) {
      const ok = await confirm({ title: 'Block user?', message: `${u.email} will no longer be able to log in.`, confirmLabel: 'Block', danger: true });
      if (!ok) return;
    }
    setBusy(u.id);
    try {
      const updated = u.active ? await blockUser(u.id) : await unblockUser(u.id);
      patch(u, updated);
      toast.success(`${u.email} ${updated.active ? 'unblocked' : 'blocked'}.`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed.');
    } finally { setBusy(null); }
  };

  const changeRole = async (u, role) => {
    if (role === u.role) return;
    setBusy(u.id);
    try {
      const updated = await updateUserRole(u.id, role);
      patch(u, updated);
      toast.success(`${u.email} is now ${role.toLowerCase()}.`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not change role.');
    } finally { setBusy(null); }
  };

  const columns = [
    { key: 'name', header: 'User', render: u => (
      <div>
        <div className="dash-table__cell-strong">{u.name}</div>
        <div style={{ fontSize: 12, color: '#8a8a8a' }}>{u.email}</div>
      </div>
    ) },
    { key: 'phone', header: 'Phone', render: u => u.phone || '—' },
    { key: 'role', header: 'Role', render: u => (
      <select className="dash-select" style={{ width: 130 }} value={u.role}
        disabled={busy === u.id} onChange={e => changeRole(u, e.target.value)}>
        {ROLES.map(r => <option key={r} value={r}>{r[0] + r.slice(1).toLowerCase()}</option>)}
      </select>
    ) },
    { key: 'status', header: 'Status', render: u => <StatusBadge status={u.active ? 'ACTIVE' : 'BLOCKED'} /> },
    { key: 'actions', header: '', align: 'right', render: u => (
      <button className={`dash-btn dash-btn--sm ${u.active ? 'dash-btn--danger' : 'dash-btn--ghost'}`}
        disabled={busy === u.id || u.role === 'ADMIN'} onClick={() => toggleBlock(u)}>
        {u.active ? <><Ban size={14} /> Block</> : <><CheckCircle2 size={14} /> Unblock</>}
      </button>
    ) },
  ];

  return (
    <div className="dash-card">
      <div className="dash-card__head">
        <h3 className="dash-card__title">Users ({users.length})</h3>
        <div className="dash-tabs">
          {FILTERS.map(f => (
            <button key={f} className={`dash-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f[0] + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      <DataTable columns={columns} rows={users} loading={loading}
        empty={<EmptyState icon={Users} title="No users" message="Registered users will appear here." />} />
    </div>
  );
};

export default AdminUsers;
