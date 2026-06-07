import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'leaderboard', name: 'Standings', icon: '🏆' },
  { id: 'players', name: 'Neighbors', icon: '👥' },
  { id: 'groups', name: 'Groups', icon: '⚽' },
  { id: 'picks', name: 'Picks', icon: '✍️' },
  { id: 'rules', name: 'Rules', icon: '📜' },
  { id: 'admin', name: 'Pitch Side', icon: '⚙️' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-8 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl shadow-inner border border-white/50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-200 transform ${
            activeTab === tab.id
              ? 'bg-[#2d5a27] text-white shadow-lg scale-105'
              : 'text-[#1a472a] hover:bg-white/60 active:scale-95'
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};
