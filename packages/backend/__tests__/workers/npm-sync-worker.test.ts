import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  runNpmSync,
  startNpmSyncWorker,
  stopNpmSyncWorker,
} from '../../src/workers/npm-sync-worker';
import {
  scanMonorepo,
  checkOutdatedDependencies,
} from '@mindfiredigital/utils';
import { prisma } from '../../src/db/prisma';

vi.mock('@mindfiredigital/utils', () => ({
  scanMonorepo: vi.fn(),
  checkOutdatedDependencies: vi.fn(),
}));

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    dependencyInfo: {
      upsert: vi.fn(),
    },
  },
}));

describe('NPM Sync Worker Unit Tests', () => {
  beforeEach(() => {
    stopNpmSyncWorker();
    vi.clearAllMocks();
  });

  it('should scan monorepo and upsert outdated dependencies', async () => {
    vi.mocked(scanMonorepo).mockResolvedValueOnce([{ name: 'pkg-a' }] as any);
    vi.mocked(checkOutdatedDependencies).mockResolvedValueOnce([
      {
        name: 'react',
        version: '17',
        latest: '18',
        status: 'outdated',
        type: 'dep',
        outdated: true,
      },
      {
        name: 'ts',
        version: '4',
        latest: '5',
        status: 'outdated',
        type: 'devDep',
      },
    ] as any);

    await runNpmSync('/root');
    expect(prisma.dependencyInfo.upsert).toHaveBeenCalledTimes(2);
  });

  it('should skip run if sync is already in progress', async () => {
    vi.mocked(scanMonorepo).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve([]), 200))
    );

    const promise1 = runNpmSync('/root');
    const promise2 = runNpmSync('/root'); // Should hit isSyncing branch

    await Promise.all([promise1, promise2]);
    expect(scanMonorepo).toHaveBeenCalledTimes(1);
  });

  it('should handle package-level and fatal errors gracefully', async () => {
    vi.mocked(scanMonorepo).mockResolvedValueOnce([
      { name: 'pkg-fail' },
    ] as any);
    vi.mocked(checkOutdatedDependencies).mockRejectedValueOnce(
      new Error('NPM registry timeout')
    );

    await runNpmSync('/root');
    expect(prisma.dependencyInfo.upsert).not.toHaveBeenCalled();

    // Fatal error branch
    vi.mocked(scanMonorepo).mockRejectedValueOnce(
      new Error('Directory unreadable')
    );
    await runNpmSync('/root');
  });

  it('startNpmSyncWorker & stopNpmSyncWorker lifecycle', async () => {
    vi.useFakeTimers();
    vi.mocked(scanMonorepo).mockResolvedValue([]);

    startNpmSyncWorker('/root');
    expect(scanMonorepo).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(3600000);
    expect(scanMonorepo).toHaveBeenCalledTimes(2);

    stopNpmSyncWorker();
    stopNpmSyncWorker(); // Second call to test null branch
    await vi.advanceTimersByTimeAsync(3600000);
    expect(scanMonorepo).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
