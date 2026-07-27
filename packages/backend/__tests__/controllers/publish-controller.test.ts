import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPublishPackages,
  getPublishChangesets,
  previewPublish,
  createChangeset,
  checkPublishStatus,
  triggerPublish,
} from '../../src/controllers/publish-controller';

import * as changesetService from '../../src/services/changeset-service';
import * as pipelineService from '../../src/services/pipeline-service';
import { getRepositoryInfoFromGit } from '../../src/utils/utilities';
import { listWorkflows } from '../../src/services/github-actions-service';
import { prisma } from '../../src/db/prisma';

vi.mock('../../src/services/changeset-service', () => ({
  getWorkspacePackages: vi.fn(),
  getExistingChangesets: vi.fn(),
  calculateNewVersions: vi.fn(),
  generateChangeset: vi.fn(),
  isWorkingTreeClean: vi.fn(),
  triggerPublishPipeline: vi.fn(),
  checkCIPassing: vi.fn(),
  checkVersionAvailableOnNpm: vi.fn(),
}));

vi.mock('../../src/services/pipeline-service', () => ({
  createOrUpdatePipeline: vi.fn(),
  createAuditLog: vi.fn(),
}));

vi.mock('../../src/utils/utilities', () => ({
  getRepositoryInfoFromGit: vi.fn(),
}));

vi.mock('../../src/services/github-actions-service', () => ({
  listWorkflows: vi.fn(),
  triggerWorkflow: vi.fn(),
}));

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    activityLog: {
      create: vi.fn(),
    },
  },
}));

describe('Publish Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      app: { locals: { rootPath: '/mock-root' } },
      body: {},
      user: { id: 1, login: 'octocat' },
      permission: { permission: 'write' },
      accessToken: 'mock-token',
    };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe('getPublishPackages', () => {
    it('should return non-private workspace packages', async () => {
      vi.mocked(changesetService.getWorkspacePackages).mockResolvedValueOnce([
        { name: 'public-pkg', private: false } as any,
        { name: 'private-pkg', private: true } as any,
      ]);

      await getPublishPackages(req, res);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        packages: [{ name: 'public-pkg', private: false }],
        total: 1,
      });
    });

    it('should handle service errors', async () => {
      vi.mocked(changesetService.getWorkspacePackages).mockRejectedValueOnce(
        new Error('Fs error')
      );
      await getPublishPackages(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getPublishChangesets', () => {
    it('should return list of changesets or 500 on error', async () => {
      vi.mocked(changesetService.getExistingChangesets).mockResolvedValueOnce([
        'c1',
        'c2',
      ]);
      await getPublishChangesets(req, res);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        changesets: ['c1', 'c2'],
        total: 2,
      });

      vi.mocked(changesetService.getExistingChangesets).mockRejectedValueOnce(
        new Error('Fs error')
      );
      await getPublishChangesets(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('previewPublish', () => {
    it('should validate request body array', async () => {
      req.body = { packages: 'invalid' };
      await previewPublish(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return preview calculations and check results', async () => {
      req.body = {
        packages: ['pkg-a'],
        bumps: [{ package: 'pkg-a', bumpType: 'minor' }],
      };
      vi.mocked(changesetService.getWorkspacePackages).mockResolvedValueOnce([
        { name: 'pkg-a', version: '1.0.0' },
      ] as any);
      vi.mocked(changesetService.calculateNewVersions).mockReturnValueOnce([
        {
          package: 'pkg-a',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          bumpType: 'minor',
        },
      ]);
      vi.mocked(changesetService.isWorkingTreeClean).mockResolvedValueOnce(
        true
      );
      vi.mocked(changesetService.getExistingChangesets).mockResolvedValueOnce([
        'c1',
      ]);
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(listWorkflows).mockResolvedValueOnce({
        workflows: [
          { id: 1, name: 'Release', path: '.github/workflows/release.yml' },
        ],
      } as any);
      vi.mocked(changesetService.checkCIPassing).mockResolvedValueOnce(true);
      vi.mocked(
        changesetService.checkVersionAvailableOnNpm
      ).mockResolvedValueOnce(true);

      await previewPublish(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          isValid: true,
        })
      );
    });

    it('should handle CI check and NPM version check failures gracefully', async () => {
      req.body = { packages: ['pkg-a'] };
      vi.mocked(changesetService.getWorkspacePackages).mockResolvedValueOnce([
        { name: 'pkg-a', version: '1.0.0' },
      ] as any);
      vi.mocked(changesetService.calculateNewVersions).mockReturnValueOnce([
        {
          package: 'pkg-a',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          bumpType: 'minor',
        },
      ]);
      vi.mocked(changesetService.isWorkingTreeClean).mockResolvedValueOnce(
        false
      );
      vi.mocked(changesetService.getExistingChangesets).mockResolvedValueOnce(
        []
      );
      vi.mocked(getRepositoryInfoFromGit).mockRejectedValueOnce(
        new Error('No git')
      );
      vi.mocked(
        changesetService.checkVersionAvailableOnNpm
      ).mockRejectedValueOnce(new Error('Npm error'));

      await previewPublish(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          isValid: false,
        })
      );
    });
  });

  describe('createChangeset', () => {
    it('should validate package input and summary length', async () => {
      req.body = { packages: null };
      await createChangeset(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

      req.body = { packages: ['pkg-a'], summary: 'short' };
      await createChangeset(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 403 if user lacks write permission', async () => {
      req.permission = { permission: 'read' };
      req.body = { packages: ['pkg-a'], summary: 'Valid long summary' };
      await createChangeset(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should generate changeset on valid request or return 400 on failure', async () => {
      req.body = {
        packages: ['pkg-a'],
        summary: 'Valid long summary for release',
      };
      vi.mocked(changesetService.generateChangeset).mockResolvedValueOnce({
        success: true,
        changeset: 'c-100',
      });

      await createChangeset(req, res);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        changeset: 'c-100',
        message: expect.any(String),
      });

      vi.mocked(changesetService.generateChangeset).mockResolvedValueOnce({
        success: false,
        message: 'Invalid bump',
      });
      await createChangeset(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('checkPublishStatus', () => {
    it('should check working tree and changesets or handle error with 500', async () => {
      vi.mocked(changesetService.isWorkingTreeClean).mockResolvedValueOnce(
        true
      );
      vi.mocked(changesetService.getExistingChangesets).mockResolvedValueOnce([
        'c1',
      ]);

      await checkPublishStatus(req, res);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: {
          workingTreeClean: true,
          hasChangesets: true,
          changesetCount: 1,
          readyToPublish: true,
        },
      });

      vi.mocked(changesetService.isWorkingTreeClean).mockRejectedValueOnce(
        new Error('Fs error')
      );
      await checkPublishStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('triggerPublish', () => {
    it('should check maintain permission', async () => {
      req.permission = { permission: 'write' };
      await triggerPublish(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should verify clean working tree and changesets presence', async () => {
      req.permission = { permission: 'maintain' };
      vi.mocked(changesetService.isWorkingTreeClean).mockResolvedValueOnce(
        false
      );
      await triggerPublish(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

      vi.mocked(changesetService.isWorkingTreeClean).mockResolvedValueOnce(
        true
      );
      vi.mocked(changesetService.getExistingChangesets).mockResolvedValueOnce(
        []
      );
      await triggerPublish(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle pipeline trigger failure with 500', async () => {
      req.permission = { permission: 'maintain' };
      req.body = { packages: [{ name: 'pkg-a', newVersion: '1.1.0' }] };

      vi.mocked(changesetService.isWorkingTreeClean).mockResolvedValueOnce(
        true
      );
      vi.mocked(changesetService.getExistingChangesets).mockResolvedValueOnce([
        'c1',
      ]);
      vi.mocked(changesetService.triggerPublishPipeline).mockResolvedValueOnce({
        success: false,
        message: 'Pipeline failed',
      });

      await triggerPublish(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should trigger publish pipeline and create DB pipeline records on success', async () => {
      req.permission = { permission: 'maintain' };
      req.body = { packages: [{ name: 'pkg-a', newVersion: '1.1.0' }] };

      vi.mocked(changesetService.isWorkingTreeClean).mockResolvedValueOnce(
        true
      );
      vi.mocked(changesetService.getExistingChangesets).mockResolvedValueOnce([
        'c1',
      ]);
      vi.mocked(changesetService.triggerPublishPipeline).mockResolvedValueOnce({
        success: true,
        message: 'OK',
        result: { timestamp: '2026-01-01' },
      });
      vi.mocked(getRepositoryInfoFromGit).mockResolvedValueOnce({
        owner: 'o',
        repo: 'r',
      });
      vi.mocked(listWorkflows).mockResolvedValueOnce({
        workflows: [{ id: 1, name: 'Release', path: 'release.yml' }],
      } as any);
      vi.mocked(pipelineService.createOrUpdatePipeline).mockResolvedValueOnce({
        id: 'pipe-1',
      } as any);
      vi.mocked(prisma.activityLog.create).mockResolvedValueOnce({} as any);

      await triggerPublish(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
      expect(pipelineService.createOrUpdatePipeline).toHaveBeenCalled();
    });
  });
});
