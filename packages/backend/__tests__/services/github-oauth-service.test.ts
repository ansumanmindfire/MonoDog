import { describe, it, expect, vi, beforeEach } from 'vitest';
import https from 'https';
import { EventEmitter } from 'events';
import {
  mapPermissionToRole,
  hasPermission,
  generateAuthorizationUrl,
  exchangeCodeForToken,
  getAuthenticatedUser,
  getUserEmail,
  getRepositoryPermission,
  validateToken,
} from '../../src/services/github-oauth-service';

vi.mock('https');

describe('GitHub OAuth Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setupMockHttps(statusCode: number, body: string) {
    vi.mocked(https.request).mockImplementationOnce((opts: any, cb?: any) => {
      const req = new EventEmitter() as any;
      req.write = vi.fn();
      req.destroy = vi.fn();
      req.setTimeout = vi.fn();
      req.end = vi.fn(() => {
        if (cb) {
          const res = new EventEmitter() as any;
          res.statusCode = statusCode;
          cb(res);
          res.emit('data', body);
          res.emit('end');
        }
      });
      return req;
    });
  }

  describe('OAuth API Requests', () => {
    it('exchangeCodeForToken should return token object or throw error', async () => {
      setupMockHttps(
        200,
        JSON.stringify({
          access_token: 'tok_123',
          scope: 'repo',
          token_type: 'bearer',
        })
      );
      const res = await exchangeCodeForToken('code', 'id', 'sec', 'uri');
      expect(res.access_token).toBe('tok_123');

      setupMockHttps(200, JSON.stringify({ error: 'bad_verification_code' }));
      await expect(
        exchangeCodeForToken('bad', 'id', 'sec', 'uri')
      ).rejects.toThrow('OAuth exchange failed');
    });

    it('getAuthenticatedUser and validateToken', async () => {
      setupMockHttps(200, JSON.stringify({ id: 1, login: 'octocat' }));
      const user = await getAuthenticatedUser('token');
      expect(user.login).toBe('octocat');

      setupMockHttps(200, JSON.stringify({ id: 1, login: 'octocat' }));
      expect(await validateToken('token')).toBe(true);

      setupMockHttps(401, 'Bad credentials');
      expect(await validateToken('invalid')).toBe(false);
    });

    it('getUserEmail should find primary verified email', async () => {
      setupMockHttps(
        200,
        JSON.stringify([
          { email: 'secondary@test.com', primary: false, verified: true },
          { email: 'primary@test.com', primary: true, verified: true },
        ])
      );

      const email = await getUserEmail('token');
      expect(email).toBe('primary@test.com');
    });

    it('getRepositoryPermission direct and fallback public repo check', async () => {
      // Direct permission response
      setupMockHttps(200, JSON.stringify({ permission: 'admin' }));
      const perm1 = await getRepositoryPermission('token', 'o', 'r', 'u');
      expect(perm1.permission).toBe('admin');

      // 404 on permission endpoint, fallback public check returns public repo -> 'read'
      setupMockHttps(404, 'Not Found');
      setupMockHttps(200, JSON.stringify({ private: false }));
      const perm2 = await getRepositoryPermission('token', 'o', 'r', 'u');
      expect(perm2.permission).toBe('read');

      // 404 on permission endpoint, fallback public check returns private -> 'none'
      setupMockHttps(404, 'Not Found');
      setupMockHttps(404, 'Not Found');
      const perm3 = await getRepositoryPermission('token', 'o', 'r', 'u');
      expect(perm3.permission).toBe('none');
    });
  });

  describe('mapPermissionToRole', () => {
    it('should map admin to Admin', () => {
      expect(mapPermissionToRole('admin')).toBe('Admin');
    });

    it('should map maintain to Maintainer', () => {
      expect(mapPermissionToRole('maintain')).toBe('Maintainer');
    });

    it('should map write and read to Collaborator and Viewer', () => {
      expect(mapPermissionToRole('write')).toBe('Collaborator');
      expect(mapPermissionToRole('read')).toBe('Viewer');
    });

    it('should map none to Denied', () => {
      expect(mapPermissionToRole('none')).toBe('Denied');
    });
  });

  describe('hasPermission', () => {
    it('should allow equal permissions', () => {
      expect(hasPermission('write', 'write')).toBe(true);
      expect(hasPermission('admin', 'admin')).toBe(true);
    });

    it('should allow higher permissions', () => {
      expect(hasPermission('admin', 'write')).toBe(true);
      expect(hasPermission('maintain', 'read')).toBe(true);
      expect(hasPermission('write', 'read')).toBe(true);
    });

    it('should deny lower permissions', () => {
      expect(hasPermission('read', 'write')).toBe(false);
      expect(hasPermission('none', 'read')).toBe(false);
      expect(hasPermission('write', 'admin')).toBe(false);
    });
  });

  describe('generateAuthorizationUrl', () => {
    it('should generate a valid OAuth URL with default scopes', () => {
      const url = generateAuthorizationUrl(
        'client123',
        'http://localhost/cb',
        'statexyz'
      );
      expect(url).toContain('https://github.com/login/oauth/authorize');
      expect(url).toContain('client_id=client123');
      expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%2Fcb');
      expect(url).toContain('state=statexyz');
      expect(url).toContain('scope=read%3Auser%2Cuser%3Aemail%2Crepo');
    });

    it('should generate a valid OAuth URL with custom scopes', () => {
      const url = generateAuthorizationUrl(
        'client123',
        'http://localhost/cb',
        'statexyz',
        ['repo', 'workflow']
      );
      expect(url).toContain('scope=repo%2Cworkflow');
    });
  });
});
