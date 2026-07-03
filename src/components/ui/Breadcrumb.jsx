import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => (
  <nav className="breadcrumb" aria-label="Breadcrumb">
    {items.map((item, i) => (
      <span key={i} className="breadcrumb__item">
        {i > 0 && <ChevronRight size={12} className="breadcrumb__sep" />}
        {item.path ? (
          <Link to={item.path} className="breadcrumb__link">{item.label}</Link>
        ) : (
          <span className="breadcrumb__current">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
