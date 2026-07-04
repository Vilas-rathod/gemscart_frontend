import { createContext, useContext, useState, useCallback, useRef } from 'react';
import './dashboard.css';

const ConfirmContext = createContext(null);

/**
 * Promise-based confirm dialog:
 *   const confirm = useConfirm();
 *   if (await confirm({ title, message, confirmLabel, danger })) { ... }
 */
export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((opts) => new Promise((resolve) => {
    resolver.current = resolve;
    setState(opts || {});
  }), []);

  const close = (result) => {
    resolver.current?.(result);
    resolver.current = null;
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="dash-modal-overlay" onClick={() => close(false)}>
          <div className="dash-modal dash-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="dash-modal__head">
              <h3 className="dash-modal__title">{state.title || 'Are you sure?'}</h3>
            </div>
            <div className="dash-modal__body">
              <p className="confirm-msg">{state.message || 'This action cannot be undone.'}</p>
            </div>
            <div className="dash-modal__foot">
              <button className="dash-btn dash-btn--ghost" onClick={() => close(false)}>
                {state.cancelLabel || 'Cancel'}
              </button>
              <button
                className={`dash-btn ${state.danger ? 'dash-btn--danger' : 'dash-btn--primary'}`}
                onClick={() => close(true)}
                autoFocus
              >
                {state.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};
