import { useState } from 'react';
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

    const tagLabels = { required: '● Required', tip: '💡 Pro tip', video: '▶ Video' };
    const tagCls = { required: 'step-tag-required', tip: 'step-tag-tip', video: 'step-tag-video' };

    return (
        <>
            <div id="panel-scrim" className={isOpen ? 'visible' : ''} onClick={onClose} />
            <div id="subject-panel" className={isOpen ? 'open' : ''}>
                <div className="panel-header">
                    <div className="panel-back" onClick={onClose}>←</div>
                    <div className="panel-header-info">
                        <div className="panel-breadcrumb">{groupName} · Subject</div>
                        <div className="panel-title">{subjectName}</div>
                    </div>
                    <div className="panel-actions">
                        <div className="panel-action-btn">✏️ Edit</div>
                        <div className="panel-action-btn primary" onClick={onClose}>Assign →</div>
                    </div>
                </div>
                <div className="panel-meta">
                    <div className="panel-meta-item">📖 <span className="panel-meta-val">{data.steps} steps</span></div>
                    <div className="panel-meta-item">⏱ <span className="panel-meta-val">{data.time}</span></div>
                    <div className="panel-meta-item">🧠 <span className="panel-meta-val">1 quiz</span></div>
                    <div className="panel-status-pill"><div className="status-pulse"></div>AI Draft</div>
                </div>
                <div className="panel-body">
                    <div style={{ background: `${groupColor}12`, border: `1px solid ${groupColor}28`, borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${groupColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>✦</div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{groupName}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>AI-generated draft · {data.time} read · {data.steps} steps</div>
                        </div>
                    </div>

                    {data.topics.map((topic, ti) => (
                        <div className="topic-section" key={ti} style={{ opacity: 1, transform: 'translateY(0)' }}>
                            <div className="topic-label">{topic.label}</div>
                            {topic.steps.map((step, si) => {
                                const key = `${ti}-${si}`;
                                const isExpanded = expandedStep === key;
                                return (
                                    <div className={`step-card ${isExpanded ? 'expanded' : ''}`} key={si} onClick={() => toggleStep(key)}>
                                        <div className="step-num-badge">{si + 1}</div>
                                        <div className="step-body">
                                            <div className="step-title">{step.title}</div>
                                            <div className="step-preview">{step.preview}</div>
                                            <div className="step-content">
                                                {step.tags && <div style={{ marginBottom: 10 }}>
                                                    {step.tags.map(t => <span key={t} className={`step-tag ${tagCls[t] || ''}`}>{tagLabels[t] || t}</span>)}
                                                </div>}
                                                {step.content.split('\n').filter(l => l.trim()).map((l, i) => <p key={i}>{l}</p>)}
                                            </div>
                                        </div>
                                        <div className="step-chevron">▶</div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    <div className="quiz-section" style={{ opacity: 1, transform: 'translateY(0)' }}>
                        <div className="quiz-header">
                            <div className="quiz-icon">🧠</div>
                            <div className="quiz-title">Knowledge check</div>
                            <div className="quiz-meta">1 question</div>
                        </div>
                        <div className="quiz-body">
                            <div className="quiz-q">{data.quiz.q}</div>
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
                <div className="panel-footer">
                    <div className="panel-footer-info">Generated from your description · <strong>Ready to customise</strong></div>
                    <div className="panel-action-btn" onClick={onClose}>Done</div>
                </div>
            </div>
        </>
    );
}
