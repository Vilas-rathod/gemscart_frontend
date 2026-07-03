import './Rating.css';

const Rating = ({ value = 0, max = 5, count, size = 'sm' }) => (
  <div className={`rating rating--${size}`}>
    <div className="rating__stars">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`rating__star ${i < Math.floor(value) ? 'full' : i < value ? 'half' : 'empty'}`}
        >
          ★
        </span>
      ))}
    </div>
    {count != null && <span className="rating__count">({count})</span>}
  </div>
);

export default Rating;
