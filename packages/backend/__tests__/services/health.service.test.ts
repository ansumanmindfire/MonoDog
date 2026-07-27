import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSystemHealth,
  getPackageHealthMetrics,
  getAllPackagesHealthMetrics,
  refreshPackagesHealth,
} from '../../src/services/health.service';

import { scanMonorepo } from '../../src/utils/utilities';
import { prisma } from '../../src/db/prisma';

vi.mock('../../src/utils/utilities', () => ({
  scanMonorepo: vi.fn(),
}));

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    package: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    packageHealth: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock('@mindfiredigital/monorepo-scanner', () => {
  return {
    funCheckBuildStatus: vi.fn().mockResolvedValue('passed'),
    funCheckTestCoverage: vi.fn().mockResolvedValue(85),
    funCheckLintStatus: vi.fn().mockResolvedValue('passed'),
    funCheckSecurityAudit: vi
      .fn()
      .mockResolvedValue({ vulnerabilities: 0, severity: 'none' }),
  };
});

describe('Health Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSystemHealth', () => {
    it('should return status ok and timestamp', () => {
      const res = getSystemHealth();
      expect(res.status).toBe('ok');
      expect(res.services).toBeDefined();
    });
  });

  describe('getPackageHealthMetrics & getAllPackagesHealthMetrics', () => {
    it('getPackageHealthMetrics should calculate score and status', async () => {
      vi.mocked(scanMonorepo).mockResolvedValue([
        { name: 'pkg-a', path: '/pkg-a' },
      ] as any);

      const metrics = await getPackageHealthMetrics('pkg-a', '/root');
      expect(metrics.packageName).toBe('pkg-a');
      expect(metrics.health.overallScore).toBeDefined();
    });

    it('getAllPackagesHealthMetrics should calculate healthy and unhealthy packages summary', async () => {
      vi.mocked(prisma.packageHealth.findMany).mockResolvedValueOnce([
        {
          packageName: 'pkg-a',
          packageBuildStatus: 'passed',
          packageTestCoverage: 85,
          packageLintStatus: 'passed',
          packageSecurity: {},
          packageOverallScore: 90,
        },
      ] as any);

      const res = await getAllPackagesHealthMetrics();
      expect(res.summary.total).toBe(1);
      expect(res.packages).toHaveLength(1);

      // Test empty package list summary branch
      vi.mocked(prisma.packageHealth.findMany).mockResolvedValueOnce([]);
      const emptyRes = await getAllPackagesHealthMetrics();
      expect(emptyRes.summary.averageScore).toBe(0);
    });

    it('refreshPackagesHealth should refresh and return all package health', async () => {
      vi.mocked(scanMonorepo).mockResolvedValue([
        { name: 'pkg-a', path: '/pkg-a' },
      ] as any);
      vi.mocked(prisma.packageHealth.upsert).mockResolvedValue({} as any);
      vi.mocked(prisma.package.update).mockResolvedValue({} as any);

      const res = await refreshPackagesHealth('/root');
      expect(res.summary.total).toBe(1);
    });
  });
});
