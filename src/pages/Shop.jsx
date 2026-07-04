import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import Breadcrumb from '../components/ui/Breadcrumb';
import Pagination from '../components/ui/Pagination';
import * as productApi from '../api/productApi';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'newest', label: 'Newest First' },
];

const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 – ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 – ₹50,000', min: 25000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: undefined },
];

const PER_PAGE = 8;

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState(null);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryFilter = searchParams.get('category');
  const newFilter     = searchParams.get('filter') === 'new';

  useEffect(() => {
    productApi.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, newFilter, priceRange, sort]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productApi.getProducts({
      category: categoryFilter || undefined,
      minPrice: priceRange?.min,
      maxPrice: priceRange?.max,
      isNew: newFilter || undefined,
      sort,
      page: page - 1,
      size: PER_PAGE
    }).then(data => {
      if (cancelled) return;
      setProducts(data.items);
      setTotalItems(data.totalItems);
      setTotalPages(Math.max(1, data.totalPages));
    }).catch(() => {
      if (!cancelled) { setProducts([]); setTotalItems(0); setTotalPages(1); }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [categoryFilter, newFilter, priceRange, sort, page]);

  const currentCat  = categories.find(c => c.slug === categoryFilter);
  const pageTitle   = newFilter ? 'New Arrivals' : currentCat?.name || 'All Jewellery';

  return (
    <main className="shop-page">
      {/* Page Header */}
      <div className="shop-page__header">
        <div className="container">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Shop', path: '/shop' },
            ...(currentCat ? [{ label: currentCat.name }] : []),
          ]} />
          <h1 className="shop-page__title display-lg">{pageTitle}</h1>
          <p className="shop-page__count">{totalItems} pieces</p>
        </div>
      </div>

      <div className="container">
        <div className="shop-page__toolbar">
          {/* Filter Toggle */}
          <button className="shop-page__filter-toggle" onClick={() => setFiltersOpen(o => !o)}>
            <SlidersHorizontal size={16} />
            Filters
            {priceRange && <span className="shop-page__active-dot" />}
          </button>

          <div className="shop-page__toolbar-right">
            <span className="shop-page__result-count">{totalItems} Results</span>

            {/* Sort dropdown */}
            <div className="shop-page__sort">
              <button className="shop-page__sort-btn" onClick={() => setSortOpen(o => !o)}>
                <span>Sort: {SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                <ChevronDown size={14} className={sortOpen ? 'rotated' : ''} />
              </button>
              {sortOpen && (
                <div className="shop-page__sort-dropdown">
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      className={`shop-page__sort-option ${sort === o.value ? 'active' : ''}`}
                      onClick={() => { setSort(o.value); setSortOpen(false); }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="shop-page__layout">
          {/* Sidebar Filters */}
          <aside className={`shop-page__sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="shop-page__sidebar-header">
              <h3>Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="shop-page__sidebar-close">
                <X size={18} />
              </button>
            </div>

            {/* Categories */}
            <div className="shop-page__filter-section">
              <h4 className="shop-page__filter-title">Category</h4>
              {categories.map(cat => (
                <a
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={`shop-page__filter-option ${categoryFilter === cat.slug ? 'active' : ''}`}
                >
                  <span>{cat.name}</span>
                  <span className="shop-page__filter-count">{cat.count}</span>
                </a>
              ))}
            </div>

            {/* Price */}
            <div className="shop-page__filter-section">
              <h4 className="shop-page__filter-title">Price Range</h4>
              {PRICE_RANGES.map(r => (
                <button
                  key={r.label}
                  className={`shop-page__filter-option ${priceRange?.label === r.label ? 'active' : ''}`}
                  onClick={() => setPriceRange(priceRange?.label === r.label ? null : r)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Clear */}
            {priceRange && (
              <button className="shop-page__clear-filters" onClick={() => setPriceRange(null)}>
                Clear Filters
              </button>
            )}
          </aside>

          {/* Product Area */}
          <div className="shop-page__products">
            {loading ? (
              <div className="shop-page__empty"><p>Loading jewellery…</p></div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} columns={3} />
                {totalPages > 1 && (
                  <Pagination current={page} total={totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 300, behavior: 'smooth' }); }} />
                )}
              </>
            ) : (
              <div className="shop-page__empty">
                <p>No jewellery found for this selection.</p>
                <button onClick={() => setPriceRange(null)}>Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {filtersOpen && <div className="shop-page__overlay" onClick={() => setFiltersOpen(false)} />}
    </main>
  );
};

export default Shop;
