import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, Paperclip, Bot, FileText, ClipboardList, BookOpen, Shield, Users, Briefcase, ToggleLeft, ToggleRight, Monitor, Tablet, Smartphone, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
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
    const [isThinking, setIsThinking] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('mobile');
    const [panelGroup, setPanelGroup] = useState(null);
    const [panelColor, setPanelColor] = useState(null);
    const [hiddenGroups, setHiddenGroups] = useState([]);
    const [addedGroups, setAddedGroups] = useState([]);

    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    const baseGroups = scenario?.groups || [];
    const allGroups = [...baseGroups, ...addedGroups];
    const groups = allGroups.filter(g => !hiddenGroups.includes(g.name));

    // Initialize chat with history
    useEffect(() => {
        if (!active || hasInitialized.current) return;
        hasInitialized.current = true;
        if (chatHistory && chatHistory.length > 0) {
            setMessages(chatHistory);
        }
    }, [active, chatHistory]);

    // Progressive reveal: reveal one group every 1.5s/4.5s
    useEffect(() => {
        if (!active || groups.length === 0) return;
        const total = groups.length;

        if (revealedCount >= total && total > 0) {
            const readyMsgText = "Your playbook is ready! Here are a few things you can do next:\n\n• Edit any subject to customize content\n• Preview the employee experience\n• Ask me to generate more topics\n• Finalize and assign to your team";
            const timer = setTimeout(() => {
                setMessages(prev => {
                    if (prev.some(m => m.text.includes("Your playbook is ready!"))) return prev;
                    return [...prev, { id: Date.now(), role: 'ai', text: readyMsgText }];
                });
            }, 1000);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setRevealedCount(prev => prev + 1);
        }, revealedCount === 0 ? 1500 : 4500); // 1.5s then 4.5s for remaining 3 = ~15 seconds total

        return () => clearTimeout(timer);
    }, [active, groups.length, revealedCount]);

    // Auto-scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim() || isThinking) return;
        const text = inputValue.trim();
        const lowerText = text.toLowerCase();

        const newMsg = { id: Date.now(), role: 'user', text };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsThinking(true);

        let isRemove = lowerText.includes('remove') || lowerText.includes('delete') || lowerText.includes('hide');
        let isAddBack = lowerText.includes('add back') || lowerText.includes('restore') || lowerText.includes('unhide');
        let isAddNew = lowerText.includes('add new') || (lowerText.includes('add') && lowerText.includes('section')) || (lowerText.includes('add') && lowerText.includes('group'));

        const matchDig = lowerText.match(/\d+/);
        // Groups are 1-indexed for the user, so "group 3" is index 2
        const groupNum = matchDig ? parseInt(matchDig[0], 10) - 1 : -1;

        // Find target group by number or name
        let targetGroup = null;
        if (groupNum >= 0 && groupNum < allGroups.length) {
            targetGroup = allGroups[groupNum];
        } else {
            targetGroup = allGroups.find(g => lowerText.includes(g.name.toLowerCase()));
        }

        setTimeout(() => {
            if (isAddBack && targetGroup) {
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: `I'll restore the ${targetGroup.name} section as asked.` }]);
                setTimeout(() => {
                    setHiddenGroups(prev => prev.filter(n => n !== targetGroup.name));

                    setTimeout(() => {
                        const el = document.getElementById('group-card-' + targetGroup.name.replace(/\s+/g, '-'));
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.classList.add('highlight-add');
                        }
                    }, 100);

                    setMessages(prev => [...prev, { id: Date.now() + 2, role: 'ai', text: `Done as requested! The section is back. I can do other things as well, just say it.` }]);
                    setIsThinking(false);
                }, 1500);
            } else if (isRemove && targetGroup) {
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: `I'll remove the ${targetGroup.name} section as asked.` }]);

                setTimeout(() => {
                    const el = document.getElementById('group-card-' + targetGroup.name.replace(/\s+/g, '-'));
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('highlight-remove');
                    }
                }, 100);

                setTimeout(() => {
                    setHiddenGroups(prev => [...prev, targetGroup.name]);
                    setRevealedCount(prev => Math.max(0, prev - 1));
                    setMessages(prev => [...prev, { id: Date.now() + 2, role: 'ai', text: `Done as requested! The section is removed. I can do other things as well, just say it.` }]);
                    setIsThinking(false);
                }, 2000);
            } else if (isAddNew) {
                const predefName = "Custom Operations";
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: `I'll add a new ${predefName} section for you.` }]);
                setTimeout(() => {
                    setAddedGroups(prev => [...prev, {
                        icon: '✨', name: predefName, color: '#3b82f6', subjects: ['Drafting new protocols'], count: '1 subject'
                    }]);

                    setTimeout(() => {
                        const el = document.getElementById('group-card-' + predefName.replace(/\s+/g, '-'));
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.classList.add('highlight-add');
                        }
                    }, 100);

                    setTimeout(() => {
                        setMessages(prev => [...prev, { id: Date.now() + 2, role: 'ai', text: `Done as requested! I've started generating the new section. I can do other things as well, just say it.` }]);
                        setIsThinking(false);
                    }, 4500);
                }, 1500);
            } else {
                setMessages(prev => [
                    ...prev,
                    { id: Date.now() + 1, role: 'ai', text: "I've noted that. You can continue editing the playbook on the right, or ask me to add/remove specific sections." }
                ]);
                setIsThinking(false);
            }
        }, 1200);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const openSubject = useCallback((sub, group, color) => {
        setSelectedSubject(sub);
        setPanelGroup(group);
        setPanelColor(color);
        setShowSidebar(true);
    }, []);

    const closeSubject = useCallback(() => setShowSidebar(false), []);

    if (!active || !scenario) return null;

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
                            {(() => {
                                let lastAiIndex = -1;
                                messages.forEach((m, ix) => { if (m.role === 'ai') lastAiIndex = ix; });

                                return messages.map((msg, ix) => {
                                    const isLastAi = msg.role === 'ai' && ix === lastAiIndex;
                                    return (
                                        <div key={msg.id} className={`context-msg-row ${msg.role}`}>
                                            {msg.role === 'ai' && (
                                                <div className="context-msg-avatar">
                                                    <Bot size={16} strokeWidth={2} />
                                                </div>
                                            )}
                                            <div className="context-msg-content">
                                                <div className="context-msg-bubble">
                                                    {msg.text.split('\n').map((line, lineIx, arr) => (
                                                        <span key={lineIx}>
                                                            {line}
                                                            {lineIx !== arr.length - 1 && <br />}
                                                        </span>
                                                    ))}
                                                </div>
                                                {msg.role === 'ai' && (
                                                    <div className="context-msg-actions">
                                                        <div className={`context-msg-btn-group ${isLastAi ? 'visible' : ''}`}>
                                                            <button className="context-action-btn" title="Like"><ThumbsUp size={12} /></button>
                                                            <button className="context-action-btn" title="Dislike"><ThumbsDown size={12} /></button>
                                                            <button className="context-action-btn" title="Copy"><Copy size={12} /></button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
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

                            <div className="sv2-right-actions-row">
                                <div className="sv2-right-toggle">
                                    {rightTab === 'playbook' ? (
                                        <ToggleLeft size={20} strokeWidth={1.5} />
                                    ) : (
                                        <ToggleRight size={20} strokeWidth={1.5} />
                                    )}
                                </div>
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
                                                    id={'group-card-' + g.name.replace(/\s+/g, '-')}
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
                                <div className="sv2-employee-preview">
                                    <div className="lt-floating-switcher">
                                        <div className="lt-device-switcher">
                                            <button
                                                className={`lt-device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
                                                onClick={() => setPreviewDevice('desktop')}
                                            >
                                                <Monitor size={14} strokeWidth={2} />
                                            </button>
                                            <button
                                                className={`lt-device-btn ${previewDevice === 'tablet' ? 'active' : ''}`}
                                                onClick={() => setPreviewDevice('tablet')}
                                            >
                                                <Tablet size={14} strokeWidth={2} />
                                            </button>
                                            <button
                                                className={`lt-device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
                                                onClick={() => setPreviewDevice('mobile')}
                                            >
                                                <Smartphone size={14} strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>
                                    <EmployeeOverlay scenario={scenario} deviceType={previewDevice} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SubjectPanel
                isOpen={showSidebar}
                onClose={closeSubject}
                subjectName={selectedSubject}
                groupName={panelGroup}
                groupColor={panelColor}
            />
        </>
    );
}
