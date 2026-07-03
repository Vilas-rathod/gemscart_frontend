import { useState } from 'react';
import { X } from 'lucide-react';
import './AnnouncementBar.css';

const messages = [
  "✦  Free shipping on orders above ₹50,000  ✦",
  "✦  New Bridal Collection — Now Available  ✦",
  "✦  BIS Hallmarked Jewellery — Certified Purity  ✦"
];

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);
  const [msgIndex, setMsgIndex] = useState(0);

  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        <span className="announcement-text">{messages[msgIndex]}</span>
      </div>
      <button
        className="announcement-close"
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
