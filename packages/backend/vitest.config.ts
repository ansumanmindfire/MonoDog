import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@mindfiredigital/utils': path.resolve(
        __dirname,
        '../../libs/utils/index.ts'
      ),
      '@mindfiredigital/monorepo-scanner': path.resolve(
        __dirname,
        '../../packages/monorepo-scanner/src/index.ts'
      ),
    },
  },
  test: {
    environment: 'node',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'src/index.ts',
        'src/cli.ts',
        'src/run-db.ts',
        'src/serve-dev.ts',
        'src/get-db-url.ts',
        'src/types/**',
        'src/constants/**',
        'src/config/**',
        'src/db/**',
        'src/middleware/**',
        'src/config-loader.ts',
        'src/utils/**',
        '**/*.d.ts',
        'tests/**',
      ],
    },
  },
});
