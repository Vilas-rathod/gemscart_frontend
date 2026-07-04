import './dashboard.css';

// Maps order/seller statuses to a badge colour.
const COLOR = {
  PENDING: 'amber', CONFIRMED: 'blue', PROCESSING: 'purple', SHIPPED: 'blue',
  DELIVERED: 'green', CANCELLED: 'red', FAILED: 'red',
  APPROVED: 'green', REJECTED: 'red', SUSPENDED: 'amber',
  ACTIVE: 'green', BLOCKED: 'red',
  ADMIN: 'purple', SELLER: 'blue', CUSTOMER: 'gray',
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const color = COLOR[String(status).toUpperCase()] || 'gray';
  return <span className={`status-badge status-badge--${color}`}>{String(status).toLowerCase()}</span>;
};

export default StatusBadge;
