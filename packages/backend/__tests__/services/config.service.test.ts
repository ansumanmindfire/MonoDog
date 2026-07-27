import { describe, it, expect, vi } from 'vitest';
import {
  findMonorepoRoot,
  getFileType,
  containsSecrets,
  scanConfigFiles,
} from '../../src/services/config.service';
import fs from 'fs';
import path from 'path';

describe('Config Service Unit Tests', () => {
  describe('getFileType', () => {
    it('should map extensions to correct file types', () => {
      expect(getFileType('app.json')).toBe('json');
      expect(getFileType('config.yaml')).toBe('yaml');
      expect(getFileType('config.yml')).toBe('yaml');
      expect(getFileType('index.js')).toBe('javascript');
      expect(getFileType('index.ts')).toBe('typescript');
      expect(getFileType('local.env')).toBe('env');
      expect(getFileType('README.md')).toBe('markdown');
      expect(getFileType('module.cjs')).toBe('javascript');
      expect(getFileType('app.config')).toBe('text');
      expect(getFileType('.env.example')).toBe('env');
      expect(getFileType('config.example')).toBe('text');
      expect(getFileType('unknown.xyz')).toBe('text');
    });
  });

  describe('containsSecrets', () => {
    it('should return false for non-env and non-config files', () => {
      expect(containsSecrets('password = 123', 'readme.txt')).toBe(false);
    });

    it('should detect various secret patterns in .env or config files', () => {
      expect(containsSecrets('password = secret', '.env')).toBe(true);
      expect(containsSecrets('secret = mysecret', 'config.json')).toBe(true);
      expect(containsSecrets('key = abc123', '.env.local')).toBe(true);
      expect(containsSecrets('token = gho_xyz', '.env')).toBe(true);
      expect(containsSecrets('auth = bearer', 'config.js')).toBe(true);
      expect(containsSecrets('credential = pass', '.env')).toBe(true);
      expect(containsSecrets('api_key = 123', '.env')).toBe(true);
      expect(containsSecrets('private_key = rsa', '.env')).toBe(true);
      expect(containsSecrets('DATABASE_URL = mysql://', 'config.json')).toBe(
        true
      );
      expect(containsSecrets('JWT_SECRET = sec', '.env')).toBe(true);
      expect(containsSecrets('GITHUB_TOKEN = gho_123', '.env')).toBe(true);
      expect(containsSecrets('NORMAL_VAR = 123', '.env')).toBe(false);
    });
  });

  describe('findMonorepoRoot', () => {
    it('should resolve provided root path or process.cwd()', () => {
      expect(findMonorepoRoot('/some/path')).toBe('/some/path');
      expect(findMonorepoRoot()).toBe(process.cwd());
    });
  });

  describe('scanConfigFiles', () => {
    it('should scan monorepo root directory for config files', async () => {
      const tempDir = path.resolve(__dirname, 'mock_scan_dir_' + Date.now());
      const subDir = path.join(tempDir, 'sub');
      const skipDir = path.join(tempDir, 'node_modules');

      fs.mkdirSync(subDir, { recursive: true });
      fs.mkdirSync(skipDir, { recursive: true });

      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'root' })
      );
      fs.writeFileSync(path.join(subDir, 'tsconfig.json'), '{}');
      fs.writeFileSync(path.join(skipDir, 'package.json'), '{}');

      const files = await scanConfigFiles(tempDir);
      expect(files.length).toBeGreaterThanOrEqual(2);
      const names = files.map(f => f.name);
      expect(names).toContain('package.json');
      expect(names).toContain('tsconfig.json');

      fs.rmSync(tempDir, { recursive: true, force: true });
    });
  });
});
