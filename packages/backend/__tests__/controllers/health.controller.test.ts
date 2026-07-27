import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getHealth,
  getPackageHealth,
  getAllPackagesHealth,
  refreshHealth,
  getLiveStatus,
} from '../../src/controllers/health.controller';
import * as healthService from '../../src/services/health.service';
import { Request, Response } from 'express';

vi.mock('../../src/services/health.service', () => ({
  getSystemHealth: vi.fn(),
  getPackageHealthMetrics: vi.fn(),
  getAllPackagesHealthMetrics: vi.fn(),
  refreshPackagesHealth: vi.fn(),
}));

describe('Health Controller Unit Tests', () => {
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = {
      params: {},
      app: { locals: { rootPath: '/root' } },
    };
    mockResponse = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
  });

  describe('getHealth', () => {
    it('should return 200 and system health', () => {
      const mockHealth = { status: 'ok' };
      vi.mocked(healthService.getSystemHealth).mockReturnValue(
        mockHealth as any
      );
      getHealth(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHealth);
    });

    it('should return 500 if service throws', () => {
      vi.mocked(healthService.getSystemHealth).mockImplementation(() => {
        throw new Error('Service error');
      });
      getHealth(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getPackageHealth', () => {
    it('should return package health metrics', async () => {
      mockRequest.params = { name: 'test-pkg' };
      vi.mocked(healthService.getPackageHealthMetrics).mockResolvedValue({
        packageName: 'test-pkg',
      } as any);

      await getPackageHealth(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({
        packageName: 'test-pkg',
      });
    });

    it('should return 404 if package not found, or 500 on other errors', async () => {
      mockRequest.params = { name: 'unknown' };
      vi.mocked(healthService.getPackageHealthMetrics).mockRejectedValueOnce(
        new Error('Package not found')
      );
      await getPackageHealth(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);

      vi.mocked(healthService.getPackageHealthMetrics).mockRejectedValueOnce(
        new Error('DB failure')
      );
      await getPackageHealth(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);

      vi.mocked(healthService.getPackageHealthMetrics).mockRejectedValueOnce(
        'string error'
      );
      await getPackageHealth(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllPackagesHealth, refreshHealth, getLiveStatus', () => {
    it('getAllPackagesHealth should return metrics or 500', async () => {
      vi.mocked(
        healthService.getAllPackagesHealthMetrics
      ).mockResolvedValueOnce([{ packageName: 'a' }] as any);
      await getAllPackagesHealth(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith([{ packageName: 'a' }]);

      vi.mocked(
        healthService.getAllPackagesHealthMetrics
      ).mockRejectedValueOnce(new Error('Db error'));
      await getAllPackagesHealth(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('refreshHealth should refresh metrics or 500', async () => {
      vi.mocked(healthService.refreshPackagesHealth).mockResolvedValueOnce({
        refreshed: 1,
      } as any);
      await refreshHealth(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ refreshed: 1 });

      vi.mocked(healthService.refreshPackagesHealth).mockRejectedValueOnce(
        new Error('Scan error')
      );
      await refreshHealth(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('getLiveStatus should return ok status with uptime', () => {
      getLiveStatus(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'ok', uptime: expect.any(Number) })
      );
    });
  });
});
