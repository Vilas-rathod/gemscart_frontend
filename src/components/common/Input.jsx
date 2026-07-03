import './Input.css';

const Input = ({
  label,
  error,
  hint,
  type = 'text',
  id,
  className = '',
  ...props
}) => (
  <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
    {label && <label className="input-label" htmlFor={id}>{label}</label>}
    <input type={type} id={id} className="input-field" {...props} />
    {error && <span className="input-error">{error}</span>}
    {hint && !error && <span className="input-hint">{hint}</span>}
  </div>
);

export default Input;
