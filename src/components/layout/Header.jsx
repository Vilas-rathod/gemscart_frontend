import { useRef, useLayoutEffect } from 'react';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import './Header.css';

const Header = () => {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const applyHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${el.offsetHeight}px`);
    };

    applyHeight();
    const observer = new ResizeObserver(applyHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-header" ref={headerRef}>
      <AnnouncementBar />
      <Navbar />
    </div>
  );
};

export default Header;
