import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        const data = await login({
          email: form.email,
          password: form.password,
        });

        if (data.user.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else if (data.user.role === "SELLER") {
          navigate("/seller", { replace: true });
        } else {
          navigate(redirectTo, { replace: true });
        }
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
        });

        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-page__split">
        {/* Left – decorative */}
        <div className="login-page__art">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80"
            alt="Luxury jewellery"
            className="login-page__art-img"
          />
          <div className="login-page__art-overlay">
            <div className="login-page__art-logo">
              <span className="login-page__logo-word">LUXE</span>
              <span className="login-page__logo-sub">Jewellery</span>
            </div>
            <p className="login-page__art-quote">
              "Timeless jewellery crafted for every woman."
            </p>
          </div>
        </div>

        {/* Right – form */}
        <div className="login-page__form-wrap">
          <div className="login-page__form-inner">
            <Link to="/" className="login-page__back">
              ← Back to Store
            </Link>

            <div className="login-page__tabs">
              <button
                className={`login-page__tab ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Sign In
              </button>
              <button
                className={`login-page__tab ${mode === "register" ? "active" : ""}`}
                onClick={() => setMode("register")}
              >
                Create Account
              </button>
            </div>

            <h1 className="login-page__title display-sm">
              {mode === "login" ? "Welcome back" : "Join LUXE"}
            </h1>
            <p className="login-page__sub">
              {mode === "login"
                ? "Sign in to access your wishlist, track orders, and enjoy exclusive member benefits."
                : "Create your account for a personalised jewellery experience."}
            </p>

            <div className="login-page__form">
              {error && <p className="login-page__error">{error}</p>}

              {mode === "register" && (
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Priya Sharma"
                />
              )}
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="priya@email.com"
              />
              {mode === "register" && (
                <Input
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+91 98765 43210"
                />
              )}

              <div className="login-page__pwd-wrap">
                <Input
                  label="Password"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="••••••••"
                />
                <button
                  className="login-page__pwd-toggle"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label="Toggle password"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {mode === "login" && (
                <div className="login-page__forgot">
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSubmit}
                loading={submitting}
              >
                {mode === "login" ? "Sign In" : "Create Account"}
              </Button>

              <p className="login-page__switch">
                {mode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() =>
                    setMode((m) => (m === "login" ? "register" : "login"))
                  }
                  className="login-page__switch-btn"
                >
                  {mode === "login" ? "Register" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
