import request from 'supertest';
import express from 'express';
import { ensurePickEditable } from '../../src/server/middleware/ensurePickEditable';

jest.mock('../../src/server/services/roundService');
import { getRoundById } from '../../src/server/services/roundService';

const app = express();
app.use(express.json());
app.put('/picks/:id', ensurePickEditable, (req, res) => res.status(200).send('ok'));

describe('ensurePickEditable', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('allows edit before start_time', async () => {
    (getRoundById as jest.Mock).mockResolvedValue({
      id: 'r1',
      start_time: new Date(Date.now() + 60_000).toISOString(),
      end_time: new Date(Date.now() + 3600_000).toISOString(),
    });
    const res = await request(app).put('/picks/1').send({ roundId: 'r1' });
    expect(res.status).toBe(200);
  });

  it('blocks edit during round', async () => {
    (getRoundById as jest.Mock).mockResolvedValue({
      id: 'r1',
      start_time: new Date(Date.now() - 60_000).toISOString(),
      end_time: new Date(Date.now() + 3600_000).toISOString(),
    });
    const res = await request(app).put('/picks/1').send({ roundId: 'r1' });
    expect(res.status).toBe(403);
    expect(res.body.code).toBe('ROUND_LOCKED');
    expect(res.body.lockedUntil).toBeDefined();
  });

  it('allows edit after end_time', async () => {
    (getRoundById as jest.Mock).mockResolvedValue({
      id: 'r1',
      start_time: new Date(Date.now() - 7200_000).toISOString(),
      end_time: new Date(Date.now() - 3600_000).toISOString(),
    });
    const res = await request(app).put('/picks/1').send({ roundId: 'r1' });
    expect(res.status).toBe(200);
  });

  it('returns 404 when round not found', async () => {
    (getRoundById as jest.Mock).mockResolvedValue(null);
    const res = await request(app).put('/picks/1').send({ roundId: 'r1' });
    expect(res.status).toBe(404);
  });

  it('returns 400 when roundId missing', async () => {
    const res = await request(app).put('/picks/1').send({});
    expect(res.status).toBe(400);
  });
});
