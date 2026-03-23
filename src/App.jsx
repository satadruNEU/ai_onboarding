import { useState, useCallback } from 'react';
import TopBar from './components/TopBar';
import WelcomeScreen from './components/WelcomeScreen';
import SplitScreen from './components/SplitScreen';
import DashboardScreen from './components/DashboardScreen';
import { SCENARIOS } from './data/scenarios';

export default function App() {
    const [screen, setScreen] = useState('welcome'); // welcome | split | dashboard
    const [scenario, setScenario] = useState(null);

    const handleFillExample = useCallback((type) => {
        setScenario(SCENARIOS[type]);
    }, []);

    const handleStart = useCallback(() => {
        if (!scenario) {
            setScenario(SCENARIOS.restaurant);
        }
        setScreen('split');
    }, [scenario]);

    const handleSwitchTab = useCallback((tab) => {
        if (tab === 'progress') setScreen('dashboard');
        else setScreen('split');
    }, []);

    const handleGoToDashboard = useCallback(() => setScreen('dashboard'), []);
    const handleBackToPlaybook = useCallback(() => setScreen('split'), []);

    return (
        <>
            {screen !== 'welcome' && <TopBar currentScreen={screen} onSwitchTab={handleSwitchTab} />}
            <WelcomeScreen
                active={screen === 'welcome'}
                scenario={scenario}
                onStart={handleStart}
                onFillExample={handleFillExample}
            />
            {screen !== 'welcome' && (
                <SplitScreen
                    active={screen === 'split'}
                    scenario={scenario}
                    onGoToDashboard={handleGoToDashboard}
                />
            )}
            {screen === 'dashboard' && (
                <DashboardScreen
                    active={screen === 'dashboard'}
                    scenario={scenario}
                    onBack={handleBackToPlaybook}
                />
            )}
        </>
    );
}
