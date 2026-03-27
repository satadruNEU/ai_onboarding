import { useState, useRef, useEffect } from 'react';

export default function ChatPanel({ scenario, onChatDone }) {
    const [messages, setMessages] = useState([]);
    const [chatStep, setChatStep] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [subLabel, setSubLabel] = useState('Tell us about your team');
    const [aiDotColor, setAiDotColor] = useState(undefined);
    const messagesRef = useRef(null);
    const inputRef = useRef(null);
    const initRef = useRef(false);

    const scrollBottom = () => {
        setTimeout(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, 50);
    };

    // Initialize with user's first message
    useEffect(() => {
        if (!scenario || initRef.current) return;
        initRef.current = true;
        const userInput = scenario.userInput;
        setMessages([{ role: 'user', text: userInput }]);
        setTimeout(() => {
            setIsTyping(true);
            scrollBottom();
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { role: 'ai', text: scenario.conversation[0].text }]);
                setChatStep(1);
                setSubLabel('Getting to know your business…');
                scrollBottom();
            }, 1600);
        }, 500);
    }, [scenario]);

    const sendMessage = () => {
        if (isDone) return;
        const val = inputRef.current?.value?.trim();
        if (!val) return;
        inputRef.current.value = '';

        setMessages(prev => [...prev, { role: 'user', text: val }]);
        scrollBottom();

        const convo = scenario.conversation;
        if (chatStep < convo.length - 1) {
            const aiIdx = chatStep + 1;
            setTimeout(() => {
                setIsTyping(true);
                scrollBottom();
                setTimeout(() => {
                    setIsTyping(false);
                    if (aiIdx < convo.length) {
                        setMessages(prev => [...prev, { role: 'ai', text: convo[aiIdx].text }]);
                        setChatStep(aiIdx + 1);
                        scrollBottom();
                        if (aiIdx === convo.length - 1) {
                            setIsDone(true);
                            setSubLabel('Playbook ready ✓');
                            setAiDotColor('var(--green)');
                            onChatDone();
                        }
                    }
                }, 1400);
            }, 400);
        } else {
            setIsDone(true);
            setSubLabel('Playbook ready ✓');
            setAiDotColor('var(--green)');
            onChatDone();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <div className="split-left">
            <div className="split-left-header">
                <div className="split-left-title">
                    <div className="split-ai-dot" style={aiDotColor ? { background: aiDotColor } : undefined}></div>
                    Onboardly AI
                </div>
                <div className="split-left-sub">{subLabel}</div>
            </div>
            <div className="split-messages" ref={messagesRef}>
                {messages.map((m, i) => (
                    <div className={`msg ${m.role}`} key={i} style={{ opacity: 1, transform: 'translateY(0)' }}>
                        <div className={`msg-avatar ${m.role}`}>{m.role === 'ai' ? 'AI' : 'Y'}</div>
                        <div className="msg-body">
                            <div className="msg-name">{m.role === 'ai' ? 'Onboardly' : 'You'}</div>
                            <div className="msg-text">{m.text}</div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="msg ai" style={{ opacity: 1, transform: 'translateY(0)' }}>
                        <div className="msg-avatar ai">AI</div>
                        <div className="msg-body">
                            <div className="msg-name">Onboardly</div>
                            <div className="msg-text">
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="split-input-area">
                <textarea className="split-input" ref={inputRef} placeholder="Reply…" rows="1" onKeyDown={handleKeyDown} disabled={isDone} />
                <button className="split-send" onClick={sendMessage} disabled={isDone}>→</button>
            </div>
        </div>
    );
}
