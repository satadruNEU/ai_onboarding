export default function EmployeeOverlay({ scenario }) {
    if (!scenario) return null;
    const g = scenario.groups[0];
    const icons = ['📖', '🛡️', '⭐', '💡', '🎯'];
    const durs = ['8 min', '6 min', '10 min', '7 min', '9 min'];
    const statuses = ['status-next', 'status-locked', 'status-locked', 'status-locked', 'status-locked'];
    const statusLabels = ['Up next', 'Locked', 'Locked', 'Locked', 'Locked'];

    return (
        <div className="split-phone-wrap">
            <div className="split-phone">
                <div className="phone-notch"></div>
                <div className="emp-screen">
                    <div className="emp-hero">
                        <p className="emp-greeting">Day 1 of your journey</p>
                        <h2 className="emp-name">Hey, Alex 👋</h2>
                        <div className="emp-role">
                            <span className="emp-role-badge">{g.icon} {g.name}</span>
                        </div>
                        <div className="emp-dayone">
                            <div className="emp-dayone-icon">🎯</div>
                            <div className="emp-dayone-text">
                                <div className="emp-dayone-title">Your training is ready</div>
                                <div className="emp-dayone-sub">{g.subjects.length} modules · ~{g.subjects.length * 8} min</div>
                            </div>
                        </div>
                    </div>
                    <div className="emp-progress-section">
                        <p className="emp-section-label">Your modules</p>
                        <div>
                            {g.subjects.slice(0, 5).map((sub, i) => (
                                <div className={`emp-module${i === 0 ? ' unlocked' : ''}`} key={i}
                                    style={{ opacity: 1, transform: 'translateY(0)', margin: '0 16px 8px' }}>
                                    <div className="emp-module-icon" style={{ background: `${g.color}18`, color: g.color }}>{icons[i] || '📋'}</div>
                                    <div className="emp-module-body">
                                        <div className="emp-module-title">{sub}</div>
                                        <div className="emp-module-meta">{durs[i]} · {i === 0 ? 'Ready to start' : 'Complete previous first'}</div>
                                    </div>
                                    <span className={`emp-module-status ${statuses[i]}`}>{statusLabels[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="emp-bottom-nav">
                    <div className="emp-nav-item active"><span className="emp-nav-icon">📚</span>Training</div>
                    <div className="emp-nav-item"><span className="emp-nav-icon">🗂️</span>Playbook</div>
                    <div className="emp-nav-item"><span className="emp-nav-icon">👥</span>Team</div>
                    <div className="emp-nav-item"><span className="emp-nav-icon">👤</span>Profile</div>
                </div>
            </div>
        </div>
    );
}
