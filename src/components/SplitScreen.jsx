import { useState, useCallback } from 'react';
import ChatPanel from './ChatPanel';
import BuilderPanel from './BuilderPanel';
import SubjectPanel from './SubjectPanel';

export default function SplitScreen({ active, scenario, onGoToDashboard }) {
    const [chatDone, setChatDone] = useState(false);
    const [publishState, setPublishState] = useState('idle'); // idle | publishing | done
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelSubject, setPanelSubject] = useState(null);
    const [panelGroup, setPanelGroup] = useState(null);
    const [panelColor, setPanelColor] = useState(null);

    const handleChatDone = useCallback(() => setChatDone(true), []);

    const handlePublish = useCallback(() => {
        setPublishState('publishing');
        setTimeout(() => setPublishState('done'), 1800);
    }, []);

    const openSubject = useCallback((sub, group, color) => {
        setPanelSubject(sub);
        setPanelGroup(group);
        setPanelColor(color);
        setPanelOpen(true);
    }, []);

    const closeSubject = useCallback(() => setPanelOpen(false), []);

    return (
        <>
            <div className={`screen ${active ? 'active' : ''}`} id="screen-split">
                <ChatPanel scenario={scenario} onChatDone={handleChatDone} />
                <BuilderPanel
                    scenario={scenario}
                    chatDone={chatDone}
                    publishState={publishState}
                    onPublish={handlePublish}
                    onOpenSubject={openSubject}
                    onGoToDashboard={onGoToDashboard}
                />
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
