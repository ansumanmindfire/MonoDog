import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchMonorepoPackages } from '../../src/services/search.service';
import { prisma } from '../../src/db/prisma';

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    package: {
      findMany: vi.fn(),
    },
  },
}));

describe('Search Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should search packages with query, type, and status filters', async () => {
    vi.mocked(prisma.package.findMany).mockResolvedValueOnce([
      { name: 'ui', maintainers: '[]' },
    ] as any);

    const res = await searchMonorepoPackages('ui', 'lib', 'active');
    expect(prisma.package.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ name: { contains: 'ui' } }, { description: { contains: 'ui' } }],
        type: 'lib',
        status: 'active',
      },
      include: { _count: { select: { commits: true } } },
    });
    expect(res.total).toBe(1);
  });

  it('should handle missing or all filters', async () => {
    vi.mocked(prisma.package.findMany).mockResolvedValueOnce([]);
    await searchMonorepoPackages(undefined, 'all', 'all');
    expect(prisma.package.findMany).toHaveBeenCalledWith({
      where: {},
      include: { _count: { select: { commits: true } } },
    });
  });
});
