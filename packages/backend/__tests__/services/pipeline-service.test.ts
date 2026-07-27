import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as pipelineService from '../../src/services/pipeline-service';
import { ReleasePipelineRepository } from '../../src/repositories/release-pipeline-repository';
import { PipelineAuditLogRepository } from '../../src/repositories/pipeline-audit-log-repository';
import { prisma } from '../../src/db/prisma';

vi.mock('../../src/repositories/release-pipeline-repository');
vi.mock('../../src/repositories/pipeline-audit-log-repository');
vi.mock('../../src/db/prisma', () => ({
  prisma: {
    scheduledRelease: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('Pipeline Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrUpdatePipeline & updatePipelineStatus', () => {
    it('should call ReleasePipelineRepository.createOrUpdate', async () => {
      const pipelineData = {
        releaseVersion: '1.0.0',
        packageName: 'pkg-a',
        status: 'pending',
      };
      vi.mocked(ReleasePipelineRepository.createOrUpdate).mockResolvedValue({
        id: '1',
        ...pipelineData,
      } as any);

      const result = await pipelineService.createOrUpdatePipeline(
        pipelineData as any
      );
      expect(ReleasePipelineRepository.createOrUpdate).toHaveBeenCalledWith(
        pipelineData
      );
      expect(result.id).toBe('1');
    });

    it('should call ReleasePipelineRepository.updateStatus', async () => {
      vi.mocked(ReleasePipelineRepository.updateStatus).mockResolvedValue({
        id: '1',
      } as any);
      const res = await pipelineService.updatePipelineStatus(
        '1',
        'completed',
        'success',
        'run1'
      );
      expect(res.id).toBe('1');

      vi.mocked(ReleasePipelineRepository.updateStatus).mockRejectedValueOnce(
        new Error('Update error')
      );
      await expect(
        pipelineService.updatePipelineStatus('1', 'failed', null)
      ).rejects.toThrow('Update error');
    });
  });

  describe('Audit Logs & Pipeline Queries', () => {
    it('createAuditLog & getPipelineAuditLogs should invoke PipelineAuditLogRepository', async () => {
      vi.mocked(PipelineAuditLogRepository.create).mockResolvedValueOnce(
        undefined as any
      );
      vi.mocked(
        PipelineAuditLogRepository.findByPipelineId
      ).mockResolvedValueOnce([{ id: 'log1' }]);

      await pipelineService.createAuditLog(
        'p1',
        1,
        'user',
        'action',
        'type',
        '1',
        'name'
      );
      expect(PipelineAuditLogRepository.create).toHaveBeenCalled();

      const logs = await pipelineService.getPipelineAuditLogs('p1', 10, 0);
      expect(logs).toHaveLength(1);
    });

    it('getRecentPipelines, getPipelineById, deleteOldPipelines should delegate to repository', async () => {
      vi.mocked(ReleasePipelineRepository.getRecent).mockResolvedValueOnce([
        { id: 'p1' },
      ]);
      vi.mocked(ReleasePipelineRepository.findById).mockResolvedValueOnce({
        id: 'p1',
      });
      vi.mocked(ReleasePipelineRepository.deleteOld).mockResolvedValueOnce(5);

      expect(await pipelineService.getRecentPipelines(10, 0, 'o', 'r')).toEqual(
        [{ id: 'p1' }]
      );
      expect(await pipelineService.getPipelineById('p1')).toEqual({ id: 'p1' });
      expect(await pipelineService.deleteOldPipelines(30)).toBe(5);
    });
  });

  describe('Scheduled Releases', () => {
    it('should throw if release already scheduled', async () => {
      vi.mocked(prisma.scheduledRelease.findFirst).mockResolvedValue({
        id: '1',
      } as any);
      await expect(
        pipelineService.scheduleRelease('1.0.0', 'pkg-a', new Date(), 'user')
      ).rejects.toThrow(/already scheduled/);
    });

    it('should create scheduled release if not exists', async () => {
      vi.mocked(prisma.scheduledRelease.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.scheduledRelease.create).mockResolvedValue({
        id: '2',
      } as any);

      const result = await pipelineService.scheduleRelease(
        '1.0.0',
        'pkg-a',
        new Date(),
        'user'
      );
      expect(result.id).toBe('2');
    });

    it('cancelScheduledRelease validation & deletion', async () => {
      vi.mocked(prisma.scheduledRelease.findUnique).mockResolvedValueOnce(null);
      await expect(pipelineService.cancelScheduledRelease('1')).rejects.toThrow(
        /not found/
      );

      vi.mocked(prisma.scheduledRelease.findUnique).mockResolvedValueOnce({
        id: '1',
        status: 'completed',
      } as any);
      await expect(pipelineService.cancelScheduledRelease('1')).rejects.toThrow(
        /Cannot cancel/
      );

      vi.mocked(prisma.scheduledRelease.findUnique).mockResolvedValueOnce({
        id: '1',
        status: 'pending',
      } as any);
      await pipelineService.cancelScheduledRelease('1');
      expect(prisma.scheduledRelease.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('getPendingScheduledReleases and updateScheduledReleaseStatus', async () => {
      vi.mocked(prisma.scheduledRelease.findMany).mockResolvedValueOnce([
        { id: 'r1' },
      ] as any);
      vi.mocked(prisma.scheduledRelease.update).mockResolvedValueOnce({
        id: 'r1',
        status: 'done',
      } as any);

      const pending = await pipelineService.getPendingScheduledReleases(10);
      expect(pending).toHaveLength(1);

      const updated = await pipelineService.updateScheduledReleaseStatus(
        'r1',
        'done'
      );
      expect(updated.status).toBe('done');
    });
  });
});
