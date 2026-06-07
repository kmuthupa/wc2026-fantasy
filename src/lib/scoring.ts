import { Picks, Results, Player } from './data';

export const SCORING_RULES = {
  r32: 1, // Points for each correct R32 winner
  r16: 2, // Points for each correct R16 winner
  qf: 4,  // Points for each correct QF winner
  sf: 6,  // Points for each correct SF winner
  final: 10, // Points for correct Champion
  championBonus: 5, // Bonus if pre-tournament champion pick is correct
};

export function calculatePlayerScore(player: Player, results: Results): number {
  let score = 0;

  // R32 winners (correctly picked teams that advanced to R16)
  player.picks.r32.forEach((teamId) => {
    if (results.r32.includes(teamId)) score += SCORING_RULES.r32;
  });

  // R16 winners (correctly picked teams that advanced to QF)
  player.picks.r16.forEach((teamId) => {
    if (results.r16.includes(teamId)) score += SCORING_RULES.r16;
  });

  // QF winners (correctly picked teams that advanced to SF)
  player.picks.qf.forEach((teamId) => {
    if (results.qf.includes(teamId)) score += SCORING_RULES.qf;
  });

  // SF winners (correctly picked teams that advanced to Final)
  player.picks.sf.forEach((teamId) => {
    if (results.sf.includes(teamId)) score += SCORING_RULES.sf;
  });

  // Final winner (correct Champion pick in the bracket)
  if (player.picks.final && player.picks.final === results.final) {
    score += SCORING_RULES.final;
  }

  // Champion Bonus (pre-tournament pick)
  if (player.championPick && player.championPick === results.final) {
    score += SCORING_RULES.championBonus;
  }

  return score;
}
