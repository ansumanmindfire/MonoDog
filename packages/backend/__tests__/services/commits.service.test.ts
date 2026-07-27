import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPackageCommits } from '../../src/services/commits.service';
import { GitService } from '../../src/gitService';

describe('Commits Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get commits for relative and absolute paths', async () => {
    vi.spyOn(GitService.prototype, 'getAllCommits').mockResolvedValue([
      { hash: 'c1' },
    ] as any);

    const res1 = await getPackageCommits('packages/ui', '/root');
    expect(res1).toEqual([{ hash: 'c1' }]);

    const res2 = await getPackageCommits('/root/packages/ui', '/root');
    expect(res2).toEqual([{ hash: 'c1' }]);

    const res3 = await getPackageCommits('packages/ui');
    expect(res3).toEqual([{ hash: 'c1' }]);
  });

  it('should return empty array on git error', async () => {
    vi.spyOn(GitService.prototype, 'getAllCommits').mockRejectedValueOnce(
      new Error('Git fail')
    );

    const res = await getPackageCommits('packages/ui', '/root');
    expect(res).toEqual([]);
  });
});
