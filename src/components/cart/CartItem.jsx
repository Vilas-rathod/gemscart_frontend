import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { dispatch } = useCart();

  const update = (qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, size: item.size, quantity: qty } });
  const remove = () => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id, size: item.size } });

  return (
    <div className="cart-item">
      <Link to={`/product/${item.slug}`} className="cart-item__image-wrap">
        <img src={item.images[0]} alt={item.name} className="cart-item__image" />
      </Link>

      <div className="cart-item__details">
        <div className="cart-item__top">
          <div>
            <Link to={`/product/${item.slug}`} className="cart-item__name">{item.name}</Link>
            <div className="cart-item__meta">
              <span>{item.metal}</span>
              {item.size && <><span className="cart-item__dot">·</span><span>Size: {item.size}</span></>}
            </div>
          </div>
          <button className="cart-item__remove" onClick={remove} aria-label="Remove item">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="cart-item__bottom">
          <div className="cart-item__qty">
            <button onClick={() => update(item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button onClick={() => update(item.quantity + 1)}>+</button>
          </div>

          <div className="cart-item__pricing">
            <span className="cart-item__price">{formatPrice(item.price * item.quantity)}</span>
            {item.quantity > 1 && (
              <span className="cart-item__unit-price">{formatPrice(item.price)} each</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
