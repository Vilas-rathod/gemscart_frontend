import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productApi from '../../api/productApi';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productApi.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
  <section className="categories section-pad">
    <div className="container">
      <div className="section-header">
        <span className="label-uppercase section-eyebrow">Browse By</span>
        <h2 className="display-md section-title">Featured Categories</h2>
        <div className="gold-divider centered" />
      </div>

      <div className="categories__grid">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            className={`categories__card ${i === 0 ? 'categories__card--large' : ''}`}
          >
            <div className="categories__card-image-wrap">
              <img src={cat.image} alt={cat.name} loading="lazy" className="categories__card-image" />
              <div className="categories__card-overlay" />
            </div>
            <div className="categories__card-content">
              <h3 className="categories__card-name">{cat.name}</h3>
              <p className="categories__card-desc">{cat.description}</p>
              <span className="categories__card-count label-uppercase">{cat.count} Pieces</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Categories;
