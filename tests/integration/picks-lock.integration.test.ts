import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { ensurePickEditable } from '../../src/server/middleware/ensurePickEditable';
import * as roundService from '../../src/server/services/roundService';

const app = express();
app.use(bodyParser.json());

// Dummy auth + update handler for integration test
app.put('/api/picks/:id', ensurePickEditable, (req, res) => {
  res.json({ ok: true, id: req.params.id, selection: req.body.selection });
});

describe('picks integration lock', () => {
  afterEach(() => jest.resetAllMocks());

  it('blocks update while round in progress', async () => {
    jest.spyOn(roundService, 'getRoundById').mockResolvedValue({
      id: 'r1',
      start_time: new Date(Date.now() - 60000).toISOString(),
      end_time: new Date(Date.now() + 60000).toISOString(),
    } as any);

    const res = await request(app).put('/api/picks/123').send({ roundId: 'r1', selection: 'X' });
    expect(res.status).toBe(403);
    expect(res.body.code).toBe('ROUND_LOCKED');
  });

  it('allows update when round not in progress', async () => {
    jest.spyOn(roundService, 'getRoundById').mockResolvedValue({
      id: 'r1',
      start_time: new Date(Date.now() - 7200_000).toISOString(),
      end_time: new Date(Date.now() - 3600_000).toISOString(),
    } as any);

    const res = await request(app).put('/api/picks/123').send({ roundId: 'r1', selection: 'Y' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
