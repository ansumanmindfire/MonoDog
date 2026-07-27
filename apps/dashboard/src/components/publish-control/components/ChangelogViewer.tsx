import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { ReleaseData } from '../../../../../../packages/backend/src/types/changelog.types';
import { monorepoService } from '../../../services/monorepoService';
import { ChangelogViewerProps } from '../types/publish.types';

interface CommitItem {
  hash: string;
  message: string;
  author?: string;
  date?: string;
}

const ChangelogViewer: React.FC<ChangelogViewerProps> = ({ packageName }) => {
  const [releases, setReleases] = useState<ReleaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Commit History State
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [commitsLoading, setCommitsLoading] = useState<boolean>(true);
  const [commitSearch, setCommitSearch] = useState<string>('');
  const [visibleCommitCount, setVisibleCommitCount] = useState<number>(10);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchChangelogAndCommits = async () => {
      setLoading(true);
      setCommitsLoading(true);
      try {
        // Fetch package details using monorepoService
        const packages = await monorepoService.getPackages();
        let pkgPath = packageName;
        let foundUrl = '';

        const matchedPkg = packages.find((p: any) => p.name === packageName);
        if (matchedPkg) {
          pkgPath = matchedPkg.path || packageName;
          const repo = matchedPkg.repository;
          if (typeof repo === 'string') {
            try {
              const parsed = JSON.parse(repo);
              foundUrl = parsed.url || repo;
            } catch {
              foundUrl = repo;
            }
          } else if (repo && repo.url) {
            foundUrl = repo.url;
          }
        }

        let cleanUrl: string | null = null;
        if (foundUrl) {
          cleanUrl = foundUrl
            .replace(/^git\+/, '')
            .replace(/^git:\/\//, 'https://')
            .replace(/\.git$/, '');
          if (
            !cleanUrl.startsWith('http://') &&
            !cleanUrl.startsWith('https://')
          ) {
            cleanUrl = `https://${cleanUrl.replace(/^github\.com\/?/, 'github.com/')}`;
          }
        }
        setRepoUrl(cleanUrl);

        // Fetch Release History via monorepoService
        const changelogData = await monorepoService.getChangelog(packageName);
        setReleases(changelogData);

        // Fetch Package Commits History via monorepoService
        const commitsData = await monorepoService.getCommits(pkgPath);
        setCommits(commitsData);
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
        setCommitsLoading(false);
      }
    };

    if (packageName) {
      fetchChangelogAndCommits();
    }
  }, [packageName]);

  if (loading)
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 rounded bg-neutral-200" />
          <div className="h-8 w-32 rounded bg-neutral-200" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card overflow-hidden">
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-5 w-16 rounded bg-neutral-200" />
                <div className="h-4 w-24 rounded bg-neutral-100" />
              </div>
              <div className="h-5 w-14 rounded-full bg-neutral-100" />
            </div>
            <div className="p-6 space-y-3">
              <div className="h-4 w-full rounded bg-neutral-100" />
              <div className="h-4 w-3/4 rounded bg-neutral-100" />
              <div className="h-4 w-1/2 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );

  // Filter Logic for Releases
  const keyword = searchKeyword.toLowerCase().trim();
  const displayedReleases = releases.filter(r => {
    const matchesVersion =
      selectedVersion === 'all' || r.version === selectedVersion;
    const matchesSearch =
      !keyword ||
      r.version.toLowerCase().includes(keyword) ||
      (r.markdownBody && r.markdownBody.toLowerCase().includes(keyword));
    return matchesVersion && matchesSearch;
  });

  // Filter Logic for Commits
  const commitQuery = commitSearch.toLowerCase().trim();
  const filteredCommits = commits.filter(
    c =>
      !commitQuery ||
      c.message?.toLowerCase().includes(commitQuery) ||
      c.hash?.toLowerCase().includes(commitQuery) ||
      c.author?.toLowerCase().includes(commitQuery)
  );

  return (
    <div className="space-y-6 w-full">
      {/* SECTION 1: RELEASE HISTORY */}
      <div className="card overflow-hidden w-full">
        <div className="bg-neutral-50 px-6 py-5 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-heading text-xl">Release History</h2>
            <select
              className="input-base bg-white"
              value={selectedVersion}
              onChange={e => setSelectedVersion(e.target.value)}
            >
              <option value="all">All Versions</option>
              {releases.map(r => (
                <option key={r.version} value={r.version}>
                  v{r.version}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className="input-base bg-white w-full"
            placeholder="Search changelogs by keyword..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
          />
        </div>

        <div className="p-6 flex flex-col gap-4">
          {displayedReleases.length === 0 ? (
            <div className="p-4 text-gray-500 italic">
              No release history found matching your filters.
            </div>
          ) : (
            displayedReleases.map(release => (
              <div key={release.version} className="card overflow-hidden">
                {/* Release Header */}
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-heading text-primary-600 text-lg font-semibold">
                      v{release.version}
                    </span>
                    {release.date &&
                      !isNaN(new Date(release.date).getTime()) && (
                        <span className="text-caption">
                          {new Date(release.date).toLocaleDateString()}
                        </span>
                      )}
                  </div>
                  {release.author && release.author !== 'system' && (
                    <span className="badge-neutral">{release.author}</span>
                  )}
                </div>

                {/* Markdown Body */}
                <div className="p-6 prose prose-blue max-w-none text-gray-700 prose-table:w-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {release.markdownBody || '*No release notes available.*'}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 2: PACKAGE COMMIT HISTORY */}
      <div className="card overflow-hidden w-full">
        <div className="bg-neutral-50 px-6 py-5 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-heading text-xl flex items-center gap-2">
              Package Commit History
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-700">
                {commits.length} Commits
              </span>
            </h2>
            <p className="text-caption text-xs mt-1">
              Git commit history for {packageName}
            </p>
          </div>
          <input
            type="text"
            className="input-base bg-white w-full md:w-64"
            placeholder="Filter commits..."
            value={commitSearch}
            onChange={e => setCommitSearch(e.target.value)}
          />
        </div>

        <div className="p-6">
          {commitsLoading ? (
            <div className="py-8 text-center text-gray-500 animate-pulse">
              Loading package commit history...
            </div>
          ) : filteredCommits.length === 0 ? (
            <div className="py-8 text-center text-gray-500 italic">
              No commits found for this package.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 overflow-hidden">
                {filteredCommits
                  .slice(0, visibleCommitCount)
                  .map((commit: CommitItem) => {
                    const commitUrl = repoUrl
                      ? `${repoUrl}/commit/${commit.hash}`
                      : null;

                    const commitDateFormatted = commit.date
                      ? new Date(commit.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '';

                    return (
                      <div
                        key={commit.hash}
                        className="p-4 bg-white hover:bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          {commitUrl ? (
                            <a
                              href={commitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200 px-2 py-1 rounded transition-colors font-medium shrink-0 flex items-center gap-1"
                              title="View commit on GitHub"
                            >
                              #{commit.hash.substring(0, 7)}
                              <span className="text-[10px]">↗</span>
                            </a>
                          ) : (
                            <span className="font-mono text-xs bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-1 rounded font-medium shrink-0">
                              #{commit.hash.substring(0, 7)}
                            </span>
                          )}
                          <span className="text-sm font-medium text-neutral-800">
                            {commit.message}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-500 shrink-0">
                          {commit.author && (
                            <span className="font-medium text-neutral-600">
                              {commit.author}
                            </span>
                          )}
                          {commitDateFormatted && (
                            <span>{commitDateFormatted}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {filteredCommits.length > visibleCommitCount && (
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setVisibleCommitCount(prev => prev + 15)}
                    className="btn-primary text-sm px-5 py-2.5 shadow-sm"
                  >
                    Load More Commits (
                    {filteredCommits.length - visibleCommitCount} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangelogViewer;
