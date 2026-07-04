import { useState, useEffect } from 'react';
import { Package, Trash2 } from 'lucide-react';
import { getAllProducts, deleteProduct } from '../../api/productApi';
import { formatPrice } from '../../utils/helpers';
import DataTable from '../../components/dashboard/DataTable';
import EmptyState from '../../components/dashboard/EmptyState';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useToast } from '../../components/dashboard/ToastProvider';
import { useConfirm } from '../../components/dashboard/ConfirmProvider';

const AdminProducts = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, [toast]);

  const remove = async (p) => {
    const ok = await confirm({
      title: 'Delete product?',
      message: `"${p.name}" will be permanently removed from the catalog.`,
      confirmLabel: 'Delete', danger: true,
    });
    if (!ok) return;
    try {
      await deleteProduct(p.id);
      setProducts(list => list.filter(x => x.id !== p.id));
      toast.success('Product deleted.');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not delete the product.');
    }
  };

  const filtered = query
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : products;

  const columns = [
    { key: 'img', header: '', render: p => <img className="dash-table__thumb" src={p.images?.[0]} alt="" /> },
    { key: 'name', header: 'Product', render: p => (
      <div>
        <div className="dash-table__cell-strong">{p.name}</div>
        <div style={{ fontSize: 12, color: '#8a8a8a' }}>{p.category}</div>
      </div>
    ) },
    { key: 'seller', header: 'Seller', render: p => p.sellerId ? `#${p.sellerId}` : 'Platform' },
    { key: 'price', header: 'Price', render: p => formatPrice(p.price) },
    { key: 'stock', header: 'Stock', render: p => <StatusBadge status={p.inStock ? 'ACTIVE' : 'BLOCKED'} /> },
    { key: 'actions', header: '', align: 'right', render: p => (
      <button className="dash-icon-btn dash-icon-btn--danger" onClick={() => remove(p)} aria-label="Delete"><Trash2 size={15} /></button>
    ) },
  ];

  return (
    <div className="dash-card">
      <div className="dash-card__head">
        <h3 className="dash-card__title">All Products ({products.length})</h3>
        <input className="dash-input" style={{ maxWidth: 240 }} placeholder="Search…" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <DataTable columns={columns} rows={filtered} loading={loading}
        empty={<EmptyState icon={Package} title="No products" message="Products across all sellers appear here." />} />
    </div>
  );
};

export default AdminProducts;
