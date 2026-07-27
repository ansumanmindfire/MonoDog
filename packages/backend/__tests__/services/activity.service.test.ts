import { describe, it, expect, vi } from 'vitest';
import { getRecentActivity } from '../../src/services/activity.service';
import { prisma } from '../../src/db/prisma';

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    activityLog: {
      findMany: vi.fn(),
      count: vi.fn().mockResolvedValue(3),
    },
  },
}));

describe('Activity Service Unit Tests', () => {
  describe('getRecentActivity', () => {
    it('should return recent activities bounded by limit and parse metadata or default to null', async () => {
      vi.mocked(prisma.activityLog.findMany).mockResolvedValueOnce([
        { id: '1', type: 'test', metadata: '{"a":1}' },
        { id: '2', type: 'test', metadata: null },
      ] as any);

      const result = await getRecentActivity(2);
      expect(result.total).toBe(3);
      expect(result.activities[0].metadata).toEqual({ a: 1 });
      expect(result.activities[1].metadata).toBeNull();
    });
  });
});
