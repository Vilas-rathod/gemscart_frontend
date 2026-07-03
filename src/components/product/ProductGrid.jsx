import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, columns = 4 }) => (
  <div className={`product-grid product-grid--${columns}`}>
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

export default ProductGrid;
