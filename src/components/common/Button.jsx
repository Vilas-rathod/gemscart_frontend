import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => (
  <button
    type={type}
    className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${loading ? 'btn--loading' : ''} ${className}`}
    disabled={disabled || loading}
    onClick={onClick}
    {...props}
  >
    {loading ? <span className="btn__spinner" /> : children}
  </button>
);

export default Button;
