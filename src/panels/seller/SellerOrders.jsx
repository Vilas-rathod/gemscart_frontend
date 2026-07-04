import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getSellerOrders, updateOrderStatus } from '../../api/orderApi';
import { formatPrice } from '../../utils/helpers';
import DataTable from '../../components/dashboard/DataTable';
import EmptyState from '../../components/dashboard/EmptyState';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useToast } from '../../components/dashboard/ToastProvider';

const NEXT = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const TERMINAL = ['DELIVERED', 'CANCELLED', 'FAILED'];

const SellerOrders = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getSellerOrders()
      .then(setOrders)
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [toast]);

  const changeStatus = async (order, status) => {
    if (!status || status === order.status) return;
    setUpdating(order.id);
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders(list => list.map(o => o.id === order.id ? { ...o, status: updated.status } : o));
      toast.success(`Order LUXE-${order.id} marked ${status.toLowerCase()}.`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not update status.');
    } finally {
      setUpdating(null);
    }
  };

  const columns = [
    { key: 'id', header: 'Order', render: o => <span className="dash-table__cell-strong">LUXE-{o.id}</span> },
    { key: 'buyer', header: 'Customer', render: o => (
      <div>
        <div>{o.buyerName || '—'}</div>
        <div style={{ fontSize: 12, color: '#8a8a8a' }}>{o.city} · {o.phone}</div>
      </div>
    ) },
    { key: 'items', header: 'Items', render: o => o.itemCount },
    { key: 'total', header: 'Your Total', render: o => formatPrice(o.sellerSubtotal) },
    { key: 'payment', header: 'Payment', render: o => o.paymentMethod },
    { key: 'status', header: 'Status', render: o => <StatusBadge status={o.status} /> },
    { key: 'action', header: 'Update', align: 'right', render: o => {
      const done = TERMINAL.includes(o.status);
      return (
        <select
          className="dash-select" style={{ width: 140 }}
          value=""
          disabled={done || updating === o.id}
          onChange={e => changeStatus(o, e.target.value)}
        >
          <option value="">{done ? '—' : 'Set status…'}</option>
          {NEXT.map(s => <option key={s} value={s}>{s[0] + s.slice(1).toLowerCase()}</option>)}
        </select>
      );
    } },
  ];

  return (
    <div className="dash-card">
      <div className="dash-card__head"><h3 className="dash-card__title">Orders ({orders.length})</h3></div>
      <DataTable
        columns={columns}
        rows={orders}
        loading={loading}
        empty={<EmptyState icon={ShoppingCart} title="No orders yet" message="When customers buy your products, orders show up here." />}
      />
    </div>
  );
};

export default SellerOrders;
