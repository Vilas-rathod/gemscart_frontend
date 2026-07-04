import './dashboard.css';

const StatCard = ({ icon: Icon, label, value, delta }) => (
  <div className="stat-card">
    {Icon && <div className="stat-card__icon"><Icon size={22} /></div>}
    <div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {delta && <div className="stat-card__delta">{delta}</div>}
    </div>
  </div>
);

export default StatCard;
