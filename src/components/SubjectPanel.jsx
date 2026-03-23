import { useState } from 'react';
import { ArrowLeft, Pencil, ArrowRight, BookOpen, Clock, Brain, Sparkles, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { SUBJECT_CONTENT, getFallbackContent } from '../data/subjectContent';

export default function SubjectPanel({ isOpen, onClose, subjectName, groupName, groupColor }) {
    const [expandedStep, setExpandedStep] = useState(null);

    if (!subjectName) return null;
    const data = SUBJECT_CONTENT[subjectName] || getFallbackContent(subjectName, groupName);

    const toggleStep = (key) => setExpandedStep(prev => prev === key ? null : key);

    const answerQuiz = (e, optIdx, correct) => {
        const container = e.currentTarget.parentElement;
        if (container.dataset.answered) return;
        container.dataset.answered = '1';
        container.querySelectorAll('.quiz-option').forEach(opt => { opt.style.pointerEvents = 'none'; opt.style.opacity = '0.5'; });
        e.currentTarget.style.opacity = '1';
        e.currentTarget.classList.add(correct ? 'correct' : 'wrong');
        const fb = container.parentElement.querySelector('.quiz-feedback');
        if (fb) {
            fb.className = 'quiz-feedback show ' + (correct ? 'success' : 'fail');
            fb.textContent = correct ? data.quiz.feedback.correct : data.quiz.feedback.wrong;
        }
    };

    const tagIcons = { required: <AlertCircle size={10} />, tip: <Sparkles size={10} />, video: <ChevronRight size={10} /> };
    const tagLabels = { required: 'Required', tip: 'Pro tip', video: 'Video' };
    const tagCls = { required: 'step-tag-required', tip: 'step-tag-tip', video: 'step-tag-video' };

    return (
        <>
            <div id="panel-scrim" className={`lt-scrim ${isOpen ? 'visible' : ''}`} onClick={onClose} />
            <div id="subject-panel" className={`lt-panel ${isOpen ? 'open' : ''}`}>
                <div className="lt-panel-header">
                    <button className="lt-panel-back" onClick={onClose}>
                        <ArrowLeft size={16} strokeWidth={2} />
                    </button>
                    <div className="lt-panel-header-info">
                        <div className="lt-panel-breadcrumb">{groupName} · Subject</div>
                        <div className="lt-panel-title">{subjectName}</div>
                    </div>
                    <div className="lt-panel-actions">
                        <button className="lt-panel-action-btn">
                            <Pencil size={12} strokeWidth={2} />
                            Edit
                        </button>
                        <button className="lt-panel-action-btn primary" onClick={onClose}>
                            Assign
                            <ArrowRight size={12} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                <div className="lt-panel-meta">
                    <div className="lt-panel-meta-item">
                        <BookOpen size={13} strokeWidth={1.5} />
                        <span>{data.steps} steps</span>
                    </div>
                    <div className="lt-panel-meta-item">
                        <Clock size={13} strokeWidth={1.5} />
                        <span>{data.time}</span>
                    </div>
                    <div className="lt-panel-meta-item">
                        <Brain size={13} strokeWidth={1.5} />
                        <span>1 quiz</span>
                    </div>
                    <div className="lt-panel-status-pill">
                        <div className="lt-status-pulse"></div>
                        AI Draft
                    </div>
                </div>

                <div className="lt-panel-body">
                    <div className="lt-panel-group-banner">
                        <div className="lt-panel-group-icon">
                            <Sparkles size={14} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="lt-panel-group-name">{groupName}</div>
                            <div className="lt-panel-group-sub">AI-generated draft · {data.time} read · {data.steps} steps</div>
                        </div>
                    </div>

                    {data.topics.map((topic, ti) => (
                        <div className="lt-topic-section" key={ti}>
                            <div className="lt-topic-label">{topic.label}</div>
                            {topic.steps.map((step, si) => {
                                const key = `${ti}-${si}`;
                                const isExpanded = expandedStep === key;
                                return (
                                    <div className={`lt-step-card ${isExpanded ? 'expanded' : ''}`} key={si} onClick={() => toggleStep(key)}>
                                        <div className="lt-step-num">{si + 1}</div>
                                        <div className="lt-step-body">
                                            <div className="lt-step-title">{step.title}</div>
                                            <div className="lt-step-preview">{step.preview}</div>
                                            <div className="lt-step-content">
                                                {step.tags && <div className="lt-step-tags">
                                                    {step.tags.map(t => (
                                                        <span key={t} className={`lt-step-tag ${tagCls[t] || ''}`}>
                                                            {tagIcons[t]} {tagLabels[t] || t}
                                                        </span>
                                                    ))}
                                                </div>}
                                                {step.content.split('\n').filter(l => l.trim()).map((l, i) => <p key={i}>{l}</p>)}
                                            </div>
                                        </div>
                                        <div className="lt-step-chevron">
                                            <ChevronRight size={14} strokeWidth={2} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    <div className="lt-quiz-section">
                        <div className="lt-quiz-header">
                            <div className="lt-quiz-icon">
                                <Brain size={16} strokeWidth={1.5} />
                            </div>
                            <div className="lt-quiz-title">Knowledge check</div>
                            <div className="lt-quiz-meta">1 question</div>
                        </div>
                        <div className="lt-quiz-body">
                            <div className="lt-quiz-q">{data.quiz.q}</div>
                            <div className="quiz-options">
                                {data.quiz.options.map((opt, i) => (
                                    <div className="quiz-option" key={i} onClick={(e) => answerQuiz(e, i, opt.correct)}>
                                        <div className="quiz-option-dot"></div>
                                        {opt.text}
                                    </div>
                                ))}
                            </div>
                            <div className="quiz-feedback"></div>
                        </div>
                    </div>
                </div>

                <div className="lt-panel-footer">
                    <div className="lt-panel-footer-info">
                        Generated from your description · <strong>Ready to customise</strong>
                    </div>
                    <button className="lt-panel-action-btn" onClick={onClose}>Done</button>
                </div>
            </div>
        </>
    );
}
