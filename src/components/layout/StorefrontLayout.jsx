import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

/** Wraps all customer-facing pages with the storefront header/footer. */
const StorefrontLayout = () => (
  <>
    <ScrollToTop />
    <Header />
    <Outlet />
    <Footer />
  </>
);

export default StorefrontLayout;
