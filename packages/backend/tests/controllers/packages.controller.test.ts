import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPackages,
  refreshPackages,
  syncNpmData,
  getPackageDetails,
  updatePackage,
} from '../../src/controllers/packages.controller';
import * as packageService from '../../src/services/package.service';
import * as npmWorker from '../../src/workers/npm-sync-worker';

vi.mock('../../src/services/package.service', () => ({
  getAllPackages: vi.fn(),
  refreshAllPackages: vi.fn(),
  getPackageByName: vi.fn(),
  updatePackageConfig: vi.fn(),
}));

vi.mock('../../src/workers/npm-sync-worker', () => ({
  runNpmSync: vi.fn(),
}));

describe('Packages Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      params: { name: 'ui' },
      body: { packageName: 'ui', config: '{}', packagePath: '/path' },
      app: { locals: { rootPath: '/mock/path' } },
    };
    res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  describe('getPackages & refreshPackages & syncNpmData', () => {
    it('getPackages should return all packages or 500 on error', async () => {
      vi.mocked(packageService.getAllPackages).mockResolvedValueOnce([
        { name: 'ui' },
      ] as any);
      await getPackages(req, res);
      expect(res.json).toHaveBeenCalledWith([{ name: 'ui' }]);

      vi.mocked(packageService.getAllPackages).mockRejectedValueOnce(
        new Error('DB failure')
      );
      await getPackages(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('refreshPackages should return refreshed packages or 500 on error', async () => {
      vi.mocked(packageService.refreshAllPackages).mockResolvedValueOnce([
        { name: 'ui' },
      ] as any);
      await refreshPackages(req, res);
      expect(res.json).toHaveBeenCalledWith([{ name: 'ui' }]);

      vi.mocked(packageService.refreshAllPackages).mockRejectedValueOnce(
        new Error('Error')
      );
      await refreshPackages(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('syncNpmData should start background npm sync', async () => {
      await syncNpmData(req, res);
      expect(npmWorker.runNpmSync).toHaveBeenCalledWith('/mock/path');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'NPM sync started in background',
      });
    });
  });

  describe('getPackageDetails & updatePackage', () => {
    it('getPackageDetails should return 404 if package not found', async () => {
      vi.mocked(packageService.getPackageByName).mockRejectedValueOnce(
        new Error('Package not found')
      );
      await getPackageDetails(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('updatePackage should handle 400 validation, 404 not found, and 200 success', async () => {
      vi.mocked(packageService.updatePackageConfig).mockResolvedValueOnce({
        success: true,
      } as any);
      await updatePackage(req, res);
      expect(res.json).toHaveBeenCalledWith({ success: true });

      vi.mocked(packageService.updatePackageConfig).mockRejectedValueOnce(
        new Error('JSON parsing error')
      );
      await updatePackage(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

      vi.mocked(packageService.updatePackageConfig).mockRejectedValueOnce(
        new Error('Package directory not found')
      );
      await updatePackage(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
