import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getActivity } from '../../src/controllers/activity.controller';
import * as activityService from '../../src/services/activity.service';

vi.mock('../../src/services/activity.service', () => ({
  getRecentActivity: vi.fn(),
}));

describe('Activity Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = { query: {} };
    res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  it('should return recent activity', async () => {
    req.query.limit = '5';
    vi.mocked(activityService.getRecentActivity).mockResolvedValueOnce([
      { id: 'a1' },
    ] as any);

    await getActivity(req, res);
    expect(activityService.getRecentActivity).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith([{ id: 'a1' }]);
  });

  it('should return 500 status on service error', async () => {
    vi.mocked(activityService.getRecentActivity).mockRejectedValueOnce(
      new Error('Db error')
    );
    await getActivity(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
