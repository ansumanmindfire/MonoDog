import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'],
  target: 'node18',
  clean: true,
  dts: false,
  sourcemap: false,
  splitting: false,
  noExternal: ['@mindfiredigital/utils', '@mindfiredigital/monorepo-scanner'],
  onSuccess: 'node scripts/copy-dashboard.js',
});
