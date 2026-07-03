import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      );
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id && i.size === action.payload.size
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => !(i.id === action.payload.id && i.size === action.payload.size)) };

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => !(i.id === action.payload.id && i.size === action.payload.size)) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id && i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };

    case 'REMOVE_COUPON':
      return { ...state, coupon: null };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  coupon: null
};

export const CartProvider = ({ children }) => {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart')) || initialState; }
    catch { return initialState; }
  })();

  const [state, dispatch] = useReducer(cartReducer, stored);

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(state));
  }, [state]);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = state.coupon ? Math.round(subtotal * (state.coupon.percent / 100)) : 0;
  const shipping = subtotal > 50000 ? 0 : 299;
  const total = subtotal - discount + shipping;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      coupon: state.coupon,
      subtotal,
      discount,
      shipping,
      total,
      itemCount,
      dispatch
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
