import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext(null);

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return state.some(i => i.id === action.payload.id)
        ? state.filter(i => i.id !== action.payload.id)
        : [...state, action.payload];
    case 'REMOVE':
      return state.filter(i => i.id !== action.payload);
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem('luxe_wishlist')) || []; }
    catch { return []; }
  })();

  const [items, dispatch] = useReducer(wishlistReducer, stored);

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(items));
  }, [items]);

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
