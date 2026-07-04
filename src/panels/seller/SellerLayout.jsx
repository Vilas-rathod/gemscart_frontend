import { LayoutDashboard, Package, ShoppingCart, BarChart3, UserCog } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const NAV = [
  { to: '/seller', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/seller/products', label: 'Products', icon: Package },
  { to: '/seller/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/seller/profile', label: 'Profile', icon: UserCog },
];

const SellerLayout = () => <DashboardLayout nav={NAV} title="Seller Panel" />;

export default SellerLayout;
