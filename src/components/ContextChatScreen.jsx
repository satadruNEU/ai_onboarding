import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, Paperclip, Bot, Briefcase, ChevronDown, CircleDashed, FileText, Settings, Share, Play, User } from 'lucide-react';

const CONVERSATION_SCRIPT = [
    {
        ai: "Hey Satadru, Welcome to Trainual! \n I am here to help you create a training playbook for your team. \n To make this playbook really effective — who exactly will be going through it?",
        suggestions: [
            "New hires only",
            "Existing team members",
            "Both new and existing",
            "Managers and leads"
        ]
    },
    {
        ai: "Got it. How would you describe the current skill level of your team? This helps me calibrate the depth of the training.",
        suggestions: [
            "Complete beginners",
            "Some experience, need standardization",
            "Experienced, need advanced protocols",
            "Mixed levels across the team"
        ]
    },
    {
        ai: "What's the biggest challenge you're facing with training right now? This helps me prioritize the right modules.",
        suggestions: [
            "Inconsistent quality across locations",
            "High turnover, constant retraining",
            "No formal process exists yet",
            "Compliance and safety gaps"
        ]
    },
    {
        ai: "Last one — how quickly do you need people fully ramped up? This affects how we structure the learning path.",
        suggestions: [
            "Within the first week",
            "2–3 weeks",
            "Within the first month",
            "Ongoing, no strict deadline"
        ]
    }
];

const FINAL_AI_MESSAGE = "Perfect — I have everything I need. Assembling your custom playbook now...";

export default function ContextChatScreen({ active, scenario, onComplete, onGoToDashboard }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // 0 = waiting for first AI Q, 1-4 = which question we're on
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showPlaybookMenu, setShowPlaybookMenu] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // Close dropdown on outside clicks
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.playbook-dropdown-container')) {
                setShowPlaybookMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking, showSuggestions]);

    // Initialize: show user prompt, then first AI question
    useEffect(() => {
        if (!active || !scenario?.userInput || hasInitialized.current) return;
        hasInitialized.current = true;

        setMessages([{ id: 1, role: 'user', text: scenario.userInput }]);
        setIsThinking(true);

        // AI "types" the first question
        const delay = 1200 + Math.random() * 800;
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { id: 2, role: 'ai', text: CONVERSATION_SCRIPT[0].ai }
            ]);
            setIsThinking(false);
            setCurrentStep(1);
            // Show suggestions after a beat
            setTimeout(() => setShowSuggestions(true), 300);
        }, delay);
    }, [active, scenario]);

    const advanceConversation = useCallback((userReply) => {
        // Add user reply
        const userMsg = { id: Date.now(), role: 'user', text: userReply };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setShowSuggestions(false);
        setIsThinking(true);

        const nextStep = currentStep; // currentStep is 1-indexed for the question we just answered
        const delay = 1000 + Math.random() * 1000;

        setTimeout(() => {
            if (nextStep < CONVERSATION_SCRIPT.length) {
                // Show next AI question
                setMessages(prev => [
                    ...prev,
                    { id: Date.now() + 1, role: 'ai', text: CONVERSATION_SCRIPT[nextStep].ai }
                ]);
                setIsThinking(false);
                setCurrentStep(nextStep + 1);
                setTimeout(() => setShowSuggestions(true), 300);
            } else {
                // Final message — all questions answered
                const finalAiMsg = { id: Date.now() + 1, role: 'ai', text: FINAL_AI_MESSAGE };
                let finalMessages = [];
                setMessages(prev => {
                    finalMessages = [...prev, finalAiMsg];
                    return finalMessages;
                });
                setIsThinking(false);
                setShowSuggestions(false);

                // Transition to split screen — pass full chat history
                setTimeout(() => {
                    setIsExiting(true);
                    setTimeout(() => onComplete(finalMessages), 400);
                }, 2000);
            }
        }, delay);
    }, [currentStep, onComplete]);

    const handleSend = () => {
        if (!inputValue.trim() || isThinking) return;
        advanceConversation(inputValue.trim());
    };

    const handleSuggestionClick = (text) => {
        if (isThinking) return;
        advanceConversation(text);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!active) return null;

    const currentSuggestions = currentStep >= 1 && currentStep <= CONVERSATION_SCRIPT.length
        ? CONVERSATION_SCRIPT[currentStep - 1].suggestions
        : [];

    return (
        <div className={`context-screen ${isExiting ? 'context-screen-exit' : ''}`}>
            {/* Top Navigation Bar */}
            <nav className="context-nav">
                <div className="context-nav-left">
                    <div className="context-nav-logo" style={{ fontFamily: "'Instrument Serif', serif", cursor: 'pointer' }} onClick={onGoToDashboard}>
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
                        <CircleDashed size={14} />
                        Drafts
                    </button>
                    <span className="context-nav-slash" style={{ fontSize: '0.9rem', margin: '0 2px' }}>/</span>
                    <div className="relative playbook-dropdown-container">
                        <button className="context-nav-item" onClick={() => setShowPlaybookMenu(!showPlaybookMenu)}>
                            <FileText size={14} />
                            {scenario?.bizName || "New Playbook"}
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {showPlaybookMenu && (
                            <div className="context-dropdown-menu">
                                <div className="context-dropdown-group">
                                    <div className="context-dropdown-item">Rename</div>
                                    <div className="context-dropdown-item">Add to Favorites</div>
                                    <div className="context-dropdown-item">Duplicate...</div>
                                </div>
                                <div className="context-dropdown-separator"></div>
                                <div className="context-dropdown-group">
                                    <div className="context-dropdown-item">Settings</div>
                                    <div className="context-dropdown-item">Transfer...</div>
                                    <div className="context-dropdown-item danger">Delete</div>
                                </div>
                            </div>
                        )}
                    </div>
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
                    <button className="context-nav-btn context-nav-publish" disabled>
                        <Play size={12} fill="currentColor" />
                        <span className="hidden sm:inline">Publish</span>
                    </button>
                    <div className="context-nav-avatar-btn" title="Your Profile">
                    </div>
                </div>
            </nav>

            {/* Main Chat Area */}
            <main className="context-chat-area">
                <div className="context-chat-container">
                    {messages.map((msg) => (
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
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="context-msg-row ai">
                            <div className="context-msg-avatar">
                                <Bot size={16} strokeWidth={2} />
                            </div>
                            <div className="context-msg-thinking">
                                <span className="thinking-dot"></span>
                                <span className="thinking-dot"></span>
                                <span className="thinking-dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Bottom Input Area */}
            <div className="context-input-container">
                {/* Suggestion Bubbles */}
                {showSuggestions && currentSuggestions.length > 0 && (
                    <div className="context-suggestions">
                        {currentSuggestions.map((text, i) => (
                            <button
                                key={i}
                                className="context-suggestion-chip"
                                onClick={() => handleSuggestionClick(text)}
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                )}

                <div className="context-hero-input-wrap">
                    <textarea
                        className="context-hero-input"
                        rows="2"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your reply..."
                        disabled={isThinking}
                    />
                    <div className="context-input-toolbar">
                        <button className="context-toolbar-btn" title="Attach file">
                            <Paperclip size={12} strokeWidth={2} />
                            <span className="context-toolbar-label">Attach</span>
                        </button>
                        <button
                            className="context-toolbar-btn send"
                            onClick={handleSend}
                            title="Send"
                            disabled={isThinking || !inputValue.trim()}
                        >
                            <ArrowUp size={12} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
