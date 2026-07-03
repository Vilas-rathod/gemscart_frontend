import { useParams, Link } from 'react-router-dom';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductGrid from '../components/product/ProductGrid';
import Breadcrumb from '../components/ui/Breadcrumb';
import { products, categories } from '../data/products';
import './Product.css';

const Product = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2 className="display-md">Product not found</h2>
        <Link to="/shop">← Back to Shop</Link>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const cat = categories.find(c => c.slug === product.category);

  return (
    <main className="product-page">
      <div className="container">
        <div className="product-page__breadcrumb">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Shop', path: '/shop' },
            { label: cat?.name || product.category, path: `/shop?category=${product.category}` },
            { label: product.name }
          ]} />
        </div>

        <div className="product-page__main">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="product-page__related">
            <div className="section-header" style={{ textAlign: 'left' }}>
              <span className="label-uppercase section-eyebrow">You May Also Like</span>
              <h2 className="display-sm section-title" style={{ textAlign: 'left' }}>Related Pieces</h2>
              <div className="gold-divider" />
            </div>
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </div>
    </main>
  );
};

export default Product;
