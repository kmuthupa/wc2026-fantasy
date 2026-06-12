import React from 'react';
import { SCORING_RULES } from '@/lib/scoring';
import { Card } from '@/components/ui/Card';

const knockoutRounds = [
  { round: 'Round of 32', points: SCORING_RULES.r32, note: 'Per correct winner' },
  { round: 'Round of 16', points: SCORING_RULES.r16, note: 'Per correct winner' },
  { round: 'Quarter-finals', points: SCORING_RULES.qf, note: 'Per correct winner' },
  { round: 'Semi-finals', points: SCORING_RULES.sf, note: 'Per correct winner' },
  { round: 'Final', points: SCORING_RULES.final, note: 'Correct champion' },
];

const steps = [
  'Add all players and their champion picks',
  'Each player fills in their full knockout bracket before kickoff',
  'Admin enters actual results as matches finish',
  'Standings update automatically',
];

export const RulesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Scoring</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Points increase each round — later picks are worth more.
        </p>

        <div className="space-y-2">
          {knockoutRounds.map((item) => (
            <div
              key={item.round}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface-muted)]"
            >
              <div>
                <p className="font-medium text-[var(--text-primary)]">{item.round}</p>
                <p className="text-xs text-[var(--text-secondary)]">{item.note}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {item.points} pt{item.points !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Champion bonus</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          When signing up, each player selects one team to win the tournament. If that
          team lifts the trophy, they earn an extra{' '}
          <span className="font-medium text-[var(--text-primary)]">
            +{SCORING_RULES.championBonus} points
          </span>{' '}
          — independent of their bracket picks.
        </p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold tracking-tight mb-4">How it works</h2>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)] text-white text-xs font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm text-[var(--text-secondary)] pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
};
