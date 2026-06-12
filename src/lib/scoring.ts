import { Player, Results } from './data';
import { resolveTeamId } from './teams';

export const SCORING_RULES = {
  r32: 1,
  r16: 2,
  qf: 4,
  sf: 6,
  final: 10,
  championBonus: 5,
};

export function calculatePlayerScore(player: Player, results: Results): number {
  return calculateScoreBreakdown(player, results).total;
}

export function calculateScoreBreakdown(player: Player, results: Results) {
  const r32 = player.picks.r32.filter((id) => results.r32.includes(id)).length * SCORING_RULES.r32;
  const r16 = player.picks.r16.filter((id) => results.r16.includes(id)).length * SCORING_RULES.r16;
  const qf = player.picks.qf.filter((id) => results.qf.includes(id)).length * SCORING_RULES.qf;
  const sf = player.picks.sf.filter((id) => results.sf.includes(id)).length * SCORING_RULES.sf;
  const final =
    player.picks.final && player.picks.final === results.final ? SCORING_RULES.final : 0;
  const champion =
    resolveTeamId(player.championPick) === results.final && results.final
      ? SCORING_RULES.championBonus
      : 0;

  return { r32, r16, qf, sf, final, champion, total: r32 + r16 + qf + sf + final + champion };
}
