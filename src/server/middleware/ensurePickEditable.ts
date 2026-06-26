import { Request, Response, NextFunction } from 'express';
import { getRoundById } from '../services/roundService';

/**
 * Ensures picks for the referenced round are editable.
 * - Expects a roundId in req.body.roundId, req.params.roundId, req.body.round?.id or req.query.roundId.
 * - Uses server time (UTC) and round.start_time / round.end_time.
 * - Responds 403 { code: 'ROUND_LOCKED', message, lockedUntil } when blocked.
 *
 * Adapt getRoundById to your ORM/service layer.
 */
export async function ensurePickEditable(req: Request, res: Response, next: NextFunction) {
  const roundId =
    (req.body && (req.body.roundId ?? req.body.round?.id)) ??
    req.params?.roundId ??
    req.query?.roundId;

  if (!roundId) {
    return res.status(400).json({ code: 'MISSING_ROUND_ID', message: 'roundId required' });
  }

  const round = await getRoundById(String(roundId));
  if (!round) {
    return res.status(404).json({ code: 'ROUND_NOT_FOUND', message: 'Round not found' });
  }

  // authoritative server time
  const now = new Date();

  // Time-based lock: if start_time <= now < end_time then locked
  if (round.start_time && round.end_time) {
    const start = new Date(round.start_time);
    const end = new Date(round.end_time);
    if (now >= start && now < end) {
      return res.status(403).json({
        code: 'ROUND_LOCKED',
        message: 'Cannot edit picks while the round is in progress.',
        lockedUntil: end.toISOString(),
      });
    }
  }

  // allowed
  return next();
}
