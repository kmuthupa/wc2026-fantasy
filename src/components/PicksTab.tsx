import React, { useState } from 'react';
import { Player, ALL_TEAMS, Team, Picks } from '@/lib/data';

interface PicksTabProps {
  players: Player[];
  updatePlayerPicks: (playerId: string, picks: Picks) => void;
}

export const PicksTab: React.FC<PicksTabProps> = ({ players, updatePlayerPicks }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [currentRound, setCurrentRound] = useState<'r32' | 'r16' | 'qf' | 'sf' | 'final'>('r32');

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  const handleTogglePick = (teamId: string) => {
    if (!selectedPlayer) return;

    const newPicks = { ...selectedPlayer.picks };
    const roundKey = currentRound === 'final' ? 'final' : currentRound;
    
    if (currentRound === 'final') {
      newPicks.final = newPicks.final === teamId ? '' : teamId;
    } else {
      const roundPicks = [...(newPicks[roundKey] as string[])];
      const idx = roundPicks.indexOf(teamId);
      if (idx > -1) {
        roundPicks.splice(idx, 1);
      } else {
        const limits = { r32: 16, r16: 8, qf: 4, sf: 2 };
        if (roundPicks.length < (limits[currentRound as keyof typeof limits] || 0)) {
          roundPicks.push(teamId);
        }
      }
      (newPicks[roundKey] as string[]) = roundPicks;
    }
    
    updatePlayerPicks(selectedPlayerId, newPicks);
  };

  const getEligibleTeams = (): Team[] => {
    if (currentRound === 'r32') return ALL_TEAMS;
    if (currentRound === 'r16') return ALL_TEAMS.filter(t => selectedPlayer?.picks.r32.includes(t.id));
    if (currentRound === 'qf') return ALL_TEAMS.filter(t => selectedPlayer?.picks.r16.includes(t.id));
    if (currentRound === 'sf') return ALL_TEAMS.filter(t => selectedPlayer?.picks.qf.includes(t.id));
    if (currentRound === 'final') return ALL_TEAMS.filter(t => selectedPlayer?.picks.sf.includes(t.id));
    return [];
  };

  if (players.length === 0) {
    return (
      <div className="p-16 text-center glass-card rounded-[2rem] shadow-xl border border-white/50">
        <p className="text-3xl font-black text-[#1a472a] uppercase tracking-tighter italic">Register the squad first!</p>
        <p className="text-[#4b5563] mt-4 font-bold uppercase tracking-widest text-xs opacity-60">Go to the Neighbors tab to sign up players</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-pitch">
      <div className="glass-card p-8 rounded-[2rem] shadow-xl border border-white/50 relative overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ffd700]/5 rounded-full"></div>
        <label className="block text-[10px] font-black text-[#1a472a] mb-3 uppercase tracking-[0.3em] opacity-60">
          Selecting Picks For:
        </label>
        <div className="relative">
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full p-5 rounded-2xl border-2 border-green-100 bg-white/50 focus:border-[#2d5a27] focus:ring-4 focus:ring-[#2d5a27]/10 outline-none font-black text-2xl text-[#1a472a] transition-all appearance-none cursor-pointer"
          >
            <option value="">-- Choose a Neighbor --</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#1a472a]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {selectedPlayer && (
        <div className="glass-card rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden">
          <div className="flex bg-[#1a472a]/5 border-b border-green-100 overflow-x-auto no-scrollbar p-2 gap-2">
            {(['r32', 'r16', 'qf', 'sf', 'final'] as const).map((round) => (
              <button
                key={round}
                onClick={() => setCurrentRound(round)}
                className={`flex-1 min-w-[120px] px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  currentRound === round
                    ? 'bg-[#1a472a] text-white shadow-xl scale-105'
                    : 'text-[#1a472a] hover:bg-white/60'
                }`}
              >
                {round === 'final' ? '🏆 Champion' : round.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="p-8">
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-black text-[#1a472a] uppercase tracking-tighter">
                {currentRound === 'final' 
                  ? 'The Final Blow' 
                  : `Select ${currentRound === 'r32' ? '16' : currentRound === 'r16' ? '8' : currentRound === 'qf' ? '4' : '2'} Powerhouses`}
              </h3>
              <div className="h-1 w-16 bg-[#ffd700] mx-auto rounded-full mt-2 mb-4"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b5563] opacity-60">
                {currentRound === 'r32' 
                  ? "Who survives the first knockout storm?"
                  : `Build your path from previous round winners.`}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {getEligibleTeams().map((team) => {
                const isPicked = currentRound === 'final' 
                  ? selectedPlayer.picks.final === team.id 
                  : (selectedPlayer.picks[currentRound] as string[]).includes(team.id);
                
                return (
                  <button
                    key={team.id}
                    onClick={() => handleTogglePick(team.id)}
                    className={`relative p-5 rounded-[2rem] border-4 flex flex-col items-center gap-3 transition-all duration-300 ${
                      isPicked
                        ? 'bg-white border-[#2d5a27] scale-105 shadow-xl ring-8 ring-[#2d5a27]/5'
                        : 'bg-white/40 border-transparent hover:border-green-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="text-4xl drop-shadow-md transition-transform duration-500 hover:rotate-12">{team.flag}</span>
                    <span className="text-[10px] font-black text-[#1a472a] text-center uppercase tracking-widest leading-none">
                      {team.name}
                    </span>
                    {isPicked && (
                      <div className="absolute -top-3 -right-3 bg-[#ffd700] text-[#1a472a] rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {getEligibleTeams().length === 0 && (
               <div className="p-16 text-center glass-card bg-green-50/50 rounded-3xl border-2 border-dashed border-green-200">
                  <span className="text-4xl mb-4 block">⚽</span>
                  <p className="text-[#1a472a] font-black uppercase tracking-widest text-sm">Fill the previous round to unlock the pitch!</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
