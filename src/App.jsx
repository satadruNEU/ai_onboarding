import { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import ContextChatScreen from './components/ContextChatScreen';
import SplitScreen from './components/SplitScreen';
import DashboardScreen from './components/DashboardScreen';
import { SCENARIOS } from './data/scenarios';

export default function App() {
    const [screen, setScreen] = useState('welcome'); // welcome | auth | context | split | dashboard
    const [scenario, setScenario] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);

    const handleFillExample = useCallback((type) => {
        setScenario(SCENARIOS[type]);
    }, []);

    const handleStart = useCallback((customInput) => {
        // If a scenario wasn't selected via chips, or user typed custom text, create a generic scenario
        if (!scenario || (customInput && customInput !== scenario.userInput)) {
            setScenario({
                type: 'custom',
                userInput: customInput || SCENARIOS.restaurant.userInput,
                subject: 'Custom Onboarding',
                generatedTitle: 'Custom Playbook'
            });
        }
        setScreen('auth');
    }, [scenario]);

    const handleAuth = useCallback(() => {
        setScreen('context');
    }, []);

    const handleContextComplete = useCallback((messages) => {
        setChatHistory(messages || []);
        setScreen('split');
    }, []);

    const handleGoToDashboard = useCallback(() => setScreen('dashboard'), []);
    const handleBackToPlaybook = useCallback(() => setScreen('split'), []);
    const handleSignOut = useCallback(() => {
        setScreen('welcome');
        setScenario(null);
        setChatHistory([]);
    }, []);

    return (
        <>
            <WelcomeScreen
                active={screen === 'welcome'}
                scenario={scenario}
                onStart={handleStart}
                onFillExample={handleFillExample}
            />

            <AuthScreen
                active={screen === 'auth'}
                onAuth={handleAuth}
            />

            <ContextChatScreen
                active={screen === 'context'}
                scenario={scenario}
                onComplete={handleContextComplete}
                onGoToDashboard={handleGoToDashboard}
            />

            {(screen === 'split' || screen === 'dashboard') && (
                <SplitScreen
                    active={screen === 'split'}
                    scenario={scenario}
                    chatHistory={chatHistory}
                    onGoToDashboard={handleGoToDashboard}
                    onSignOut={handleSignOut}
                />
            )}

            {screen === 'dashboard' && (
                <DashboardScreen
                    active={screen === 'dashboard'}
                    scenario={scenario}
                    onBack={handleBackToPlaybook}
                    onStart={handleStart}
                    onFillExample={handleFillExample}
                    onSignOut={handleSignOut}
                />
            )}
        </>
    );
}

