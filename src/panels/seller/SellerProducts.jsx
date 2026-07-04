import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { getMyProducts, deleteProduct, setProductStock } from '../../api/productApi';
import { formatPrice } from '../../utils/helpers';
import DataTable from '../../components/dashboard/DataTable';
import EmptyState from '../../components/dashboard/EmptyState';
import ProductFormModal from './ProductFormModal';
import { useToast } from '../../components/dashboard/ToastProvider';
import { useConfirm } from '../../components/dashboard/ConfirmProvider';

const SellerProducts = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getMyProducts()
      .then(setProducts)
      .catch((e) => toast.error(e.response?.data?.message || 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setModalOpen(true); };

  const toggleStock = async (p) => {
    try {
      const updated = await setProductStock(p.id, !p.inStock);
      setProducts(list => list.map(x => x.id === p.id ? updated : x));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not update stock.');
    }
  };

  const remove = async (p) => {
    const ok = await confirm({
      title: 'Delete product?',
      message: `"${p.name}" will be permanently removed from your catalog.`,
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

  const columns = [
    { key: 'img', header: '', render: p => <img className="dash-table__thumb" src={p.images?.[0]} alt="" /> },
    { key: 'name', header: 'Product', render: p => (
      <div>
        <div className="dash-table__cell-strong">{p.name}</div>
        <div style={{ fontSize: 12, color: '#8a8a8a' }}>{p.category}</div>
      </div>
    ) },
    { key: 'price', header: 'Price', render: p => formatPrice(p.price) },
    { key: 'stock', header: 'Stock', render: p => (
      <button className={`dash-btn dash-btn--sm ${p.inStock ? 'dash-btn--ghost' : 'dash-btn--danger'}`} onClick={() => toggleStock(p)}>
        {p.inStock ? 'In stock' : 'Out of stock'}
      </button>
    ) },
    { key: 'actions', header: '', align: 'right', render: p => (
      <div className="dash-cell-actions">
        <button className="dash-icon-btn" onClick={() => openEdit(p)} aria-label="Edit"><Pencil size={15} /></button>
        <button className="dash-icon-btn dash-icon-btn--danger" onClick={() => remove(p)} aria-label="Delete"><Trash2 size={15} /></button>
      </div>
    ) },
  ];

  return (
    <>
      <div className="dash-card">
        <div className="dash-card__head">
          <h3 className="dash-card__title">My Products ({products.length})</h3>
          <button className="dash-btn dash-btn--gold dash-btn--sm" onClick={openAdd}><Plus size={16} /> Add Product</button>
        </div>
        <DataTable
          columns={columns}
          rows={products}
          loading={loading}
          empty={<EmptyState
            icon={Package}
            title="No products yet"
            message="Add your first product to start selling."
            action={<button className="dash-btn dash-btn--gold dash-btn--sm" onClick={openAdd}><Plus size={16} /> Add Product</button>}
          />}
        />
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing}
        onSaved={load}
      />
    </>
  );
};

export default SellerProducts;
