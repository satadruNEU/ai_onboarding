import { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft, Pencil, ArrowRight, BookOpen, Clock, Brain,
    Sparkles, ChevronRight, AlertCircle, Trash2, Plus,
    Check, X, ArrowUp, ArrowDown
} from 'lucide-react';
import { SUBJECT_CONTENT, getFallbackContent } from '../data/subjectContent';

// Helper for auto-resizing textareas
const AutoResizeTextarea = ({ value, onChange, placeholder, className, style }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = ref.current.scrollHeight + 'px';
        }
    }, [value]);
    return (
        <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`lt-edit-textarea ${className || ''}`}
            style={{ overflow: 'hidden', resize: 'none', ...style }}
            rows={1}
        />
    );
};

export default function SubjectPanel({ isOpen, onClose, subjectName, groupName, groupColor }) {
    const [expandedStep, setExpandedStep] = useState('0-0');
    const [isEditing, setIsEditing] = useState(false);

    // Original data from the mock DB
    const [originalData, setOriginalData] = useState(null);
    // Local state for editing
    const [editData, setEditData] = useState(null);
    const [quizAnswered, setQuizAnswered] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setQuizAnswered(null);
            if (isEditing) setIsEditing(false); // also a good idea to reset edit mode optionally
        }
    }, [isOpen, isEditing]);

    // Initialize data when subject changes
    useEffect(() => {
        if (subjectName) {
            const data = SUBJECT_CONTENT[subjectName] || getFallbackContent(subjectName, groupName);
            // Deep clone to ensure we don't accidentally mutate original mock data
            const cloned = JSON.parse(JSON.stringify(data));
            setOriginalData(cloned);
            setEditData(JSON.parse(JSON.stringify(cloned)));
            setIsEditing(false);
            setExpandedStep(null);
        }
    }, [subjectName, groupName]);

    if (!subjectName || !originalData || !editData) return null;

    // The data we render comes from editData if we're in edit mode, else originalData
    const data = isEditing ? editData : originalData;

    const toggleStep = (key) => setExpandedStep(prev => prev === key ? null : key);

    // Quiz taking logic (view mode)
    const answerQuiz = (optIdx, correct) => {
        if (isEditing || quizAnswered) return;
        setQuizAnswered({ optIdx, correct });
    };

    // --- Edit Mode Handlers ---
    const startEditing = () => {
        setEditData(JSON.parse(JSON.stringify(originalData))); // fresh clone
        setIsEditing(true);
        setExpandedStep('0-0'); // auto-expand first step to show editability
    };

    const handleSave = () => {
        // Update stats based on editData
        const newTotalSteps = editData.topics.reduce((acc, t) => acc + t.steps.length, 0);
        const newData = {
            ...editData,
            steps: newTotalSteps,
        };
        setOriginalData(newData);
        setEditData(JSON.parse(JSON.stringify(newData)));
        setIsEditing(false);
    };

    const handleDiscard = () => {
        setEditData(JSON.parse(JSON.stringify(originalData)));
        setIsEditing(false);
    };

    // Topic handlers
    const addTopic = () => {
        const newData = { ...editData };
        newData.topics.push({
            label: 'New Section',
            steps: [{ title: 'New Step', preview: 'Brief description', content: 'What they need to know...', tags: [] }]
        });
        setEditData(newData);
        setExpandedStep(`${newData.topics.length - 1}-0`);
    };
    const removeTopic = (ti) => {
        const newData = { ...editData };
        newData.topics.splice(ti, 1);
        setEditData(newData);
    };
    const updateTopicLabel = (ti, val) => {
        const newData = { ...editData };
        newData.topics[ti].label = val;
        setEditData(newData);
    };

    // Step handlers
    const addStep = (ti) => {
        const newData = { ...editData };
        newData.topics[ti].steps.push({ title: 'New Step', preview: 'Brief description', content: 'Content goes here...', tags: [] });
        setEditData(newData);
        setExpandedStep(`${ti}-${newData.topics[ti].steps.length - 1}`);
    };
    const removeStep = (ti, si) => {
        const newData = { ...editData };
        newData.topics[ti].steps.splice(si, 1);
        setEditData(newData);
    };
    const updateStep = (ti, si, field, val) => {
        const newData = { ...editData };
        newData.topics[ti].steps[si][field] = val;
        setEditData(newData);
    };
    const moveStep = (ti, si, dir) => {
        const newData = { ...editData };
        const steps = newData.topics[ti].steps;
        if (dir === -1 && si > 0) {
            [steps[si - 1], steps[si]] = [steps[si], steps[si - 1]];
            setExpandedStep(`${ti}-${si - 1}`);
        } else if (dir === 1 && si < steps.length - 1) {
            [steps[si + 1], steps[si]] = [steps[si], steps[si + 1]];
            setExpandedStep(`${ti}-${si + 1}`);
        }
        setEditData(newData);
    };
    const toggleStepTag = (ti, si, tag) => {
        const newData = { ...editData };
        const step = newData.topics[ti].steps[si];
        if (!step.tags) step.tags = [];
        if (step.tags.includes(tag)) {
            step.tags = step.tags.filter(t => t !== tag);
        } else {
            step.tags.push(tag);
        }
        setEditData(newData);
    };

    // Quiz handlers
    const addQuiz = () => {
        setEditData({
            ...editData,
            quiz: {
                q: 'New Question',
                options: [{ text: 'Option A', correct: true }, { text: 'Option B', correct: false }],
                feedback: { correct: 'Correct explanation', wrong: 'Incorrect explanation' }
            }
        });
    };
    const removeQuiz = () => {
        const newData = { ...editData };
        delete newData.quiz;
        setEditData(newData);
    };
    const updateQuizField = (field, subfield, val) => {
        const newData = { ...editData };
        if (subfield) {
            newData.quiz[field][subfield] = val;
        } else {
            newData.quiz[field] = val;
        }
        setEditData(newData);
    };
    const addQuizOption = () => {
        const newData = { ...editData };
        newData.quiz.options.push({ text: 'New Option', correct: false });
        setEditData(newData);
    };
    const removeQuizOption = (oi) => {
        const newData = { ...editData };
        // Don't remove if it's the last option
        if (newData.quiz.options.length <= 1) return;
        // If removing the correct option, make the first remaining one correct
        if (newData.quiz.options[oi].correct) {
            newData.quiz.options.splice(oi, 1);
            if (newData.quiz.options.length > 0) newData.quiz.options[0].correct = true;
        } else {
            newData.quiz.options.splice(oi, 1);
        }
        setEditData(newData);
    };
    const updateQuizOption = (oi, text) => {
        const newData = { ...editData };
        newData.quiz.options[oi].text = text;
        setEditData(newData);
    };
    const setQuizCorrectOption = (oi) => {
        const newData = { ...editData };
        newData.quiz.options.forEach((o, i) => o.correct = (i === oi));
        setEditData(newData);
    };

    const tagsAvailable = ['required', 'tip', 'video'];
    const tagIcons = { required: <AlertCircle size={10} />, tip: <Sparkles size={10} />, video: <ChevronRight size={10} /> };
    const tagLabels = { required: 'Required', tip: 'Pro tip', video: 'Video' };
    const tagCls = { required: 'step-tag-required', tip: 'step-tag-tip', video: 'step-tag-video' };

    return (
        <div
            id="subject-panel"
            className={`lt-panel inline ${isEditing ? 'editing' : ''}`}
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                transform: 'none',
                boxShadow: 'none',
                borderRadius: '12px',
                overflow: 'hidden',
                animation: 'fade-in-scale 0.25s forwards'
            }}
        >
            <div className="lt-panel-header">
                {!isEditing && (
                    <button className="lt-panel-back" onClick={onClose}>
                        <ArrowLeft size={16} strokeWidth={2} />
                    </button>
                )}
                <div className="lt-panel-header-info">
                    <div className="lt-panel-breadcrumb">{groupName} · Subject</div>
                    <div className="lt-panel-title">{subjectName}</div>
                </div>
                <div className="lt-panel-actions">
                    {!isEditing ? (
                        <button className="lt-panel-action-btn" onClick={startEditing}>
                            <Pencil size={12} strokeWidth={2} />
                            Edit
                        </button>
                    ) : (
                        <>
                            <button className="lt-panel-action-btn" onClick={handleDiscard}>
                                <X size={12} strokeWidth={2} />
                                Discard
                            </button>
                            <button className="lt-panel-action-btn primary" onClick={handleSave}>
                                <Check size={12} strokeWidth={2} />
                                Save changes
                            </button>
                        </>
                    )}
                </div>
            </div>

            {!isEditing && (
                <div className="lt-panel-meta">
                    <div className="lt-panel-meta-item">
                        <BookOpen size={13} strokeWidth={1.5} />
                        <span>{originalData.steps} steps</span>
                    </div>
                    <div className="lt-panel-meta-item">
                        <Clock size={13} strokeWidth={1.5} />
                        <span>{originalData.time}</span>
                    </div>
                    <div className="lt-panel-meta-item">
                        <Brain size={13} strokeWidth={1.5} />
                        <span>{originalData.quiz ? '1 quiz' : 'No quiz'}</span>
                    </div>
                </div>
            )}

            <div className="lt-panel-body">
                {!isEditing && (
                    <div className="lt-panel-group-banner">
                        <div className="lt-panel-group-icon">
                            <Sparkles size={14} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="lt-panel-group-name">{groupName}</div>
                            <div className="lt-panel-group-sub">AI-generated draft · {originalData.time} read · {originalData.steps} steps</div>
                        </div>
                    </div>
                )}

                {data.topics.map((topic, ti) => (
                    <div className="lt-topic-section" key={ti}>
                        <div className="lt-topic-header-row">
                            {isEditing ? (
                                <div className="lt-edit-topic-wrap">
                                    <input
                                        value={topic.label}
                                        onChange={(e) => updateTopicLabel(ti, e.target.value)}
                                        className="lt-edit-input lt-topic-input"
                                        placeholder="Section Title"
                                    />
                                    <button className="lt-edit-icon-btn remove-topic" onClick={() => removeTopic(ti)}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ) : (
                                <div className="lt-topic-label">{topic.label}</div>
                            )}
                        </div>

                        {topic.steps.map((step, si) => {
                            const key = `${ti}-${si}`;
                            const isExpanded = expandedStep === key;
                            return (
                                <div className={`lt-step-card ${isExpanded ? 'expanded' : ''} ${isEditing ? 'editing' : ''}`} key={si}>
                                    <div className="lt-step-header-area" onClick={() => !isEditing && toggleStep(key)}>
                                        <div className="lt-step-num">{si + 1}</div>
                                        <div className="lt-step-body">
                                            {isEditing ? (
                                                // Edit Mode Row
                                                <div className="lt-edit-step-summary">
                                                    <input
                                                        value={step.title}
                                                        onChange={(e) => updateStep(ti, si, 'title', e.target.value)}
                                                        className="lt-edit-input lt-step-title-input"
                                                        placeholder="Step Title"
                                                        onClick={() => { if (isEditing && expandedStep !== key) toggleStep(key); }}
                                                    />
                                                    {!isExpanded && (
                                                        <input
                                                            value={step.preview}
                                                            onChange={(e) => updateStep(ti, si, 'preview', e.target.value)}
                                                            className="lt-edit-input lt-step-preview-input"
                                                            placeholder="Short preview..."
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                // View Mode Row
                                                <>
                                                    <div className="lt-step-title">{step.title}</div>
                                                    <div className="lt-step-preview">{step.preview}</div>
                                                </>
                                            )}

                                            <div className="lt-step-content">
                                                {isEditing ? (
                                                    <div className="lt-edit-content-pane">
                                                        {/* Edit Tags */}
                                                        <div className="lt-edit-tags-bar">
                                                            <span className="lt-edit-tags-label">Tags:</span>
                                                            {tagsAvailable.map(tag => {
                                                                const isActive = (step.tags || []).includes(tag);
                                                                return (
                                                                    <button
                                                                        key={tag}
                                                                        onClick={() => toggleStepTag(ti, si, tag)}
                                                                        className={`lt-edit-tag-toggle ${isActive ? 'active ' + tagCls[tag] : ''}`}
                                                                    >
                                                                        {tagIcons[tag]} {tagLabels[tag]}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        {/* Edit Content */}
                                                        <AutoResizeTextarea
                                                            value={step.content}
                                                            onChange={(e) => updateStep(ti, si, 'content', e.target.value)}
                                                            placeholder="Step content..."
                                                            className="lt-step-content-textarea"
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {step.tags && step.tags.length > 0 && <div className="lt-step-tags">
                                                            {step.tags.map(t => (
                                                                <span key={t} className={`lt-step-tag ${tagCls[t] || ''}`}>
                                                                    {tagIcons[t]} {tagLabels[t] || t}
                                                                </span>
                                                            ))}
                                                        </div>}
                                                        {step.content.split('\n').filter(l => l.trim()).map((l, i) => <p key={i}>{l}</p>)}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {isEditing ? (
                                            <div className="lt-edit-step-actions">
                                                <div className="lt-edit-arrows">
                                                    <button disabled={si === 0} onClick={() => moveStep(ti, si, -1)}><ArrowUp size={12} /></button>
                                                    <button disabled={si === topic.steps.length - 1} onClick={() => moveStep(ti, si, 1)}><ArrowDown size={12} /></button>
                                                </div>
                                                <button className="lt-edit-icon-btn danger" onClick={() => removeStep(ti, si)}><Trash2 size={12} /></button>
                                                <button className="lt-step-chevron" onClick={() => toggleStep(key)}>
                                                    <ChevronRight size={14} strokeWidth={2} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="lt-step-chevron">
                                                <ChevronRight size={14} strokeWidth={2} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {isEditing && (
                            <button className="lt-edit-add-btn" onClick={() => addStep(ti)}>
                                <Plus size={12} strokeWidth={2} /> Add step to {topic.label || 'section'}
                            </button>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <div className="lt-add-topic-wrap">
                        <button className="lt-edit-add-btn primary-outline" onClick={addTopic}>
                            <Plus size={14} strokeWidth={2} /> Add Section
                        </button>
                    </div>
                )}

                {data.quiz ? (
                    <div className={`lt-quiz-section ${isEditing ? 'editing' : ''}`}>
                        <div className="lt-quiz-header">
                            <div className="lt-quiz-icon">
                                <Brain size={16} strokeWidth={1.5} />
                            </div>
                            <div className="lt-quiz-title">Knowledge check</div>
                            <div className="lt-quiz-meta">
                                {isEditing ? (
                                    <button className="lt-edit-icon-btn remove-topic" onClick={removeQuiz}>
                                        <Trash2 size={12} />
                                    </button>
                                ) : (
                                    <span>1 question</span>
                                )}
                            </div>
                        </div>
                        <div className="lt-quiz-body">
                            {isEditing ? (
                                <AutoResizeTextarea
                                    value={data.quiz.q}
                                    onChange={(e) => updateQuizField('q', null, e.target.value)}
                                    placeholder="Question text..."
                                    className="lt-edit-quiz-q"
                                />
                            ) : (
                                <div className="lt-quiz-q">{data.quiz.q}</div>
                            )}

                            <div className="quiz-options">
                                {data.quiz.options.map((opt, i) => {
                                    let quizClass = '';
                                    let quizStyle = {};
                                    if (!isEditing && quizAnswered) {
                                        quizStyle = { pointerEvents: 'none', opacity: quizAnswered.optIdx === i ? 1 : 0.5 };
                                        if (quizAnswered.optIdx === i) {
                                            quizClass = opt.correct ? 'correct' : 'wrong';
                                        }
                                    }

                                    return (
                                        <div
                                            className={`quiz-option ${quizClass}`}
                                            style={quizStyle}
                                            key={i}
                                            onClick={() => answerQuiz(i, opt.correct)}
                                        >
                                            {isEditing ? (
                                                <div className="lt-edit-quiz-opt-row">
                                                    <div
                                                        className={`lt-edit-radio ${opt.correct ? 'checked' : ''}`}
                                                        onClick={() => setQuizCorrectOption(i)}
                                                    >
                                                        {opt.correct && <div className="dot" />}
                                                    </div>
                                                    <input
                                                        value={opt.text}
                                                        onChange={(e) => updateQuizOption(i, e.target.value)}
                                                        className="lt-edit-input"
                                                        placeholder={`Option ${i + 1}`}
                                                    />
                                                    <button className="lt-edit-icon-btn remove-opt" onClick={() => removeQuizOption(i)}>
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="quiz-option-dot"></div>
                                                    {opt.text}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                                {isEditing && (
                                    <button className="lt-edit-add-btn small" onClick={addQuizOption}>
                                        <Plus size={10} strokeWidth={2} /> Add option
                                    </button>
                                )}
                            </div>
                            {!isEditing && quizAnswered && (
                                <div className={`quiz-feedback show ${quizAnswered.correct ? 'success' : 'fail'}`}>
                                    {quizAnswered.correct ? data.quiz.feedback.correct : data.quiz.feedback.wrong}
                                </div>
                            )}

                            {isEditing && (
                                <div className="lt-edit-quiz-feedback">
                                    <div className="feedback-block correct">
                                        <div className="fb-label"><Check size={10} /> Correct feedback</div>
                                        <AutoResizeTextarea
                                            value={data.quiz.feedback.correct}
                                            onChange={(e) => updateQuizField('feedback', 'correct', e.target.value)}
                                            placeholder="Explain why it's correct..."
                                        />
                                    </div>
                                    <div className="feedback-block wrong">
                                        <div className="fb-label"><X size={10} /> Incorrect feedback</div>
                                        <AutoResizeTextarea
                                            value={data.quiz.feedback.wrong}
                                            onChange={(e) => updateQuizField('feedback', 'wrong', e.target.value)}
                                            placeholder="Explain why it's wrong..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    isEditing && (
                        <button className="lt-edit-add-btn primary-outline" onClick={addQuiz} style={{ marginTop: 20 }}>
                            <Brain size={14} strokeWidth={2} /> Add Knowledge Check
                        </button>
                    )
                )}
            </div>

            {!isEditing && (
                <div className="lt-panel-footer">
                    <div className="lt-panel-footer-info">
                        Generated from your description · <strong>Ready to customise</strong>
                    </div>
                    <button className="lt-panel-action-btn primary" onClick={onClose}>Done</button>
                </div>
            )}
        </div>
    );
}
