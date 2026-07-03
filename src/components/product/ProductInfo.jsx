import { useState } from 'react';
import { Heart, ShoppingBag, Shield, Truck, RefreshCw, ChevronDown } from 'lucide-react';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import Button from '../common/Button';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { formatPrice } from '../../utils/helpers';
import './ProductInfo.css';

const BADGE_VARIANT_MAP = {
  'Best Seller': 'gold', 'New': 'new', 'Sale': 'sale',
  'Limited': 'limited', 'Exclusive': 'exclusive', 'Trending': 'default'
};

const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('description');
  const { dispatch } = useCart();
  const { dispatch: wDispatch, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    setAdding(true);
    dispatch({ type: 'ADD_ITEM', payload: { ...product, size: selectedSize, quantity: qty } });
    setTimeout(() => setAdding(false), 1000);
  };

  const accordions = [
    { id: 'description', label: 'Description', content: product.description },
    {
      id: 'details', label: 'Product Details',
      content: <ul>{product.details.map((d, i) => <li key={i} className="product-info__detail-item">{d}</li>)}</ul>
    },
    {
      id: 'care', label: 'Care Instructions',
      content: 'Store in the provided jewellery pouch. Avoid contact with perfume and chemicals. Clean gently with a soft cloth. Remove before swimming or bathing.'
    }
  ];

  return (
    <div className="product-info">
      {/* Top row */}
      <div className="product-info__header">
        {product.badge && <Badge variant={BADGE_VARIANT_MAP[product.badge]}>{product.badge}</Badge>}
        <span className="product-info__category label-uppercase">{product.category.replace(/-/g, ' ')}</span>
      </div>

      <h1 className="product-info__name display-md">{product.name}</h1>

      <div className="product-info__rating">
        <Rating value={product.rating} count={product.reviews} size="md" />
      </div>

      {/* Pricing */}
      <div className="product-info__pricing">
        <span className="product-info__price">{formatPrice(product.price)}</span>
        {product.originalPrice > product.price && (
          <>
            <span className="product-info__original">{formatPrice(product.originalPrice)}</span>
            <span className="product-info__discount-tag">Save {product.discount}%</span>
          </>
        )}
      </div>
      <p className="product-info__tax-note">Inclusive of all taxes. Free shipping on this order.</p>

      {/* Size Selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="product-info__sizes">
          <div className="product-info__size-header">
            <span className="label-uppercase" style={{ fontSize: '11px', color: 'var(--obsidian-60)' }}>Select Size</span>
            <button className="product-info__size-guide">Size Guide</button>
          </div>
          <div className="product-info__size-options">
            {product.sizes.map(size => (
              <button
                key={size}
                className={`product-info__size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="product-info__qty">
        <span className="label-uppercase" style={{ fontSize: '11px', color: 'var(--obsidian-60)', display: 'block', marginBottom: '8px' }}>Quantity</span>
        <div className="product-info__qty-ctrl">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty(q => q + 1)}>+</button>
        </div>
      </div>

      {/* CTAs */}
      <div className="product-info__ctas">
        <Button variant="primary" size="lg" fullWidth loading={adding} onClick={handleAddToCart}>
          <ShoppingBag size={16} /> Add to Bag
        </Button>
        <button
          className={`product-info__wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={() => wDispatch({ type: 'TOGGLE', payload: product })}
          aria-label="Wishlist"
        >
          <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Trust Badges */}
      <div className="product-info__trust">
        {[
          { Icon: Shield, label: 'BIS Hallmarked', sub: 'Certified Purity' },
          { Icon: Truck, label: 'Free Delivery', sub: 'On this order' },
          { Icon: RefreshCw, label: '15-Day Returns', sub: 'Easy exchanges' },
        ].map(({ Icon, label, sub }) => (
          <div key={label} className="product-info__trust-item">
            <Icon size={18} className="product-info__trust-icon" />
            <div>
              <span className="product-info__trust-label">{label}</span>
              <span className="product-info__trust-sub">{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Accordions */}
      <div className="product-info__accordions">
        {accordions.map(({ id, label, content }) => (
          <div key={id} className="product-info__accordion">
            <button
              className="product-info__accordion-btn"
              onClick={() => setOpenAccordion(o => o === id ? null : id)}
            >
              <span>{label}</span>
              <ChevronDown
                size={16}
                className={`product-info__chevron ${openAccordion === id ? 'open' : ''}`}
              />
            </button>
            {openAccordion === id && (
              <div className="product-info__accordion-body">
                {typeof content === 'string'
                  ? <p className="product-info__accordion-text">{content}</p>
                  : content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
