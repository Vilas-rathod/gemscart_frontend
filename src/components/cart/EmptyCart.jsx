import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import './EmptyCart.css';

const EmptyCart = () => (
  <div className="empty-cart">
    <div className="empty-cart__icon">
      <ShoppingBag size={48} strokeWidth={1} />
    </div>
    <h2 className="empty-cart__title display-sm">Your bag is empty</h2>
    <p className="empty-cart__sub">
      Discover our collection of handcrafted jewellery and find your perfect piece.
    </p>
    <Link to="/shop" className="empty-cart__btn">Explore Collection</Link>
  </div>
);

export default EmptyCart;
