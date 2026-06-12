import React, { useState, useMemo } from 'react';
import { Player, ALL_TEAMS, Team, Picks, KnockoutRound } from '@/lib/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface PicksTabProps {
  players: Player[];
  updatePlayerPicks: (playerId: string, picks: Picks) => void;
  onAddPlayers?: () => void;
}

const ROUNDS: { id: KnockoutRound; label: string; subtitle: string; limit: number }[] = [
  { id: 'r32', label: 'Round of 32', subtitle: 'Pick 16 winners', limit: 16 },
  { id: 'r16', label: 'Round of 16', subtitle: 'Pick 8 winners', limit: 8 },
  { id: 'qf', label: 'Quarter-finals', subtitle: 'Pick 4 winners', limit: 4 },
  { id: 'sf', label: 'Semi-finals', subtitle: 'Pick 2 finalists', limit: 2 },
  { id: 'final', label: 'Final', subtitle: 'Pick the champion', limit: 1 },
];

export const PicksTab: React.FC<PicksTabProps> = ({
  players,
  updatePlayerPicks,
  onAddPlayers,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [activeRoundIdx, setActiveRoundIdx] = useState(0);
  const [search, setSearch] = useState('');

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);
  const activeRound = ROUNDS[activeRoundIdx];

  const handleTogglePick = (round: KnockoutRound, teamId: string) => {
    if (!selectedPlayer) return;

    const newPicks = { ...selectedPlayer.picks };

    if (round === 'final') {
      newPicks.final = newPicks.final === teamId ? '' : teamId;
    } else {
      const roundPicks = [...(newPicks[round] as string[])];
      const idx = roundPicks.indexOf(teamId);
      if (idx > -1) {
        roundPicks.splice(idx, 1);
      } else {
        const limits = { r32: 16, r16: 8, qf: 4, sf: 2 };
        if (roundPicks.length < (limits[round] || 0)) {
          roundPicks.push(teamId);
        }
      }
      newPicks[round] = roundPicks;
    }

    const rounds: KnockoutRound[] = ['r32', 'r16', 'qf', 'sf', 'final'];
    const currentRoundIdx = rounds.indexOf(round);

    for (let i = currentRoundIdx + 1; i < rounds.length; i++) {
      const r = rounds[i];
      const prevR = rounds[i - 1];
      const prevWinners = prevR === 'final' ? [] : (newPicks[prevR] as string[]);

      if (r === 'final') {
        if (!prevWinners.includes(newPicks.final)) {
          newPicks.final = '';
        }
      } else {
        newPicks[r] = (newPicks[r] as string[]).filter((tid) => prevWinners.includes(tid));
      }
    }

    updatePlayerPicks(selectedPlayerId, newPicks);
  };

  const getEligibleTeams = (round: KnockoutRound): Team[] => {
    if (!selectedPlayer) return [];
    if (round === 'r32') return ALL_TEAMS;
    if (round === 'r16') return ALL_TEAMS.filter((t) => selectedPlayer.picks.r32.includes(t.id));
    if (round === 'qf') return ALL_TEAMS.filter((t) => selectedPlayer.picks.r16.includes(t.id));
    if (round === 'sf') return ALL_TEAMS.filter((t) => selectedPlayer.picks.qf.includes(t.id));
    if (round === 'final') return ALL_TEAMS.filter((t) => selectedPlayer.picks.sf.includes(t.id));
    return [];
  };

  const isPicked = (round: KnockoutRound, teamId: string) => {
    if (!selectedPlayer) return false;
    if (round === 'final') return selectedPlayer.picks.final === teamId;
    return (selectedPlayer.picks[round] as string[]).includes(teamId);
  };

  const getPickedCount = (round: KnockoutRound) => {
    if (!selectedPlayer) return 0;
    if (round === 'final') return selectedPlayer.picks.final ? 1 : 0;
    return (selectedPlayer.picks[round] as string[]).length;
  };

  const isRoundComplete = (round: KnockoutRound) => {
    const limits = { r32: 16, r16: 8, qf: 4, sf: 2, final: 1 };
    return getPickedCount(round) === limits[round];
  };

  const totalProgress = useMemo(() => {
    if (!selectedPlayer) return 0;
    const total = 16 + 8 + 4 + 2 + 1;
    const picked =
      selectedPlayer.picks.r32.length +
      selectedPlayer.picks.r16.length +
      selectedPlayer.picks.qf.length +
      selectedPlayer.picks.sf.length +
      (selectedPlayer.picks.final ? 1 : 0);
    return Math.round((picked / total) * 100);
  }, [selectedPlayer]);

  const filteredTeams = useMemo(() => {
    const teams = getEligibleTeams(activeRound.id);
    if (!search.trim()) return teams;
    const q = search.toLowerCase();
    return teams.filter(
      (t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    );
  }, [selectedPlayer, activeRound.id, search]);

  if (players.length === 0) {
    return (
      <Card padding="none">
        <EmptyState
          title="No players yet"
          description="Add players before entering bracket picks."
          action={
            onAddPlayers ? { label: 'Add players', onClick: onAddPlayers } : undefined
          }
        />
      </Card>
    );
  }

  const selectClass =
    'w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-[var(--text-primary)] text-sm outline-none focus:border-[var(--text-primary)] transition-colors';

  return (
    <div className="space-y-6">
      <Card>
        <label htmlFor="pick-player" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Player
        </label>
        <select
          id="pick-player"
          value={selectedPlayerId}
          onChange={(e) => {
            setSelectedPlayerId(e.target.value);
            setActiveRoundIdx(0);
            setSearch('');
          }}
          className={selectClass}
        >
          <option value="">Select a player</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {selectedPlayer && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[var(--text-secondary)]">Bracket progress</span>
              <span className="font-medium tabular-nums">{totalProgress}%</span>
            </div>
            <div className="h-1.5 bg-[var(--surface-muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            {totalProgress === 100 && (
              <Badge variant="success" className="mt-3">
                Bracket complete
              </Badge>
            )}
          </div>
        )}
      </Card>

      {!selectedPlayer ? (
        <Card padding="none">
          <EmptyState
            title="Select a player"
            description="Choose a player above to enter their knockout bracket."
          />
        </Card>
      ) : (
        <>
          {/* Round stepper */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {ROUNDS.map((round, idx) => {
              const complete = isRoundComplete(round.id);
              const isActive = idx === activeRoundIdx;
              return (
                <button
                  key={round.id}
                  type="button"
                  onClick={() => {
                    setActiveRoundIdx(idx);
                    setSearch('');
                  }}
                  className={`flex-shrink-0 px-3 py-2 rounded-[var(--radius-md)] text-left transition-colors border ${
                    isActive
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : complete
                        ? 'bg-green-50 text-green-800 border-green-100'
                        : 'bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-tertiary)]'
                  }`}
                >
                  <span className="block text-xs font-medium">{round.label}</span>
                  <span className={`block text-[10px] mt-0.5 ${isActive ? 'text-white/70' : ''}`}>
                    {getPickedCount(round.id)}/{round.limit}
                  </span>
                </button>
              );
            })}
          </div>

          <Card padding="none">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">{activeRound.label}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{activeRound.subtitle}</p>
              </div>
              <Badge variant={isRoundComplete(activeRound.id) ? 'success' : 'warning'}>
                {getPickedCount(activeRound.id)} / {activeRound.limit} selected
              </Badge>
            </div>

            <div className="px-6 py-3 border-b border-[var(--border-subtle)]">
              <input
                type="search"
                placeholder="Search teams…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] outline-none focus:border-[var(--text-primary)] transition-colors"
              />
            </div>

            {filteredTeams.length === 0 ? (
              <EmptyState
                title={
                  getEligibleTeams(activeRound.id).length === 0
                    ? 'Complete the previous round first'
                    : 'No teams match your search'
                }
                description={
                  getEligibleTeams(activeRound.id).length === 0
                    ? 'Pick winners in the prior round to unlock this stage.'
                    : 'Try a different search term.'
                }
              />
            ) : (
              <ul className="divide-y divide-[var(--border-subtle)] max-h-[420px] overflow-y-auto">
                {filteredTeams.map((team) => {
                  const picked = isPicked(activeRound.id, team.id);
                  return (
                    <li key={team.id}>
                      <button
                        type="button"
                        onClick={() => handleTogglePick(activeRound.id, team.id)}
                        className={`w-full px-6 py-3 flex items-center gap-3 text-left transition-colors ${
                          picked
                            ? 'bg-[var(--accent-subtle)]'
                            : 'hover:bg-[var(--surface-muted)]'
                        }`}
                      >
                        <span className="text-2xl">{team.flag}</span>
                        <span className="flex-1 font-medium text-[var(--text-primary)]">
                          {team.name}
                        </span>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            picked
                              ? 'border-[var(--accent)] bg-[var(--accent)]'
                              : 'border-[var(--border)]'
                          }`}
                        >
                          {picked && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="px-6 py-4 border-t border-[var(--border-subtle)] flex justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={activeRoundIdx === 0}
                onClick={() => {
                  setActiveRoundIdx((i) => i - 1);
                  setSearch('');
                }}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={activeRoundIdx === ROUNDS.length - 1}
                onClick={() => {
                  setActiveRoundIdx((i) => i + 1);
                  setSearch('');
                }}
              >
                Next round
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
