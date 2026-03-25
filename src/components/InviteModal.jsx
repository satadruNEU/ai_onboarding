import { useState, useRef, useEffect } from 'react';
import { X, Mail, ChevronDown, CheckCircle2, UserPlus, AlertCircle } from 'lucide-react';

export default function InviteModal({ isOpen, onClose, groups, onSend }) {
    const [input, setInput] = useState('');
    const [emails, setEmails] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(groups?.[0]?.name || 'General Staff');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Focus input on mount
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            // Reset state
            setInput('');
            setEmails([]);
            setSelectedGroup(groups?.[0]?.name || 'General Staff');
            setIsSubmitting(false);
        }
    }, [isOpen, groups]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (!isOpen) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const addEmails = (rawText) => {
        const rawList = rawText.split(/[\s,]+/).filter(Boolean);
        const newEmails = [];
        rawList.forEach(item => {
            const clean = item.trim();
            if (clean && !emails.find(e => e.address === clean)) {
                newEmails.push({
                    address: clean,
                    isValid: emailRegex.test(clean)
                });
            }
        });
        
        if (newEmails.length > 0) {
            setEmails(prev => [...prev, ...newEmails]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
            e.preventDefault();
            if (input.trim()) {
                addEmails(input);
                setInput('');
            }
        } else if (e.key === 'Backspace' && input === '' && emails.length > 0) {
            // Remove last email
            setEmails(prev => prev.slice(0, -1));
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text');
        addEmails(pasted);
    };

    const removeEmail = (index) => {
        setEmails(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        // Automatically add any pending valid input before sending
        if (input.trim()) {
            addEmails(input);
            setInput('');
        }

        const validEmails = emails.filter(e => e.isValid);
        if (validEmails.length === 0 && !emailRegex.test(input.trim())) return;

        setIsSubmitting(true);
        setTimeout(() => {
            // Include pending input if it was valid
            const finalCount = validEmails.length + (emailRegex.test(input.trim()) ? 1 : 0);
            onSend(finalCount, selectedGroup);
            setIsSubmitting(false);
            onClose();
        }, 1200);
    };

    const hasInvalid = emails.some(e => !e.isValid);
    const validCount = emails.filter(e => e.isValid).length + (emailRegex.test(input.trim()) ? 1 : 0);
    const canSend = validCount > 0;

    return (
        <div className="invite-modal-overlay">
            <div className="invite-modal-content animate-dd-in">
                {/* Header */}
                <div className="invite-modal-header">
                    <div className="invite-modal-title-row">
                        <div className="invite-modal-icon">
                            <UserPlus size={18} strokeWidth={2} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="invite-modal-title">Invite Team Members</h2>
                            <p className="invite-modal-subtitle">Add colleagues directly to specific training groups.</p>
                        </div>
                    </div>
                    <button className="invite-modal-close" onClick={onClose} disabled={isSubmitting}>
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="invite-modal-body">
                    {/* Tag Input Component */}
                    <div className="invite-field-group">
                        <label className="invite-label">Email addresses</label>
                        <div className={`invite-tag-container ${hasInvalid ? 'has-error' : ''}`}>
                            {emails.map((email, i) => (
                                <span key={i} className={`invite-tag ${email.isValid ? 'valid' : 'invalid'}`}>
                                    {email.address}
                                    <button className="invite-tag-remove" onClick={() => removeEmail(i)}>
                                        <X size={12} strokeWidth={2.5} />
                                    </button>
                                </span>
                            ))}
                            <input
                                ref={inputRef}
                                className="invite-tag-input"
                                placeholder={emails.length === 0 ? "Paste comma-separated emails..." : ""}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                disabled={isSubmitting}
                            />
                        </div>
                        {hasInvalid && (
                            <div className="invite-error-msg">
                                <AlertCircle size={14} /> Please correct or remove the highlighted invalid emails.
                            </div>
                        )}
                        {!hasInvalid && <div className="invite-hint-msg">Press Space or Enter to add multiple emails.</div>}
                    </div>

                    {/* Group Selection Dropdown */}
                    <div className="invite-field-group" style={{ marginTop: '1.25rem' }}>
                        <label className="invite-label">Assign to training group</label>
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <button 
                                type="button"
                                className={`invite-select-btn ${showDropdown ? 'active' : ''}`}
                                onClick={() => {
                                    if (!isSubmitting) setShowDropdown(prev => !prev);
                                }}
                                disabled={isSubmitting}
                            >
                                <span>{selectedGroup}</span>
                                <ChevronDown size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
                            </button>
                            
                            {showDropdown && (
                                <div className="invite-dropdown-menu">
                                    {groups && groups.length > 0 ? groups.map((g, i) => (
                                        <div 
                                            key={i} 
                                            className="invite-dropdown-item"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setSelectedGroup(g.name);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {g.icon} {g.name}
                                        </div>
                                    )) : (
                                        <>
                                            <div className="invite-dropdown-item" onMouseDown={() => { setSelectedGroup('General Staff'); setShowDropdown(false); }}>General Staff</div>
                                            <div className="invite-dropdown-item" onMouseDown={() => { setSelectedGroup('Management'); setShowDropdown(false); }}>Management</div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="invite-modal-footer">
                    <button className="invite-btn-ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button 
                        className="invite-btn-primary" 
                        onClick={handleSend}
                        disabled={!canSend || isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="invite-spinner"></span>
                        ) : (
                            <Mail size={16} strokeWidth={2} />
                        )}
                        {isSubmitting ? 'Sending Invites...' : 'Send Invites'}
                    </button>
                </div>
            </div>
        </div>
    );
}
