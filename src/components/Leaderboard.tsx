import React, { useState } from 'react';
import { Player, Results } from '@/lib/data';
import { calculatePlayerScore, calculateScoreBreakdown } from '@/lib/scoring';
import { getTeamDisplay } from '@/lib/teams';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface LeaderboardProps {
  players: Player[];
  results: Results;
}

const rankStyles = [
  'bg-[var(--rank-gold)] text-[var(--text-primary)]',
  'bg-[var(--rank-silver)] text-[var(--text-primary)]',
  'bg-[var(--rank-bronze)] text-[var(--text-primary)]',
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ players, results }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rankedPlayers = [...players]
    .map((player) => ({
      ...player,
      score: calculatePlayerScore(player, results),
      breakdown: calculateScoreBreakdown(player, results),
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const hasResults =
    results.r32.length > 0 ||
    results.r16.length > 0 ||
    results.final !== '';

  if (rankedPlayers.length === 0) {
    return (
      <Card padding="none">
        <EmptyState
          title="No standings yet"
          description="Add players to the league to get started."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {rankedPlayers.length >= 3 && hasResults && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[1, 0, 2].map((idx) => {
            const player = rankedPlayers[idx];
            if (!player) return null;
            const champion = getTeamDisplay(player.championPick);
            const heights = ['pt-8', 'pt-4', 'pt-10'];
            return (
              <div
                key={player.id}
                className={`${heights[idx]} flex flex-col items-center text-center`}
              >
                <div
                  className={`w-full rounded-[var(--radius-lg)] border border-[var(--border)] p-4 ${idx === 0 ? 'bg-white shadow-[var(--shadow-md)]' : 'bg-[var(--surface-muted)]'}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mb-3 ${rankStyles[idx]}`}
                  >
                    {idx + 1}
                  </span>
                  <p className="font-semibold text-[var(--text-primary)] truncate">{player.name}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{player.score}</p>
                  <Badge variant="muted" className="mt-2">
                    {champion.flag} {champion.name}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Card padding="none">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-lg font-semibold tracking-tight">Standings</h2>
          {!hasResults && (
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
              Scores update once match results are entered in Admin.
            </p>
          )}
        </div>

        <ul className="divide-y divide-[var(--border-subtle)]">
          {rankedPlayers.map((player, index) => {
            const champion = getTeamDisplay(player.championPick);
            const isExpanded = expandedId === player.id;
            const showBreakdown = hasResults && isExpanded;

            return (
              <li key={player.id}>
                <button
                  type="button"
                  onClick={() =>
                    hasResults && setExpandedId(isExpanded ? null : player.id)
                  }
                  className={`w-full px-6 py-4 flex items-center gap-4 text-left transition-colors ${
                    hasResults ? 'hover:bg-[var(--surface-muted)]' : ''
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < 3 ? rankStyles[index] : 'bg-[var(--surface-muted)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{player.name}</p>
                    <p className="text-sm text-[var(--text-secondary)] truncate">
                      Champion pick: {champion.flag} {champion.name}
                    </p>
                  </div>
                  <span className="text-xl font-semibold tabular-nums text-[var(--text-primary)]">
                    {player.score}
                  </span>
                </button>

                {showBreakdown && (
                  <div className="px-6 pb-4 pl-[4.5rem]">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { label: 'R32', value: player.breakdown.r32 },
                        { label: 'R16', value: player.breakdown.r16 },
                        { label: 'QF', value: player.breakdown.qf },
                        { label: 'SF', value: player.breakdown.sf },
                        { label: 'Final', value: player.breakdown.final },
                        { label: 'Bonus', value: player.breakdown.champion },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[var(--radius-sm)] bg-[var(--surface-muted)] px-2 py-2 text-center"
                        >
                          <p className="text-[10px] text-[var(--text-tertiary)]">{item.label}</p>
                          <p className="text-sm font-medium tabular-nums">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {hasResults && (
          <p className="px-6 py-3 text-xs text-[var(--text-tertiary)] border-t border-[var(--border-subtle)]">
            Tap a player to see score breakdown
          </p>
        )}
      </Card>
    </div>
  );
};
