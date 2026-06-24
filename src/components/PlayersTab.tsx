import React from 'react';
import { Player } from '@/lib/data';
import { getTeamDisplay } from '@/lib/teams';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

interface PlayersTabProps {
  players: Player[];
  onGoToPicks?: () => void;
}

export const PlayersTab: React.FC<PlayersTabProps> = ({
  players,
  onGoToPicks,
}) => {
  return (
    <div className="space-y-6">
      <Card padding="none">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight">Roster</h3>
          <span className="text-xs text-[var(--text-tertiary)] font-medium">
            {players.length} of 25 players
          </span>
        </div>

        {players.length === 0 ? (
          <EmptyState
            title="No players yet"
            description="Contact the league administrator to add players."
          />
        ) : (
          <ul className="divide-y divide-[var(--border-subtle)]">
            {players.map((player) => {
              const champion = getTeamDisplay(player.championPick);
              return (
                <li
                  key={player.id}
                  className="px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-sm font-medium text-[var(--text-secondary)]">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--text-primary)] truncate">{player.name}</p>
                      <p className="text-sm text-[var(--text-secondary)] truncate">
                        Champion pick: {champion.flag} {champion.name}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {players.length > 0 && onGoToPicks && (
          <div className="px-6 py-4 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" className="w-full sm:w-auto" onClick={onGoToPicks}>
              Enter bracket picks →
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

