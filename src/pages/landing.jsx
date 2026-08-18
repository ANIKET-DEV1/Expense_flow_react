import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Tag,
  HandCoins,
  BarChart3,
  Lock,
  Smartphone,
  ChevronDown,
  Shield,
  EyeOff,
  Server,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/authcontext';
import Cursor from '../components/Cursor';
import { AppLogo } from '../components/Logo';
import Preloader from '../components/Preloader';

const FAQS = [
  {
    q: 'Is my financial data secure?',
    a: 'Yes. Your data is stored on a private server and accessible only through your authenticated session. We use secure HTTP-only cookies so your session token is never exposed to JavaScript or third-party scripts.',
  },
  {
    q: 'How do I add an expense?',
    a: "After logging in, go to Expenses and click 'Add Expense'. Fill in the amount, pick a tag, choose the payment type (Cash, UPI, or Card), and set the date. That's it — takes under 10 seconds.",
  },
  {
    q: 'What are tags, and do I need them?',
    a: "Tags are categories you create yourself — like 'Groceries', 'Rent', or 'Petrol'. Every expense needs one tag. You can create unlimited tags for free in the Tags section.",
  },
  {
    q: 'Can I track money I owe or money owed to me?',
    a: "Yes — that's what Settlements are for. Add a record with the person's name, amount, and direction. Mark it paid when done. You can edit amounts and statuses anytime.",
  },
  {
    q: 'Can I see my spending month by month?',
    a: "Yes. On the Dashboard and Expenses page, you can see analytics and expenses grouped by month with totals. You can also view per-category breakdown graphs.",
  },
  {
    q: 'Is this free to use?',
    a: 'Yes, completely free. No subscription, no credit card required. Register and start using it.',
  },
];

const Landing = () => {
  const { user } = useAuth();
  const [showPreloader, setShowPreloader] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
      {showPreloader && <Preloader onFinish={() => setShowPreloader(false)} />}
      <Cursor />

      {/* ─── NAV ─────────────────────────────────────── */}
      <nav className={`land-nav${scrolled ? ' scrolled' : ''}`} id="landNav">
        <AppLogo size={32} iconSize={17} />

        <div className="land-nav-menu">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="land-nav-links">
          {user ? (
            <Link to="/dashboard" className="primary">
              Go to Dashboard <ArrowRight size={13} style={{ display: 'inline', marginLeft: 4 }} />
            </Link>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register" className="primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="hero">
        {/* Left Copy */}
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="dot" />
            Stateless Finance Architecture
          </div>
          <h1>
            Take Back Control of Your <em>Expense Flow</em>
          </h1>
          <p className="hero-sub">
            A premium personal finance tracker built for clarity. Log expenses, settle debts, and organise spending by custom tags — beautifully.
          </p>
          <div className="hero-cta">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="btn btn-primary"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '13px 28px',
              }}
            >
              {user ? 'Open Dashboard' : 'Establish Stream'}
              <ArrowRight size={15} />
            </Link>
            <a
              href="#features"
              className="btn btn-ghost"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '13px 24px',
              }}
            >
              Explore Features
            </a>
          </div>

          {/* Stats row */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-val">100<span>%</span></div>
              <div className="hero-stat-lbl">Private &amp; Secure</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-val">∞<span> Tags</span></div>
              <div className="hero-stat-lbl">Custom Categories</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-val">0<span>ms</span></div>
              <div className="hero-stat-lbl">Load Latency</div>
            </div>
          </div>
        </div>

        {/* Right / Mock UI card */}
        <div className="hero-right">
          <div className="hero-card" style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
            {/* Window chrome */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5c5c', opacity: 0.8 }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', opacity: 0.8 }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', opacity: 0.8 }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                Secure Gateway
              </div>
            </div>

            {/* KPI grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: 'rgba(61,220,132,0.06)', border: '1px solid rgba(61,220,132,0.14)', borderRadius: 9, padding: 14 }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                  Income
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.18rem', fontWeight: 700, color: 'var(--green)' }}>
                  ₹34,200
                </div>
              </div>
              <div style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.14)', borderRadius: 9, padding: 14 }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                  Expenses
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.18rem', fontWeight: 700, color: 'var(--red)' }}>
                  ₹18,455
                </div>
              </div>
            </div>

            {/* Progress bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-muted)' }}>
                    <Tag size={12} color="var(--gold)" />
                    SaaS Subscription
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>₹8,900</span>
                </div>
                <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '62%', background: 'linear-gradient(90deg,var(--gold),rgba(212,162,76,0.4))' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-muted)' }}>
                    <Tag size={12} color="var(--gold)" />
                    Cloud Infrastructure
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>₹12,450</span>
                </div>
                <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '80%', background: 'linear-gradient(90deg,var(--gold),rgba(212,162,76,0.4))' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-muted)' }}>
                    <CreditCard size={12} color="var(--green)" />
                    Settlement Pending
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--green)' }}>₹3,200</span>
                </div>
                <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '38%', background: 'linear-gradient(90deg,var(--green),rgba(61,220,132,0.3))' }} />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="float-badge"
              style={{
                position: 'absolute',
                bottom: -14,
                left: -18,
                background: 'rgba(15,20,32,0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(212,162,76,0.25)',
                borderRadius: 20,
                padding: '7px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              }}
            >
              <TrendingUp size={12} color="var(--green)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text)' }}>
                +14.2% efficiency
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── FEATURES ──────────────────────────────────── */}
      <section className="features" id="features">
        <div className="features-head">
          <div className="eyebrow">Core Features</div>
          <h2>Everything you need,<br />nothing you don't</h2>
          <p>Simple, powerful tools that give you real clarity on where your money goes.</p>
        </div>
        <div className="feat-grid">
          <div className="feat-card">
            <div className="feat-icon-wrap">
              <CreditCard size={22} />
            </div>
            <h3>Expense Tracking</h3>
            <p>Log any expense in seconds. Categorize by tag and payment type — cash, UPI, or card.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon-wrap">
              <Tag size={22} />
            </div>
            <h3>Custom Tags</h3>
            <p>Create your own tags — food, travel, EMI, anything. Group your spending your way.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon-wrap">
              <HandCoins size={22} />
            </div>
            <h3>Settlements</h3>
            <p>Track who owes you and who you owe. Mark debts paid instantly when settled.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon-wrap">
              <BarChart3 size={22} />
            </div>
            <h3>Smart Views</h3>
            <p>See spending grouped by tag or month. Spot patterns and outliers at a glance.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon-wrap">
              <Lock size={22} />
            </div>
            <h3>Private by Default</h3>
            <p>Your data stays yours. Secure HTTP-only session cookies, zero third-party trackers.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon-wrap">
              <Smartphone size={22} />
            </div>
            <h3>Works Everywhere</h3>
            <p>Fully responsive. Use it on your phone, tablet, or desktop with the same great experience.</p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── SECURITY SECTION ──────────────────────────── */}
      <section id="security" style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: 1,
            background: 'var(--hairline)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--r)',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: 'var(--surface)', padding: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>
              Security
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
              HTTP-only Cookies
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Session tokens are stored in server-side HTTP-only cookies — invisible to JavaScript and third-party scripts.
            </div>
          </div>
          <div style={{ background: 'var(--surface)', padding: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>
              Privacy
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
              No Third-party Tracking
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Zero analytics scripts, no ad pixels. Your financial activity is completely private and never sold.
            </div>
          </div>
          <div style={{ background: 'var(--surface)', padding: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>
              Auth
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
              CORS-secured API
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Backend enforces strict CORS origin rules. Only your authenticated browser session can access your data.
            </div>
          </div>
          <div style={{ background: 'var(--surface)', padding: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>
              Reliability
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
              Server-persisted Data
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Your expenses are stored securely on the server — no data loss from clearing browser cache or switching devices.
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── FAQ ───────────────────────────────────────── */}
      <section className="faq-section" id="faq">
        <h2>Frequently asked questions</h2>
        <p className="faq-sub">Everything you need to know before you start.</p>

        {FAQS.map((faq, i) => (
          <div key={faq.q} className="faq-item">
            <div className={`faq-q${openFaq === i ? ' open' : ''}`} onClick={() => toggleFaq(i)}>
              {faq.q}
              <span className="arrow">
                <ChevronDown size={16} />
              </span>
            </div>
            <div className={`faq-a${openFaq === i ? ' open' : ''}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--hairline)',
          padding: '36px 44px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <AppLogo size={26} iconSize={14} />
        <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
          © {new Date().getFullYear()} ExpenseFlow — Your money, your data.
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
          Crafted by{' '}
          <a
            href="https://awsmx.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gold)', fontWeight: 600, transition: 'color var(--t)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e8b966')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gold)')}
          >
            AWSMX
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;