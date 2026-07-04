import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, IndianRupee, Clock, Plus } from 'lucide-react';
import { getMyProductStats } from '../../api/productApi';
import { getSellerOrders, getSellerOrderStats } from '../../api/orderApi';
import { formatPrice } from '../../utils/helpers';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import EmptyState from '../../components/dashboard/EmptyState';
import { StatSkeletonRow } from '../../components/dashboard/Skeleton';
import { useToast } from '../../components/dashboard/ToastProvider';

const SellerDashboard = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [pStats, setPStats] = useState(null);
  const [oStats, setOStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([getMyProductStats(), getSellerOrderStats(), getSellerOrders()])
      .then(([p, o, list]) => { setPStats(p); setOStats(o); setOrders(list); })
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <StatSkeletonRow count={4} />;

  const columns = [
    { key: 'id', header: 'Order', render: r => <span className="dash-table__cell-strong">LUXE-{r.id}</span> },
    { key: 'buyer', header: 'Customer', render: r => r.buyerName || '—' },
    { key: 'items', header: 'Items', render: r => r.itemCount },
    { key: 'total', header: 'Your Total', render: r => formatPrice(r.sellerSubtotal) },
    { key: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <div className="dash-stats">
        <StatCard icon={Package} label="Total Products" value={pStats?.totalProducts ?? 0} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={oStats?.totalOrders ?? 0} />
        <StatCard icon={IndianRupee} label="Revenue" value={formatPrice(oStats?.revenue ?? 0)} />
        <StatCard icon={Clock} label="Pending Orders" value={oStats?.pendingOrders ?? 0} />
      </div>

      <div className="dash-card">
        <div className="dash-card__head">
          <h3 className="dash-card__title">Recent Orders</h3>
          <Link to="/seller/orders" className="dash-btn dash-btn--ghost dash-btn--sm">View all</Link>
        </div>
        <DataTable
          columns={columns}
          rows={orders.slice(0, 6)}
          empty={<EmptyState
            title="No orders yet"
            message="Orders for your products will appear here."
            action={<Link to="/seller/products" className="dash-btn dash-btn--gold dash-btn--sm"><Plus size={15} /> Add your first product</Link>}
          />}
        />
      </div>
    </>
  );
};

export default SellerDashboard;
