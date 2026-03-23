import { useState, useEffect, useRef } from 'react';
import EmployeeOverlay from './EmployeeOverlay';

export default function BuilderPanel({ scenario, chatDone, onPublish, onOpenSubject, publishState }) {
    const [showReal, setShowReal] = useState(false);
    const [showPublishBtn, setShowPublishBtn] = useState(false);
    const [rightTab, setRightTab] = useState('playbook');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarHTML, setSidebarHTML] = useState('');
    const [inviteSent, setInviteSent] = useState(false);
    const emailRef = useRef(null);

    useEffect(() => {
        if (!chatDone) return;
        // Crossfade skeleton → real content
        const t1 = setTimeout(() => setShowReal(true), 1100);
        const t2 = setTimeout(() => setShowPublishBtn(true), 1800);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [chatDone]);

    useEffect(() => {
        if (publishState === 'done') {
            setShowPublishBtn(false);
            setSidebarOpen(true);
        }
    }, [publishState]);

    const switchRightTab = (tab) => {
        setRightTab(tab);
    };

    const handleSidebarInvite = () => {
        const email = emailRef.current?.value?.trim();
        if (email) setInviteSent(true);
    };

    if (!scenario) return null;

    return (
        <div className="split-right">
            <div className="split-right-nav">
                <div className="split-nav-tabs">
                    <div className={`split-nav-tab ${rightTab === 'playbook' ? 'active' : ''}`} onClick={() => switchRightTab('playbook')}>Playbook</div>
                    <div className={`split-nav-tab ${rightTab === 'employee' ? 'active' : ''}`} onClick={() => switchRightTab('employee')}>Employee preview</div>
                </div>
                <div className="split-nav-actions">
                    {!chatDone && <div className="split-building-badge"><div className="split-building-dot"></div>Building…</div>}
                    {showPublishBtn && publishState === 'idle' && (
                        <button className="split-publish-btn" onClick={onPublish}>Publish playbook →</button>
                    )}
                    {publishState === 'publishing' && (
                        <button className="split-publish-btn" disabled>Publishing…</button>
                    )}
                </div>
            </div>

            <div className="split-right-body" style={{ marginRight: sidebarOpen ? 280 : 0 }}>
                {/* Skeleton */}
                {!showReal && (
                    <div className="split-skeleton">
                        <div className="split-sk-header">
                            <div className="sk-block sk-title"></div>
                            <div className="sk-block sk-subtitle"></div>
                        </div>
                        <div>
                            {[5, 5, 4, 3].map((rowCount, i) => (
                                <div className="sk-card" key={i} style={{ opacity: 1, transform: 'translateY(0)', marginBottom: 12 }}>
                                    <div className="sk-card-header">
                                        <div className="sk-icon"></div>
                                        <div className="sk-name"></div>
                                        <div className="sk-count"></div>
                                    </div>
                                    <div className="sk-rows">
                                        {Array(rowCount).fill(0).map((_, ri) => (
                                            <div className="sk-row" key={ri} style={{ width: `${[85, 70, 90, 65, 80][ri % 5]}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Real playbook */}
                {showReal && (
                    <div className="split-playbook-content" style={{ display: 'flex' }}>
                        <div className="split-playbook-header">
                            <p className="playbook-eyebrow">Generated for you</p>
                            <h2 className="playbook-title">{scenario.bizName}</h2>
                            <p className="playbook-desc">{scenario.bizDesc}</p>
                        </div>
                        <div>
                            {scenario.groups.map((g, gi) => (
                                <div className="group-card" key={gi} style={{ opacity: 1, transform: 'translateY(0)' }}>
                                    <div className="group-header">
                                        <div className="group-icon" style={{ background: `${g.color}22`, color: g.color }}>{g.icon}</div>
                                        <div className="group-info">
                                            <div className="group-name">{g.name}</div>
                                            <div className="group-meta">{g.count} · AI-generated outlines</div>
                                        </div>
                                        <div className="group-badge">{g.count.split(' ')[0]} subjects</div>
                                    </div>
                                    <div className="group-subjects">
                                        {g.subjects.map((sub, si) => (
                                            <div className="subject-row" key={si} onClick={() => onOpenSubject(sub, g.name, g.color)}>
                                                <span className="subject-icon">{si === 0 ? '📄' : '📋'}</span>
                                                <span className="subject-name">{sub}</span>
                                                <span className="subject-status">{si === 0 ? 'Draft ready' : 'Outline ready'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Employee preview overlay */}
            <div className={`split-employee-panel ${rightTab === 'employee' ? 'visible' : ''}`}>
                <EmployeeOverlay scenario={scenario} />
            </div>

            {/* Post-publish sidebar */}
            <div className={`split-right-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <p className="sbar-title">🎉 Playbook published!</p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 }}>Your team can now access their training.</p>

                <div className={`sbar-step ${inviteSent ? 'done-step' : 'active-step'}`} style={{ opacity: 1, transform: 'translateX(0)' }}>
                    <div className="sbar-num">{inviteSent ? '✓' : '1'}</div>
                    <div className="sbar-body">
                        <div className="sbar-step-label">Invite your first employee</div>
                        <div className="sbar-step-desc">They'll see personalised training instantly</div>
                    </div>
                </div>

                {inviteSent && (
                    <div style={{ fontSize: 11, color: 'var(--green)', padding: '6px 10px', background: 'var(--green-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(74,222,128,0.2)' }}>
                        ✓ Invite sent!
                    </div>
                )}

                {!inviteSent && (
                    <div className="sbar-invite-form" style={{ opacity: 1, transform: 'translateX(0)' }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Send invite</div>
                        <input type="email" className="sbar-invite-input" ref={emailRef} placeholder="teammate@company.com" />
                        <button className="sbar-invite-btn" onClick={handleSidebarInvite}>Send invite →</button>
                    </div>
                )}

                <div className="sbar-step" style={{ opacity: 1, transform: 'translateX(0)' }}>
                    <div className="sbar-num">2</div>
                    <div className="sbar-body">
                        <div className="sbar-step-label">Customise a subject</div>
                        <div className="sbar-step-desc">Add your own steps and examples</div>
                    </div>
                </div>
                <div className="sbar-step" style={{ opacity: 1, transform: 'translateX(0)' }}>
                    <div className="sbar-num">3</div>
                    <div className="sbar-body">
                        <div className="sbar-step-label">Add more team members</div>
                        <div className="sbar-step-desc">Build out your full org chart</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
