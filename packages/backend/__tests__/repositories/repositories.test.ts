import { vi, describe, it, expect, beforeEach } from 'vitest';

const { mockPrisma, mockPrismaErrors } = vi.hoisted(() => {
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
    }
  }

  return {
    mockPrisma: {
      package: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        upsert: vi.fn(),
        update: vi.fn(),
        deleteMany: vi.fn(),
        delete: vi.fn(),
      },
      commit: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        upsert: vi.fn(),
        deleteMany: vi.fn(),
      },
      dependencyInfo: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        upsert: vi.fn(),
        deleteMany: vi.fn(),
      },
      packageHealth: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
      },
      pipelineAuditLog: {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      },
      releasePipeline: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        deleteMany: vi.fn(),
      },
    },
    mockPrismaErrors: {
      PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
    },
  };
});

vi.mock('../../src/repositories/prisma-client', () => ({
  getPrismaClient: () => mockPrisma,
  getPrismaErrors: () => mockPrismaErrors,
  default: () => mockPrisma,
}));

import { PackageRepository } from '../../src/repositories/package-repository';
import { CommitRepository } from '../../src/repositories/commit-repository';
import { DependencyRepository } from '../../src/repositories/dependency-repository';
import { PackageHealthRepository } from '../../src/repositories/package-health-repository';
import { PipelineAuditLogRepository } from '../../src/repositories/pipeline-audit-log-repository';
import { ReleasePipelineRepository } from '../../src/repositories/release-pipeline-repository';
import * as RepositoriesIndex from '../../src/repositories/index';

describe('Repository Layer Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PackageRepository', () => {
    it('findAll should invoke prisma.package.findMany', async () => {
      mockPrisma.package.findMany.mockResolvedValueOnce([{ name: 'pkg-a' }]);
      const res = await PackageRepository.findAll();
      expect(res).toEqual([{ name: 'pkg-a' }]);
      expect(mockPrisma.package.findMany).toHaveBeenCalledWith({
        include: { _count: { select: { commits: true } } },
      });
    });

    it('findByName should invoke prisma.package.findUnique', async () => {
      mockPrisma.package.findUnique.mockResolvedValueOnce({ name: 'pkg-a' });
      const res = await PackageRepository.findByName('pkg-a');
      expect(res).toEqual({ name: 'pkg-a' });
      expect(mockPrisma.package.findUnique).toHaveBeenCalledWith({
        where: { name: 'pkg-a' },
      });
    });

    it('findByNameWithRelations should invoke prisma.package.findUnique with relations', async () => {
      mockPrisma.package.findUnique.mockResolvedValueOnce({
        name: 'pkg-a',
        commits: [],
      });
      const res = await PackageRepository.findByNameWithRelations('pkg-a');
      expect(res).toEqual({ name: 'pkg-a', commits: [] });
      expect(mockPrisma.package.findUnique).toHaveBeenCalledWith({
        where: { name: 'pkg-a' },
        include: {
          dependenciesInfo: true,
          commits: true,
          packageHealth: true,
        },
      });
    });

    it('upsert should construct data correctly and invoke prisma.package.upsert', async () => {
      mockPrisma.package.upsert.mockResolvedValueOnce({ name: 'pkg-a' });
      const res = await PackageRepository.upsert({
        name: 'pkg-a',
        version: '1.0.0',
        maintainers: 'John Doe',
      });
      expect(res).toEqual({ name: 'pkg-a' });
      expect(mockPrisma.package.upsert).toHaveBeenCalled();
    });

    it('updateStatus should invoke prisma.package.update', async () => {
      mockPrisma.package.update.mockResolvedValueOnce({
        name: 'pkg-a',
        status: 'active',
      });
      const res = await PackageRepository.updateStatus('pkg-a', 'active');
      expect(res).toEqual({ name: 'pkg-a', status: 'active' });
    });

    it('updateConfig should invoke prisma.package.update', async () => {
      mockPrisma.package.update.mockResolvedValueOnce({ name: 'pkg-a' });
      const res = await PackageRepository.updateConfig('pkg-a', {
        env: 'prod',
      });
      expect(res).toEqual({ name: 'pkg-a' });
    });

    it('deleteAll and deleteByName should call deleteMany and delete', async () => {
      mockPrisma.package.deleteMany.mockResolvedValueOnce({ count: 5 });
      mockPrisma.package.delete.mockResolvedValueOnce({ name: 'pkg-a' });

      expect(await PackageRepository.deleteAll()).toEqual({ count: 5 });
      expect(await PackageRepository.deleteByName('pkg-a')).toEqual({
        name: 'pkg-a',
      });
    });
  });

  describe('CommitRepository', () => {
    it('findByPackageName and findByHash should call commit prisma queries', async () => {
      mockPrisma.commit.findMany.mockResolvedValueOnce([]);
      mockPrisma.commit.findUnique.mockResolvedValueOnce(null);

      await CommitRepository.findByPackageName('pkg-a');
      await CommitRepository.findByHash('hash123', 'pkg-a');

      expect(mockPrisma.commit.findMany).toHaveBeenCalledWith({
        where: { packageName: 'pkg-a' },
      });
      expect(mockPrisma.commit.findUnique).toHaveBeenCalledWith({
        where: { hash_packageName: { hash: 'hash123', packageName: 'pkg-a' } },
      });
    });

    it('upsert should handle success, P2002 duplicate warning, and throw error for other errors', async () => {
      mockPrisma.commit.upsert.mockResolvedValueOnce({ hash: 'h1' });
      await CommitRepository.upsert({ hash: 'h1', packageName: 'pkg-a' });

      // P2002 error
      mockPrisma.commit.upsert.mockRejectedValueOnce(
        new mockPrismaErrors.PrismaClientKnownRequestError(
          'Duplicate key',
          'P2002'
        )
      );
      await expect(
        CommitRepository.upsert({ hash: 'h1', packageName: 'pkg-a' })
      ).resolves.toBeUndefined();

      // Generic error
      mockPrisma.commit.upsert.mockRejectedValueOnce(new Error('DB failure'));
      await expect(
        CommitRepository.upsert({ hash: 'h1', packageName: 'pkg-a' })
      ).rejects.toThrow('DB failure');
    });

    it('storeMany and deleteByPackageName should execute properly', async () => {
      mockPrisma.commit.upsert.mockResolvedValue({ hash: 'h1' });
      mockPrisma.commit.deleteMany.mockResolvedValueOnce({ count: 2 });

      await CommitRepository.storeMany('pkg-a', [
        { hash: 'h1', message: 'msg1', author: 'auth', date: '2026-01-01' },
      ]);
      expect(mockPrisma.commit.upsert).toHaveBeenCalled();

      const res = await CommitRepository.deleteByPackageName('pkg-a');
      expect(res).toEqual({ count: 2 });
    });
  });

  describe('DependencyRepository', () => {
    it('findByPackageName and findByNameAndPackage should query dependencyInfo table', async () => {
      mockPrisma.dependencyInfo.findMany.mockResolvedValueOnce([]);
      mockPrisma.dependencyInfo.findUnique.mockResolvedValueOnce(null);

      await DependencyRepository.findByPackageName('pkg-a');
      await DependencyRepository.findByNameAndPackage('react', 'pkg-a');

      expect(mockPrisma.dependencyInfo.findMany).toHaveBeenCalledWith({
        where: { packageName: 'pkg-a' },
      });
    });

    it('upsert should handle success, P2002 warning, and rethrow generic error', async () => {
      mockPrisma.dependencyInfo.upsert.mockResolvedValueOnce({ name: 'react' });
      await DependencyRepository.upsert({
        name: 'react',
        version: '18.0.0',
        type: 'dependencies',
        packageName: 'pkg-a',
      });

      mockPrisma.dependencyInfo.upsert.mockRejectedValueOnce(
        new mockPrismaErrors.PrismaClientKnownRequestError('Duplicate', 'P2002')
      );
      await expect(
        DependencyRepository.upsert({
          name: 'react',
          version: '18.0.0',
          type: 'dependencies',
          packageName: 'pkg-a',
        })
      ).resolves.toBeUndefined();

      mockPrisma.dependencyInfo.upsert.mockRejectedValueOnce(
        new Error('Fatal error')
      );
      await expect(
        DependencyRepository.upsert({
          name: 'react',
          version: '18.0.0',
          type: 'dependencies',
          packageName: 'pkg-a',
        })
      ).rejects.toThrow('Fatal error');
    });

    it('storeMany and deleteByPackageName should execute properly', async () => {
      mockPrisma.dependencyInfo.upsert.mockResolvedValue({ name: 'react' });
      mockPrisma.dependencyInfo.deleteMany.mockResolvedValueOnce({ count: 1 });

      await DependencyRepository.storeMany('pkg-a', [
        { name: 'react', version: '18.0.0', type: 'dependencies' },
      ]);
      expect(mockPrisma.dependencyInfo.upsert).toHaveBeenCalled();

      const res = await DependencyRepository.deleteByPackageName('pkg-a');
      expect(res).toEqual({ count: 1 });
    });
  });

  describe('PackageHealthRepository', () => {
    it('findAll, findByPackageName, upsert, deleteByPackageName, deleteAll should call prisma methods', async () => {
      mockPrisma.packageHealth.findMany.mockResolvedValueOnce([]);
      mockPrisma.packageHealth.findUnique.mockResolvedValueOnce(null);
      mockPrisma.packageHealth.upsert.mockResolvedValueOnce({
        packageName: 'pkg-a',
      });
      mockPrisma.packageHealth.delete.mockResolvedValueOnce({
        packageName: 'pkg-a',
      });
      mockPrisma.packageHealth.deleteMany.mockResolvedValueOnce({ count: 10 });

      expect(await PackageHealthRepository.findAll()).toEqual([]);
      expect(
        await PackageHealthRepository.findByPackageName('pkg-a')
      ).toBeNull();
      expect(
        await PackageHealthRepository.upsert({
          packageName: 'pkg-a',
          packageOverallScore: 90,
          packageBuildStatus: 'pass',
          packageTestCoverage: 85,
          packageLintStatus: 'pass',
          packageSecurity: 'clean',
        })
      ).toEqual({ packageName: 'pkg-a' });

      expect(
        await PackageHealthRepository.deleteByPackageName('pkg-a')
      ).toEqual({ packageName: 'pkg-a' });
      expect(await PackageHealthRepository.deleteAll()).toEqual({ count: 10 });
    });
  });

  describe('PipelineAuditLogRepository', () => {
    it('create and query methods should function as expected', async () => {
      mockPrisma.pipelineAuditLog.create.mockResolvedValueOnce({});
      mockPrisma.pipelineAuditLog.findMany.mockResolvedValue([]);
      mockPrisma.pipelineAuditLog.count.mockResolvedValueOnce(42);

      await PipelineAuditLogRepository.create(
        'p1',
        1,
        'user',
        'deploy',
        'pipe',
        '1',
        'p1'
      );
      await PipelineAuditLogRepository.findByPipelineId('p1');
      await PipelineAuditLogRepository.findByAction('deploy');
      await PipelineAuditLogRepository.findByUser(1);
      await PipelineAuditLogRepository.findByStatus('success');
      const count = await PipelineAuditLogRepository.countByPipelineId('p1');

      expect(count).toBe(42);
      expect(mockPrisma.pipelineAuditLog.create).toHaveBeenCalled();
    });
  });

  describe('ReleasePipelineRepository', () => {
    it('createOrUpdate should handle both existing update and new create branches', async () => {
      // Branch 1: existing record exists
      mockPrisma.releasePipeline.findFirst.mockResolvedValueOnce({
        id: 'pipe-1',
      });
      mockPrisma.releasePipeline.update.mockResolvedValueOnce({
        id: 'pipe-1',
        releaseVersion: '1.0.0',
        packageName: 'pkg-a',
      });

      const res1 = await ReleasePipelineRepository.createOrUpdate({
        releaseVersion: '1.0.0',
        packageName: 'pkg-a',
        owner: 'org',
        repo: 'repo',
        workflowId: 10,
        workflowName: 'release',
        workflowPath: '.github/workflows/release.yml',
        triggerType: 'manual',
        triggeredBy: 'user',
        triggeredAt: new Date(),
        currentStatus: 'in_progress',
        currentConclusion: null,
        lastRunId: 101,
      });

      expect(res1).toEqual({
        id: 'pipe-1',
        releaseVersion: '1.0.0',
        packageName: 'pkg-a',
      });

      // Branch 2: existing record does not exist
      mockPrisma.releasePipeline.findFirst.mockResolvedValueOnce(null);
      mockPrisma.releasePipeline.create.mockResolvedValueOnce({
        id: 'pipe-2',
        releaseVersion: '1.0.1',
        packageName: 'pkg-a',
      });

      const res2 = await ReleasePipelineRepository.createOrUpdate({
        releaseVersion: '1.0.1',
        packageName: 'pkg-a',
        owner: 'org',
        repo: 'repo',
        workflowId: 10,
        workflowName: 'release',
        workflowPath: '.github/workflows/release.yml',
        triggerType: 'manual',
        triggeredBy: 'user',
        triggeredAt: new Date(),
        currentStatus: 'completed',
        currentConclusion: 'success',
      });

      expect(res2).toEqual({
        id: 'pipe-2',
        releaseVersion: '1.0.1',
        packageName: 'pkg-a',
      });
    });

    it('updateStatus, getRecent, deleteOld, findById, findByReleaseAndPackage should execute query logic', async () => {
      mockPrisma.releasePipeline.update.mockResolvedValueOnce({ id: 'pipe-1' });
      mockPrisma.releasePipeline.findMany.mockResolvedValueOnce([
        { id: 'p1', workflowPath: null },
        { id: 'p2', workflowPath: 'custom.yml' },
      ]);
      mockPrisma.releasePipeline.deleteMany.mockResolvedValueOnce({ count: 3 });
      mockPrisma.releasePipeline.findUnique.mockResolvedValueOnce({
        id: 'pipe-1',
      });
      mockPrisma.releasePipeline.findFirst.mockResolvedValueOnce({
        id: 'pipe-1',
      });

      await ReleasePipelineRepository.updateStatus(
        'pipe-1',
        'success',
        'success',
        '101'
      );
      const recent = await ReleasePipelineRepository.getRecent(
        10,
        0,
        'owner',
        'repo'
      );
      expect(recent[0].workflowPath).toBe('release.yml');
      expect(recent[1].workflowPath).toBe('custom.yml');

      const deletedCount = await ReleasePipelineRepository.deleteOld(30);
      expect(deletedCount).toBe(3);

      await ReleasePipelineRepository.findById('pipe-1');
      await ReleasePipelineRepository.findByReleaseAndPackage('1.0.0', 'pkg-a');
    });
  });

  describe('Repositories Index exports', () => {
    it('should export all repositories and prisma client helpers', () => {
      expect(RepositoriesIndex.PackageRepository).toBeDefined();
      expect(RepositoriesIndex.PackageHealthRepository).toBeDefined();
      expect(RepositoriesIndex.CommitRepository).toBeDefined();
      expect(RepositoriesIndex.DependencyRepository).toBeDefined();
      expect(RepositoriesIndex.getPrismaClient).toBeDefined();
      expect(RepositoriesIndex.getPrismaErrors).toBeDefined();
    });
  });
});
