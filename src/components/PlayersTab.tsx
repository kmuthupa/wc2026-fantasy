import React, { useState } from 'react';
import { Player, ALL_TEAMS } from '@/lib/data';

interface PlayersTabProps {
  players: Player[];
  addPlayer: (name: string, championPick: string) => void;
  deletePlayer: (playerId: string) => void;
}

export const PlayersTab: React.FC<PlayersTabProps> = ({ players, addPlayer, deletePlayer }) => {
  const [newName, setNewName] = useState('');
  const [newChampion, setNewChampion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newChampion) {
      addPlayer(newName, newChampion);
      setNewName('');
      setNewChampion('');
    }
  };

  return (
    <div className="space-y-8 animate-pitch">
      <div className="glass-card p-8 rounded-[2rem] shadow-xl border border-white/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffd700]/10 rounded-full -mr-12 -mt-12"></div>
        <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-[#1a472a] uppercase tracking-tighter">
          <span className="bg-[#1a472a] text-white p-2 rounded-xl text-xl">📋</span> Add Neighbor
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <input
              type="text"
              placeholder="Neighbor Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-green-100 bg-white/50 focus:border-[#2d5a27] focus:ring-4 focus:ring-[#2d5a27]/10 outline-none transition-all font-bold text-[#1a472a]"
              required
            />
          </div>
          <div className="md:col-span-5">
            <select
              value={newChampion}
              onChange={(e) => setNewChampion(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-green-100 bg-white/50 focus:border-[#2d5a27] focus:ring-4 focus:ring-[#2d5a27]/10 outline-none transition-all font-bold text-[#1a472a] appearance-none"
              required
            >
              <option value="">Pick their Champion</option>
              {ALL_TEAMS.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.flag} {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={players.length >= 25}
              className="w-full bg-[#1a472a] text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#2d5a27] disabled:bg-gray-300 transition-all active:scale-95 shadow-lg shadow-green-900/20"
            >
              {players.length >= 25 ? 'Full' : 'Add'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#4b5563] opacity-60">
          * Maximum 25 players • Champion pick is for the 5pt Pitch Bonus
        </p>
      </div>

      <div className="glass-card rounded-[2rem] shadow-xl border border-white/50 overflow-hidden">
        <div className="bg-[#2d5a27]/5 px-8 py-5 border-b border-green-100 flex justify-between items-center">
          <h3 className="font-black text-[#1a472a] uppercase tracking-widest text-sm">Squad List ({players.length}/25)</h3>
        </div>
        <div className="divide-y divide-green-50">
          {players.length === 0 ? (
            <div className="p-12 text-center text-[#4b5563] font-bold italic opacity-40">No neighbors signed up yet...</div>
          ) : (
            players.map((player) => (
              <div key={player.id} className="p-6 px-8 flex justify-between items-center hover:bg-white/40 transition-colors group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#1a472a]/10 rounded-2xl flex items-center justify-center font-black text-[#1a472a]">
                     {player.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                    <div className="font-black text-xl text-[#1a472a]">{player.name}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#2d5a27] opacity-60 flex items-center gap-1">
                      Pick: <span className="text-[#1a472a]">{player.championPick}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deletePlayer(player.id)}
                  className="text-gray-300 hover:text-red-500 p-3 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${player.name}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
