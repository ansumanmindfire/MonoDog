import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getRepositoryPermission,
  checkActionPermission,
  invalidateCache,
} from '../../src/controllers/permission-controller';

import * as authMiddleware from '../../src/middleware/auth-middleware';
import * as permissionService from '../../src/services/permission-service';

vi.mock('../../src/middleware/auth-middleware', () => ({
  getSessionFromRequest: vi.fn(),
}));

vi.mock('../../src/services/permission-service', () => ({
  checkRepositoryPermission: vi.fn(),
  checkUserAction: vi.fn(),
  invalidatePermissionCache: vi.fn(),
}));

describe('Permission Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      params: { owner: 'o', repo: 'r' },
      query: {},
      body: {},
    };
    res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  describe('getRepositoryPermission', () => {
    it('should return 401 if session is missing', async () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce(null);
      await getRepositoryPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 400 if owner or repo is missing', async () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        user: {},
      } as any);
      req.params = { owner: '' };
      await getRepositoryPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return permission check results', async () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        accessToken: 'token',
        user: { id: 1, login: 'octocat' },
      } as any);

      vi.mocked(
        permissionService.checkRepositoryPermission
      ).mockResolvedValueOnce({
        permission: 'admin',
        role: 'admin',
        canAdmin: true,
        canMaintain: true,
        canWrite: true,
        canRead: true,
        denied: false,
      });

      await getRepositoryPermission(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          permission: 'admin',
        })
      );
    });

    it('should handle service errors with 500 status', async () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        accessToken: 'token',
        user: { id: 1, login: 'octocat' },
      } as any);
      vi.mocked(
        permissionService.checkRepositoryPermission
      ).mockRejectedValueOnce(new Error('Err'));

      await getRepositoryPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('checkActionPermission', () => {
    it('should return 401 if session missing', async () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce(null);
      await checkActionPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 400 if owner/repo missing or action is invalid', async () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        user: {},
      } as any);
      req.params = {};
      await checkActionPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

      req.params = { owner: 'o', repo: 'r' };
      req.body = { action: 'invalid_action' };
      await checkActionPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return action permission check results on valid action', async () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        accessToken: 'token',
        user: { id: 1, login: 'octocat' },
      } as any);
      req.body = { action: 'write' };

      vi.mocked(permissionService.checkUserAction).mockResolvedValueOnce({
        action: 'write',
        can: true,
        permission: 'admin',
        role: 'admin',
      });

      await checkActionPermission(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          can: true,
        })
      );
    });

    it('should handle service errors with 500 status', async () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        accessToken: 'token',
        user: { id: 1, login: 'octocat' },
      } as any);
      req.body = { action: 'write' };
      vi.mocked(permissionService.checkUserAction).mockRejectedValueOnce(
        new Error('Err')
      );

      await checkActionPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('invalidateCache', () => {
    it('should return 401 if session missing, 400 if params missing', () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce(null);
      invalidateCache(req, res);
      expect(res.status).toHaveBeenCalledWith(401);

      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        user: {},
      } as any);
      req.params = {};
      invalidateCache(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should invalidate cache and return success', () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        accessToken: 'token',
        user: { id: 1, login: 'octocat' },
      } as any);

      invalidateCache(req, res);
      expect(permissionService.invalidatePermissionCache).toHaveBeenCalledWith(
        1,
        'o',
        'r'
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Permission cache invalidated',
        })
      );
    });

    it('should handle errors with 500 status', () => {
      vi.mocked(authMiddleware.getSessionFromRequest).mockReturnValueOnce({
        user: { id: 1 },
      } as any);
      vi.mocked(
        permissionService.invalidatePermissionCache
      ).mockImplementationOnce(() => {
        throw new Error('Err');
      });

      invalidateCache(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
