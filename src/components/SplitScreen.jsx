import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, Paperclip, Bot, FileText, ClipboardList, BookOpen, Shield, Users, Briefcase, ToggleLeft, ToggleRight } from 'lucide-react';
import SubjectPanel from './SubjectPanel';
import EmployeeOverlay from './EmployeeOverlay';

// Map group names to lucide icons
const GROUP_ICONS = {
    'Front of House': Users,
    'Kitchen Staff': Briefcase,
    'Management': ClipboardList,
    'General Staff': Shield,
    'Sales Associates': Users,
    'Stock & Operations': Briefcase,
    'Cashiers': ClipboardList,
    'Customer Success': Users,
    'Engineering': FileText,
    'Sales': Briefcase,
    'All Company': Shield,
};

function getGroupIcon(name) {
    return GROUP_ICONS[name] || BookOpen;
}

export default function SplitScreen({ active, scenario, chatHistory, onGoToDashboard }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [rightTab, setRightTab] = useState('playbook'); // playbook | employee
    const [revealedCount, setRevealedCount] = useState(0); // how many groups have fully revealed
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelSubject, setPanelSubject] = useState(null);
    const [panelGroup, setPanelGroup] = useState(null);
    const [panelColor, setPanelColor] = useState(null);
    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    // Initialize chat with history
    useEffect(() => {
        if (!active || hasInitialized.current) return;
        hasInitialized.current = true;
        if (chatHistory && chatHistory.length > 0) {
            setMessages(chatHistory);
        }
    }, [active, chatHistory]);

    // Progressive reveal: reveal one group every 1.5s
    useEffect(() => {
        if (!active || !scenario?.groups) return;
        const total = scenario.groups.length;
        if (revealedCount >= total) return;

        const timer = setTimeout(() => {
            setRevealedCount(prev => prev + 1);
        }, revealedCount === 0 ? 800 : 1500);

        return () => clearTimeout(timer);
    }, [active, scenario, revealedCount]);

    // Auto-scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMsg = { id: Date.now(), role: 'user', text: inputValue };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, role: 'ai', text: "I've noted that. You can continue editing the playbook on the right, or let me know if you have any other preferences." }
            ]);
        }, 1200);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const openSubject = useCallback((sub, group, color) => {
        setPanelSubject(sub);
        setPanelGroup(group);
        setPanelColor(color);
        setPanelOpen(true);
    }, []);

    const closeSubject = useCallback(() => setPanelOpen(false), []);

    if (!active || !scenario) return null;

    const groups = scenario.groups || [];

    return (
        <>
            <div className="sv2-screen">
                {/* Top Navigation Bar */}
                <nav className="context-nav">
                    <div className="context-nav-inner">
                        <div className="context-nav-logo" style={{ fontFamily: "'Instrument Serif', serif" }}>
                            Trainual<sup className="context-nav-sup">®</sup>
                        </div>
                        <div className="context-nav-right">
                            <div className="context-nav-avatar"></div>
                        </div>
                    </div>
                </nav>

                <div className="sv2-body">
                    {/* Left Panel: Chat */}
                    <div className="sv2-left">
                        <div className="sv2-chat-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`context-msg-row ${msg.role}`}>
                                    {msg.role === 'ai' && (
                                        <div className="context-msg-avatar">
                                            <Bot size={16} strokeWidth={2} />
                                        </div>
                                    )}
                                    <div className="context-msg-bubble">
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="sv2-chat-input-area">
                            <div className="sv2-input-wrap">
                                <textarea
                                    className="sv2-input"
                                    rows="2"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Message Agent..."
                                />
                                <div className="sv2-input-toolbar">
                                    <button className="context-toolbar-btn" title="Attach file">
                                        <Paperclip size={12} strokeWidth={2} />
                                    </button>
                                    <button
                                        className="context-toolbar-btn send"
                                        onClick={handleSend}
                                        title="Send"
                                        disabled={!inputValue.trim()}
                                    >
                                        <ArrowUp size={12} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Builder */}
                    <div className="sv2-right">
                        {/* Builder inner nav */}
                        <div className="sv2-right-nav">
                            <div className="sv2-right-tabs">
                                <button
                                    className={`sv2-tab ${rightTab === 'playbook' ? 'active' : ''}`}
                                    onClick={() => setRightTab('playbook')}
                                >
                                    Playbook
                                </button>
                                <button
                                    className={`sv2-tab ${rightTab === 'employee' ? 'active' : ''}`}
                                    onClick={() => setRightTab('employee')}
                                >
                                    Employee preview
                                </button>
                            </div>
                            <div className="sv2-right-toggle">
                                {rightTab === 'playbook' ? (
                                    <ToggleLeft size={20} strokeWidth={1.5} />
                                ) : (
                                    <ToggleRight size={20} strokeWidth={1.5} />
                                )}
                            </div>
                        </div>

                        {/* Builder content */}
                        <div className="sv2-right-body">
                            {rightTab === 'playbook' && (
                                <div className="sv2-playbook">
                                    <div className="sv2-playbook-header">
                                        <p className="sv2-eyebrow">Generated for you</p>
                                        <h2 className="sv2-title" style={{ fontFamily: "'Instrument Serif', serif" }}>
                                            {scenario.bizName}
                                        </h2>
                                        <p className="sv2-desc">{scenario.bizDesc}</p>
                                    </div>

                                    <div className="sv2-groups">
                                        {groups.map((g, gi) => {
                                            const isRevealed = gi < revealedCount;
                                            const isCurrent = gi === revealedCount - 1;
                                            const IconComp = getGroupIcon(g.name);

                                            return (
                                                <div
                                                    className={`sv2-group-card ${isRevealed ? 'revealed' : 'skeleton'} ${isCurrent ? 'just-revealed' : ''}`}
                                                    key={gi}
                                                >
                                                    {!isRevealed ? (
                                                        /* Skeleton state */
                                                        <>
                                                            <div className="sv2-sk-header">
                                                                <div className="sv2-sk-icon"></div>
                                                                <div className="sv2-sk-name"></div>
                                                                <div className="sv2-sk-count"></div>
                                                            </div>
                                                            <div className="sv2-sk-rows">
                                                                {Array(g.subjects?.length || 4).fill(0).map((_, ri) => (
                                                                    <div className="sv2-sk-row" key={ri} style={{ width: `${[85, 70, 90, 65, 80][ri % 5]}%` }}></div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        /* Real content state */
                                                        <>
                                                            <div className="sv2-group-header">
                                                                <div className="sv2-group-icon">
                                                                    <IconComp size={18} strokeWidth={1.5} />
                                                                </div>
                                                                <div className="sv2-group-info">
                                                                    <div className="sv2-group-name">{g.name}</div>
                                                                    <div className="sv2-group-meta">{g.count}</div>
                                                                </div>
                                                                <div className="sv2-group-badge">{g.count.split(' ')[0]} subjects</div>
                                                            </div>
                                                            <div className="sv2-group-subjects">
                                                                {g.subjects.map((sub, si) => (
                                                                    <div
                                                                        className="sv2-subject-row"
                                                                        key={si}
                                                                        onClick={() => openSubject(sub, g.name, g.color)}
                                                                    >
                                                                        <FileText size={14} strokeWidth={1.5} className="sv2-subject-icon" />
                                                                        <span className="sv2-subject-name">{sub}</span>
                                                                        <span className="sv2-subject-status">{si === 0 ? 'Draft ready' : 'Outline ready'}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {rightTab === 'employee' && (
                                <div className="sv2-employee-wrap">
                                    <EmployeeOverlay scenario={scenario} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SubjectPanel
                isOpen={panelOpen}
                onClose={closeSubject}
                subjectName={panelSubject}
                groupName={panelGroup}
                groupColor={panelColor}
            />
        </>
    );
}
