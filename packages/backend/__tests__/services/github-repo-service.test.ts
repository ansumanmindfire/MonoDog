import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createChangesetPullRequest } from '../../src/services/github-repo-service';
import { makeGitHubRequest } from '../../src/services/github-actions-service';

vi.mock('../../src/services/github-actions-service', () => ({
  makeGitHubRequest: vi.fn(),
  requestOptions: vi.fn(),
}));

describe('github-repo-service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create changeset pull request successfully with default branch fallback', async () => {
    vi.mocked(makeGitHubRequest)
      .mockResolvedValueOnce({ data: {} }) // repoData with no default_branch -> fallback to 'main'
      .mockResolvedValueOnce({ data: { object: { sha: 'sha123' } } })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({
        data: { html_url: 'https://github.com/o/r/pull/1' },
      });

    const res = await createChangesetPullRequest(
      'owner',
      'repo',
      'pkg-a',
      'content',
      'token'
    );
    expect(res.success).toBe(true);
    expect(res.prUrl).toBe('https://github.com/o/r/pull/1');
  });

  it('should handle errors during PR creation gracefully', async () => {
    vi.mocked(makeGitHubRequest).mockRejectedValueOnce(
      new Error('GitHub API Error 403')
    );
    const res = await createChangesetPullRequest(
      'owner',
      'repo',
      'pkg-a',
      'content',
      'token'
    );

    expect(res.success).toBe(false);
    expect(res.message).toBe('GitHub API Error 403');
  });

  it('should handle non-Error throwables gracefully', async () => {
    vi.mocked(makeGitHubRequest).mockRejectedValueOnce('string error');
    const res = await createChangesetPullRequest(
      'owner',
      'repo',
      'pkg-a',
      'content',
      'token'
    );

    expect(res.success).toBe(false);
    expect(res.message).toBe('Unknown error creating PR');
  });
});
