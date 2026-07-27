import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  login,
  callback,
  getMe,
  validate,
  logout,
} from '../../src/controllers/auth.controller';
import * as authService from '../../src/services/auth.service';
import * as authMiddleware from '../../src/middleware/auth-middleware';

vi.mock('../../src/services/auth.service', () => ({
  generateGithubAuthUrl: vi.fn(),
  decodeSessionToken: vi.fn(),
  handleOAuthCallback: vi.fn(),
}));

vi.mock('../../src/middleware/auth-middleware', () => ({
  getSession: vi.fn(),
}));

describe('Auth Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      headers: {},
      query: {},
      app: { locals: { rootPath: '/root' } },
    };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      cookie: vi.fn(),
    };
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return 200 with authUrl and state', () => {
      vi.mocked(authService.generateGithubAuthUrl).mockReturnValue({
        authUrl: 'http://gh',
        state: 'xyz',
      });
      login(req, res);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        authUrl: 'http://gh',
        state: 'xyz',
      });
    });

    it('should return 500 on generation error', () => {
      vi.mocked(authService.generateGithubAuthUrl).mockImplementationOnce(
        () => {
          throw new Error('Url gen error');
        }
      );
      login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('callback', () => {
    it('should handle OAuth query error from GitHub', async () => {
      req.query = {
        error: 'access_denied',
        error_description: 'User denied access',
      };
      await callback(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if code or state is missing', async () => {
      req.query = { code: '123' };
      await callback(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should process OAuth callback successfully', async () => {
      req.query = { code: '123', state: 'xyz' };
      vi.mocked(authService.handleOAuthCallback).mockResolvedValueOnce({
        sessionToken: 's-123',
        user: { id: 1, login: 'octocat' },
      } as any);

      await callback(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          sessionToken: 's-123',
        })
      );
    });

    it('should handle CSRF vs generic login errors', async () => {
      req.query = { code: '123', state: 'xyz' };
      vi.mocked(authService.handleOAuthCallback).mockRejectedValueOnce(
        new Error('Invalid state - possible CSRF attack')
      );

      await callback(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

      vi.mocked(authService.handleOAuthCallback).mockRejectedValueOnce(
        new Error('GitHub OAuth failed')
      );
      await callback(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getMe, validate, logout', () => {
    it('getMe should return session user info if session exists, fallback to decoded token if null', async () => {
      req.headers.authorization = 'Bearer token123';
      vi.mocked(authMiddleware.getSession).mockResolvedValueOnce({
        user: { id: 1, login: 'octocat' },
        scopes: ['repo'],
        expiresAt: 1000,
        permission: { level: 'admin' },
      } as any);

      await getMe(req, res);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: { id: 1, login: 'octocat' },
        scopes: ['repo'],
        expiresAt: 1000,
        permission: { level: 'admin' },
      });

      // Fallback path when getSession returns null
      vi.mocked(authMiddleware.getSession).mockResolvedValueOnce(null);
      vi.mocked(authService.decodeSessionToken).mockReturnValueOnce({
        userId: 2,
        login: 'dev',
        issuedAt: 2000,
      } as any);

      await getMe(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: { id: 2, login: 'dev' },
        })
      );
    });

    it('getMe should return 401 on missing or invalid token', async () => {
      await getMe(req, res);
      expect(res.status).toHaveBeenCalledWith(401);

      req.headers.authorization = 'Bearer invalid';
      vi.mocked(authMiddleware.getSession).mockRejectedValueOnce(
        new Error('Invalid token')
      );
      await getMe(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('validate should check token and return valid state for active or decoded session', async () => {
      req.headers.authorization = 'Bearer token123';
      vi.mocked(authMiddleware.getSession).mockResolvedValueOnce(null);
      vi.mocked(authService.decodeSessionToken).mockReturnValueOnce({
        userId: 1,
      } as any);

      await validate(req, res);
      expect(res.json).toHaveBeenCalledWith({ success: true, valid: true });

      // Error path
      vi.mocked(authMiddleware.getSession).mockRejectedValueOnce(
        new Error('Bad token')
      );
      await validate(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('logout should return success response', () => {
      logout(req, res);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});
