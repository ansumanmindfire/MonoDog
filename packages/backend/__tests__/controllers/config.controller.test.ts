import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getConfigFiles,
  updateConfigFile,
} from '../../src/controllers/config.controller';
import * as configService from '../../src/services/config.service';
import fs from 'fs';

vi.mock('../../src/services/config.service', () => ({
  findMonorepoRoot: vi.fn(() => '/mock/root'),
  scanConfigFiles: vi.fn(),
  getFileType: vi.fn(() => 'json'),
  containsSecrets: vi.fn(() => false),
}));

vi.mock('../../src/db/prisma', () => ({
  prisma: {
    activityLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe('Config Controller Unit Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      params: { id: 'package.json' },
      body: { content: '{"name":"test"}' },
      app: { locals: { rootPath: '/mock/rootPath' } },
    };
    res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  describe('getConfigFiles', () => {
    it('should return config files successfully', async () => {
      const mockFiles = [
        {
          id: '1',
          name: 'package.json',
          path: '/mock/root/package.json',
          type: 'json',
          content: '{}',
        },
      ];
      vi.mocked(configService.scanConfigFiles).mockResolvedValue(
        mockFiles as any
      );

      await getConfigFiles(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, files: expect.any(Array) })
      );
    });

    it('should handle service errors gracefully', async () => {
      vi.mocked(configService.scanConfigFiles).mockRejectedValue(
        new Error('Permission denied')
      );

      await getConfigFiles(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateConfigFile', () => {
    it('should return 400 if content is missing', async () => {
      req.body = {};
      await updateConfigFile(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 403 for path traversal attempts', async () => {
      req.params.id = '../../secret.txt';
      await updateConfigFile(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 403 if file is not writable', async () => {
      vi.spyOn(fs.promises, 'access').mockRejectedValueOnce(
        new Error('EACCES')
      );
      await updateConfigFile(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 400 if JSON content is invalid', async () => {
      req.body = { content: 'invalid json {' };
      vi.spyOn(fs.promises, 'access').mockResolvedValueOnce(undefined);
      await updateConfigFile(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should write file and return updated file object on valid JSON', async () => {
      req.body = { content: '{"name":"monodog"}' };
      vi.spyOn(fs.promises, 'access').mockResolvedValueOnce(undefined);
      vi.spyOn(fs.promises, 'writeFile').mockResolvedValueOnce(undefined);
      vi.spyOn(fs.promises, 'stat').mockResolvedValueOnce({
        size: 100,
        mtime: new Date(),
      } as any);

      await updateConfigFile(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'File saved successfully',
        })
      );
    });
  });
});
