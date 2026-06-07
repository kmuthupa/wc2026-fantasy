import React, { useState } from 'react';
import { Results, ALL_TEAMS } from '@/lib/data';

interface AdminTabProps {
  results: Results;
  setResults: (results: Results) => void;
  clearAllData: () => void;
  state: any;
}

export const AdminTab: React.FC<AdminTabProps> = ({ results, setResults, clearAllData, state }) => {
  const [currentRound, setCurrentRound] = useState<'r32' | 'r16' | 'qf' | 'sf' | 'final'>('r32');

  const handleToggleResult = (teamId: string) => {
    const newResults = { ...results };
    
    if (currentRound === 'final') {
      newResults.final = newResults.final === teamId ? '' : teamId;
    } else {
      const roundResults = [...newResults[currentRound]];
      const idx = roundResults.indexOf(teamId);
      if (idx > -1) {
        roundResults.splice(idx, 1);
      } else {
        const limits = { r32: 16, r16: 8, qf: 4, sf: 2 };
        if (roundResults.length < (limits[currentRound] || 0)) {
          roundResults.push(teamId);
        }
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
    a.download = `wc2026-pitch-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-pitch">
      <div className="glass-card p-8 rounded-[2rem] shadow-xl border border-white/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16"></div>
        <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-red-700 uppercase tracking-tighter">
          <span className="bg-red-700 text-white p-2 rounded-xl text-xl">🛡️</span> Pitch Control
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b5563] mb-8 opacity-60">
          Official Referee Panel • Enter actual tournament outcomes
        </p>

        <div className="flex bg-gray-100 rounded-2xl p-1.5 gap-1.5 mb-8 border border-gray-200">
          {(['r32', 'r16', 'qf', 'sf', 'final'] as const).map((round) => (
            <button
              key={round}
              onClick={() => setCurrentRound(round)}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                currentRound === round
                  ? 'bg-red-700 text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              {round === 'final' ? 'Champ' : round.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-black text-[#1a472a] mb-6 text-center uppercase tracking-widest italic">
             Set {currentRound.toUpperCase()} Winners
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {ALL_TEAMS.map((team) => {
              const isWinner = currentRound === 'final' 
                ? results.final === team.id 
                : results[currentRound].includes(team.id);

              return (
                <button
                  key={team.id}
                  onClick={() => handleToggleResult(team.id)}
                  className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    isWinner
                      ? 'bg-red-50 border-red-700 scale-105 shadow-md ring-4 ring-red-700/5'
                      : 'bg-white border-transparent opacity-30 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl drop-shadow-sm">{team.flag}</span>
                  <span className="text-[8px] font-black text-gray-700 text-center uppercase truncate w-full tracking-tighter">
                    {team.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
          <button
            onClick={handleExport}
            className="flex-1 bg-green-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-green-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 active:scale-95"
          >
            <span>📥</span> Export Backup
          </button>
          <button
            onClick={clearAllData}
            className="flex-1 bg-gray-200 text-[#4b5563] font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-300 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <span>🗑️</span> Reset Season
          </button>
        </div>
      </div>
      
      <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 text-red-900">
        <h4 className="font-black mb-2 flex items-center gap-3 uppercase tracking-[0.2em] text-sm">
          <span className="bg-red-700 text-white p-1.5 rounded-lg text-xs">⚠️</span> Danger Zone
        </h4>
        <p className="text-xs font-bold leading-relaxed opacity-80">
          Modifying results will instantly recalculate every neighbor's score across the entire league. Ensure the VAR check is complete before confirming winners.
        </p>
      </div>
    </div>
  );
};
