import { useEffect } from 'react';
import { X } from 'lucide-react';
import './dashboard.css';

const DashModal = ({ open, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className={`dash-modal ${size === 'sm' ? 'dash-modal--sm' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="dash-modal__head">
          <h3 className="dash-modal__title">{title}</h3>
          <button className="dash-icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="dash-modal__body">{children}</div>
        {footer && <div className="dash-modal__foot">{footer}</div>}
      </div>
    </div>
  );
};

export default DashModal;
