import React from 'react';

export type TabId = 'leaderboard' | 'players' | 'picks' | 'rules' | 'admin';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: TabId) => void;
}

const tabs: { id: TabId; name: string; shortName: string }[] = [
  { id: 'leaderboard', name: 'Standings', shortName: 'Standings' },
  { id: 'players', name: 'Players', shortName: 'Players' },
  { id: 'picks', name: 'Picks', shortName: 'Picks' },
  { id: 'rules', name: 'Rules', shortName: 'Rules' },
  { id: 'admin', name: 'Admin', shortName: 'Admin' },
];

function NavButton({
  tab,
  activeTab,
  setActiveTab,
  compact,
}: {
  tab: (typeof tabs)[number];
  activeTab: string;
  setActiveTab: (tab: TabId) => void;
  compact?: boolean;
}) {
  const isActive = activeTab === tab.id;
  return (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={`font-medium transition-colors duration-150 ${
        compact
          ? `flex-1 py-2.5 text-[11px] sm:text-xs border-t-2 ${
              isActive
                ? 'text-[var(--text-primary)] border-[var(--accent)]'
                : 'text-[var(--text-tertiary)] border-transparent'
            }`
          : `px-4 py-2 text-sm rounded-[var(--radius-md)] ${
              isActive
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)]'
            }`
      }`}
    >
      {compact ? tab.shortName : tab.name}
    </button>
  );
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Desktop / tablet top nav */}
      <nav className="hidden sm:flex items-center gap-1 p-1 bg-[var(--surface-muted)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)]">
        {tabs.map((tab) => (
          <NavButton
            key={tab.id}
            tab={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex max-w-lg mx-auto">
          {tabs.map((tab) => (
            <NavButton
              key={tab.id}
              tab={tab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              compact
            />
          ))}
        </div>
      </nav>
    </>
  );
};
