import React from 'react';

export const RulesTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-pitch">
      <div className="glass-card p-12 rounded-[3rem] shadow-2xl border border-white/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1a472a] via-[#ffd700] to-[#1a472a]"></div>
        
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-[#1a472a] uppercase tracking-tighter mb-2">
            The Pitch Rules
          </h2>
          <p className="text-[#4b5563] font-black uppercase tracking-[0.3em] text-[10px] opacity-60">Official Scoring & Mechanics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h3 className="text-2xl font-black text-[#2d5a27] mb-6 flex items-center gap-3 uppercase tracking-tight">
              <span className="bg-[#2d5a27] text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg">📈</span> Knockout Points
            </h3>
            <div className="space-y-3">
              {[
                { round: 'Round of 32', points: '1 point', desc: 'Per correct winner' },
                { round: 'Round of 16', points: '2 points', desc: 'Per correct winner' },
                { round: 'Quarter-Finals', points: '4 points', desc: 'Per correct winner' },
                { round: 'Semi-Finals', points: '6 points', desc: 'Per correct winner' },
                { round: 'Grand Final', points: '10 points', desc: 'Correct Champion' },
              ].map((item) => (
                <div key={item.round} className="bg-white/40 p-5 rounded-2xl border border-green-50 flex justify-between items-center group hover:bg-white transition-all">
                  <div>
                    <div className="font-black text-[#1a472a] uppercase tracking-tighter">{item.round}</div>
                    <div className="text-[10px] font-bold text-[#4b5563] opacity-60 uppercase">{item.desc}</div>
                  </div>
                  <span className="bg-[#1a472a] text-[#ffd700] px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-900/10 group-hover:scale-110 transition-transform">
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-10">
            <section>
              <h3 className="text-2xl font-black text-[#9a3412] mb-6 flex items-center gap-3 uppercase tracking-tight">
                <span className="bg-[#9a3412] text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg">⭐</span> Pitch Bonus
              </h3>
              <div className="bg-orange-50/50 p-8 rounded-[2rem] border-2 border-dashed border-orange-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">🏆</div>
                <p className="text-[#9a3412] font-black text-xl leading-tight mb-2">
                  THE PRE-GAME SHOT
                </p>
                <p className="text-[#9a3412] text-sm font-bold opacity-80 leading-relaxed">
                  When a neighbor signs up, they pick one "Champion Team". If that nation lifts the trophy, they bank an automatic <span className="bg-[#9a3412] text-white px-2 py-0.5 rounded ml-1">+5 Point Bonus</span>.
                </p>
              </div>
            </section>

            <section className="bg-[#1a472a] p-8 rounded-[2rem] text-white shadow-2xl relative">
              <div className="absolute -bottom-4 -right-4 text-6xl opacity-20">⚽</div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-3 uppercase tracking-widest text-[#ffd700]">
                Match Day Flow
              </h3>
              <ul className="space-y-4">
                {[
                  { step: '1', text: 'Register the neighbors' },
                  { step: '2', text: 'Lock in full brackets before kickoff' },
                  { step: '3', text: 'Admin updates results live' },
                  { step: '4', text: 'Climb the global standings' },
                ].map((item) => (
                  <li key={item.step} className="flex items-center gap-4 group">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-[#ffd700] text-sm group-hover:bg-[#ffd700] group-hover:text-[#1a472a] transition-all">
                      {item.step}
                    </span>
                    <span className="font-bold text-sm tracking-tight opacity-90">{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
