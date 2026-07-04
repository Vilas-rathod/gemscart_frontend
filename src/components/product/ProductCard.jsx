import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Zap, Eye } from 'lucide-react';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { useWishlist } from '../../hooks/useWishlist';
import { setBuyNow } from '../../utils/buyNow';
import { formatPrice } from '../../utils/helpers';
import './ProductCard.css';

const BADGE_VARIANT_MAP = {
  'Best Seller': 'gold',
  'New': 'new',
  'Sale': 'sale',
  'Limited': 'limited',
  'Exclusive': 'exclusive',
  'Trending': 'default'
};

const ProductCard = ({ product }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const navigate = useNavigate();
  const { dispatch: wDispatch, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  // "Order Now" — buy this item directly (COD), skipping the cart.
  const handleOrderNow = (e) => {
    e.preventDefault();
    setBuyNow({ ...product, size: product.sizes?.[0] || '', quantity: 1 });
    navigate('/checkout');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    wDispatch({ type: 'TOGGLE', payload: product });
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card__image-wrap">
        <img
          src={product.images[imgIndex]}
          alt={product.name}
          className="product-card__image"
          onMouseEnter={() => product.images[1] && setImgIndex(1)}
          onMouseLeave={() => setImgIndex(0)}
          loading="lazy"
        />

        {/* Badges */}
        {product.badge && (
          <div className="product-card__badge">
            <Badge variant={BADGE_VARIANT_MAP[product.badge] || 'default'}>{product.badge}</Badge>
          </div>
        )}
        {product.discount > 0 && (
          <div className="product-card__discount">−{product.discount}%</div>
        )}

        {/* Hover Actions */}
        <div className="product-card__actions">
          <button
            className={`product-card__action-btn ${wishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <Link to={`/product/${product.slug}`} className="product-card__action-btn" aria-label="Quick view">
            <Eye size={16} />
          </Link>
        </div>
      </Link>

      <div className="product-card__info">
        <div className="product-card__meta">
          <span className="product-card__category label-uppercase">{product.metal}</span>
          <Rating value={product.rating} count={product.reviews} />
        </div>

        <Link to={`/product/${product.slug}`} className="product-card__name">
          {product.name}
        </Link>

        <div className="product-card__pricing">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-card__original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <button
          className="product-card__add-btn"
          onClick={handleOrderNow}
          disabled={!product.inStock}
        >
          <Zap size={14} />
          {!product.inStock ? 'Out of Stock' : 'Order Now'}
        </button>
        {product.inStock && <span className="product-card__cod-note">Cash on Delivery available</span>}
      </div>
    </article>
  );
};

export default ProductCard;
