import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import {
  parseChangelog,
  fetchGitHubReleases,
} from '../../src/services/changelog.service';

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
}));

describe('changelog.service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseChangelog', () => {
    it('should parse CHANGELOG.md file and cache the result', async () => {
      const mockMarkdown = `
# Changelog
## [1.2.0] - 2026-01-01
- Added feature A

## 1.1.0 2025-12-01
- Fixed bug B
      `;
      vi.mocked(fs.readFile).mockResolvedValue(mockMarkdown);

      const pathDir = '/path/to/pkg-' + Date.now();
      const res1 = await parseChangelog(pathDir);
      expect(res1).toHaveLength(2);
      expect(res1[0].version).toBe('1.2.0');
      expect(res1[0].date).toContain('2026-01-01');

      // Second call should return cached data
      const res2 = await parseChangelog(pathDir);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(res2).toEqual(res1);
    });

    it('should handle unparseable header date or missing file gracefully', async () => {
      const mockMarkdown = `
## [1.0.0] - InvalidDate
- Initial release
      `;
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockMarkdown);
      const resNoDate = await parseChangelog('/fake/nodate-' + Date.now());
      expect(resNoDate[0].date).toBeNull();

      vi.mocked(fs.readFile).mockRejectedValueOnce(new Error('ENOENT'));
      const resMissing = await parseChangelog(
        '/fake/nonexistent-' + Date.now()
      );
      expect(resMissing).toEqual([]);
    });
  });

  describe('fetchGitHubReleases', () => {
    it('should fetch releases from GitHub API, handle null fields, and cache response', async () => {
      const mockFetchResponse = [
        {
          tag_name: 'v1.0.0',
          published_at: '2026-01-01',
          author: { login: 'octocat' },
          body: 'Release notes',
        },
        {
          tag_name: 'v0.9.0',
          published_at: '2025-12-01',
          author: null,
          body: null,
        },
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockFetchResponse),
        })
      );

      const ownerRepo = 'owner-' + Date.now();
      const releases1 = await fetchGitHubReleases(ownerRepo, 'repo', 'token');
      expect(releases1).toHaveLength(2);
      expect(releases1[0].version).toBe('1.0.0');
      expect(releases1[1].author).toBe('');
      expect(releases1[1].markdownBody).toBe('');

      // Second call should hit the cache
      const releases2 = await fetchGitHubReleases(ownerRepo, 'repo', 'token');
      expect(releases2).toEqual(releases1);

      vi.unstubAllGlobals();
    });

    it('should return empty array when response is not ok', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
        })
      );

      const releases = await fetchGitHubReleases('owner-bad', 'repo', 'token');
      expect(releases).toEqual([]);
      vi.unstubAllGlobals();
    });

    it('should catch throwables during fetch', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('Network error'))
      );

      const releases = await fetchGitHubReleases('owner-err', 'repo', 'token');
      expect(releases).toEqual([]);
      vi.unstubAllGlobals();
    });
  });
});
