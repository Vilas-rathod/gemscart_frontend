import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ current, total, onChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="pagination">
      <button className="pagination__btn" onClick={() => onChange(current - 1)} disabled={current === 1} aria-label="Previous">
        <ChevronLeft size={16} />
      </button>
      {pages.map(p => (
        <button
          key={p}
          className={`pagination__page ${p === current ? 'active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button className="pagination__btn" onClick={() => onChange(current + 1)} disabled={current === total} aria-label="Next">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
