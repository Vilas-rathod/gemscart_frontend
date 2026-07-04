import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as wishlistApi from '../api/wishlistApi';
import * as productApi from '../api/productApi';
import { track, ACTIVITY } from '../api/activityApi';

const WishlistContext = createContext(null);

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return state.some(i => i.id === action.payload.id)
        ? state.filter(i => i.id !== action.payload.id)
        : [...state, action.payload];
    case 'REMOVE':
      return state.filter(i => i.id !== action.payload);
    case 'SET_ITEMS':
      return action.payload;
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem('luxe_wishlist')) || []; }
    catch { return []; }
  })();

  const [items, localDispatch] = useReducer(wishlistReducer, stored);
  const wasAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('luxe_wishlist', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const refreshServerWishlist = useCallback(async () => {
    const data = await wishlistApi.getWishlist();
    const products = await Promise.all(data.map(i => productApi.getProductById(i.productId)));
    localDispatch({ type: 'SET_ITEMS', payload: products });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      wasAuthenticated.current = false;
      return;
    }

    const justLoggedIn = !wasAuthenticated.current;
    wasAuthenticated.current = true;

    (async () => {
      if (justLoggedIn && items.length > 0) {
        for (const item of items) {
          await wishlistApi.addItem(item.id);
        }
        localStorage.removeItem('luxe_wishlist');
      }
      await refreshServerWishlist();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const dispatch = useCallback(async (action) => {
    if (!isAuthenticated) {
      localDispatch(action);
      return;
    }

    switch (action.type) {
      case 'TOGGLE': {
        const alreadySaved = items.some(i => i.id === action.payload.id);
        if (alreadySaved) {
          await wishlistApi.removeItem(action.payload.id);
        } else {
          await wishlistApi.addItem(action.payload.id);
          track(ACTIVITY.WISHLIST_ADD, action.payload.slug || action.payload.id);
        }
        break;
      }
      case 'REMOVE':
        await wishlistApi.removeItem(action.payload);
        break;
      default:
        break;
    }
    await refreshServerWishlist();
  }, [isAuthenticated, items, refreshServerWishlist]);

  const isWishlisted = (id) => items.some(i => i.id === id);

  return (
    <WishlistContext.Provider value={{ items, dispatch, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
