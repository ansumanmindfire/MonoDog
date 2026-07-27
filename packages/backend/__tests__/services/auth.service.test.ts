import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateGithubAuthUrl,
  exchangeGithubCodeForToken,
  handleOAuthCallback,
  decodeSessionToken,
} from '../../src/services/auth.service';
import {
  exchangeCodeForToken,
  getAuthenticatedUser,
} from '../../src/services/github-oauth-service';
import { getRepositoryInfoFromGit } from '../../src/utils/utilities';
import { getUserRepositoryPermission } from '../../src/services/permission-service';

vi.mock('../../src/services/github-oauth-service', () => ({
  exchangeCodeForToken: vi.fn(),
  getAuthenticatedUser: vi.fn(),
}));

vi.mock('../../src/utils/utilities', () => ({
  getRepositoryInfoFromGit: vi.fn(),
}));

vi.mock('../../src/services/permission-service', () => ({
  getUserRepositoryPermission: vi.fn(),
}));

vi.mock('../../src/middleware/auth-middleware', () => ({
  storeSession: vi.fn().mockResolvedValue('mock-session-token-123'),
}));

describe('Auth Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateGithubAuthUrl', () => {
    it('should generate an auth URL and state', () => {
      const result = generateGithubAuthUrl();

      expect(result).toHaveProperty('authUrl');
      expect(result).toHaveProperty('state');
      expect(result.authUrl).toContain(
        'https://github.com/login/oauth/authorize'
      );
      expect(result.authUrl).toContain('state=');
    });
  });

  describe('exchangeGithubCodeForToken', () => {
    it('should throw error when code or state is missing', async () => {
      await expect(
        exchangeGithubCodeForToken('', 'state', 'state')
      ).rejects.toThrow('Authorization code is required');
      await expect(
        exchangeGithubCodeForToken('code', '', 'cookieState')
      ).rejects.toThrow('State parameter is missing');
    });

    it('should throw CSRF error when state does not match cookieState or stateStore', async () => {
      await expect(
        exchangeGithubCodeForToken('code', 'stateA', 'stateB')
      ).rejects.toThrow('Invalid state parameter - possible CSRF attack');
    });

    it('should exchange code for token and return sessionToken and user details', async () => {
      const { state } = generateGithubAuthUrl();

      const globalFetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          json: async () => ({ access_token: 'gho_12345' }),
        })
        .mockResolvedValueOnce({
          json: async () => ({
            id: 99,
            login: 'octocat',
            avatar_url: 'https://avatar.url',
            name: 'Monalisa Octocat',
            email: 'octo@github.com',
          }),
        });

      vi.stubGlobal('fetch', globalFetchMock);

      const result = await exchangeGithubCodeForToken('code123', state, state);

      expect(result.user.login).toBe('octocat');
      expect(result.user.id).toBe(99);
      expect(result.sessionToken).toBeDefined();

      const decoded = decodeSessionToken(result.sessionToken);
      expect(decoded.login).toBe('octocat');
      expect(decoded.token).toBe('gho_12345');

      vi.unstubAllGlobals();
    });

    it('should throw error if GitHub token exchange or user fetch fails', async () => {
      const { state: state1 } = generateGithubAuthUrl();
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          json: async () => ({ error: 'bad_code' }),
        })
      );
      await expect(
        exchangeGithubCodeForToken('code123', state1, state1)
      ).rejects.toThrow('Failed to exchange authorization code');
      vi.unstubAllGlobals();

      const { state: state2 } = generateGithubAuthUrl();
      vi.stubGlobal(
        'fetch',
        vi
          .fn()
          .mockResolvedValueOnce({
            json: async () => ({ access_token: 'gho_12345' }),
          })
          .mockResolvedValueOnce({
            json: async () => ({ error: 'user_error' }),
          })
      );
      await expect(
        exchangeGithubCodeForToken('code123', state2, state2)
      ).rejects.toThrow('Failed to fetch user information');
      vi.unstubAllGlobals();
    });
  });

  describe('handleOAuthCallback', () => {
    it('should throw error on missing code/state or expired session', async () => {
      await expect(handleOAuthCallback('', 'state')).rejects.toThrow(
        'OAuth code and state are required'
      );
      await expect(
        handleOAuthCallback('code', 'invalid_state')
      ).rejects.toThrow('Invalid or expired session');
    });

    it('should throw error if GITHUB_CLIENT_SECRET is missing', async () => {
      const { state } = generateGithubAuthUrl();
      const origSecret = process.env.GITHUB_CLIENT_SECRET;
      delete process.env.GITHUB_CLIENT_SECRET;

      await expect(handleOAuthCallback('code', state)).rejects.toThrow(
        'Failed to initiate GitHub OAuth flow'
      );

      process.env.GITHUB_CLIENT_SECRET = origSecret;
    });

    it('should complete OAuth callback flow with permission fetching', async () => {
      const { state } = generateGithubAuthUrl();
      process.env.GITHUB_CLIENT_SECRET = 'secret123';
      process.env.GITHUB_CLIENT_ID = 'id123';
      process.env.GITHUB_REDIRECT_URI = 'http://localhost/callback';

      vi.mocked(exchangeCodeForToken).mockResolvedValueOnce({
        access_token: 'token_abc',
        scope: 'repo,user',
      } as any);

      vi.mocked(getAuthenticatedUser).mockResolvedValueOnce({
        id: 42,
        login: 'octocat',
        name: 'Octocat',
        avatar_url: 'http://avatar.png',
      } as any);

      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'mindfire',
        repo: 'monodog',
      });

      vi.mocked(getUserRepositoryPermission).mockResolvedValueOnce({
        permission: 'admin',
        role: 'admin',
        owner: 'mindfire',
        repo: 'monodog',
      } as any);

      const res = await handleOAuthCallback('code123', state, '/root');

      expect(res.sessionToken).toBe('mock-session-token-123');
      expect(res.user.login).toBe('octocat');
      expect(res.permission).toEqual({
        level: 'admin',
        role: 'admin',
        owner: 'mindfire',
        repo: 'monodog',
      });
    });

    it('should handle permission fetch errors gracefully without throwing', async () => {
      const { state } = generateGithubAuthUrl();
      process.env.GITHUB_CLIENT_SECRET = 'secret123';

      vi.mocked(exchangeCodeForToken).mockResolvedValueOnce({
        access_token: 'token_abc',
        scope: 'user',
      } as any);

      vi.mocked(getAuthenticatedUser).mockResolvedValueOnce({
        id: 42,
        login: 'octocat',
      } as any);

      vi.mocked(getRepositoryInfoFromGit).mockRejectedValueOnce(
        new Error('Git error')
      );

      const res = await handleOAuthCallback('code123', state);
      expect(res.permission).toBeNull();
    });
  });

  describe('decodeSessionToken', () => {
    it('should decode a base64 encoded JSON token', () => {
      const payload = { userId: 123, login: 'testuser' };
      const token = Buffer.from(JSON.stringify(payload)).toString('base64');

      const decoded = decodeSessionToken(token);
      expect(decoded).toEqual(payload);
    });
  });
});
