import React from 'react';
import { GROUPS } from '@/lib/data';

export const GroupsTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-pitch">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-[#1a472a] mb-3 uppercase tracking-tighter">Tournament Groups</h2>
        <div className="h-1.5 w-24 bg-[#ffd700] mx-auto rounded-full mb-4"></div>
        <p className="text-[#4b5563] font-bold uppercase tracking-widest text-xs opacity-70">
          48 Nations • 12 Groups • World Cup 2026 Official Draw
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {GROUPS.map((group) => (
          <div key={group.id} className="glass-card rounded-[2rem] shadow-xl border border-white/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="bg-[#1a472a] px-6 py-4 text-white flex justify-between items-center">
              <span className="font-black uppercase tracking-widest text-sm">{group.name}</span>
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-black">2026</span>
            </div>
            <div className="p-6 space-y-4 bg-white/40">
              {group.teams.map((team) => (
                <div key={team.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-green-100 hover:shadow-sm">
                  <span className="text-3xl drop-shadow-sm" role="img" aria-label={`${team.name} flag`}>
                    {team.flag}
                  </span>
                  <span className="font-black text-[#1a472a] uppercase tracking-tight text-sm">{team.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
