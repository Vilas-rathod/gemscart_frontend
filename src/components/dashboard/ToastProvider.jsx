import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './dashboard.css';

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  const push = useCallback((type, message, ttl = 3500) => {
    const id = ++idRef.current;
    setToasts(t => [...t, { id, type, message }]);
    if (ttl) setTimeout(() => remove(id), ttl);
  }, [remove]);

  const api = useRef({
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  }).current;

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack">
        {toasts.map(({ id, type, message }) => {
          const Icon = ICONS[type] || Info;
          return (
            <div key={id} className={`toast toast--${type}`} role="status">
              <Icon size={18} className="toast__icon" />
              <span className="toast__msg">{message}</span>
              <button className="toast__close" onClick={() => remove(id)} aria-label="Dismiss"><X size={15} /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
