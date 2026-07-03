import { Link } from 'react-router-dom';
import './Hero.css';

const SLIDES = [
  {
    id: 1,
    eyebrow: "New Bridal Collection 2025",
    headline: ["Timeless", "Jewellery Crafted", "For Every Woman"],
    sub: "Celebrate elegance with handcrafted jewellery designed to make every moment unforgettable.",
    cta: { label: "Explore Collection", path: "/shop" },
    ctaSecondary: { label: "Inspire New Arrivals", path: "/shop?filter=new" },
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=85",
    imageAlt: "Luxury jewellery collection"
  }
];

const Hero = () => {
  const slide = SLIDES[0];

  return (
    <section className="hero">
      {/* Background Image */}
      <div className="hero__bg">
        <img src={slide.image} alt={slide.imageAlt} className="hero__bg-img" />
        <div className="hero__overlay" />
      </div>

      {/* Content */}
      <div className="hero__content container">
        <div className="hero__text">
          <span className="hero__eyebrow label-uppercase">{slide.eyebrow}</span>

          <h1 className="hero__headline">
            {slide.headline.map((line, i) => (
              <span key={i} className="hero__headline-line">{line}</span>
            ))}
          </h1>

          <div className="hero__gold-line" />

          <p className="hero__sub">{slide.sub}</p>

          <div className="hero__actions">
            <Link to={slide.cta.path} className="hero__btn hero__btn--primary">
              {slide.cta.label}
            </Link>
            <Link to={slide.ctaSecondary.path} className="hero__btn hero__btn--ghost">
              {slide.ctaSecondary.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-label label-uppercase">Scroll</span>
      </div>

      {/* Stats */}
      <div className="hero__stats">
        {[
          { value: '10,000+', label: 'Happy Customers' },
          { value: '500+', label: 'Handcrafted Designs' },
          { value: '22K–18K', label: 'Certified Gold' },
        ].map(({ value, label }) => (
          <div key={label} className="hero__stat">
            <span className="hero__stat-value">{value}</span>
            <span className="hero__stat-label label-uppercase">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
