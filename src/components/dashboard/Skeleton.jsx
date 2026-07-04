import './dashboard.css';

export const Skeleton = ({ height = 16, width = '100%', radius = 6, style }) => (
  <span className="skel" style={{ display: 'block', height, width, borderRadius: radius, ...style }} />
);

export const StatSkeletonRow = ({ count = 4 }) => (
  <div className="dash-stats">
    {Array.from({ length: count }).map((_, i) => <div key={i} className="skel skel-stat" />)}
  </div>
);
