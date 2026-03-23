import { useEffect, useRef } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { TEAM_DATA, ACTIVITY_DATA } from '../data/teamData';

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

    const statusColors = { complete: '#4ade80', 'on-track': '#e8e8e8', 'at-risk': '#f59e0b', 'not-started': '#5a5a6e' };
    const groupPcts = [72, 55, 88, 30];

    useEffect(() => {
        if (!active || animated.current) return;
        animated.current = true;
        const timer = setTimeout(() => {
            // Animate stat tiles
            document.querySelectorAll('.stat-tile').forEach((el, i) => {
                setTimeout(() => { el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 80);
            });
            // Count up
            const targets = { 'stat-avg': [avgPct, '%'], 'stat-done': [completed, ''], 'stat-track': [onTrack, ''], 'stat-risk': [atRisk, ''] };
            Object.entries(targets).forEach(([id, [val, suf]], i) => {
                setTimeout(() => { const el = document.querySelector('#' + id + ' .stat-tile-num'); countUpTo(el, val, suf, 800); }, 200 + i * 80);
            });
            // Cards
            document.querySelectorAll('.dash-card').forEach((el, i) => {
                setTimeout(() => { el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 300 + i * 100);
            });
            // Team rows
            setTimeout(() => {
                document.querySelectorAll('.team-row').forEach((el, i) => {
                    setTimeout(() => { el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, background 0.15s'; el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, i * 60);
                });
                setTimeout(() => {
                    document.querySelectorAll('.team-progress-bar-fill').forEach(bar => { if (bar) bar.style.width = bar.dataset.pct + '%'; });
                }, 300);
            }, 400);
            // Group bars
            setTimeout(() => {
                document.querySelectorAll('.group-bar-row').forEach((el, i) => {
                    setTimeout(() => {
                        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)';
                        setTimeout(() => { const fill = el.querySelector('.group-bar-fill'); if (fill) fill.style.width = fill.dataset.pct + '%'; }, 200);
                    }, i * 80);
                });
            }, 500);
            // Activity
            setTimeout(() => {
                document.querySelectorAll('.activity-item').forEach((el, i) => {
                    setTimeout(() => { el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, i * 70);
                });
            }, 600);
            // Donut
            setTimeout(() => {
                const fill = document.getElementById('donut-fill');
                const pctEl = document.getElementById('donut-pct');
                if (fill && pctEl) {
                    fill.style.strokeDashoffset = 220 - (220 * avgPct / 100);
                    countUpTo(pctEl, avgPct, '%', 1000);
                }
            }, 500);
        }, 100);
    }, [active, avgPct, completed, onTrack, atRisk]);

    if (!scenario) return null;

    return (
        <div className={`screen ${active ? 'active' : ''}`} id="screen-dashboard">
            <div className="dash-layout">
                <div className="dash-nav">
                    <div className="dash-nav-label">Overview</div>
                    <div className="dash-nav-item active"><span className="dash-nav-icon">📊</span> Team progress</div>
                    <div className="dash-nav-item"><span className="dash-nav-icon">👥</span> All members</div>
                    <div className="dash-nav-item"><span className="dash-nav-icon">📋</span> Assignments</div>
                    <div className="dash-nav-divider"></div>
                    <div className="dash-nav-label">Groups</div>
                    {scenario.groups.map((g, i) => (
                        <div className="dash-nav-item" key={i}><span className="dash-nav-icon">{g.icon}</span>{g.name}</div>
                    ))}
                    <div className="dash-nav-divider"></div>
                    <div className="dash-nav-item" onClick={onBack}><span className="dash-nav-icon">←</span> Back to playbook</div>
                </div>

                <div className="dash-main" ref={mainRef}>
                    {/* Header */}
                    <div className="dash-header">
                        <div className="dash-title-wrap">
                            <div className="dash-eyebrow">Training progress</div>
                            <div className="dash-title">{scenario.bizName.replace(' Playbook', '')}</div>
                            <div className="dash-subtitle">{total} team members · Updated live</div>
                        </div>
                        <div className="dash-header-actions">
                            <div className="live-badge"><div className="live-dot"></div>Live</div>
                            <div className="dash-btn">Export</div>
                            <div className="dash-btn primary" onClick={onBack}>← Back to playbook</div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="dash-stats">
                        {[
                            { id: 'stat-avg', label: 'Avg completion', sub: 'across all members', cls: 'highlight', trend: '↑ +12%', trendCls: 'trend-up' },
                            { id: 'stat-done', label: 'Completed', sub: `of ${total} members`, cls: 'success-tile', trend: `↑ ${completed}`, trendCls: 'trend-up' },
                            { id: 'stat-track', label: 'On track', sub: 'progressing normally', cls: '' },
                            { id: 'stat-risk', label: 'Need attention', sub: 'behind or not started', cls: '', trend: atRisk > 0 ? `⚠ ${atRisk}` : '', trendCls: 'trend-mid' },
                        ].map(t => (
                            <div className={`stat-tile ${t.cls}`} id={t.id} key={t.id}>
                                <div className="stat-tile-label">{t.label} {t.trend && <span className={`stat-tile-trend ${t.trendCls}`}>{t.trend}</span>}</div>
                                <div className="stat-tile-num">0</div>
                                <div className="stat-tile-sub">{t.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Two col */}
                    <div className="dash-two-col">
                        <div className="dash-card">
                            <div className="dash-card-header">
                                <div className="dash-card-title">👥 Team members <span style={{ background: 'var(--bg-overlay)', borderRadius: 99, padding: '2px 8px', fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 4 }}>{total}</span></div>
                                <div className="dash-card-action">Send reminder</div>
                            </div>
                            {team.map((m, i) => (
                                <div className="team-row" key={i}>
                                    <div className="team-avatar" style={{ background: m.bg, color: m.color, borderColor: `${m.color}30` }}>{m.initials}</div>
                                    <div className="team-info"><div className="team-name">{m.name}</div><div className="team-role">{m.role}</div></div>
                                    <div className="team-progress-wrap">
                                        <div className="team-progress-bar-bg"><div className="team-progress-bar-fill" data-pct={m.pct} style={{ background: statusColors[m.status] }}></div></div>
                                        <div className="team-pct">{m.pct}%</div>
                                        <div className="team-status-dot" style={{ background: statusColors[m.status] }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Donut */}
                            <div className="dash-card">
                                <div className="dash-card-header"><div className="dash-card-title">📈 Overall completion</div></div>
                                <div className="donut-wrap" style={{ position: 'relative' }}>
                                    <svg className="donut-svg" width="120" height="120" viewBox="0 0 120 120">
                                        <circle className="donut-track" cx="60" cy="60" r="35" />
                                        <circle className="donut-fill" id="donut-fill" cx="60" cy="60" r="35" stroke={completed > 0 ? '#4ade80' : '#ffffff'} />
                                    </svg>
                                    <div className="donut-center"><div className="donut-pct" id="donut-pct">0%</div><div className="donut-label">complete</div></div>
                                </div>
                            </div>
                            {/* Group bars */}
                            <div className="dash-card">
                                <div className="dash-card-header"><div className="dash-card-title">🏷 By group</div></div>
                                {scenario.groups.map((g, i) => {
                                    const pct = groupPcts[i] || 50;
                                    return (
                                        <div className="group-bar-row" key={i}>
                                            <div className="group-bar-top"><div className="group-bar-name"><span>{g.icon}</span>{g.name}</div><div className="group-bar-pct">{pct}%</div></div>
                                            <div className="group-bar-track"><div className="group-bar-fill" data-pct={pct} style={{ background: g.color }}></div></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="dash-card">
                        <div className="dash-card-header"><div className="dash-card-title">⚡ Recent activity</div><div className="dash-card-action">View all</div></div>
                        {activity.map((a, i) => (
                            <div className="activity-item" key={i}>
                                <div className="activity-dot" style={{ background: a.color }}></div>
                                <div className="activity-text" dangerouslySetInnerHTML={{ __html: a.text }}></div>
                                <div className="activity-time">{a.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
