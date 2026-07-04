import { useState, useEffect } from 'react';
import { Upload, X, Link2, Loader2 } from 'lucide-react';
import DashModal from '../../components/dashboard/DashModal';
import { createProduct, updateProduct, uploadProductImage, getCategories } from '../../api/productApi';
import { useToast } from '../../components/dashboard/ToastProvider';
import './product-form.css';

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const BLANK = {
  name: '', slug: '', category: '', price: '', originalPrice: '',
  metal: '', stone: '', description: '', badge: '',
  sizes: '', details: '', images: [], inStock: true, isNew: false,
};

const ProductFormModal = ({ open, onClose, onSaved, product }) => {
  const toast = useToast();
  const editing = !!product;
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => { getCategories().then(setCategories).catch(() => setCategories([])); }, []);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        name: product.name || '', slug: product.slug || '', category: product.category || '',
        price: product.price ?? '', originalPrice: product.originalPrice ?? '',
        metal: product.metal || '', stone: product.stone || '', description: product.description || '',
        badge: product.badge || '',
        sizes: (product.sizes || []).join(', '), details: (product.details || []).join('\n'),
        images: product.images || [], inStock: product.inStock ?? true, isNew: product.isNew ?? false,
      });
    } else {
      setForm(BLANK);
    }
    setErrors({});
    setUrlInput('');
  }, [open, product]);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => {
      const next = { ...f, [k]: v };
      if (k === 'name' && !editing) next.slug = slugify(v);
      return next;
    });
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const addImageUrl = () => {
    const u = urlInput.trim();
    if (u) { setForm(f => ({ ...f, images: [...f.images, u] })); setUrlInput(''); }
  };

  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadProductImage(file);
      setForm(f => ({ ...f, images: [...f.images, url] }));
      toast.success('Image uploaded.');
    } catch (err) {
      // e.g. Cloudinary keys not configured yet — guide the user to the URL fallback.
      toast.error(err.response?.data?.message || 'Upload failed. You can paste an image URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.slug.trim()) e.slug = 'Required';
    if (!form.category.trim()) e.category = 'Required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (form.images.length === 0) e.images = 'Add at least one image';
    return e;
  };

  const save = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const price = Number(form.price);
    const original = form.originalPrice ? Number(form.originalPrice) : null;
    const payload = {
      name: form.name.trim(), slug: form.slug.trim(), category: form.category.trim(),
      price, originalPrice: original,
      discount: original && original > price ? Math.round(((original - price) / original) * 100) : 0,
      rating: product?.rating ?? 0, reviews: product?.reviews ?? 0,
      images: form.images, badge: form.badge.trim() || null,
      isNew: form.isNew, inStock: form.inStock,
      metal: form.metal.trim() || null, stone: form.stone.trim() || null,
      description: form.description.trim() || null,
      details: form.details.split('\n').map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      const saved = editing ? await updateProduct(product.id, payload) : await createProduct(payload);
      toast.success(editing ? 'Product updated.' : 'Product added.');
      onSaved?.(saved);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save the product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashModal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Product' : 'Add Product'}
      footer={
        <>
          <button className="dash-btn dash-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="dash-btn dash-btn--gold" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Product'}
          </button>
        </>
      }
    >
      <div className="dash-field">
        <label className="dash-field__label">Product Name *</label>
        <input className="dash-input" value={form.name} onChange={set('name')} placeholder="Diamond Solitaire Ring" />
        {errors.name && <span className="dash-field__error">{errors.name}</span>}
      </div>

      <div className="dash-grid-2">
        <div className="dash-field">
          <label className="dash-field__label">Slug *</label>
          <input className="dash-input" value={form.slug} onChange={set('slug')} placeholder="diamond-solitaire-ring" />
          {errors.slug && <span className="dash-field__error">{errors.slug}</span>}
        </div>
        <div className="dash-field">
          <label className="dash-field__label">Category *</label>
          {categories.length > 0 ? (
            <select className="dash-select" value={form.category} onChange={set('category')}>
              <option value="">Select…</option>
              {categories.map(c => <option key={c.slug || c} value={c.slug || c}>{c.name || c.slug || c}</option>)}
            </select>
          ) : (
            <input className="dash-input" value={form.category} onChange={set('category')} placeholder="diamond-rings" />
          )}
          {errors.category && <span className="dash-field__error">{errors.category}</span>}
        </div>
      </div>

      <div className="dash-grid-2">
        <div className="dash-field">
          <label className="dash-field__label">Price (₹) *</label>
          <input className="dash-input" type="number" value={form.price} onChange={set('price')} placeholder="45000" />
          {errors.price && <span className="dash-field__error">{errors.price}</span>}
        </div>
        <div className="dash-field">
          <label className="dash-field__label">Original Price (₹)</label>
          <input className="dash-input" type="number" value={form.originalPrice} onChange={set('originalPrice')} placeholder="52000" />
        </div>
      </div>

      <div className="dash-grid-2">
        <div className="dash-field">
          <label className="dash-field__label">Metal</label>
          <input className="dash-input" value={form.metal} onChange={set('metal')} placeholder="18K Gold" />
        </div>
        <div className="dash-field">
          <label className="dash-field__label">Stone</label>
          <input className="dash-input" value={form.stone} onChange={set('stone')} placeholder="Diamond" />
        </div>
      </div>

      {/* Images */}
      <div className="dash-field">
        <label className="dash-field__label">Images *</label>
        <div className="pf-images">
          {form.images.map((src, i) => (
            <div key={i} className="pf-thumb">
              <img src={src} alt="" />
              <button type="button" onClick={() => removeImage(i)} aria-label="Remove"><X size={13} /></button>
            </div>
          ))}
          <label className="pf-upload">
            {uploading ? <Loader2 size={18} className="pf-spin" /> : <Upload size={18} />}
            <span>{uploading ? 'Uploading' : 'Upload'}</span>
            <input type="file" accept="image/*" hidden onChange={handleFile} disabled={uploading} />
          </label>
        </div>
        <div className="pf-url-row">
          <Link2 size={15} />
          <input className="dash-input" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                 placeholder="…or paste an image URL" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())} />
          <button type="button" className="dash-btn dash-btn--ghost dash-btn--sm" onClick={addImageUrl}>Add</button>
        </div>
        {errors.images && <span className="dash-field__error">{errors.images}</span>}
      </div>

      <div className="dash-field">
        <label className="dash-field__label">Description</label>
        <textarea className="dash-textarea" value={form.description} onChange={set('description')} />
      </div>

      <div className="dash-grid-2">
        <div className="dash-field">
          <label className="dash-field__label">Sizes (comma separated)</label>
          <input className="dash-input" value={form.sizes} onChange={set('sizes')} placeholder="6, 7, 8" />
        </div>
        <div className="dash-field">
          <label className="dash-field__label">Badge</label>
          <input className="dash-input" value={form.badge} onChange={set('badge')} placeholder="Best Seller" />
        </div>
      </div>

      <div className="dash-field">
        <label className="dash-field__label">Details (one per line)</label>
        <textarea className="dash-textarea" value={form.details} onChange={set('details')} placeholder={'BIS Hallmarked\nCertificate of authenticity'} />
      </div>

      <div className="pf-toggles">
        <label><input type="checkbox" checked={form.inStock} onChange={set('inStock')} /> In stock</label>
        <label><input type="checkbox" checked={form.isNew} onChange={set('isNew')} /> Mark as new</label>
      </div>
    </DashModal>
  );
};

export default ProductFormModal;
