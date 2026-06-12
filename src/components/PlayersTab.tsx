import React, { useState } from 'react';
import { Player, ALL_TEAMS } from '@/lib/data';
import { getTeamDisplay } from '@/lib/teams';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

interface PlayersTabProps {
  players: Player[];
  addPlayer: (name: string, championPick: string) => void;
  deletePlayer: (playerId: string) => void;
  onGoToPicks?: () => void;
}

const inputClass =
  'w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-primary)] outline-none transition-colors';

export const PlayersTab: React.FC<PlayersTabProps> = ({
  players,
  addPlayer,
  deletePlayer,
  onGoToPicks,
}) => {
  const [newName, setNewName] = useState('');
  const [newChampion, setNewChampion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newChampion) {
      addPlayer(newName.trim(), newChampion);
      setNewName('');
      setNewChampion('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Add player"
          description="Each player picks a pre-tournament champion for a +5 bonus."
        />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="player-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Name
              </label>
              <input
                id="player-name"
                type="text"
                placeholder="e.g. Alex"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="champion-pick" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Champion pick
              </label>
              <select
                id="champion-pick"
                value={newChampion}
                onChange={(e) => setNewChampion(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select a team</option>
                {ALL_TEAMS.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.flag} {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-tertiary)]">
              {players.length} of 25 players
            </p>
            <Button type="submit" disabled={players.length >= 25}>
              {players.length >= 25 ? 'League full' : 'Add player'}
            </Button>
          </div>
        </form>
      </Card>

      <Card padding="none">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <h3 className="text-lg font-semibold tracking-tight">Roster</h3>
        </div>

        {players.length === 0 ? (
          <EmptyState
            title="No players yet"
            description="Add your first player above to start the league."
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
                        {champion.flag} {champion.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePlayer(player.id)}
                    aria-label={`Remove ${player.name}`}
                  >
                    Remove
                  </Button>
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
