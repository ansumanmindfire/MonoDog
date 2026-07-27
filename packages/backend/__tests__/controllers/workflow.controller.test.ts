import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAvailableWorkflows,
  getRepositoryWorkflowRuns,
  getWorkflowRunDetails,
  getWorkflowJobLogs,
  triggerRepositoryWorkflow,
  cancelRepositoryWorkflowRun,
  rerunRepositoryWorkflowRun,
} from '../../src/controllers/workflow.controller';

import * as githubService from '../../src/services/github-actions-service';
import * as pipelineService from '../../src/services/pipeline-service';

vi.mock('../../src/services/github-actions-service', () => ({
  listWorkflows: vi.fn(),
  getWorkflowRuns: vi.fn(),
  getWorkflowRun: vi.fn(),
  getWorkflowRunJobs: vi.fn(),
  getJobLogs: vi.fn(),
  buildJobLogsResponse: vi.fn(),
  triggerWorkflow: vi.fn(),
  cancelWorkflowRun: vi.fn(),
  rerunWorkflow: vi.fn(),
}));

vi.mock('../../src/services/pipeline-service', () => ({
  createAuditLog: vi.fn(),
  createOrUpdatePipeline: vi.fn(),
}));

describe('Workflow Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      params: { owner: 'o', repo: 'r', runId: '100', jobId: '200' },
      query: {},
      body: {},
      user: { id: 1, login: 'octocat' },
      accessToken: 'mock-token',
    };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  it('getAvailableWorkflows should list workflows', async () => {
    vi.mocked(githubService.listWorkflows).mockResolvedValueOnce({
      workflows: [{ id: 1, name: 'w1', path: 'p1', state: 'active' }],
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });

    await getAvailableWorkflows(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, workflows: expect.any(Array) })
    );
  });

  it('getRepositoryWorkflowRuns should return runs', async () => {
    vi.mocked(githubService.getWorkflowRuns).mockResolvedValueOnce({
      runs: [{ id: 100 }] as any,
      totalCount: 1,
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });

    await getRepositoryWorkflowRuns(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, runs: expect.any(Array) })
    );
  });

  it('getWorkflowRunDetails should return run and jobs details', async () => {
    vi.mocked(githubService.getWorkflowRun).mockResolvedValueOnce({
      run: { id: 100 } as any,
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });
    vi.mocked(githubService.getWorkflowRunJobs).mockResolvedValueOnce({
      jobs: [{ id: 200 }] as any,
      totalCount: 1,
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });

    await getWorkflowRunDetails(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, run: { id: 100 } })
    );
  });

  it('getWorkflowJobLogs should parse logs or return 404 if job missing', async () => {
    vi.mocked(githubService.getWorkflowRunJobs).mockResolvedValueOnce({
      jobs: [{ id: 200, name: 'Build' }] as any,
      totalCount: 1,
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });
    vi.mocked(githubService.getJobLogs).mockResolvedValueOnce({
      logs: 'raw logs',
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });
    vi.mocked(githubService.buildJobLogsResponse).mockReturnValueOnce({
      jobId: 200,
    } as any);

    await getWorkflowJobLogs(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, logs: { jobId: 200 } })
    );

    // Job missing test
    vi.mocked(githubService.getWorkflowRunJobs).mockResolvedValueOnce({
      jobs: [],
      totalCount: 0,
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });
    await getWorkflowJobLogs(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('triggerRepositoryWorkflow should trigger workflow and create pipeline record', async () => {
    req.body = {
      workflow: 'release.yml',
      ref: 'main',
      releaseVersion: '1.0.0',
      packageName: 'pkg-a',
    };
    vi.mocked(githubService.triggerWorkflow).mockResolvedValueOnce({
      response: { success: true, message: 'Triggered' },
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });
    vi.mocked(githubService.listWorkflows).mockResolvedValueOnce({
      workflows: [
        { id: 10, name: 'Release', path: 'release.yml', state: 'active' },
      ],
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });
    vi.mocked(pipelineService.createOrUpdatePipeline).mockResolvedValueOnce({
      id: 'pipe-10',
    } as any);

    await triggerRepositoryWorkflow(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, message: 'Triggered' })
    );
    expect(pipelineService.createOrUpdatePipeline).toHaveBeenCalled();
  });

  it('cancelRepositoryWorkflowRun and rerunRepositoryWorkflowRun', async () => {
    req.query = { pipelineId: 'pipe-1' };
    vi.mocked(githubService.cancelWorkflowRun).mockResolvedValueOnce({
      success: true,
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });
    vi.mocked(githubService.rerunWorkflow).mockResolvedValueOnce({
      success: true,
      rateLimit: { limit: 5000, remaining: 4999, reset: 0, used: 1 },
    });

    await cancelRepositoryWorkflowRun(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );

    await rerunRepositoryWorkflowRun(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });
});
