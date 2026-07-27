import fs from 'fs/promises';
import path from 'path';
import { AppLogger } from '../middleware/logger';
import { ReleaseData } from '../types/changelog.types';

// In-memory cache for parsed changelogs
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min
interface CachedChangelog {
  data: ReleaseData[];
  cachedAt: number;
}
const changelogCache = new Map<string, CachedChangelog>();

// Parse the local CHANGELOG.md file
async function parseChangelog(packagePath: string): Promise<ReleaseData[]> {
  // Check cache first
  const cached = changelogCache.get(packagePath);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const changelogPath = path.join(packagePath, 'CHANGELOG.md');
    const content = await fs.readFile(changelogPath, 'utf-8');

    const versionBlocks = content.split(
      // eslint-disable-next-line no-useless-escape
      /^##\s+\[?([\d\.]+(?:-[a-zA-Z0-9\.]+)?)]?(?:\s+-?\s+)?(.*)?$/m
    );

    const entries: ReleaseData[] = [];

    for (let i = 1; i < versionBlocks.length; i += 3) {
      const version = versionBlocks[i];
      const headerDateCandidate = versionBlocks[i + 1]?.trim() || '';
      const isValidHeaderDate =
        Boolean(headerDateCandidate) &&
        !isNaN(new Date(headerDateCandidate).getTime());

      const dateString = isValidHeaderDate
        ? new Date(headerDateCandidate).toISOString()
        : null;

      const body = versionBlocks[i + 2]?.trim() || '';

      entries.push({
        version,
        date: dateString,
        author: '',
        markdownBody: body,
        source: 'changelog',
        commits: [],
      });
    }

    // Store in cache
    changelogCache.set(packagePath, { data: entries, cachedAt: Date.now() });

    return entries;
  } catch (error) {
    AppLogger.warn(`No local CHANGELOG.md found at ${packagePath}`);
    return [];
  }
}

const githubReleasesCache = new Map<string, CachedChangelog>();

// Fetch official releases from GitHub API
async function fetchGitHubReleases(
  owner: string,
  repo: string,
  accessToken: string
): Promise<ReleaseData[]> {
  const cacheKey = `${owner}/${repo}`;
  const cached = githubReleasesCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'MonoDog',
      Accept: 'application/vnd.github+json',
    };

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      { headers }
    );

    if (!response.ok) return [];

    const data = await response.json();

    const releases = data.map((release: any) => ({
      version: release.tag_name.replace(/^v/, ''),
      date: release.published_at,
      author: release.author?.login || '',
      markdownBody: release.body || '',
      source: 'github',
      commits: [],
    }));

    githubReleasesCache.set(cacheKey, { data: releases, cachedAt: Date.now() });

    return releases;
  } catch (error) {
    AppLogger.error(`Failed to fetch GitHub releases: ${error}`);
    return [];
  }
}

export { parseChangelog, fetchGitHubReleases };
