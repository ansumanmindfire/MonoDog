import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  performScan,
  getScanResults,
  exportScanResults,
} from '../../src/controllers/scan.controller';
import * as scanService from '../../src/services/scan.service';

vi.mock('../../src/services/scan.service');

describe('Scan Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
      send: vi.fn(),
    };
    vi.clearAllMocks();
  });

  describe('performScan & getScanResults', () => {
    it('should trigger a scan and return results or 500 on error', async () => {
      req.body.force = true;
      const mockResult = { packages: 10, duration: 150 };
      vi.mocked(scanService.performMonorepoScan).mockResolvedValueOnce(
        mockResult as any
      );

      await performScan(req, res);
      expect(scanService.performMonorepoScan).toHaveBeenCalledWith(true);
      expect(res.json).toHaveBeenCalledWith(mockResult);

      vi.mocked(scanService.performMonorepoScan).mockRejectedValueOnce(
        new Error('Scan failed')
      );
      await performScan(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('getScanResults should return scan results or 500 on error', async () => {
      vi.mocked(scanService.getMonorepoScanResults).mockResolvedValueOnce({
        score: 90,
      } as any);
      await getScanResults(req, res);
      expect(res.json).toHaveBeenCalledWith({ score: 90 });

      vi.mocked(scanService.getMonorepoScanResults).mockRejectedValueOnce(
        new Error('Fs error')
      );
      await getScanResults(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('exportScanResults', () => {
    it('should export json format directly', async () => {
      req.params.format = 'json';
      vi.mocked(scanService.exportMonorepoScanResults).mockResolvedValueOnce({
        result: { score: 95 },
        exportData: '{}',
      } as any);

      await exportScanResults(req, res);
      expect(res.json).toHaveBeenCalledWith({ score: 95 });
    });

    it('should export csv or html format with headers', async () => {
      req.params.format = 'csv';
      req.query.filename = 'custom.csv';
      vi.mocked(scanService.exportMonorepoScanResults).mockResolvedValueOnce({
        result: {},
        exportData: 'col1,col2',
      } as any);

      await exportScanResults(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="custom.csv"'
      );
      expect(res.send).toHaveBeenCalledWith('col1,col2');
    });

    it('should return 400 on invalid export format error', async () => {
      req.params.format = 'xml';
      vi.mocked(scanService.exportMonorepoScanResults).mockRejectedValueOnce(
        new Error('Invalid export format')
      );
      await exportScanResults(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

      vi.mocked(scanService.exportMonorepoScanResults).mockRejectedValueOnce(
        'string error'
      );
      await exportScanResults(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
