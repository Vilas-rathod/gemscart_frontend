import { Routes, Route } from 'react-router-dom';
import StorefrontLayout from '../components/layout/StorefrontLayout';
import Home     from '../pages/Home';
import Shop     from '../pages/Shop';
import Product  from '../pages/Product';
import Cart     from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import Login    from '../pages/Login';
import Profile  from '../pages/Profile';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

// Seller panel
import SellerLayout    from '../panels/seller/SellerLayout';
import SellerApply     from '../panels/seller/SellerApply';
import SellerDashboard from '../panels/seller/SellerDashboard';
import SellerProducts  from '../panels/seller/SellerProducts';
import SellerOrders    from '../panels/seller/SellerOrders';
import SellerAnalytics from '../panels/seller/SellerAnalytics';
import SellerProfile   from '../panels/seller/SellerProfile';

// Admin panel
import AdminLayout    from '../panels/admin/AdminLayout';
import AdminDashboard from '../panels/admin/AdminDashboard';
import AdminSellers   from '../panels/admin/AdminSellers';
import AdminUsers     from '../panels/admin/AdminUsers';
import AdminProducts  from '../panels/admin/AdminProducts';
import AdminOrders    from '../panels/admin/AdminOrders';

const NotFound = () => (
  <div style={{ padding: '140px 0', textAlign: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: '#0A0A0A' }}>
    404 — Page Not Found
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* ── Storefront (with header/footer) ── */}
    <Route element={<StorefrontLayout />}>
      <Route path="/"         element={<Home />} />
      <Route path="/shop"     element={<Shop />} />
      <Route path="/product/:slug" element={<Product />} />
      <Route path="/cart"     element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="*"         element={<NotFound />} />
    </Route>

    {/* ── Seller onboarding (any authenticated user) ── */}
    <Route
      path="/seller/apply"
      element={<RoleRoute roles={['CUSTOMER', 'SELLER', 'ADMIN']}><SellerApply /></RoleRoute>}
    />

    {/* ── Seller panel (SELLER/ADMIN; customers routed to apply) ── */}
    <Route
      path="/seller"
      element={<RoleRoute roles={['SELLER', 'ADMIN']} redirectTo="/seller/apply"><SellerLayout /></RoleRoute>}
    >
      <Route index element={<SellerDashboard />} />
      <Route path="products" element={<SellerProducts />} />
      <Route path="orders" element={<SellerOrders />} />
      <Route path="analytics" element={<SellerAnalytics />} />
      <Route path="profile" element={<SellerProfile />} />
    </Route>

    {/* ── Admin panel (ADMIN only) ── */}
    <Route path="/admin" element={<RoleRoute roles={['ADMIN']}><AdminLayout /></RoleRoute>}>
      <Route index element={<AdminDashboard />} />
      <Route path="sellers" element={<AdminSellers />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
    </Route>
  </Routes>
);

export default AppRoutes;
