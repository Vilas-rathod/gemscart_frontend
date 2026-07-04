import { useState, useEffect, useMemo } from 'react';
import { IndianRupee, TrendingUp, Package } from 'lucide-react';
import { getSellerOrders } from '../../api/orderApi';
import { formatPrice } from '../../utils/helpers';
import StatCard from '../../components/dashboard/StatCard';
import EmptyState from '../../components/dashboard/EmptyState';
import { StatSkeletonRow } from '../../components/dashboard/Skeleton';
import { useToast } from '../../components/dashboard/ToastProvider';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const isRevenue = (s) => s !== 'CANCELLED' && s !== 'FAILED';

const SellerAnalytics = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSellerOrders()
      .then(setOrders)
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, [toast]);

  const { totalSales, monthly, best } = useMemo(() => {
    const valid = orders.filter(o => isRevenue(o.status));
    const totalSales = valid.reduce((s, o) => s + Number(o.sellerSubtotal || 0), 0);

    // last 6 months
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTHS[d.getMonth()], total: 0 });
    }
    const byKey = Object.fromEntries(buckets.map(b => [b.key, b]));
    valid.forEach(o => {
      const d = new Date(o.createdAt);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      if (byKey[k]) byKey[k].total += Number(o.sellerSubtotal || 0);
    });

    const counts = {};
    valid.forEach(o => (o.items || []).forEach(it => {
      counts[it.name] = (counts[it.name] || 0) + it.quantity;
    }));
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { totalSales, monthly: buckets, best };
  }, [orders]);

  if (loading) return <StatSkeletonRow count={3} />;

  if (orders.length === 0) {
    return <div className="dash-card"><EmptyState icon={TrendingUp} title="No sales data yet" message="Analytics appear once you start receiving orders." /></div>;
  }

  const max = Math.max(...monthly.map(m => m.total), 1);

  return (
    <>
      <div className="dash-stats">
        <StatCard icon={IndianRupee} label="Total Sales" value={formatPrice(totalSales)} />
        <StatCard icon={Package} label="Orders" value={orders.filter(o => isRevenue(o.status)).length} />
        <StatCard icon={TrendingUp} label="Avg. Order Value" value={formatPrice(orders.length ? totalSales / orders.filter(o => isRevenue(o.status)).length || 0 : 0)} />
      </div>

      <div className="dash-grid-2" style={{ alignItems: 'start' }}>
        <div className="dash-card">
          <div className="dash-card__head"><h3 className="dash-card__title">Monthly Sales</h3></div>
          <div className="dash-card__body">
            <div className="dash-bars">
              {monthly.map(m => (
                <div key={m.key} className="dash-bar-col" title={formatPrice(m.total)}>
                  <div className="dash-bar" style={{ height: `${(m.total / max) * 100}%` }} />
                  <span className="dash-bar-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__head"><h3 className="dash-card__title">Best Sellers</h3></div>
          <div className="dash-card__body">
            {best.length === 0 ? <p style={{ color: '#8a8a8a', fontSize: 14 }}>No sales yet.</p> : (
              <ol className="best-list">
                {best.map(([name, qty], i) => (
                  <li key={name}>
                    <span className="best-rank">{i + 1}</span>
                    <span className="best-name">{name}</span>
                    <span className="best-qty">{qty} sold</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerAnalytics;
