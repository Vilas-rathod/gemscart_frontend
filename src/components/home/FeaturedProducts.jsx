import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import ProductGrid from '../product/ProductGrid';
import { products, testimonials } from '../../data/products';
import './FeaturedProducts.css';

const FILTERS = ['All', 'Best Sellers', 'New Arrivals', 'Rings', 'Necklaces', 'Earrings'];

const FeaturedProducts = () => {
  const [active, setActive] = useState('All');

  const filtered = products.filter(p => {
    if (active === 'All') return true;
    if (active === 'Best Sellers') return p.badge === 'Best Seller';
    if (active === 'New Arrivals') return p.isNew;
    if (active === 'Rings') return p.category === 'diamond-rings';
    if (active === 'Necklaces') return p.category === 'necklaces';
    if (active === 'Earrings') return p.category === 'earrings';
    return true;
  });

  return (
    <>
      {/* ── Best Sellers ── */}
      <section className="featured section-pad">
        <div className="container">
          <div className="section-header">
            <span className="label-uppercase section-eyebrow">Curated For You</span>
            <h2 className="display-md section-title">Best Sellers</h2>
            <div className="gold-divider centered" />
          </div>

          {/* Filter Pills */}
          <div className="featured__filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`featured__filter-btn ${active === f ? 'active' : ''}`}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <ProductGrid products={filtered} columns={4} />

          <div className="featured__view-all">
            <Link to="/shop" className="featured__view-all-link">
              View All Products
              <span className="featured__view-all-line" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Banner Strip ── */}
      <section className="heritage-banner">
        <div className="container">
          <div className="heritage-banner__inner">
            <div className="heritage-banner__text">
              <span className="label-uppercase" style={{ color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
                Our Promise
              </span>
              <h2 className="display-lg" style={{ color: 'var(--white)', lineHeight: 1.1 }}>
                Jewellery that becomes<br />
                <em>your heirloom</em>
              </h2>
            </div>
            <div className="heritage-banner__stats">
              {[
                { n: '25+', l: 'Years of Craft' },
                { n: '100%', l: 'Hallmarked Gold' },
                { n: '4.9★', l: 'Average Rating' },
                { n: '0%', l: 'EMI Available' },
              ].map(({ n, l }) => (
                <div key={l} className="heritage-banner__stat">
                  <span className="heritage-banner__stat-n">{n}</span>
                  <span className="heritage-banner__stat-l label-uppercase">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials section-pad">
        <div className="container">
          <div className="section-header">
            <span className="label-uppercase section-eyebrow">Stories of Love</span>
            <h2 className="display-md section-title">What Our Customers Say</h2>
            <div className="gold-divider centered" />
          </div>

          <div className="testimonials__grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonials__card">
                <div className="testimonials__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--gold)" stroke="none" />
                  ))}
                </div>
                <p className="testimonials__text">"{t.text}"</p>
                <div className="testimonials__footer">
                  <div>
                    <span className="testimonials__name">{t.name}</span>
                    <span className="testimonials__location">{t.location}</span>
                  </div>
                  <span className="testimonials__product label-uppercase">{t.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;
