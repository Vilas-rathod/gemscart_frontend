import { Inbox } from 'lucide-react';
import './dashboard.css';

const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) => (
  <div className="dash-empty">
    <div className="dash-empty__icon"><Icon size={26} /></div>
    <h3 className="dash-empty__title">{title}</h3>
    {message && <p>{message}</p>}
    {action}
  </div>
);

export default EmptyState;
