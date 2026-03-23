export const TEAM_DATA = {
    restaurant: [
        { name: 'Jordan Kim', initials: 'JK', role: 'Front of House', color: '#e8e8e8', bg: '#e8e8e818', pct: 80, modules: 4, status: 'on-track', lastSeen: '2h ago' },
        { name: 'Maria Santos', initials: 'MS', role: 'Front of House', color: '#e8e8e8', bg: '#e8e8e818', pct: 60, modules: 3, status: 'on-track', lastSeen: '4h ago' },
        { name: 'Tom Reeves', initials: 'TR', role: 'Kitchen Staff', color: '#888888', bg: '#88888818', pct: 100, modules: 5, status: 'complete', lastSeen: '1h ago' },
        { name: 'Priya Nair', initials: 'PN', role: 'Kitchen Staff', color: '#888888', bg: '#88888818', pct: 40, modules: 2, status: 'at-risk', lastSeen: '2d ago' },
        { name: 'Alex Chen', initials: 'AC', role: 'Management', color: '#06b6d4', bg: '#06b6d418', pct: 100, modules: 4, status: 'complete', lastSeen: '30m ago' },
        { name: 'Sam Okafor', initials: 'SO', role: 'General Staff', color: '#10b981', bg: '#10b98118', pct: 20, modules: 1, status: 'at-risk', lastSeen: '3d ago' },
        { name: 'Lisa Park', initials: 'LP', role: 'Front of House', color: '#e8e8e8', bg: '#e8e8e818', pct: 0, modules: 0, status: 'not-started', lastSeen: 'Just invited' },
    ],
    retail: [
        { name: 'Emma Wilson', initials: 'EW', role: 'Sales Associate', color: '#e8e8e8', bg: '#e8e8e818', pct: 100, modules: 5, status: 'complete', lastSeen: '1h ago' },
        { name: 'Dan Moore', initials: 'DM', role: 'Sales Associate', color: '#e8e8e8', bg: '#e8e8e818', pct: 60, modules: 3, status: 'on-track', lastSeen: '3h ago' },
        { name: 'Chloe Adams', initials: 'CA', role: 'Stock & Ops', color: '#f59e0b', bg: '#f59e0b18', pct: 80, modules: 3, status: 'on-track', lastSeen: '2h ago' },
        { name: 'Ryan Lee', initials: 'RL', role: 'Cashier', color: '#10b981', bg: '#10b98118', pct: 33, modules: 1, status: 'at-risk', lastSeen: '2d ago' },
        { name: 'Nina Patel', initials: 'NP', role: 'Management', color: '#888888', bg: '#88888818', pct: 100, modules: 3, status: 'complete', lastSeen: '45m ago' },
    ],
    startup: [
        { name: 'Zara Osei', initials: 'ZO', role: 'Customer Success', color: '#e8e8e8', bg: '#e8e8e818', pct: 100, modules: 5, status: 'complete', lastSeen: '20m ago' },
        { name: 'Liam Torres', initials: 'LT', role: 'Customer Success', color: '#e8e8e8', bg: '#e8e8e818', pct: 80, modules: 4, status: 'on-track', lastSeen: '1h ago' },
        { name: 'Mei Zhang', initials: 'MZ', role: 'Engineering', color: '#10b981', bg: '#10b98118', pct: 75, modules: 3, status: 'on-track', lastSeen: '2h ago' },
        { name: 'Jake Owens', initials: 'JO', role: 'Sales', color: '#f59e0b', bg: '#f59e0b18', pct: 50, modules: 2, status: 'on-track', lastSeen: '4h ago' },
        { name: 'Ava Nguyen', initials: 'AN', role: 'Customer Success', color: '#e8e8e8', bg: '#e8e8e818', pct: 20, modules: 1, status: 'at-risk', lastSeen: '3d ago' },
        { name: 'Omar Hassan', initials: 'OH', role: 'Engineering', color: '#10b981', bg: '#10b98118', pct: 0, modules: 0, status: 'not-started', lastSeen: 'Just invited' },
    ]
};

export const ACTIVITY_DATA = {
    restaurant: [
        { color: '#4ade80', text: '<strong>Tom Reeves</strong> completed all Kitchen Staff training', time: '1h ago' },
        { color: '#e8e8e8', text: '<strong>Alex Chen</strong> completed Management onboarding', time: '2h ago' },
        { color: '#e8e8e8', text: '<strong>Jordan Kim</strong> passed the Guest Service Standards quiz', time: '3h ago' },
        { color: '#f59e0b', text: '<strong>Priya Nair</strong> hasn\'t logged in for 2 days — consider a nudge', time: '2d ago' },
        { color: '#e8e8e8', text: '<strong>Maria Santos</strong> started Food Safety & Hygiene', time: '4h ago' },
        { color: '#9898a6', text: '<strong>Lisa Park</strong> accepted their invite', time: '5h ago' },
    ],
    retail: [
        { color: '#4ade80', text: '<strong>Emma Wilson</strong> completed all Sales Associate training', time: '1h ago' },
        { color: '#4ade80', text: '<strong>Nina Patel</strong> completed Management onboarding', time: '2h ago' },
        { color: '#e8e8e8', text: '<strong>Chloe Adams</strong> passed the Inventory Management quiz', time: '3h ago' },
        { color: '#f59e0b', text: '<strong>Ryan Lee</strong> is falling behind — last active 2 days ago', time: '2d ago' },
        { color: '#e8e8e8', text: '<strong>Dan Moore</strong> started Visual Merchandising module', time: '4h ago' },
    ],
    startup: [
        { color: '#4ade80', text: '<strong>Zara Osei</strong> completed the full CS onboarding track', time: '20m ago' },
        { color: '#e8e8e8', text: '<strong>Liam Torres</strong> completed the Renewal Playbook module', time: '1h ago' },
        { color: '#e8e8e8', text: '<strong>Mei Zhang</strong> passed the Deployment Process quiz', time: '2h ago' },
        { color: '#f59e0b', text: '<strong>Ava Nguyen</strong> is at risk — only 20% complete after 3 days', time: '3d ago' },
        { color: '#9898a6', text: '<strong>Omar Hassan</strong> accepted their invite', time: '4h ago' },
    ]
};
