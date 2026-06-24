import React, { useState, useRef } from 'react';
import { Player, Results, ALL_TEAMS, KnockoutRound } from '@/lib/data';
import { getTeamDisplay } from '@/lib/teams';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AdminTabProps {
  results: Results;
  setResults: (results: Results) => void;
  clearAllData: () => void;
  importData: (json: string) => void;
  players: Player[];
  addPlayer: (name: string, championPick: string) => void;
  deletePlayer: (playerId: string) => void;
  state: { players: Player[]; results: Results; activeTab: string };
}

const ROUNDS: { id: KnockoutRound; label: string; limit: number }[] = [
  { id: 'r32', label: 'Round of 32', limit: 16 },
  { id: 'r16', label: 'Round of 16', limit: 8 },
  { id: 'qf', label: 'Quarter-finals', limit: 4 },
  { id: 'sf', label: 'Semi-finals', limit: 2 },
  { id: 'final', label: 'Final', limit: 1 },
];

function getEligibleTeams(round: KnockoutRound, results: Results) {
  if (round === 'r32') return ALL_TEAMS;
  if (round === 'r16') return ALL_TEAMS.filter((t) => results.r32.includes(t.id));
  if (round === 'qf') return ALL_TEAMS.filter((t) => results.r16.includes(t.id));
  if (round === 'sf') return ALL_TEAMS.filter((t) => results.qf.includes(t.id));
  if (round === 'final') return ALL_TEAMS.filter((t) => results.sf.includes(t.id));
  return [];
}

export const AdminTab: React.FC<AdminTabProps> = ({
  results,
  setResults,
  clearAllData,
  importData,
  players,
  addPlayer,
  deletePlayer,
  state,
}) => {
  const [currentRound, setCurrentRound] = useState<KnockoutRound>('r32');
  const [passcode, setPasscode] = useState('');
  const [isVerified, setIsVerified] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admin_verified') === 'true';
    }
    return false;
  });
  const [newName, setNewName] = useState('');
  const [newChampion, setNewChampion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newChampion) {
      addPlayer(newName.trim(), newChampion);
      setNewName('');
      setNewChampion('');
    }
  };

  const roundMeta = ROUNDS.find((r) => r.id === currentRound)!;
  const eligibleTeams = getEligibleTeams(currentRound, results);

  const selectedCount =
    currentRound === 'final'
      ? results.final ? 1 : 0
      : results[currentRound].length;

  const handleToggleResult = (teamId: string) => {
    const newResults = { ...results };

    if (currentRound === 'final') {
      newResults.final = newResults.final === teamId ? '' : teamId;
    } else {
      const roundResults = [...newResults[currentRound]];
      const idx = roundResults.indexOf(teamId);
      if (idx > -1) {
        roundResults.splice(idx, 1);
      } else if (roundResults.length < roundMeta.limit) {
        roundResults.push(teamId);
      }
      newResults[currentRound] = roundResults;
    }

    setResults(newResults);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wc2026-fantasy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        if (confirm('Import will replace all current league data. Continue?')) {
          importData(text);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isWinner = (teamId: string) =>
    currentRound === 'final'
      ? results.final === teamId
      : results[currentRound].includes(teamId);

  if (!isVerified) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader
          title="Admin Verification"
          description="Enter the admin passcode to unlock tournament results updates, database backups, and resets."
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const expected = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'sawgrass2026';
            if (passcode === expected) {
              setIsVerified(true);
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('admin_verified', 'true');
              }
            } else {
              alert('Incorrect passcode. Please try again.');
            }
          }}
          className="space-y-4 mt-2"
        >
          <div>
            <label htmlFor="admin-passcode" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Passcode
            </label>
            <input
              id="admin-passcode"
              type="password"
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-primary)] outline-none transition-colors"
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full font-medium">
            Verify & Unlock
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Match results"
          description="Enter actual knockout winners. Standings update instantly."
        />

        <div className="flex gap-1 overflow-x-auto no-scrollbar p-1 mb-6 bg-[var(--surface-muted)] rounded-[var(--radius-lg)]">
          {ROUNDS.map((round) => (
            <button
              key={round.id}
              type="button"
              onClick={() => setCurrentRound(round.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                currentRound === round.id
                  ? 'bg-white text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {round.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Select {roundMeta.limit} winner{roundMeta.limit !== 1 ? 's' : ''}
          </p>
          <Badge variant={selectedCount === roundMeta.limit ? 'success' : 'warning'}>
            {selectedCount} / {roundMeta.limit}
          </Badge>
        </div>

        {eligibleTeams.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] py-8 text-center">
            Enter results for the previous round first.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {eligibleTeams.map((team) => {
              const winner = isWinner(team.id);
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => handleToggleResult(team.id)}
                  className={`p-3 rounded-[var(--radius-md)] border transition-all flex flex-col items-center gap-1.5 ${
                    winner
                      ? 'border-[var(--accent)] bg-[var(--accent-subtle)] shadow-[var(--shadow-sm)]'
                      : 'border-[var(--border)] bg-white hover:border-[var(--text-tertiary)]'
                  }`}
                >
                  <span className="text-2xl">{team.flag}</span>
                  <span className="text-[10px] font-medium text-[var(--text-secondary)] text-center leading-tight">
                    {team.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader
          title="Add player"
          description="Each player picks a pre-tournament champion for a +5 bonus."
        />
        <form onSubmit={handleAddPlayerSubmit} className="space-y-4">
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
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-primary)] outline-none transition-colors"
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
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-[var(--text-primary)] text-sm focus:border-[var(--text-primary)] outline-none transition-colors"
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
          <h3 className="text-lg font-semibold tracking-tight">Roster management</h3>
        </div>

        {players.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
            No players added yet.
          </div>
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
      </Card>

      <Card>
        <CardHeader title="Backup & restore" description="Export or import league data as JSON." />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" className="flex-1" onClick={handleExport}>
            Export backup
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
          >
            Import backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </Card>

      <Card className="border-red-100">
        <h3 className="text-base font-semibold text-red-700 mb-1">Reset league</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Permanently delete all players, picks, and results.
        </p>
        <Button variant="danger" onClick={clearAllData}>
          Clear all data
        </Button>
      </Card>
    </div>
  );
};
