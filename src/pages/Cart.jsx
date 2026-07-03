import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Coupon from '../components/cart/Coupon';
import EmptyCart from '../components/cart/EmptyCart';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useCart } from '../hooks/useCart';
import './Cart.css';

const Cart = () => {
  const { items } = useCart();

  return (
    <main className="cart-page">
      <div className="container">
        <div className="cart-page__breadcrumb">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Cart' }
          ]} />
        </div>

        <h1 className="cart-page__title display-lg">Your Bag</h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="cart-page__layout">
            <div className="cart-page__items">
              <div className="cart-page__items-header">
                <span>{items.length} item{items.length > 1 ? 's' : ''} in your bag</span>
              </div>

              {items.map(item => (
                <CartItem key={`${item.id}-${item.size}`} item={item} />
              ))}

              <div className="cart-page__coupon">
                <h4 className="cart-page__coupon-title label-uppercase">Have a Coupon?</h4>
                <Coupon />
              </div>
            </div>

            <CartSummary />
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
