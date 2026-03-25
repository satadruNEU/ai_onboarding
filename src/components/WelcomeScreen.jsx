import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const PLACEHOLDER_TEXTS = [
    "We're a 40-person restaurant group with 3 locations. I need to train front-of-house staff on service standards, and kitchen staff on food safety and prep procedures.",
    "I'm launching a new tech startup. We need to onboard our first 10 engineers on our codebase, deployment pipeline, and agile sprint methodology.",
    "We run a boutique retail store. I want to train the sales team on our new point-of-sale system, customer greeting protocols, and daily opening procedures."
];

function AnimatedPlaceholder({ visible }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animateIn, setAnimateIn] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        if (!visible) {
            setAnimateIn(false);
            setAnimateOut(false);
            return;
        }

        // 1. Initial trigger to paint hidden state, then start animate in
        let id1 = requestAnimationFrame(() => {
            requestAnimationFrame(() => setAnimateIn(true));
        });

        // 2. Schedule the continuous loop
        // Animate in -> hold for ~8s -> animate out for 1s -> switch text & loop
        const loopInterval = setInterval(() => {
            // Start fading out
            setAnimateOut(true);
            setAnimateIn(false);

            // Wait for fade out to finish (1 second), then switch text and fade back in
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
                setAnimateOut(false);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => setAnimateIn(true));
                });
            }, 1000);
        }, 9000);

        return () => {
            cancelAnimationFrame(id1);
            clearInterval(loopInterval);
        };
    }, [visible]);

    if (!visible) return null;

    const currentText = PLACEHOLDER_TEXTS[currentIndex];

    // When animating out, all characters fade out together faster.
    // When animating in, they stagger.
    return (
        <div className="hero-placeholder-overlay" aria-hidden="true" style={{ opacity: animateOut ? 0 : 1, transition: 'opacity 0.8s ease' }}>
            <div className="hero-placeholder-letters">
                {currentText.split('').map((char, i) => (
                    <span
                        key={`${currentIndex}-${i}`} // Key includes index so React recreates spans on text change
                        className="hero-placeholder-char"
                        style={{
                            transitionDelay: animateOut ? '0ms' : `${i * 15}ms`,
                            opacity: animateIn && !animateOut ? 1 : 0,
                            filter: animateIn && !animateOut ? 'blur(0px)' : 'blur(10px)',
                            transform: animateIn && !animateOut ? 'none' : `translateY(${Math.min(i * 0.15, 10)}px)`,
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function WelcomeScreen({ active, onStart, scenario, onFillExample }) {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    const handleStart = () => onStart(inputValue);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleStart(); }
    };

    // Sync scenario input value when a chip is clicked
    useEffect(() => {
        setInputValue(scenario?.userInput || '');
    }, [scenario]);

    if (!active) return null;

    const showPlaceholder = inputValue.length === 0;

    return (
        <div className="welcome-page">
            {/* Fullscreen video background */}
            <video className="welcome-video-bg" autoPlay loop muted playsInline>
                <source src={VIDEO_SRC} type="video/mp4" />
            </video>

            {/* Navigation */}
            <nav className="welcome-nav">
                <div className="welcome-nav-inner">
                    <div className="welcome-nav-logo" style={{ fontFamily: "'Instrument Serif', serif" }}>
                        Trainual<sup className="welcome-nav-sup">®</sup>
                    </div>
                    <div className="welcome-nav-links">
                        <a className="welcome-nav-link active" href="#">Home</a>
                        <a className="welcome-nav-link" href="#">Templates</a>
                        <a className="welcome-nav-link" href="#">About</a>
                        <a className="welcome-nav-link" href="#">Pricing</a>
                        {/* <a className="welcome-nav-link" href="#">Change Log</a> */}
                    </div>
                    <div className="welcome-nav-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <a href="#" className="welcome-nav-link" style={{ fontWeight: 500 }}>Log in</a>
                        <button style={{
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                        }}>
                            Book a demo
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero section */}
            <section className="welcome-hero">
                <h1
                    className="welcome-hero-h1 animate-fade-rise"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                    Build your company<br />
                    <em className="welcome-hero-em">playbook.</em>
                </h1>

                <p className="welcome-hero-sub animate-fade-rise-delay">
                    Tell us about your business and team. We'll generate a complete starter playbook in under 60 seconds.
                </p>

                <div className="welcome-hero-input-wrap animate-fade-rise-delay-2">
                    <textarea
                        className="welcome-hero-input"
                        ref={inputRef}
                        rows="3"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <AnimatedPlaceholder visible={showPlaceholder} />
                    <div className="hero-input-toolbar">
                        <button className="hero-toolbar-btn" title="Attach file">
                            <Paperclip size={12} strokeWidth={2} />
                            <span className="hero-toolbar-label">Attach</span>
                        </button>
                        <button className="hero-toolbar-btn" onClick={handleStart} title="Continue">
                            <ArrowUp size={12} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                <div className="welcome-hero-chips">
                    <span className="animate-fade-rise" style={{ animationDelay: '0.8s', display: 'inline-block' }}>Try an example:</span>
                    <span className="welcome-chip animate-fade-rise" style={{ animationDelay: '0.9s' }} onClick={() => onFillExample('restaurant')}>🍽️ Restaurant</span>
                    <span className="welcome-chip animate-fade-rise" style={{ animationDelay: '1.0s' }} onClick={() => onFillExample('retail')}>🛍️ Retail store</span>
                    <span className="welcome-chip animate-fade-rise" style={{ animationDelay: '1.1s' }} onClick={() => onFillExample('startup')}>🚀 Tech startup</span>
                </div>
            </section>
        </div>
    );
}
