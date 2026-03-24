import { useState, useEffect, useRef } from 'react';
import { Settings, BookOpen, Users, CreditCard, LogOut, HelpCircle } from 'lucide-react';

export default function ProfileDropdown({ onSignOut }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open]);

    return (
        <div className="profile-dd-wrap" ref={ref}>
            <div
                className="context-nav-avatar-btn"
                title="Your Profile"
                onClick={() => setOpen(!open)}
                style={{ cursor: 'pointer' }}
            />

            {open && (
                <div className="profile-dd">
                    {/* User info */}
                    <div className="profile-dd-section">
                        <div className="profile-dd-user">
                            <div className="profile-dd-avatar">SD</div>
                            <div className="profile-dd-user-info">
                                <div className="profile-dd-name">Satadru Debnath</div>
                                <div className="profile-dd-email">satadru@awesomecompany.com</div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-dd-divider" />

                    {/* Menu items */}
                    <div className="profile-dd-section">
                        {[
                            { icon: Settings, label: 'Settings' },
                            { icon: CreditCard, label: 'Billing' },
                            { icon: BookOpen, label: 'Documentation' },
                            { icon: Users, label: 'Invite team' },
                            { icon: HelpCircle, label: 'Help & support' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <button className="profile-dd-item" key={i} onClick={() => setOpen(false)}>
                                    <Icon size={15} strokeWidth={1.8} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="profile-dd-divider" />

                    {/* Sign out */}
                    <div className="profile-dd-section">
                        <button
                            className="profile-dd-item profile-dd-signout"
                            onClick={() => {
                                setOpen(false);
                                onSignOut?.();
                            }}
                        >
                            <LogOut size={15} strokeWidth={1.8} />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
