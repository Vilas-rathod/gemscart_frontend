import { createContext, useContext, useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as cartApi from '../api/cartApi';
import { track, ACTIVITY } from '../api/activityApi';

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

    case 'SET_ITEMS':
      return { ...state, items: action.payload };

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

const mapServerItem = (item) => ({
  id: item.productId,
  cartItemId: item.id,
  name: item.name,
  slug: item.slug,
  price: item.price,
  images: item.image ? [item.image] : [],
  metal: item.metal,
  inStock: item.inStock,
  size: item.size,
  quantity: item.quantity
});

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart')) || initialState; }
    catch { return initialState; }
  })();

  const [state, localDispatch] = useReducer(cartReducer, stored);
  const wasAuthenticated = useRef(isAuthenticated);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('luxe_cart', JSON.stringify(state));
    }
  }, [state, isAuthenticated]);

  const refreshServerCart = useCallback(async () => {
    const data = await cartApi.getCart();
    localDispatch({ type: 'SET_ITEMS', payload: data.items.map(mapServerItem) });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const justLoggedIn = !wasAuthenticated.current;
    wasAuthenticated.current = true;

    (async () => {
      setLoading(true);
      try {
        if (justLoggedIn && state.items.length > 0) {
          for (const item of state.items) {
            await cartApi.addItem({ productId: item.id, size: item.size, quantity: item.quantity });
          }
          localStorage.removeItem('luxe_cart');
        }
        await refreshServerCart();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) wasAuthenticated.current = false;
  }, [isAuthenticated]);

  const dispatch = useCallback(async (action) => {
    if (action.type === 'APPLY_COUPON' || action.type === 'REMOVE_COUPON') {
      localDispatch(action);
      return;
    }

    if (!isAuthenticated) {
      localDispatch(action);
      return;
    }

    const findServerItem = () => state.items.find(i => i.id === action.payload?.id && i.size === action.payload?.size);

    switch (action.type) {
      case 'ADD_ITEM':
        await cartApi.addItem({ productId: action.payload.id, size: action.payload.size, quantity: action.payload.quantity || 1 });
        track(ACTIVITY.CART_ADD, action.payload.slug || action.payload.id);
        break;
      case 'REMOVE_ITEM': {
        const item = findServerItem();
        if (item) await cartApi.removeItem(item.cartItemId);
        break;
      }
      case 'UPDATE_QUANTITY': {
        const item = findServerItem();
        if (item) {
          if (action.payload.quantity <= 0) await cartApi.removeItem(item.cartItemId);
          else await cartApi.updateItem(item.cartItemId, action.payload.quantity);
        }
        break;
      }
      case 'CLEAR_CART':
        await cartApi.clearCart();
        break;
      default:
        break;
    }
    await refreshServerCart();
  }, [isAuthenticated, state.items, refreshServerCart]);

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
      loading,
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
