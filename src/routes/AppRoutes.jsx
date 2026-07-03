import { Routes, Route } from 'react-router-dom';
import Home     from '../pages/Home';
import Shop     from '../pages/Shop';
import Product  from '../pages/Product';
import Cart     from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import Login    from '../pages/Login';
import Profile  from '../pages/Profile';

const AppRoutes = () => (
  <Routes>
    <Route path="/"         element={<Home />} />
    <Route path="/shop"     element={<Shop />} />
    <Route path="/product/:slug" element={<Product />} />
    <Route path="/cart"     element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/login"    element={<Login />} />
    <Route path="/profile"  element={<Profile />} />
    <Route path="*"         element={<div style={{ padding: '140px 0', textAlign: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: '#0A0A0A' }}>404 — Page Not Found</div>} />
  </Routes>
);

export default AppRoutes;
