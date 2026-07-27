import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getRecentPipelines,
  getPipelineAuditLogs,
  updatePipelineStatus,
  getPipelineDetails,
  refreshPipelineFromRun,
  scheduleRelease,
  getPendingScheduledReleases,
  cancelScheduledRelease,
} from '../../src/controllers/pipeline.controller';

import * as pipelineService from '../../src/services/pipeline-service';
import * as githubService from '../../src/services/github-actions-service';
import { getRepositoryInfoFromGit } from '../../src/utils/utilities';
import { prisma } from '../../src/db/prisma';

vi.mock('../../src/services/pipeline-service', () => ({
  getRecentPipelines: vi.fn(),
  getPipelineAuditLogs: vi.fn(),
  updatePipelineStatus: vi.fn(),
  getPipelineById: vi.fn(),
  scheduleRelease: vi.fn(),
  getPendingScheduledReleases: vi.fn(),
  cancelScheduledRelease: vi.fn(),
}));

vi.mock('../../src/services/github-actions-service', () => ({
  getWorkflowRuns: vi.fn(),
  getWorkflowRunJobs: vi.fn(),
  getWorkflowRun: vi.fn(),
}));

vi.mock('../../src/utils/utilities', () => ({
  getRepositoryInfoFromGit: vi.fn(),
}));

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    activityLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe('Pipeline Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      params: { pipelineId: 'p1', id: 'sch-1' },
      query: { limit: '10', offset: '0' },
      body: {},
      user: { id: 1, login: 'octocat' },
      accessToken: 'mock-token',
      app: { locals: { rootPath: '/root' } },
    };
    res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  it('getRecentPipelines should fetch and enrich pipelines without accessToken', async () => {
    delete req.accessToken;
    vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
      owner: 'o',
      repo: 'r',
    });
    vi.mocked(pipelineService.getRecentPipelines).mockResolvedValueOnce([
      {
        id: 'p1',
        owner: 'o',
        repo: 'r',
        workflowId: '1',
        triggeredAt: new Date().toISOString(),
      },
    ] as any);

    await getRecentPipelines(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, total: 1 })
    );
  });

  it('getRecentPipelines should select best run with matching lastRunId and sorting by run_attempt', async () => {
    req.accessToken = 'mock-token';
    const now = new Date();
    const t1 = new Date(now.getTime() - 1000).toISOString();
    const t2 = new Date(now.getTime() - 500).toISOString();

    vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
      owner: 'o',
      repo: 'r',
    });
    vi.mocked(pipelineService.getRecentPipelines).mockResolvedValueOnce([
      {
        id: 'p1',
        owner: 'o',
        repo: 'r',
        workflowId: '1',
        lastRunId: '100',
        triggeredAt: now.toISOString(),
      },
      {
        id: 'p2',
        owner: 'o',
        repo: 'r',
        workflowId: '1',
        triggeredAt: now.toISOString(),
      },
    ] as any);

    vi.mocked(githubService.getWorkflowRuns)
      .mockResolvedValueOnce({
        runs: [
          {
            id: 100,
            status: 'completed',
            conclusion: 'success',
            created_at: t1,
            run_attempt: 1,
          },
          {
            id: 101,
            status: 'completed',
            conclusion: 'success',
            created_at: t2,
            run_attempt: 2,
          },
        ] as any,
        rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
      })
      .mockResolvedValueOnce({
        runs: [
          {
            id: 201,
            status: 'completed',
            conclusion: 'success',
            created_at: t2,
            run_attempt: 1,
          },
          {
            id: 202,
            status: 'completed',
            conclusion: 'success',
            created_at: t2,
            run_attempt: 2,
          },
        ] as any,
        rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
      });

    vi.mocked(githubService.getWorkflowRunJobs).mockResolvedValue({
      jobs: [],
      totalCount: 0,
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });

    await getRecentPipelines(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, total: 2 })
    );
  });

  it('getRecentPipelines should handle enrichPipeline exception gracefully', async () => {
    vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
      owner: 'o',
      repo: 'r',
    });
    vi.mocked(pipelineService.getRecentPipelines).mockResolvedValueOnce([
      {
        id: 'p1',
        owner: 'o',
        repo: 'r',
        workflowId: '1',
        triggeredAt: new Date().toISOString(),
      },
    ] as any);
    vi.mocked(githubService.getWorkflowRuns).mockRejectedValueOnce(
      new Error('GitHub API timeout')
    );

    await getRecentPipelines(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, total: 1 })
    );
  });

  it('getPipelineAuditLogs audit log details parsing', async () => {
    vi.mocked(pipelineService.getPipelineAuditLogs).mockResolvedValueOnce([
      { id: 'l1', details: '{"a":1}' },
      { id: 'l2', details: { b: 2 } },
    ]);

    await getPipelineAuditLogs(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        logs: [
          expect.objectContaining({ details: { a: 1 } }),
          expect.objectContaining({ details: { b: 2 } }),
        ],
      })
    );
  });

  it('updatePipelineStatus check mandatory currentStatus', async () => {
    req.body = {};
    await updatePipelineStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    req.body = { currentStatus: 'completed', currentConclusion: 'success' };
    vi.mocked(pipelineService.updatePipelineStatus).mockResolvedValueOnce({
      id: 'p1',
    } as any);
    await updatePipelineStatus(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      pipeline: { id: 'p1' },
    });
  });

  it('getPipelineDetails and refreshPipelineFromRun 404 & missing token branches', async () => {
    vi.mocked(pipelineService.getPipelineById).mockResolvedValueOnce(null);
    await getPipelineDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);

    vi.mocked(pipelineService.getPipelineById).mockResolvedValueOnce(null);
    await refreshPipelineFromRun(req, res);
    expect(res.status).toHaveBeenCalledWith(404);

    vi.mocked(pipelineService.getPipelineById).mockResolvedValueOnce({
      id: 'p1',
      owner: 'o',
      repo: 'r',
      lastRunId: null,
    } as any);
    await refreshPipelineFromRun(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      pipeline: expect.anything(),
    });
  });

  it('scheduleRelease missing args branch & log failure handling', async () => {
    req.body = {};
    await scheduleRelease(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    req.body = {
      releaseVersion: '1.0.0',
      packageName: 'pkg-a',
      scheduledAt: new Date().toISOString(),
    };
    vi.mocked(pipelineService.scheduleRelease).mockResolvedValueOnce({
      id: 'sch-1',
    } as any);
    vi.mocked(prisma.activityLog.create).mockRejectedValueOnce(
      new Error('Log error')
    );

    await scheduleRelease(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      release: { id: 'sch-1' },
    });
  });

  it('cancelScheduledRelease missing id and 404 not found vs 500 error branches', async () => {
    req.params = {};
    await cancelScheduledRelease(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    req.params = { id: 'sch-1' };
    vi.mocked(pipelineService.cancelScheduledRelease).mockRejectedValueOnce(
      new Error('Scheduled release not found')
    );
    await cancelScheduledRelease(req, res);
    expect(res.status).toHaveBeenCalledWith(404);

    vi.mocked(pipelineService.cancelScheduledRelease).mockRejectedValueOnce(
      new Error('Database error')
    );
    await cancelScheduledRelease(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
