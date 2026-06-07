import React from 'react';
import { Player, Results } from '@/lib/data';
import { calculatePlayerScore } from '@/lib/scoring';

interface LeaderboardProps {
  players: Player[];
  results: Results;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players, results }) => {
  const rankedPlayers = [...players]
    .map((player) => ({
      ...player,
      score: calculatePlayerScore(player, results),
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="animate-pitch glass-card rounded-[2rem] shadow-2xl overflow-hidden border border-white/40">
      <div className="bg-[#1a472a] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-4xl mb-2">⚽</span>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Pitch Standings</h2>
          <p className="text-green-300 font-bold uppercase tracking-widest text-xs mt-1">World Cup 2026 • Neighbor League</p>
        </div>
      </div>
      
      {rankedPlayers.length === 0 ? (
        <div className="p-16 text-center">
          <p className="text-2xl text-[#1a472a] font-black italic">The field is empty!</p>
          <p className="text-[#4b5563] mt-2">Head to the "Neighbors" tab to register the squad.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2d5a27]/5 text-[#1a472a] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Rank</th>
                <th className="px-8 py-5">Player</th>
                <th className="px-8 py-5">Top Pick</th>
                <th className="px-8 py-5 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100">
              {rankedPlayers.map((player, index) => {
                let rankDisplay = (index + 1).toString();
                let rankClass = "bg-[#f3f4f6] text-[#1a472a]";
                
                if (index === 0) {
                  rankDisplay = "🏆";
                  rankClass = "bg-[#ffd700] text-[#1a472a] ring-4 ring-[#ffd700]/20 scale-110";
                } else if (index === 1) {
                  rankDisplay = "🥈";
                  rankClass = "bg-[#e5e7eb] text-[#374151] scale-105";
                } else if (index === 2) {
                  rankDisplay = "🥉";
                  rankClass = "bg-[#fed7aa] text-[#9a3412]";
                }

                return (
                  <tr key={player.id} className="group hover:bg-[#2d5a27]/5 transition-all duration-200">
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black tabular-nums transition-transform duration-300 group-hover:rotate-12 ${rankClass}`}>
                        {rankDisplay}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-xl text-[#1a472a]">{player.name}</td>
                    <td className="px-8 py-6">
                      <span className="bg-white/60 px-3 py-1.5 rounded-full border border-green-100 text-xs font-bold text-[#2d5a27] flex items-center gap-2 w-fit">
                        ⭐ {player.championPick}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right tabular-nums">
                      <span className="text-4xl font-black text-[#2d5a27] drop-shadow-sm">{player.score}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
