import { useState } from 'react';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import './Profile.css';

const TABS = [
  { id: 'orders',   Icon: Package,  label: 'My Orders' },
  { id: 'wishlist', Icon: Heart,    label: 'Wishlist' },
  { id: 'address',  Icon: MapPin,   label: 'Addresses' },
  { id: 'settings', Icon: Settings, label: 'Account Settings' },
];

const MOCK_ORDERS = [
  { id: 'LUXE-982341', date: 'June 20, 2025', status: 'Delivered', total: 28500, items: 1, product: 'Premium Diamond Solitaire Ring', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80' },
  { id: 'LUXE-871220', date: 'May 14, 2025',  status: 'Delivered', total: 12800, items: 1, product: 'Heirloom Pearl Drop Necklace', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80' },
];

const STATUS_CLASS = { 'Delivered': 'success', 'Processing': 'warning', 'Cancelled': 'error' };

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <main className="profile-page">
      <div className="container">
        <div className="profile-page__breadcrumb">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'My Account' }]} />
        </div>

        <div className="profile-page__layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-sidebar__user">
              <div className="profile-sidebar__avatar">
                <User size={28} />
              </div>
              <div>
                <p className="profile-sidebar__name">Priya Sharma</p>
                <p className="profile-sidebar__email">priya@email.com</p>
              </div>
            </div>

            <nav className="profile-sidebar__nav">
              {TABS.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  className={`profile-sidebar__link ${activeTab === id ? 'active' : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
              <button className="profile-sidebar__link profile-sidebar__logout">
                <LogOut size={16} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {activeTab === 'orders' && (
              <div>
                <h2 className="profile-content__title display-sm">My Orders</h2>
                <div className="profile-orders">
                  {MOCK_ORDERS.map(order => (
                    <div key={order.id} className="profile-order">
                      <img src={order.img} alt={order.product} className="profile-order__img" />
                      <div className="profile-order__info">
                        <div className="profile-order__top">
                          <span className="profile-order__id">{order.id}</span>
                          <span className={`profile-order__status status-${STATUS_CLASS[order.status]}`}>{order.status}</span>
                        </div>
                        <p className="profile-order__product">{order.product}</p>
                        <p className="profile-order__meta">{order.date} · ₹{order.total.toLocaleString('en-IN')}</p>
                      </div>
                      <button className="profile-order__btn">View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="profile-content__title display-sm">Account Settings</h2>
                <div className="profile-settings">
                  <div className="profile-settings__group">
                    <label className="profile-settings__label">Full Name</label>
                    <input className="profile-settings__input" defaultValue="Priya Sharma" />
                  </div>
                  <div className="profile-settings__group">
                    <label className="profile-settings__label">Email</label>
                    <input className="profile-settings__input" defaultValue="priya@email.com" type="email" />
                  </div>
                  <div className="profile-settings__group">
                    <label className="profile-settings__label">Phone</label>
                    <input className="profile-settings__input" defaultValue="+91 98765 43210" type="tel" />
                  </div>
                  <button className="profile-settings__save">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="profile-content__title display-sm">Saved Pieces</h2>
                <p className="profile-content__empty">Visit your <a href="/wishlist">Wishlist page</a> to see saved jewellery.</p>
              </div>
            )}

            {activeTab === 'address' && (
              <div>
                <h2 className="profile-content__title display-sm">Delivery Addresses</h2>
                <div className="profile-address">
                  <p className="profile-address__name">Priya Sharma (Home)</p>
                  <p className="profile-address__line">123, Marine Drive, Nariman Point</p>
                  <p className="profile-address__line">Mumbai, Maharashtra – 400021</p>
                  <p className="profile-address__line">+91 98765 43210</p>
                  <div className="profile-address__actions">
                    <button>Edit</button>
                    <button>Remove</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
