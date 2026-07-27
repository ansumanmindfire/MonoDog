import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getUserRepositoryPermission,
  invalidatePermissionCache,
  invalidateUserCache,
  clearAllCache,
  getCacheStats,
  checkRepositoryPermission,
  checkUserAction,
  startCacheCleanup,
} from '../../src/services/permission-service';
import * as githubOAuthService from '../../src/services/github-oauth-service';

vi.mock('../../src/services/github-oauth-service', () => ({
  getRepositoryPermission: vi.fn(),
  mapPermissionToRole: vi.fn().mockImplementation(perm => {
    if (perm === 'admin') return 'Admin';
    if (perm === 'write') return 'Collaborator';
    if (perm === 'maintain') return 'Maintainer';
    if (perm === 'read') return 'Viewer';
    return 'Denied';
  }),
}));

describe('Permission Service Unit Tests', () => {
  beforeEach(() => {
    clearAllCache();
    vi.clearAllMocks();
  });

  describe('getUserRepositoryPermission', () => {
    it('should query github API and cache the result', async () => {
      vi.mocked(githubOAuthService.getRepositoryPermission).mockResolvedValue({
        permission: 'admin',
      } as any);

      const result = await getUserRepositoryPermission(
        'token',
        1,
        'user',
        'owner',
        'repo'
      );

      expect(githubOAuthService.getRepositoryPermission).toHaveBeenCalledTimes(
        1
      );
      expect(result.permission).toBe('admin');
      expect(result.role).toBe('Admin');

      // Second call should hit the cache
      const cachedResult = await getUserRepositoryPermission(
        'token',
        1,
        'user',
        'owner',
        'repo'
      );
      expect(githubOAuthService.getRepositoryPermission).toHaveBeenCalledTimes(
        1
      );
      expect(cachedResult).toEqual(result);
    });

    it('should invalidate and query API again if cache is expired', async () => {
      vi.useFakeTimers();
      vi.mocked(githubOAuthService.getRepositoryPermission).mockResolvedValue({
        permission: 'write',
      } as any);

      await getUserRepositoryPermission('token', 1, 'user', 'owner', 'repo');
      expect(githubOAuthService.getRepositoryPermission).toHaveBeenCalledTimes(
        1
      );

      // Fast forward past 5 minute TTL
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);

      await getUserRepositoryPermission('token', 1, 'user', 'owner', 'repo');
      expect(githubOAuthService.getRepositoryPermission).toHaveBeenCalledTimes(
        2
      );

      vi.useRealTimers();
    });

    it('should force refresh when specified', async () => {
      vi.mocked(githubOAuthService.getRepositoryPermission).mockResolvedValue({
        permission: 'admin',
      } as any);

      await getUserRepositoryPermission('token', 1, 'user', 'owner', 'repo');
      await getUserRepositoryPermission(
        'token',
        1,
        'user',
        'owner',
        'repo',
        true
      );

      expect(githubOAuthService.getRepositoryPermission).toHaveBeenCalledTimes(
        2
      );
    });

    it('should fallback to none on API failure', async () => {
      vi.mocked(githubOAuthService.getRepositoryPermission).mockRejectedValue(
        new Error('API error')
      );

      const result = await getUserRepositoryPermission(
        'token',
        1,
        'user',
        'owner',
        'repo'
      );

      expect(result.permission).toBe('none');
    });
  });

  describe('checkRepositoryPermission & checkUserAction DTOs', () => {
    it('checkRepositoryPermission should format DTO correctly for admin and none', async () => {
      vi.mocked(
        githubOAuthService.getRepositoryPermission
      ).mockResolvedValueOnce({
        permission: 'admin',
      } as any);

      const dto1 = await checkRepositoryPermission(
        'token',
        1,
        'user',
        'owner',
        'repo'
      );
      expect(dto1.canAdmin).toBe(true);
      expect(dto1.canWrite).toBe(true);
      expect(dto1.denied).toBe(false);

      vi.mocked(
        githubOAuthService.getRepositoryPermission
      ).mockResolvedValueOnce({
        permission: 'none',
      } as any);

      const dto2 = await checkRepositoryPermission(
        'token',
        2,
        'user2',
        'owner',
        'repo'
      );
      expect(dto2.canAdmin).toBe(false);
      expect(dto2.denied).toBe(true);
    });

    it('checkUserAction should return action status for different actions', async () => {
      vi.mocked(githubOAuthService.getRepositoryPermission).mockResolvedValue({
        permission: 'write',
      } as any);

      const dtoWrite = await checkUserAction(
        'token',
        1,
        'user',
        'owner',
        'repo',
        'write'
      );
      expect(dtoWrite.can).toBe(true);

      const dtoAdmin = await checkUserAction(
        'token',
        1,
        'user',
        'owner',
        'repo',
        'admin'
      );
      expect(dtoAdmin.can).toBe(false);
    });
  });

  describe('Cache Management & Cleanup', () => {
    it('should clear all cache and calculate cache stats', async () => {
      vi.mocked(githubOAuthService.getRepositoryPermission).mockResolvedValue({
        permission: 'admin',
      } as any);
      await getUserRepositoryPermission('token', 1, 'user', 'owner', 'repo');

      expect(getCacheStats().size).toBe(1);
      expect(getCacheStats().capacity).toBe(10000);
      expect(getCacheStats().utilizationPercent).toBeGreaterThan(0);

      clearAllCache();
      expect(getCacheStats().size).toBe(0);
    });

    it('should invalidate specific permission cache and user cache', async () => {
      vi.mocked(githubOAuthService.getRepositoryPermission).mockResolvedValue({
        permission: 'admin',
      } as any);
      await getUserRepositoryPermission('token', 1, 'user', 'owner', 'repo1');
      await getUserRepositoryPermission('token', 1, 'user', 'owner', 'repo2');
      await getUserRepositoryPermission('token', 2, 'user2', 'owner', 'repo1');

      expect(getCacheStats().size).toBe(3);

      invalidatePermissionCache(1, 'owner', 'repo1');
      expect(getCacheStats().size).toBe(2);

      invalidateUserCache(1);
      expect(getCacheStats().size).toBe(1);
    });

    it('should run cache cleanup interval and delete expired entries', async () => {
      vi.useFakeTimers();
      vi.mocked(githubOAuthService.getRepositoryPermission).mockResolvedValue({
        permission: 'admin',
      } as any);

      await getUserRepositoryPermission('token', 1, 'user', 'owner', 'repo');
      expect(getCacheStats().size).toBe(1);

      // Fast forward past cleanup interval (60s) and TTL (5m)
      vi.advanceTimersByTime(6 * 60 * 1000);
      startCacheCleanup();
      vi.advanceTimersByTime(60 * 1000);

      expect(getCacheStats().size).toBe(0);
      vi.useRealTimers();
    });
  });
});
