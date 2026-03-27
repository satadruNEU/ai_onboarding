import { useState, useEffect, useRef } from 'react';
import {
    BarChart3, Users, ClipboardList, Tag, Zap, TrendingUp, ArrowLeft, Download, FileText,
    ChevronDown, CircleDashed, Settings, Share, Play, MessageSquare, BookOpen,
    Home, FolderOpen, PieChart, GraduationCap, Search, Plus, UserPlus,
    HelpCircle, Bell, Send, ArrowUp, Paperclip, Utensils, ShoppingBag, Rocket, ArrowRight,
    Mail, Pencil, ListChecks, ExternalLink, X, Sparkles,
    Settings2,
    CheckCircle2
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { TEAM_DATA, ACTIVITY_DATA } from '../data/teamData';
import ProfileDropdown from './ProfileDropdown';
import InviteModal from './InviteModal';

// Map group names to lucide icons (same mapping as SplitScreen)
const GROUP_ICONS = {
    'Front of House': Users,
    'Kitchen Staff': ClipboardList,
    'Management': ClipboardList,
    'General Staff': BookOpen,
    'Sales Associates': Users,
    'Stock & Operations': Tag,
    'Cashiers': ClipboardList,
    'Customer Success': Users,
    'Engineering': FileText,
    'Sales': TrendingUp,
    'All Company': BookOpen,
};

function getGroupIcon(name) {
    return GROUP_ICONS[name] || BookOpen;
}

function countUpTo(el, target, suffix, duration) {
    if (!el) return;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current) + suffix;
        if (current >= target) clearInterval(timer);
    }, 16);
}

// Status color map for light mode
const STATUS_COLORS = {
    complete: '#22c55e',
    'on-track': '#3b82f6',
    'at-risk': '#f59e0b',
    'not-started': '#d1d5db'
};

const STATUS_LABELS = {
    complete: 'Completed',
    'on-track': 'On track',
    'at-risk': 'At risk',
    'not-started': 'Not started'
};

const PLACEHOLDER_TEXTS = [
    "We're a 40-person restaurant group with 3 locations. I need to train front-of-house staff on service standards, and kitchen staff on food safety and prep procedures.",
    "I'm launching a new tech startup. We need to onboard our first 10 engineers on our codebase, deployment pipeline, and agile sprint methodology.",
    "We run a boutique retail store. I want to train the sales team on our new point-of-sale system, customer greeting protocols, and daily opening procedures."
];

function LightAnimatedPlaceholder({ visible }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animateIn, setAnimateIn] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        if (!visible) {
            setAnimateIn(false);
            setAnimateOut(false);
            return;
        }
        let id1 = requestAnimationFrame(() => {
            requestAnimationFrame(() => setAnimateIn(true));
        });
        const loopInterval = setInterval(() => {
            setAnimateOut(true);
            setAnimateIn(false);
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

    return (
        <div className="db-nc-placeholder-overlay" aria-hidden="true" style={{ opacity: animateOut ? 0 : 1, transition: 'opacity 0.8s ease' }}>
            <div className="db-nc-placeholder-letters">
                {currentText.split('').map((char, i) => (
                    <span
                        key={`${currentIndex}-${i}`}
                        className="db-nc-placeholder-char"
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

function DashboardNewChat({ scenario, onStart, onFillExample }) {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    const handleStart = () => onStart(inputValue);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleStart(); }
    };

    const showPlaceholder = inputValue.length === 0;

    return (
        <div className="db-new-chat">
            <div className="db-nc-content">
                <h1
                    className="db-nc-headline animate-fade-rise"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                    Hey Satadru, What would you like to train your team on?<br />
                    {/* <em className="db-nc-headline-em">playbook.</em> */}
                </h1>

                {/* <p className="db-nc-sub animate-fade-rise-delay">
                    Tell us about your business and team. We'll generate a complete starter playbook in under 60 seconds.
                </p> */}

                <div className="db-nc-input-wrap animate-fade-rise-delay-2">
                    <textarea
                        className="db-nc-input"
                        ref={inputRef}
                        rows="3"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <LightAnimatedPlaceholder visible={showPlaceholder} />
                    <div className="db-nc-toolbar">
                        <button className="db-nc-toolbar-btn" title="Attach file">
                            <Paperclip size={12} strokeWidth={2} />
                            <span className="db-nc-toolbar-label">Attach</span>
                        </button>
                        <button className="db-nc-toolbar-btn" onClick={handleStart} title="Continue">
                            <ArrowUp size={12} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* <div className="db-nc-chips animate-fade-rise-delay-2">
                    Try an example:
                    <span className="db-nc-chip" onClick={() => onFillExample('restaurant')}>🍽️ Restaurant</span>
                    <span className="db-nc-chip" onClick={() => onFillExample('retail')}>🛍️ Retail store</span>
                    <span className="db-nc-chip" onClick={() => onFillExample('startup')}>🚀 Tech startup</span>
                </div> */}

                {/* Templates section */}
                <div className="db-nc-templates animate-fade-rise-delay-2">
                    <div className="db-nc-templates-header">
                        <h3 className="db-nc-templates-title">Start with a template</h3>
                        <span className="db-nc-templates-sub">Pre-built playbooks to get you started faster</span>
                    </div>
                    <div className="db-nc-templates-grid">
                        {[
                            {
                                icon: Utensils,
                                color: '#f97316',
                                bg: '#fff7ed',
                                title: 'Restaurant Onboarding',
                                desc: 'FOH service standards, kitchen safety, opening & closing checklists.',
                                tags: ['5 subjects', '18 steps', 'Quiz included'],
                            },
                            {
                                icon: ShoppingBag,
                                color: '#8b5cf6',
                                bg: '#f5f3ff',
                                title: 'Retail Store Training',
                                desc: 'POS systems, customer service, inventory management, and visual merchandising.',
                                tags: ['4 subjects', '14 steps', 'Quiz included'],
                            },
                            {
                                icon: Rocket,
                                color: '#0ea5e9',
                                bg: '#f0f9ff',
                                title: 'Tech Startup Playbook',
                                desc: 'Engineering onboarding, deployment pipeline, agile practices, and code review.',
                                tags: ['4 subjects', '16 steps', 'Quiz included'],
                            },
                        ].map((tmpl, i) => {
                            const IconComp = tmpl.icon;
                            return (
                                <div className="db-nc-template-card" key={i} onClick={() => onFillExample(['restaurant', 'retail', 'startup'][i])}>
                                    <div className="db-nc-template-icon" style={{ background: tmpl.bg, color: tmpl.color }}>
                                        <IconComp size={20} strokeWidth={1.5} />
                                    </div>
                                    <div className="db-nc-template-info">
                                        <div className="db-nc-template-name">{tmpl.title}</div>
                                        <div className="db-nc-template-desc">{tmpl.desc}</div>
                                        <div className="db-nc-template-tags">
                                            {tmpl.tags.map((t, ti) => (
                                                <span className="db-nc-template-tag" key={ti}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="db-nc-template-arrow">
                                        <ArrowRight size={14} strokeWidth={2} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mock recent chats for the right sidebar
const RECENT_CHATS = [
    { id: 1, title: 'Generate onboarding flow', time: '2m ago', preview: 'I\'ll create a structured playbook...' },
    { id: 2, title: 'Add kitchen safety section', time: '15m ago', preview: 'Done! Added Food Safety & Hygiene...' },
    { id: 3, title: 'Customize training groups', time: '1h ago', preview: 'I\'ve reorganized into 4 groups...' },
];

export default function DashboardScreen({ active, scenario, onBack, onStart, onFillExample, onSignOut }) {
    const mainRef = useRef(null);
    const [showNewChat, setShowNewChat] = useState(false);
    const [showNextSteps, setShowNextSteps] = useState(true);
    const [nextStepsStage, setNextStepsStage] = useState('hidden'); // hidden | expanding | visible
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isExiting, setIsExiting] = useState(false); // Added for screen transition

    const scenarioKey = scenario ? Object.keys(SCENARIOS).find(k => SCENARIOS[k] === scenario) || 'restaurant' : 'restaurant';
    const team = TEAM_DATA[scenarioKey] || TEAM_DATA.restaurant;
    const activity = ACTIVITY_DATA[scenarioKey] || ACTIVITY_DATA.restaurant;

    const total = team.length;
    const completed = team.filter(m => m.status === 'complete').length;
    const onTrack = team.filter(m => m.status === 'on-track').length;
    const atRisk = team.filter(m => m.status === 'at-risk').length;
    const avgPct = Math.round(team.reduce((s, m) => s + m.pct, 0) / total);

    const groupPcts = [72, 55, 88, 30];

    const handleInviteSuccess = (count, groupName) => {
        setToastMessage(`Successfully invited ${count} employee${count === 1 ? '' : 's'} to ${groupName}.`);
        setTimeout(() => setToastMessage(''), 4000); // Auto-dismiss
    };

    useEffect(() => {
        if (!active || showNewChat) return;
        // Small delay to let DOM mount before querying elements
        const timer = setTimeout(() => {
            // Animate stat tiles
            document.querySelectorAll('.db-stat-tile').forEach((el, i) => {
                setTimeout(() => { el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 80);
            });
            // Count up
            const targets = { 'db-stat-avg': [avgPct, '%'], 'db-stat-done': [completed, ''], 'db-stat-track': [onTrack, ''], 'db-stat-risk': [atRisk, ''] };
            Object.entries(targets).forEach(([id, [val, suf]], i) => {
                setTimeout(() => { const el = document.querySelector('#' + id + ' .db-stat-num'); countUpTo(el, val, suf, 800); }, 200 + i * 80);
            });
            // Sequence for next steps banner expansion
            if (showNextSteps && nextStepsStage === 'hidden') {
                const t1 = setTimeout(() => setNextStepsStage('expanding'), 3000);
                const t2 = setTimeout(() => setNextStepsStage('visible'), 3600); // after height transition
                // Store timeout IDs on the ref if we needed to clear them on complex unmounts
            }

            // List items
            const listItems = mainRef.current?.querySelectorAll('.db-card-list > *');
            if (listItems) {
                listItems.forEach((el, i) => {
                    el.style.animation = 'none';
                    el.offsetHeight;
                    el.style.animation = `fade-rise 0.4s ease forwards ${0.3 + (i * 0.05)}s`;
                });
            }
            // Cards
            document.querySelectorAll('.db-card').forEach((el, i) => {
                setTimeout(() => { el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 300 + i * 100);
            });
            // Team rows
            setTimeout(() => {
                document.querySelectorAll('.db-team-row').forEach((el, i) => {
                    setTimeout(() => { el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, background 0.15s'; el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, i * 60);
                });
                setTimeout(() => {
                    document.querySelectorAll('.db-progress-fill').forEach(bar => { if (bar) bar.style.width = bar.dataset.pct + '%'; });
                }, 300);
            }, 400);
            // Group bars
            setTimeout(() => {
                document.querySelectorAll('.db-group-row').forEach((el, i) => {
                    setTimeout(() => {
                        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)';
                        setTimeout(() => { const fill = el.querySelector('.db-group-fill'); if (fill) fill.style.width = fill.dataset.pct + '%'; }, 200);
                    }, i * 80);
                });
            }, 500);
            // Activity
            setTimeout(() => {
                document.querySelectorAll('.db-activity-item').forEach((el, i) => {
                    setTimeout(() => { el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, i * 70);
                });
            }, 600);
            // Donut
            setTimeout(() => {
                const fill = document.getElementById('db-donut-fill');
                const pctEl = document.getElementById('db-donut-pct');
                if (fill && pctEl) {
                    fill.style.strokeDashoffset = 220 - (220 * avgPct / 100);
                    countUpTo(pctEl, avgPct, '%', 1000);
                }
            }, 500);
            // Right sidebar
            setTimeout(() => {
                document.querySelectorAll('.db-sidebar-item').forEach((el, i) => {
                    setTimeout(() => { el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 80);
                });
            }, 300);
        }, 100);
    }, [active, showNewChat, avgPct, completed, onTrack, atRisk]);

    if (!scenario && !isExiting) return null;

    return (
        <div className={`db-screen ${active ? 'sv2-screen-enter' : ''}`}>
            {/* Shared light-mode nav bar */}
            <nav className="context-nav">
                <div className="context-nav-left">
                    <div className="context-nav-logo" style={{ fontFamily: "'Instrument Serif', serif" }}>
                        Onboardly<sup className="context-nav-sup">®</sup>
                    </div>
                    <span className="context-nav-slash">/</span>
                    <button className="context-nav-item">
                        <div className="context-nav-workspace-icon">
                        </div>
                        <span className="hidden sm:inline">Satadru's Workspace</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <div className="context-nav-center hidden md:flex" style={{ width: '100%', maxWidth: '480px' }}>
                    <div className="db-nav-search">
                        <Search size={14} strokeWidth={2} className="db-nav-search-icon" />
                        <input
                            type="text"
                            className="db-nav-search-input"
                            placeholder="Search subjects, people, or settings..."
                        />
                        <kbd className="db-nav-search-kbd">⌘K</kbd>
                    </div>
                </div>

                <div className="context-nav-right">
                    <button className="context-nav-btn" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '0 8px' }}>
                        <HelpCircle size={16} strokeWidth={2} className="text-gray-500" />
                    </button>
                    <button className="context-nav-btn" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '0 8px' }}>
                        <Bell size={16} strokeWidth={2} className="text-gray-500" />
                    </button>
                    <ProfileDropdown onSignOut={onSignOut} />
                </div>
            </nav>

            <div className="db-body">
                {/* Left sidebar */}
                <aside className="db-sidebar">
                    {/* Nav links */}
                    <div className="db-sidebar-nav">
                        <button className={`db-sidebar-nav-item ${!showNewChat ? 'active' : ''}`} onClick={() => setShowNewChat(false)}>
                            <Home size={16} strokeWidth={1.8} />
                            Home
                        </button>
                        <button className="db-sidebar-nav-item">
                            <Users size={16} strokeWidth={1.8} />
                            People
                        </button>
                        <button className="db-sidebar-nav-item">
                            <FolderOpen size={16} strokeWidth={1.8} />
                            Templates
                        </button>
                        <button className="db-sidebar-nav-item">
                            <GraduationCap size={16} strokeWidth={1.8} />
                            Training
                        </button>
                        <button className="db-sidebar-nav-item">
                            <PieChart size={16} strokeWidth={1.8} />
                            Reports
                        </button>
                        <button className="db-sidebar-nav-item">
                            <Settings size={16} strokeWidth={1.8} />
                            Settings
                        </button>
                    </div>



                    {/* New chat button */}
                    <button className="db-sidebar-new-chat" onClick={() => setShowNewChat(true)}>
                        <Plus size={14} strokeWidth={2} />
                        New chat
                    </button>

                    {/* Recent chats */}
                    <div className="db-sidebar-section">
                        <div className="db-sidebar-heading">
                            <MessageSquare size={14} strokeWidth={2} />
                            Recent chats
                        </div>
                        {RECENT_CHATS.map(chat => (
                            <div className="db-sidebar-item" key={chat.id}>
                                <div className="db-sidebar-item-title">{chat.title}</div>
                                <div className="db-sidebar-item-preview">{chat.preview}</div>
                                <div className="db-sidebar-item-time">{chat.time}</div>
                            </div>
                        ))}
                    </div>

                    {/* Current playbook */}
                    <div className="db-sidebar-section">
                        <div className="db-sidebar-heading">
                            <BookOpen size={14} strokeWidth={2} />
                            Playbook
                        </div>
                        <div className="db-sidebar-item db-sidebar-playbook" onClick={onBack}>
                            <div className="db-sidebar-playbook-icon">
                                <FileText size={16} strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="db-sidebar-item-title">{scenario.bizName}</div>
                                <div className="db-sidebar-item-preview">{scenario.bizDesc}</div>
                            </div>
                        </div>
                        {scenario.groups.map((g, i) => {
                            const IconComp = getGroupIcon(g.name);
                            return (
                                <div className="db-sidebar-item db-sidebar-group" key={i} onClick={onBack}>
                                    <IconComp size={14} strokeWidth={1.5} />
                                    <span>{g.name}</span>
                                    <span className="db-sidebar-group-count">{g.count}</span>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Main scrollable content */}
                <div className="db-main" ref={mainRef}>
                    {showNewChat ? (
                        <DashboardNewChat
                            scenario={scenario}
                            onStart={onStart}
                            onFillExample={onFillExample}
                        />
                    ) : (
                        <>
                            {/* Suggested Next Steps */}
                            {showNextSteps && (
                                <div className={`db-next-steps-wrapper ${nextStepsStage}`}>
                                    <div className="db-next-steps">
                                        <div className="db-next-steps-header">
                                        <div className="db-next-steps-title-row">
                                            <Sparkles size={16} strokeWidth={2} className="db-next-steps-icon" />
                                            <h2 className="db-next-steps-title">Suggested next steps</h2>
                                        </div>
                                        <p className="db-next-steps-sub">Your playbook is published! Here's what we recommend doing next.</p>
                                        <button className="db-next-steps-dismiss" onClick={() => setShowNextSteps(false)} title="Dismiss">
                                            <X size={14} strokeWidth={2} />
                                        </button>
                                    </div>
                                    <div className="db-next-steps-grid">
                                        {[
                                            {
                                                icon: Mail,
                                                color: '#3b82f6',
                                                bg: '#eff6ff',
                                                title: 'Invite employees',
                                                desc: 'Send invites to your team so they can start training right away.',
                                                cta: 'Send invites',
                                                onClick: () => setShowInviteModal(true)
                                            },
                                            {
                                                icon: Pencil,
                                                color: '#8b5cf6',
                                                bg: '#f5f3ff',
                                                title: 'Customize content',
                                                desc: 'Edit subjects, add images, or refine the AI-generated copy.',
                                                cta: 'Edit playbook',
                                            },
                                            {
                                                icon: ListChecks,
                                                color: '#f97316',
                                                bg: '#fff7ed',
                                                title: 'Set up quizzes',
                                                desc: 'Add knowledge checks to validate understanding after each section.',
                                                cta: 'Add quiz',
                                            },
                                            {
                                                icon: ExternalLink,
                                                color: '#10b981',
                                                bg: '#ecfdf5',
                                                title: 'Share playbook',
                                                desc: 'Generate a shareable link or embed it in your company wiki.',
                                                cta: 'Get link',
                                            },
                                        ].map((step, i) => {
                                            const StepIcon = step.icon;
                                            return (
                                                <div className="db-next-step-card" key={i}>
                                                    <div className="db-next-step-icon" style={{ background: step.bg, color: step.color }}>
                                                        <StepIcon size={18} strokeWidth={1.5} />
                                                    </div>
                                                    <div className="db-next-step-name">{step.title}</div>
                                                    <div className="db-next-step-desc">{step.desc}</div>
                                                    <button className="db-next-step-cta" style={{ color: step.color }} onClick={step.onClick}>
                                                        {step.cta}
                                                        <ArrowRight size={12} strokeWidth={2} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                </div>
                            )}

                            {/* Main header block */}
                            <div className="db-header">
                                <div className="db-title-wrap">
                                    <p className="db-eyebrow">Training progress</p>
                                    <h1 className="db-title" style={{ fontFamily: "'Instrument Serif', serif" }}>
                                        {scenario.bizName.replace(' Playbook', '')}
                                    </h1>
                                    <p className="db-subtitle">{total} team members · Updated live</p>
                                </div>
                                <div className="db-header-actions">
                                    {/* <div className="db-live-badge">
                                        <div className="db-live-dot"></div>
                                        Live
                                    </div> */}
                                    {!showNextSteps && (
                                        <button className="db-btn" onClick={() => { setShowNextSteps(true); setNextStepsStage('visible'); }}>
                                            <Sparkles size={14} strokeWidth={2} />
                                            Show tips
                                        </button>
                                    )}
                                    <button className="db-btn">
                                        <Download size={14} strokeWidth={2} />
                                        Export
                                    </button>
                                    <button className="db-btn" style={{ background: '#111827', color: '#fff', borderColor: '#111827' }} onClick={() => setShowInviteModal(true)}>
                                        <UserPlus size={14} strokeWidth={2} />
                                        Invite employees
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="db-stats">
                                {[
                                    { id: 'db-stat-avg', label: 'Avg completion', sub: 'across all members', cls: 'highlight', trend: '↑ +12%', trendCls: 'trend-up', icon: TrendingUp },
                                    { id: 'db-stat-done', label: 'Completed', sub: `of ${total} members`, cls: 'success', trend: `↑ ${completed}`, trendCls: 'trend-up', icon: Users },
                                    { id: 'db-stat-track', label: 'On track', sub: 'progressing normally', cls: '', icon: BarChart3 },
                                    { id: 'db-stat-risk', label: 'Need attention', sub: 'behind or not started', cls: '', trend: atRisk > 0 ? `⚠ ${atRisk}` : '', trendCls: 'trend-warn', icon: Zap },
                                ].map(t => {
                                    const IconComp = t.icon;
                                    return (
                                        <div className={`db-stat-tile ${t.cls}`} id={t.id} key={t.id}>
                                            <div className="db-stat-header">
                                                <div className="db-stat-icon-wrap">
                                                    <IconComp size={14} strokeWidth={2} />
                                                </div>
                                                <span className="db-stat-label">{t.label}</span>
                                                {t.trend && <span className={`db-stat-trend ${t.trendCls}`}>{t.trend}</span>}
                                            </div>
                                            <div className="db-stat-num">0</div>
                                            <div className="db-stat-sub">{t.sub}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Two col */}
                            <div className="db-two-col">
                                <div className="db-card">
                                    <div className="db-card-header">
                                        <div className="db-card-title">
                                            <Users size={14} strokeWidth={2} />
                                            Team members
                                            <span className="db-card-count">{total}</span>
                                        </div>
                                        <button className="db-card-action" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Send size={12} strokeWidth={2} />
                                            Send reminder
                                        </button>
                                    </div>
                                    {team.map((m, i) => (
                                        <div className="db-team-row" key={i}>
                                            <div className="db-team-avatar" style={{ background: `${m.color}15`, color: m.color, borderColor: `${m.color}30` }}>{m.initials}</div>
                                            <div className="db-team-info">
                                                <div className="db-team-name">{m.name}</div>
                                                <div className="db-team-role">{m.role}</div>
                                            </div>
                                            <div className="db-team-progress">
                                                <div className="db-progress-bar">
                                                    <div className="db-progress-fill" data-pct={m.pct} style={{ background: STATUS_COLORS[m.status] }}></div>
                                                </div>
                                                <div className="db-team-pct">{m.pct}%</div>
                                                <div className="db-team-status" style={{ background: `${STATUS_COLORS[m.status]}15`, color: STATUS_COLORS[m.status] }}>
                                                    {STATUS_LABELS[m.status]}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {/* Donut */}
                                    <div className="db-card">
                                        <div className="db-card-header">
                                            <div className="db-card-title">
                                                <TrendingUp size={14} strokeWidth={2} />
                                                Overall completion
                                            </div>
                                        </div>
                                        <div className="db-donut-wrap" style={{ position: 'relative' }}>
                                            <svg className="db-donut-svg" width="120" height="120" viewBox="0 0 120 120">
                                                <circle className="db-donut-track" cx="60" cy="60" r="35" />
                                                <circle className="db-donut-fill" id="db-donut-fill" cx="60" cy="60" r="35" stroke={completed > 0 ? '#22c55e' : '#e5e7eb'} />
                                            </svg>
                                            <div className="db-donut-center">
                                                <div className="db-donut-pct" id="db-donut-pct">0%</div>
                                                <div className="db-donut-label">complete</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Group bars */}
                                    <div className="db-card">
                                        <div className="db-card-header">
                                            <div className="db-card-title">
                                                <Tag size={14} strokeWidth={2} />
                                                By group
                                            </div>
                                        </div>
                                        {scenario.groups.map((g, i) => {
                                            const pct = groupPcts[i] || 50;
                                            const IconComp = getGroupIcon(g.name);
                                            return (
                                                <div className="db-group-row" key={i}>
                                                    <div className="db-group-top">
                                                        <div className="db-group-name">
                                                            <IconComp size={14} strokeWidth={1.5} />
                                                            {g.name}
                                                        </div>
                                                        <div className="db-group-pct">{pct}%</div>
                                                    </div>
                                                    <div className="db-group-track">
                                                        <div className="db-group-fill" data-pct={pct} style={{ background: g.color === '#e8e8e8' ? '#6b7280' : g.color }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>


                        </>
                    )}
                </div>
            </div>

            {/* Modals & Toasts */}
            <InviteModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                groups={scenario?.groups}
                onSend={handleInviteSuccess}
            />

            {toastMessage && (
                <div className="db-toast animate-dd-in">
                    <CheckCircle2 size={16} strokeWidth={2} className="text-green-500" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
