import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import {
  getMonorepoCIStatus,
  getPackageCIStatus,
  triggerCIBuild,
  getBuildLogs,
  getBuildArtifacts,
  cancelCIBuild,
  retryCIBuild,
  togglePipeline,
  getAvailableWorkflows,
  getRepoBranches,
} from '../../src/services/ci-status.service';
import { getRepositoryInfoFromGit } from '../../src/utils/utilities';
import {
  getWorkflowRuns,
  getJobLogs,
  triggerWorkflow,
  cancelWorkflowRun,
  rerunWorkflow,
  enableWorkflow,
  disableWorkflow,
  listWorkflows,
  makeGitHubRequest,
} from '../../src/services/github-actions-service';

vi.mock('../../src/utils/utilities', () => ({
  getRepositoryInfoFromGit: vi.fn(),
}));

vi.mock('../../src/services/github-actions-service', () => ({
  getWorkflowRuns: vi.fn(),
  getJobLogs: vi.fn(),
  triggerWorkflow: vi.fn(),
  cancelWorkflowRun: vi.fn(),
  rerunWorkflow: vi.fn(),
  enableWorkflow: vi.fn(),
  disableWorkflow: vi.fn(),
  listWorkflows: vi.fn(),
  makeGitHubRequest: vi.fn(),
  requestOptions: vi.fn(),
}));

describe('CI Status Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Validation & Auth Errors', () => {
    it('should throw error when accessToken is missing', async () => {
      await expect(getMonorepoCIStatus('/root')).rejects.toThrow(
        'GitHub access token is required'
      );
      await expect(getPackageCIStatus('/root', 'pkg')).rejects.toThrow(
        'GitHub access token is required'
      );
      await expect(
        triggerCIBuild('/root', 'pkg', 'github', 'main', 'ci.yml')
      ).rejects.toThrow('GitHub access token is required');
      await expect(getBuildLogs('/root', '123')).rejects.toThrow(
        'GitHub access token is required'
      );
      await expect(cancelCIBuild('/root', '123')).rejects.toThrow(
        'GitHub access token is required'
      );
      await expect(retryCIBuild('/root', '123')).rejects.toThrow(
        'GitHub access token is required'
      );
      await expect(togglePipeline('/root', '123', true)).rejects.toThrow(
        'GitHub access token is required'
      );
      await expect(getAvailableWorkflows('/root')).rejects.toThrow(
        'GitHub access token is required'
      );
      await expect(getRepoBranches('/root')).rejects.toThrow(
        'GitHub access token is required'
      );
    });

    it('should throw error when packageName is missing in triggerCIBuild', async () => {
      await expect(
        triggerCIBuild('/root', '', 'github', 'main', 'ci.yml', 'token')
      ).rejects.toThrow('Package name is required');
    });

    it('should throw error when repoInfo cannot be determined', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce(null);
      await expect(getMonorepoCIStatus('/root', 'token')).rejects.toThrow(
        'Could not determine GitHub repository info'
      );
    });
  });

  describe('getMonorepoCIStatus & getPackageCIStatus', () => {
    it('should return overall monorepo CI status runs', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(getWorkflowRuns).mockResolvedValueOnce({
        runs: [{ id: 1, name: 'CI' }] as any,
        totalCount: 1,
      });

      const res = await getMonorepoCIStatus('/root', 'token');
      expect(res.success).toBe(true);
      expect(res.pipelines).toHaveLength(1);
    });

    it('should filter runs by package name in getPackageCIStatus', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(getWorkflowRuns).mockResolvedValueOnce({
        runs: [
          { id: 1, name: 'Build core' },
          { id: 2, name: 'Build utils' },
        ] as any,
        totalCount: 2,
      });

      const res = await getPackageCIStatus('/root', 'core', 'token');
      expect(res.success).toBe(true);
      expect(res.pipelines).toHaveLength(1);
      expect(res.pipelines[0].name).toBe('Build core');
    });
  });

  describe('triggerCIBuild', () => {
    it('should trigger workflow successfully with parsed workflow dispatch inputs', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(triggerWorkflow).mockResolvedValueOnce({
        response: { success: true, message: 'OK' },
      } as any);

      vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(`
on:
  workflow_dispatch:
    inputs:
      package:
        description: 'Package name'
      source:
        description: 'Source'
      `);

      const res = await triggerCIBuild(
        '/root',
        'pkg-a',
        'github',
        'main',
        'ci.yml',
        'token'
      );
      expect(res.success).toBe(true);
      expect(triggerWorkflow).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it('should handle unparseable workflow file gracefully', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(triggerWorkflow).mockResolvedValueOnce({
        response: { success: true, message: 'OK' },
      } as any);

      vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
      vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
        throw new Error('Unparseable file');
      });

      const res = await triggerCIBuild(
        '/root',
        'pkg-a',
        'github',
        'main',
        'ci.yml',
        'token'
      );
      expect(res.success).toBe(true);

      vi.restoreAllMocks();
    });

    it('should throw error if workflow trigger fails', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(triggerWorkflow).mockResolvedValueOnce({
        response: { success: false, message: 'Workflow missing' },
      } as any);

      await expect(
        triggerCIBuild('/root', 'pkg-a', 'github', 'main', 'ci.yml', 'token')
      ).rejects.toThrow('Workflow missing');
    });
  });

  describe('getBuildLogs & getBuildArtifacts', () => {
    it('should return logs for build ID', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(getJobLogs).mockResolvedValueOnce({
        logs: 'Build step output...',
      });

      const res = await getBuildLogs('/root', '101', 'github', 'token');
      expect(res).toEqual({ buildId: '101', logs: 'Build step output...' });
    });

    it('should return empty artifacts array', async () => {
      const res = await getBuildArtifacts('101');
      expect(res).toEqual({ buildId: '101', artifacts: [] });
    });
  });

  describe('cancelCIBuild & retryCIBuild', () => {
    it('cancelCIBuild should handle success and failure', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValue({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(cancelWorkflowRun).mockResolvedValueOnce({
        success: true,
      } as any);

      const res = await cancelCIBuild('/root', '101', 'token');
      expect(res.success).toBe(true);

      vi.mocked(cancelWorkflowRun).mockResolvedValueOnce({
        success: false,
      } as any);
      await expect(cancelCIBuild('/root', '101', 'token')).rejects.toThrow(
        'Failed to cancel build via GitHub API'
      );
    });

    it('retryCIBuild should handle success and failure', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValue({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(rerunWorkflow).mockResolvedValueOnce({ success: true } as any);

      const res = await retryCIBuild('/root', '101', 'token');
      expect(res.success).toBe(true);

      vi.mocked(rerunWorkflow).mockResolvedValueOnce({ success: false } as any);
      await expect(retryCIBuild('/root', '101', 'token')).rejects.toThrow(
        'Failed to retry build via GitHub API'
      );
    });
  });

  describe('togglePipeline', () => {
    it('should enable and disable pipeline based on active boolean', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValue({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(enableWorkflow).mockResolvedValueOnce({ success: true } as any);
      vi.mocked(disableWorkflow).mockResolvedValueOnce({
        success: true,
      } as any);

      const enableRes = await togglePipeline('/root', 'pipe-1', true, 'token');
      expect(enableRes.success).toBe(true);

      const disableRes = await togglePipeline(
        '/root',
        'pipe-1',
        false,
        'token'
      );
      expect(disableRes.success).toBe(true);
    });
  });

  describe('getAvailableWorkflows & getRepoBranches', () => {
    it('getAvailableWorkflows should return workflows list or throw if missing', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValue({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(listWorkflows).mockResolvedValueOnce({
        workflows: [{ id: 1, name: 'release.yml' }] as any,
        rateLimit: { limit: 5000 },
      } as any);

      const res = await getAvailableWorkflows('/root', 'token');
      expect(res.success).toBe(true);

      vi.mocked(listWorkflows).mockResolvedValueOnce({
        workflows: null,
      } as any);
      await expect(getAvailableWorkflows('/root', 'token')).rejects.toThrow(
        'Failed to fetch workflows'
      );
    });

    it('getRepoBranches should map branch names or throw on failure', async () => {
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValue({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(makeGitHubRequest).mockResolvedValueOnce({
        data: [{ name: 'main' }, { name: 'dev' }],
      } as any);

      const res = await getRepoBranches('/root', 'token');
      expect(res).toEqual({ success: true, branches: ['main', 'dev'] });

      vi.mocked(makeGitHubRequest).mockRejectedValueOnce(
        new Error('Network error')
      );
      await expect(getRepoBranches('/root', 'token')).rejects.toThrow(
        'Failed to fetch branches from GitHub repository'
      );
    });
  });
});
