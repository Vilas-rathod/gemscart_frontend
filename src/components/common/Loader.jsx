import './Loader.css';

const Loader = ({ size = 'md', overlay = false }) => (
  <div className={`loader-wrap ${overlay ? 'loader-wrap--overlay' : ''}`}>
    <div className={`loader loader--${size}`}>
      <span className="loader__ring" />
      <span className="loader__dot" />
    </div>
  </div>
);

export default Loader;
