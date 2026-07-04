import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, Package, ShoppingCart, IndianRupee, Clock } from 'lucide-react';
import { getUsers, getSellers } from '../../api/adminApi';
import { getAllProducts } from '../../api/productApi';
import { getAllOrders, getAdminOrderStats } from '../../api/orderApi';
import { formatPrice } from '../../utils/helpers';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { StatSkeletonRow } from '../../components/dashboard/Skeleton';
import { useToast } from '../../components/dashboard/ToastProvider';

const AdminDashboard = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ users: [], sellers: [], products: [], orders: [], oStats: null });

  useEffect(() => {
    Promise.all([getUsers(), getSellers(), getAllProducts(), getAllOrders(), getAdminOrderStats()])
      .then(([users, sellers, products, orders, oStats]) => setData({ users, sellers, products, orders, oStats }))
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <StatSkeletonRow count={5} />;

  const { users, sellers, products, orders, oStats } = data;
  const approvedSellers = sellers.filter(s => s.status === 'APPROVED').length;
  const pendingSellers = sellers.filter(s => s.status === 'PENDING').length;

  const columns = [
    { key: 'id', header: 'Order', render: o => <span className="dash-table__cell-strong">LUXE-{o.id}</span> },
    { key: 'buyer', header: 'Customer', render: o => `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim() || '—' },
    { key: 'total', header: 'Total', render: o => formatPrice(o.total) },
    { key: 'payment', header: 'Payment', render: o => o.paymentMethod },
    { key: 'status', header: 'Status', render: o => <StatusBadge status={o.status} /> },
  ];

  return (
    <>
      <div className="dash-stats">
        <StatCard icon={Users} label="Total Users" value={users.length} />
        <StatCard icon={Store} label="Active Sellers" value={approvedSellers} delta={pendingSellers ? `${pendingSellers} pending approval` : undefined} />
        <StatCard icon={Package} label="Total Products" value={products.length} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={oStats?.totalOrders ?? 0} />
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatPrice(oStats?.totalRevenue ?? 0)} />
      </div>

      {pendingSellers > 0 && (
        <div className="dash-card" style={{ marginBottom: 'var(--space-6)', borderLeft: '3px solid var(--gold)' }}>
          <div className="dash-card__head">
            <h3 className="dash-card__title"><Clock size={16} style={{ verticalAlign: -2, marginRight: 6 }} />{pendingSellers} seller application{pendingSellers > 1 ? 's' : ''} awaiting review</h3>
            <Link to="/admin/sellers" className="dash-btn dash-btn--gold dash-btn--sm">Review</Link>
          </div>
        </div>
      )}

      <div className="dash-card">
        <div className="dash-card__head">
          <h3 className="dash-card__title">Recent Orders</h3>
          <Link to="/admin/orders" className="dash-btn dash-btn--ghost dash-btn--sm">View all</Link>
        </div>
        <DataTable columns={columns} rows={orders.slice(0, 8)} />
      </div>
    </>
  );
};

export default AdminDashboard;
