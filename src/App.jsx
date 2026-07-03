import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import { WishlistProvider } from './hooks/useWishlist';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';

const App = () => (
  <BrowserRouter>
    <CartProvider>
      <WishlistProvider>
        <ScrollToTop />
        <AnnouncementBar />
        <Navbar />
        <AppRoutes />
        <Footer />
      </WishlistProvider>
    </CartProvider>
  </BrowserRouter>
);

export default App;
