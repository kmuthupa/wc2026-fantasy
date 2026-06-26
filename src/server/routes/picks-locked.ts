import express from 'express';
import { ensurePickEditable } from '../middleware/ensurePickEditable';

// Replace these imports with your auth/controller code as needed.
// The file purpose is to show how to wire the middleware; import into your main router.
import { ensureAuthenticated } from '../middleware/auth'; // adapt path / implementation
import { updatePickById } from '../controllers/picksController'; // adapt path / implementation

const router = express.Router();

/**
 * Example route that protects pick updates with ensurePickEditable.
 * If your existing update endpoint already infers roundId from the pickId,
 * modify ensurePickEditable to load the pick and then the round, or pass roundId
 * in the request body.
 */
router.put('/picks/:id', ensureAuthenticated, ensurePickEditable, async (req, res) => {
  try {
    // updatePickById should validate ownership, apply changes, etc.
    const updated = await updatePickById(req.params.id, (req as any).user?.id, req.body);
    return res.json(updated);
  } catch (err: any) {
    console.error('Failed to update pick', err);
    return res.status(500).json({ message: 'Could not update pick' });
  }
});

export default router;
