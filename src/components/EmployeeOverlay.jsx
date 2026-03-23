import { BookOpen, FolderOpen, Users, User, Target, Shield, Star, Lightbulb, Lock, ChevronRight } from 'lucide-react';

const MODULE_ICONS = [BookOpen, Shield, Star, Lightbulb, Target];
const DURATIONS = ['8 min', '6 min', '10 min', '7 min', '9 min'];

export default function EmployeeOverlay({ scenario }) {
    if (!scenario) return null;
    const g = scenario.groups[0];

    return (
        <div className="lt-phone-wrap">
            <div className="lt-phone">
                <div className="lt-phone-notch"></div>
                <div className="lt-emp-screen">
                    <div className="lt-emp-hero">
                        <p className="lt-emp-greeting">Day 1 of your journey</p>
                        <h2 className="lt-emp-name">Hey, Alex</h2>
                        <div className="lt-emp-role">
                            <span className="lt-emp-role-badge">
                                <Users size={12} strokeWidth={1.5} />
                                {g.name}
                            </span>
                        </div>
                        <div className="lt-emp-banner">
                            <div className="lt-emp-banner-icon">
                                <Target size={14} strokeWidth={1.5} />
                            </div>
                            <div className="lt-emp-banner-text">
                                <div className="lt-emp-banner-title">Your training is ready</div>
                                <div className="lt-emp-banner-sub">{g.subjects.length} modules · ~{g.subjects.length * 8} min</div>
                            </div>
                        </div>
                    </div>

                    <div className="lt-emp-modules">
                        <p className="lt-emp-section-label">Your modules</p>
                        {g.subjects.slice(0, 5).map((sub, i) => {
                            const IconComp = MODULE_ICONS[i] || BookOpen;
                            const isFirst = i === 0;
                            return (
                                <div className={`lt-emp-module ${isFirst ? 'unlocked' : ''}`} key={i}>
                                    <div className="lt-emp-module-icon">
                                        <IconComp size={14} strokeWidth={1.5} />
                                    </div>
                                    <div className="lt-emp-module-body">
                                        <div className="lt-emp-module-title">{sub}</div>
                                        <div className="lt-emp-module-meta">
                                            {DURATIONS[i]} · {isFirst ? 'Ready to start' : 'Complete previous first'}
                                        </div>
                                    </div>
                                    <span className={`lt-emp-module-status ${isFirst ? 'next' : 'locked'}`}>
                                        {isFirst ? (
                                            <><ChevronRight size={10} /> Up next</>
                                        ) : (
                                            <><Lock size={10} /> Locked</>
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lt-emp-bottom-nav">
                    <div className="lt-emp-nav-item active">
                        <BookOpen size={16} strokeWidth={1.5} />
                        Training
                    </div>
                    <div className="lt-emp-nav-item">
                        <FolderOpen size={16} strokeWidth={1.5} />
                        Playbook
                    </div>
                    <div className="lt-emp-nav-item">
                        <Users size={16} strokeWidth={1.5} />
                        Team
                    </div>
                    <div className="lt-emp-nav-item">
                        <User size={16} strokeWidth={1.5} />
                        Profile
                    </div>
                </div>
            </div>
        </div>
    );
}
