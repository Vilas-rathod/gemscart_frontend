import { LayoutDashboard, Store, Users, Package, ShoppingCart } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/sellers', label: 'Sellers', icon: Store },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

const AdminLayout = () => <DashboardLayout nav={NAV} title="Admin Panel" />;

export default AdminLayout;
