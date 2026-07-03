import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter__bg" />
      <div className="container">
        <div className="newsletter__inner">
          <div className="newsletter__text">
            <span className="label-uppercase newsletter__eyebrow">Join the Circle</span>
            <h2 className="display-md newsletter__title">
              Receive exclusive offers &<br />new arrivals in your inbox
            </h2>
            <p className="newsletter__sub">
              Be the first to know about new collections, private sales, and jewellery care tips from our master craftspeople.
            </p>
          </div>

          {submitted ? (
            <div className="newsletter__success">
              <CheckCircle size={32} strokeWidth={1.5} />
              <p>Thank you for joining. Watch your inbox for something beautiful.</p>
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <div className="newsletter__field">
                <input
                  type="email"
                  className="newsletter__input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter__btn">
                  <Send size={16} />
                  <span>Subscribe</span>
                </button>
              </div>
              <p className="newsletter__disclaimer">
                By subscribing, you agree to receive marketing communications. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
