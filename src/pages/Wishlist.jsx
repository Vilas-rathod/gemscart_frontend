import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useWishlist } from '../hooks/useWishlist';
import './Wishlist.css';

const Wishlist = () => {
  const { items } = useWishlist();

  return (
    <main className="wishlist-page">
      <div className="container">
        <div className="wishlist-page__breadcrumb">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
        </div>

        <div className="wishlist-page__header">
          <h1 className="display-lg wishlist-page__title">
            My Wishlist
            <Heart size={28} strokeWidth={1.5} style={{ color: 'var(--gold)' }} />
          </h1>
          <p className="wishlist-page__count">{items.length} saved piece{items.length !== 1 ? 's' : ''}</p>
        </div>

        {items.length === 0 ? (
          <div className="wishlist-page__empty">
            <div className="wishlist-page__empty-icon">
              <Heart size={48} strokeWidth={1} />
            </div>
            <h2 className="display-sm">Nothing saved yet</h2>
            <p>Browse our collections and tap the heart to save pieces you love.</p>
            <Link to="/shop" className="wishlist-page__shop-btn">Explore Jewellery</Link>
          </div>
        ) : (
          <ProductGrid products={items} columns={4} />
        )}
      </div>
    </main>
  );
};

export default Wishlist;
