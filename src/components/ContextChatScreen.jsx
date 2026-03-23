import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, Paperclip, Bot } from 'lucide-react';

const CONVERSATION_SCRIPT = [
    {
        ai: "Thanks for sharing! To make this playbook really effective — who exactly will be going through it?",
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

export default function ContextChatScreen({ active, scenario, onComplete }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // 0 = waiting for first AI Q, 1-4 = which question we're on
    const [showSuggestions, setShowSuggestions] = useState(false);
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
                setTimeout(() => onComplete(finalMessages), 2500);
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
        <div className="context-screen">
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
                            <div className="context-msg-bubble">
                                {msg.text}
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
