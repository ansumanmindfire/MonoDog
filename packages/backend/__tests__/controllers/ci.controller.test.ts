import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getMonorepoCIStatus,
  getPackageCIStatus,
  triggerCIBuild,
  getBuildLogs,
  getBuildArtifacts,
  cancelPipeline,
  retryPipeline,
  togglePipeline,
  getAvailableWorkflows,
  getAvailableBranches,
} from '../../src/controllers/ci.controller';
import * as ciService from '../../src/services/ci-status.service';

vi.mock('../../src/services/ci-status.service', () => ({
  getMonorepoCIStatus: vi.fn(),
  getPackageCIStatus: vi.fn(),
  triggerCIBuild: vi.fn(),
  getBuildLogs: vi.fn(),
  getBuildArtifacts: vi.fn(),
  cancelCIBuild: vi.fn(),
  retryCIBuild: vi.fn(),
  togglePipeline: vi.fn(),
  getAvailableWorkflows: vi.fn(),
  getRepoBranches: vi.fn(),
}));

describe('CI Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      params: { name: 'pkg-a', buildId: '100', pipelineId: 'p1' },
      query: { provider: 'github' },
      body: {
        packageName: 'pkg-a',
        providerName: 'github',
        branch: 'main',
        workflowFileName: 'ci.yml',
        active: true,
      },
      app: { locals: { rootPath: '/mock/root/path' } },
      accessToken: 'mock-token',
    };
    res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  it('getMonorepoCIStatus should return status or 403 / 500 error', async () => {
    vi.mocked(ciService.getMonorepoCIStatus).mockResolvedValueOnce({
      success: true,
    } as any);
    await getMonorepoCIStatus(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });

    vi.mocked(ciService.getMonorepoCIStatus).mockRejectedValueOnce(
      new Error('401 Token invalid')
    );
    await getMonorepoCIStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(403);

    vi.mocked(ciService.getMonorepoCIStatus).mockRejectedValueOnce(
      new Error('Database failure')
    );
    await getMonorepoCIStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('getPackageCIStatus should return status, 404 or 500', async () => {
    vi.mocked(ciService.getPackageCIStatus).mockResolvedValueOnce({
      success: true,
    } as any);
    await getPackageCIStatus(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });

    vi.mocked(ciService.getPackageCIStatus).mockRejectedValueOnce(
      new Error('Package CI status not found')
    );
    await getPackageCIStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(404);

    vi.mocked(ciService.getPackageCIStatus).mockRejectedValueOnce(
      'string error'
    );
    await getPackageCIStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('triggerCIBuild should handle success and 400 error (Error vs non-Error)', async () => {
    vi.mocked(ciService.triggerCIBuild).mockResolvedValueOnce({
      success: true,
    } as any);
    await triggerCIBuild(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });

    vi.mocked(ciService.triggerCIBuild).mockRejectedValueOnce(
      new Error('Trigger error')
    );
    await triggerCIBuild(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    vi.mocked(ciService.triggerCIBuild).mockRejectedValueOnce('string error');
    await triggerCIBuild(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('getBuildLogs and getBuildArtifacts error handling', async () => {
    vi.mocked(ciService.getBuildLogs).mockResolvedValueOnce({
      logs: 'data',
    } as any);
    await getBuildLogs(req, res);
    expect(res.json).toHaveBeenCalledWith({ logs: 'data' });

    vi.mocked(ciService.getBuildLogs).mockRejectedValueOnce('string error');
    await getBuildLogs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    vi.mocked(ciService.getBuildArtifacts).mockResolvedValueOnce({
      artifacts: [],
    } as any);
    await getBuildArtifacts(req, res);
    expect(res.json).toHaveBeenCalledWith({ artifacts: [] });

    vi.mocked(ciService.getBuildArtifacts).mockRejectedValueOnce(
      'string error'
    );
    await getBuildArtifacts(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('cancelPipeline, retryPipeline, togglePipeline handlers with error branches', async () => {
    vi.mocked(ciService.cancelCIBuild).mockResolvedValueOnce({
      success: true,
    } as any);
    await cancelPipeline(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });

    vi.mocked(ciService.cancelCIBuild).mockRejectedValueOnce('string error');
    await cancelPipeline(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    vi.mocked(ciService.retryCIBuild).mockResolvedValueOnce({
      success: true,
    } as any);
    await retryPipeline(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });

    vi.mocked(ciService.retryCIBuild).mockRejectedValueOnce('string error');
    await retryPipeline(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    vi.mocked(ciService.togglePipeline).mockResolvedValueOnce({
      success: true,
    } as any);
    await togglePipeline(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });

    vi.mocked(ciService.togglePipeline).mockRejectedValueOnce('string error');
    await togglePipeline(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('getAvailableWorkflows and getAvailableBranches handlers with error branches', async () => {
    vi.mocked(ciService.getAvailableWorkflows).mockResolvedValueOnce({
      workflows: [],
    } as any);
    await getAvailableWorkflows(req, res);
    expect(res.json).toHaveBeenCalledWith({ workflows: [] });

    vi.mocked(ciService.getAvailableWorkflows).mockRejectedValueOnce(
      'string error'
    );
    await getAvailableWorkflows(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    vi.mocked(ciService.getRepoBranches).mockResolvedValueOnce({
      branches: ['main'],
    } as any);
    await getAvailableBranches(req, res);
    expect(res.json).toHaveBeenCalledWith({ branches: ['main'] });

    vi.mocked(ciService.getRepoBranches).mockRejectedValueOnce('string error');
    await getAvailableBranches(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
