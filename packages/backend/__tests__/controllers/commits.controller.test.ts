import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCommits } from '../../src/controllers/commits.controller';
import * as commitsService from '../../src/services/commits.service';

vi.mock('../../src/services/commits.service', () => ({
  getPackageCommits: vi.fn(),
}));

describe('Commits Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      query: {},
      params: { packagePath: 'core' },
      app: { locals: { rootPath: '/mock/root' } },
    };
    res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  describe('getCommits', () => {
    it('should return recent commits', async () => {
      const mockCommits = [{ hash: '123456', message: 'init' }];
      vi.mocked(commitsService.getPackageCommits).mockResolvedValue(
        mockCommits as any
      );

      await getCommits(req, res);
      expect(commitsService.getPackageCommits).toHaveBeenCalledWith(
        'core',
        '/mock/root'
      );
      expect(res.json).toHaveBeenCalledWith(mockCommits);
    });

    it('should handle Package path not found with 404', async () => {
      vi.mocked(commitsService.getPackageCommits).mockRejectedValue(
        new Error('Package path not found')
      );

      await getCommits(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle generic errors with 500 status', async () => {
      vi.mocked(commitsService.getPackageCommits).mockRejectedValue(
        new Error('Git error')
      );

      await getCommits(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
