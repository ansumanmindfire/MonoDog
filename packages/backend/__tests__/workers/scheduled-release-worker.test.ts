import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  startScheduledReleaseWorker,
  stopScheduledReleaseWorker,
} from '../../src/workers/scheduled-release-worker';
import { prisma } from '../../src/db/prisma';
import {
  updateScheduledReleaseStatus,
  deleteOldPipelines,
} from '../../src/services/pipeline-service';
import { getRepositoryInfoFromGit } from '../../src/utils/utilities';
import { createChangesetPullRequest } from '../../src/services/github-repo-service';

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    scheduledRelease: {
      findMany: vi.fn(),
    },
    session: {
      findFirst: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../../src/services/pipeline-service', () => ({
  updateScheduledReleaseStatus: vi.fn(),
  deleteOldPipelines: vi.fn(),
}));

vi.mock('../../src/utils/utilities', () => ({
  getRepositoryInfoFromGit: vi.fn(),
}));

vi.mock('../../src/services/github-repo-service', () => ({
  createChangesetPullRequest: vi.fn(),
}));

vi.mock('../../src/utils/encryption', () => ({
  decryptToken: vi.fn().mockReturnValue('decrypted-token'),
}));

describe('Scheduled Release Worker Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stopScheduledReleaseWorker();
  });

  afterEach(() => {
    stopScheduledReleaseWorker();
  });

  it('should start and run initial checks and hourly cleanup with count > 0 or error', async () => {
    vi.useFakeTimers();
    vi.mocked(prisma.scheduledRelease.findMany).mockResolvedValue([]);
    vi.mocked(deleteOldPipelines).mockResolvedValueOnce(5);

    startScheduledReleaseWorker('/root');
    expect(prisma.scheduledRelease.findMany).toHaveBeenCalledTimes(1);

    // Advance by 60s for check cycle
    await vi.advanceTimersByTimeAsync(60 * 1000);
    expect(prisma.scheduledRelease.findMany).toHaveBeenCalledTimes(2);

    // Advance by 1 hour for cleanup cycle
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);
    expect(deleteOldPipelines).toHaveBeenCalledWith(90);

    // Cleanup error branch
    vi.mocked(deleteOldPipelines).mockRejectedValueOnce(
      new Error('Db cleanup fail')
    );
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

    vi.useRealTimers();
  });

  it('should prevent duplicate starts', () => {
    vi.useFakeTimers();
    vi.mocked(prisma.scheduledRelease.findMany).mockResolvedValue([]);
    startScheduledReleaseWorker('/root');
    startScheduledReleaseWorker('/root');
    expect(prisma.scheduledRelease.findMany).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('should process due pending release successfully', async () => {
    const dueRelease = {
      id: 'rel-1',
      packageName: 'pkg-a',
      releaseVersion: '2.0.0',
      triggeredBy: 'octocat',
      scheduledAt: new Date(),
      package: { version: '1.0.0' },
    };

    vi.mocked(prisma.scheduledRelease.findMany).mockResolvedValueOnce([
      dueRelease,
    ] as any);
    vi.mocked(prisma.session.findFirst).mockResolvedValueOnce({
      accessToken: 'enc-token',
    } as any);
    vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
      owner: 'o',
      repo: 'r',
    });
    vi.mocked(createChangesetPullRequest).mockResolvedValueOnce({
      success: true,
      message: 'PR created',
    });

    startScheduledReleaseWorker('/root');

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(updateScheduledReleaseStatus).toHaveBeenCalledWith(
      'rel-1',
      'in-progress'
    );
    expect(createChangesetPullRequest).toHaveBeenCalledWith(
      'o',
      'r',
      'pkg-a',
      expect.any(String),
      'decrypted-token'
    );
    expect(updateScheduledReleaseStatus).toHaveBeenCalledWith(
      'rel-1',
      'triggered'
    );
    expect(prisma.activityLog.create).toHaveBeenCalled();
  });

  it('should handle missing token/repo info and failure response', async () => {
    const dueRelease = {
      id: 'rel-2',
      packageName: 'pkg-b',
      releaseVersion: '1.1.0',
      triggeredBy: 'octocat',
      scheduledAt: new Date(),
      package: { version: '1.0.0' },
    };

    vi.mocked(prisma.scheduledRelease.findMany).mockResolvedValueOnce([
      dueRelease,
    ] as any);
    vi.mocked(prisma.session.findFirst).mockResolvedValueOnce(null);

    startScheduledReleaseWorker('/root');

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(updateScheduledReleaseStatus).toHaveBeenCalledWith(
      'rel-2',
      'failed'
    );
  });

  it('should process release exception gracefully', async () => {
    const dueRelease = {
      id: 'rel-3',
      packageName: 'pkg-c',
      releaseVersion: '1.1.0',
      triggeredBy: 'octocat',
      scheduledAt: new Date(),
      package: { version: '1.0.0' },
    };

    vi.mocked(prisma.scheduledRelease.findMany).mockResolvedValueOnce([
      dueRelease,
    ] as any);
    vi.mocked(updateScheduledReleaseStatus).mockRejectedValueOnce(
      new Error('Db write fail')
    );

    startScheduledReleaseWorker('/root');

    await new Promise(resolve => setTimeout(resolve, 50));
  });
});
