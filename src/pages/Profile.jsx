import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import Breadcrumb from "../components/ui/Breadcrumb";
import { useAuth } from "../context/AuthContext";
import * as userApi from "../api/userApi";
import * as orderApi from "../api/orderApi";
import { formatPrice } from "../utils/helpers";
import "./Profile.css";

const TABS = [
  { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
  { id: "orders", Icon: Package, label: "My Orders" },
  { id: "wishlist", Icon: Heart, label: "Wishlist" },
  { id: "address", Icon: MapPin, label: "Addresses" },
  { id: "settings", Icon: Settings, label: "Account Settings" },
];

const STATUS_CLASS = {
  CONFIRMED: "success",
  PENDING: "warning",
  FAILED: "error",
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [settingsForm, setSettingsForm] = useState({ name: "", phone: "" });
  const [savingSettings, setSavingSettings] = useState(false);
  const [addressForm, setAddressForm] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadProfile = () =>
    userApi.getMe().then((data) => {
      setProfile(data);
      setSettingsForm({ name: data.name, phone: data.phone || "" });
    });

  useEffect(() => {
    loadProfile().catch(() => {});
    orderApi
      .getOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await userApi.updateMe(settingsForm);
      await loadProfile();
    } finally {
      setSavingSettings(false);
    }
  };

  const removeAddress = async (id) => {
    await userApi.deleteAddress(id);
    await loadProfile();
  };

  const submitAddress = async () => {
    await userApi.addAddress({
      ...addressForm,
      isDefault: profile?.addresses?.length === 0,
    });
    setAddressForm(null);
    await loadProfile();
  };

  return (
    <main className="profile-page">
      <div className="container">
        <div className="profile-page__breadcrumb">
          <Breadcrumb
            items={[{ label: "Home", path: "/" }, { label: "My Account" }]}
          />
        </div>

        <div className="profile-page__layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-sidebar__user">
              <div className="profile-sidebar__avatar">
                <User size={28} />
              </div>
              <div>
                <p className="profile-sidebar__name">{profile?.name || "—"}</p>
                <p className="profile-sidebar__email">{profile?.email || ""}</p>
              </div>
            </div>

            <nav className="profile-sidebar__nav">
              {TABS.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  className={`profile-sidebar__link ${activeTab === id ? "active" : ""}`}
                  onClick={() => {
                    if (id === "dashboard") {
                      if (user?.role === "ADMIN") {
                        navigate("/admin");
                      } else if (user?.role === "SELLER") {
                        navigate("/seller");
                      }
                    } else {
                      setActiveTab(id);
                    }
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}{" "}
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {activeTab === "orders" && (
              <div>
                <h2 className="profile-content__title display-sm">My Orders</h2>
                {orders.length === 0 ? (
                  <p className="profile-content__empty">
                    You haven't placed any orders yet.
                  </p>
                ) : (
                  <div className="profile-orders">
                    {orders.map((order) => (
                      <div key={order.id} className="profile-order">
                        <img
                          src={order.items[0]?.image}
                          alt={order.items[0]?.name}
                          className="profile-order__img"
                        />
                        <div className="profile-order__info">
                          <div className="profile-order__top">
                            <span className="profile-order__id">
                              LUXE-{order.id}
                            </span>
                            <span
                              className={`profile-order__status status-${STATUS_CLASS[order.status] || "warning"}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="profile-order__product">
                            {order.items[0]?.name}
                            {order.items.length > 1
                              ? ` + ${order.items.length - 1} more`
                              : ""}
                          </p>
                          <p className="profile-order__meta">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}{" "}
                            · {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="profile-content__title display-sm">
                  Account Settings
                </h2>
                <div className="profile-settings">
                  <div className="profile-settings__group">
                    <label className="profile-settings__label">Full Name</label>
                    <input
                      className="profile-settings__input"
                      value={settingsForm.name}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="profile-settings__group">
                    <label className="profile-settings__label">Email</label>
                    <input
                      className="profile-settings__input"
                      value={profile?.email || ""}
                      type="email"
                      disabled
                    />
                  </div>
                  <div className="profile-settings__group">
                    <label className="profile-settings__label">Phone</label>
                    <input
                      className="profile-settings__input"
                      value={settingsForm.phone}
                      onChange={(e) =>
                        setSettingsForm((f) => ({
                          ...f,
                          phone: e.target.value,
                        }))
                      }
                      type="tel"
                    />
                  </div>
                  <button
                    className="profile-settings__save"
                    onClick={saveSettings}
                    disabled={savingSettings}
                  >
                    {savingSettings ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="profile-content__title display-sm">
                  Saved Pieces
                </h2>
                <p className="profile-content__empty">
                  Visit your <a href="/wishlist">Wishlist page</a> to see saved
                  jewellery.
                </p>
              </div>
            )}

            {activeTab === "address" && (
              <div>
                <h2 className="profile-content__title display-sm">
                  Delivery Addresses
                </h2>
                {(profile?.addresses || []).map((addr) => (
                  <div key={addr.id} className="profile-address">
                    <p className="profile-address__name">
                      {addr.label || "Address"}
                      {addr.isDefault ? " (Default)" : ""}
                    </p>
                    <p className="profile-address__line">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}
                    </p>
                    <p className="profile-address__line">
                      {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="profile-address__line">{addr.phone}</p>
                    <div className="profile-address__actions">
                      <button onClick={() => removeAddress(addr.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {addressForm ? (
                  <div
                    className="profile-settings"
                    style={{ marginTop: "16px" }}
                  >
                    {[
                      "label",
                      "line1",
                      "line2",
                      "city",
                      "state",
                      "pincode",
                      "phone",
                    ].map((field) => (
                      <div className="profile-settings__group" key={field}>
                        <label className="profile-settings__label">
                          {field}
                        </label>
                        <input
                          className="profile-settings__input"
                          value={addressForm[field] || ""}
                          onChange={(e) =>
                            setAddressForm((f) => ({
                              ...f,
                              [field]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ))}
                    <button
                      className="profile-settings__save"
                      onClick={submitAddress}
                    >
                      Save Address
                    </button>
                  </div>
                ) : (
                  <button
                    className="profile-settings__save"
                    style={{ marginTop: "16px" }}
                    onClick={() => setAddressForm({})}
                  >
                    + Add Address
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
