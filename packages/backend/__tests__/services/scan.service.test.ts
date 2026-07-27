import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  performMonorepoScan,
  getMonorepoScanResults,
  exportMonorepoScanResults,
  scanner,
} from '../../src/services/scan.service';

vi.mock('@mindfiredigital/monorepo-scanner', () => ({
  MonorepoScanner: class {
    clearCache = vi.fn();
    exportResults = vi.fn().mockReturnValue('exported-content');
  },
  quickScan: vi.fn().mockResolvedValue({ score: 95 }),
}));

describe('Scan Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('performMonorepoScan should clear cache when force is true and leave when false', async () => {
    const clearSpy = vi.spyOn(scanner, 'clearCache');
    const res1 = await performMonorepoScan(true);
    expect(clearSpy).toHaveBeenCalled();
    expect(res1.success).toBe(true);

    const res2 = await performMonorepoScan(false);
    expect(res2.success).toBe(true);
  });

  it('getMonorepoScanResults should return quickScan result', async () => {
    const res = await getMonorepoScanResults();
    expect(res).toEqual({ score: 95 });
  });

  it('exportMonorepoScanResults should export results with or without filename or throw on invalid format', async () => {
    await expect(exportMonorepoScanResults('pdf')).rejects.toThrow(
      'Invalid export format'
    );

    const res1 = await exportMonorepoScanResults('json', 'report.json');
    expect(res1.format).toBe('json');

    const res2 = await exportMonorepoScanResults('csv');
    expect(res2.filename).toBeUndefined();
  });
});
