import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductGrid from '../components/product/ProductGrid';
import Breadcrumb from '../components/ui/Breadcrumb';
import * as productApi from '../api/productApi';
import { track, ACTIVITY } from '../api/activityApi';
import './Product.css';

const Product = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    productApi.getProductBySlug(slug)
      .then(data => {
        if (cancelled) return;
        setProduct(data);
        track(ACTIVITY.PRODUCT_VIEW, slug);
        return productApi.getRelatedProducts(slug, 4);
      })
      .then(relatedData => {
        if (!cancelled && relatedData) setRelated(relatedData);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <div className="product-not-found"><h2 className="display-md">Loading…</h2></div>;
  }

  if (notFound || !product) {
    return (
      <div className="product-not-found">
        <h2 className="display-md">Product not found</h2>
        <Link to="/shop">← Back to Shop</Link>
      </div>
    );
  }

  return (
    <main className="product-page">
      <div className="container">
        <div className="product-page__breadcrumb">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Shop', path: '/shop' },
            { label: product.category.replace(/-/g, ' '), path: `/shop?category=${product.category}` },
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
