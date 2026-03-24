import { useEffect, useRef } from 'react';
import {
    BarChart3, Users, ClipboardList, Tag, Zap, TrendingUp, ArrowLeft, Download, FileText,
    ChevronDown, CircleDashed, Settings, Share, Play, MessageSquare, BookOpen
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { TEAM_DATA, ACTIVITY_DATA } from '../data/teamData';

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

// Mock recent chats for the right sidebar
const RECENT_CHATS = [
    { id: 1, title: 'Generate onboarding flow', time: '2m ago', preview: 'I\'ll create a structured playbook...' },
    { id: 2, title: 'Add kitchen safety section', time: '15m ago', preview: 'Done! Added Food Safety & Hygiene...' },
    { id: 3, title: 'Customize training groups', time: '1h ago', preview: 'I\'ve reorganized into 4 groups...' },
];

export default function DashboardScreen({ active, scenario, onBack }) {
    const mainRef = useRef(null);
    const animated = useRef(false);

    const scenarioKey = scenario ? Object.keys(SCENARIOS).find(k => SCENARIOS[k] === scenario) || 'restaurant' : 'restaurant';
    const team = TEAM_DATA[scenarioKey] || TEAM_DATA.restaurant;
    const activity = ACTIVITY_DATA[scenarioKey] || ACTIVITY_DATA.restaurant;

    const total = team.length;
    const completed = team.filter(m => m.status === 'complete').length;
    const onTrack = team.filter(m => m.status === 'on-track').length;
    const atRisk = team.filter(m => m.status === 'at-risk').length;
    const avgPct = Math.round(team.reduce((s, m) => s + m.pct, 0) / total);

    const groupPcts = [72, 55, 88, 30];

    useEffect(() => {
        if (!active || animated.current) return;
        animated.current = true;
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
    }, [active, avgPct, completed, onTrack, atRisk]);

    if (!scenario) return null;

    return (
        <div className={`db-screen ${active ? 'sv2-screen-enter' : ''}`}>
            {/* Shared light-mode nav bar */}
            <nav className="context-nav">
                <div className="context-nav-left">
                    <div className="context-nav-logo" style={{ fontFamily: "'Instrument Serif', serif" }}>
                        Trainual<sup className="context-nav-sup">®</sup>
                    </div>
                    <span className="context-nav-slash">/</span>
                    <button className="context-nav-item">
                        <div className="context-nav-workspace-icon">
                        </div>
                        <span className="hidden sm:inline">Satadru's Workspace</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <div className="context-nav-center hidden md:flex">
                    <button className="context-nav-item context-nav-item-muted">
                        <BarChart3 size={14} />
                        Progress
                    </button>
                    <span className="context-nav-slash" style={{ fontSize: '0.9rem', margin: '0 2px' }}>/</span>
                    <button className="context-nav-item">
                        <FileText size={14} />
                        {scenario.bizName}
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <div className="context-nav-right">
                    <button className="context-nav-btn hidden sm:flex">
                        <Settings size={14} />
                        <span className="hidden lg:inline">Settings</span>
                    </button>
                    <button className="context-nav-btn hidden sm:flex">
                        <Share size={14} />
                        <span className="hidden lg:inline">Share</span>
                    </button>
                    <button className="context-nav-btn context-nav-publish">
                        <Play size={12} fill="currentColor" />
                        <span className="hidden sm:inline">Publish</span>
                    </button>
                    <div className="context-nav-avatar-btn" title="Your Profile">
                    </div>
                </div>
            </nav>

            <div className="db-body">
                {/* Main scrollable content */}
                <div className="db-main" ref={mainRef}>
                    {/* Header */}
                    <div className="db-header">
                        <div className="db-title-wrap">
                            <p className="db-eyebrow">Training progress</p>
                            <h1 className="db-title" style={{ fontFamily: "'Instrument Serif', serif" }}>
                                {scenario.bizName.replace(' Playbook', '')}
                            </h1>
                            <p className="db-subtitle">{total} team members · Updated live</p>
                        </div>
                        <div className="db-header-actions">
                            <div className="db-live-badge">
                                <div className="db-live-dot"></div>
                                Live
                            </div>
                            <button className="db-btn">
                                <Download size={14} strokeWidth={2} />
                                Export
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
                                <button className="db-card-action">Send reminder</button>
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

                    {/* Activity */}
                    <div className="db-card">
                        <div className="db-card-header">
                            <div className="db-card-title">
                                <Zap size={14} strokeWidth={2} />
                                Recent activity
                            </div>
                            <button className="db-card-action">View all</button>
                        </div>
                        {activity.map((a, i) => (
                            <div className="db-activity-item" key={i}>
                                <div className="db-activity-dot" style={{ background: a.color === '#e8e8e8' ? '#6b7280' : a.color }}></div>
                                <div className="db-activity-text" dangerouslySetInnerHTML={{ __html: a.text }}></div>
                                <div className="db-activity-time">{a.time}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right sidebar */}
                <aside className="db-sidebar">
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
            </div>
        </div>
    );
}
