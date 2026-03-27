import { useState, useEffect } from 'react';
import logo1 from '../assets/logos/logo1.png';
import logo2 from '../assets/logos/logo2.png';
import logo3 from '../assets/logos/logo3.png';
import logo4 from '../assets/logos/logo4.png';
import logo5 from '../assets/logos/logo5.png';

const TRUST_QUOTES = [
    {
        text: "Onboardly cut our onboarding time by 50%. It's the single best investment we've made for our growing team.",
        author: "Sarah K.",
        role: "Operations Lead",
        company: "BrightPath Co."
    },
    {
        text: "We went from 3-week onboarding to 4 days. Every new hire hits the ground running now.",
        author: "Marcus T.",
        role: "Head of People",
        company: "Relay Commerce"
    },
    {
        text: "Finally, one source of truth for how we do things. Our team actually reads it because it's so well organized.",
        author: "Priya D.",
        role: "CEO & Founder",
        company: "Nomad Studio"
    },
    {
        text: "I used to spend my entire first week answering the same questions. Now Onboardly does it for me.",
        author: "James L.",
        role: "Engineering Manager",
        company: "StackForge"
    }
];



const TRUST_LOGOS = [
    { name: 'Shopify', src: logo1, height: 18 },
    { name: 'Slack', src: logo2, height: 48 },
    { name: 'Stripe', src: logo3, height: 20 },
    { name: 'HubSpot', src: logo4, height: 44 },
    { name: 'Notion', src: logo5, height: 26 }
];

export default function AuthScreen({ active, onAuth }) {
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [quoteFading, setQuoteFading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    // Rotate quotes every 5 seconds
    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => {
            setQuoteFading(true);
            setTimeout(() => {
                setQuoteIndex(prev => (prev + 1) % TRUST_QUOTES.length);
                setQuoteFading(false);
            }, 400);
        }, 5000);
        return () => clearInterval(interval);
    }, [active]);

    if (!active) return null;

    const currentQuote = TRUST_QUOTES[quoteIndex];

    return (
        <div className="auth-screen">
            {/* Navbar */}
            <nav className="auth-nav">
                <div className="auth-nav-inner">
                    <div className="auth-nav-logo" style={{ fontFamily: "'Instrument Serif', serif" }}>
                        Onboardly<sup className="auth-nav-sup">®</sup>
                    </div>
                    <button className="auth-nav-login" onClick={onAuth}>
                        Log in
                    </button>
                </div>
            </nav>

            <div className="auth-content">
                {/* Left Panel — Brand & Trust */}
                <div className="auth-brand-panel">
                    <div className="auth-brand-inner">
                        <div className="auth-brand-badge">Almost there</div>
                        <h1 className="auth-brand-headline" style={{ fontFamily: "'Instrument Serif', serif" }}>
                            Your playbook is<br />
                            <em>almost ready.</em>
                        </h1>
                        <p className="auth-brand-sub">
                            Create a free account to save your AI-generated playbook, invite your team, and start training — all in under 60 seconds.
                        </p>

                        {/* Animated Quote */}
                        <div className="auth-quote-container">
                            <div className={`auth-quote ${quoteFading ? 'fading' : ''}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="auth-quote-icon">
                                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H5C3.756 3 3 3.756 3 5v3c0 1.244.756 2 2 2h2c0 4-2.5 5-5 5v6z" fill="#d1d5db" />
                                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2h-3c-1.244 0-2 .756-2 2v3c0 1.244.756 2 2 2h2c0 4-2.5 5-5 5v6z" fill="#d1d5db" />
                                </svg>
                                <p className="auth-quote-text">{currentQuote.text}</p>
                                <div className="auth-quote-attribution">
                                    <div className="auth-quote-avatar">
                                        {currentQuote.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="auth-quote-author">{currentQuote.author}</div>
                                        <div className="auth-quote-role">{currentQuote.role}, {currentQuote.company}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Quote dots */}
                            <div className="auth-quote-dots">
                                {TRUST_QUOTES.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`auth-quote-dot ${i === quoteIndex ? 'active' : ''}`}
                                        onClick={() => { setQuoteFading(true); setTimeout(() => { setQuoteIndex(i); setQuoteFading(false); }, 300); }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Trust Companies */}
                        <div className="auth-trust-section">
                            <p className="auth-trust-label">Trusted by teams at</p>
                            <div className="auth-trust-logos">
                                {TRUST_LOGOS.map(({ name, src, height }) => (
                                    <span key={name} className="auth-trust-logo" title={name}>
                                        <img src={src} alt={name} style={{ height: `${height}px`, width: 'auto' }} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel — Auth Form */}
                <div className="auth-form-panel">
                    <div className="auth-form-inner">
                        <h2 className="auth-form-title">
                            {isLogin ? 'Welcome back' : 'Create your account'}
                        </h2>
                        <p className="auth-form-subtitle">
                            {isLogin
                                ? 'Log in to access your playbooks and team.'
                                : 'Get started for free. No credit card required.'}
                        </p>

                        {/* Social Buttons */}
                        <div className="auth-social-buttons">
                            <button className="auth-social-btn" onClick={onAuth}>
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>

                            <button className="auth-social-btn auth-social-apple" onClick={onAuth}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                Continue with Apple
                            </button>

                            <button className="auth-social-btn" onClick={onAuth}>
                                <svg width="18" height="18" viewBox="0 0 23 23">
                                    <rect width="11" height="11" fill="#f25022" />
                                    <rect x="12" width="11" height="11" fill="#7fba00" />
                                    <rect y="12" width="11" height="11" fill="#00a4ef" />
                                    <rect x="12" y="12" width="11" height="11" fill="#ffb900" />
                                </svg>
                                Continue with Microsoft
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="auth-divider">
                            <span className="auth-divider-line"></span>
                            <span className="auth-divider-text">or</span>
                            <span className="auth-divider-line"></span>
                        </div>

                        {/* Email Form */}
                        <div className="auth-email-form">
                            <div className="auth-field">
                                <label className="auth-field-label">Email</label>
                                <input
                                    type="email"
                                    className="auth-field-input"
                                    placeholder="name@company.com"
                                />
                            </div>
                            <div className="auth-field">
                                <label className="auth-field-label">Password</label>
                                <input
                                    type="password"
                                    className="auth-field-input"
                                    placeholder="Create a password"
                                />
                            </div>
                            <button className="auth-submit-btn" onClick={onAuth}>
                                {isLogin ? 'Log in' : 'Continue'}
                            </button>
                        </div>

                        {/* Toggle */}
                        <p className="auth-toggle-text">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button className="auth-toggle-link" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>

                        <p className="auth-terms">
                            By continuing, you agree to Onboardly's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
