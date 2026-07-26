import fs from 'fs';
import path from 'path';
import { PackageManager, PMCommands } from './types';

/**
 * Detects the active package manager for a given workspace root directory.
 */
export function detectPackageManager(rootDir: string): PackageManager {
  try {
    const pkgJsonPath = path.join(rootDir, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkgContent = fs.readFileSync(pkgJsonPath, 'utf8');
      const pkg = JSON.parse(pkgContent);
      if (pkg.packageManager && typeof pkg.packageManager === 'string') {
        if (pkg.packageManager.includes('pnpm')) return 'pnpm';
        if (pkg.packageManager.includes('yarn')) return 'yarn';
        if (pkg.packageManager.includes('bun')) return 'bun';
        if (pkg.packageManager.includes('npm')) return 'npm';
      }
    }

    if (fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml'))) return 'pnpm';
    if (
      fs.existsSync(path.join(rootDir, 'bun.lockb')) ||
      fs.existsSync(path.join(rootDir, 'bun.lock'))
    ) {
      return 'bun';
    }
    if (fs.existsSync(path.join(rootDir, 'yarn.lock'))) return 'yarn';
    if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) return 'npm';
  } catch {
    // Ignore read or parse errors
  }

  return 'pnpm'; // Default fallback
}

/**
 * Returns executable shell commands for the given package manager.
 */
export function getPMCommands(pm: PackageManager): PMCommands {
  switch (pm) {
    case 'bun':
      return {
        name: 'bun',
        runBuild: 'bun run build',
        runLint: 'bun run lint',
        runTest: 'bun test',
        auditJson: 'bun audit --json',
      };
    case 'yarn':
      return {
        name: 'yarn',
        runBuild: 'yarn run build',
        runLint: 'yarn run lint',
        runTest: 'yarn test',
        auditJson: 'yarn audit --json',
      };
    case 'npm':
      return {
        name: 'npm',
        runBuild: 'npm run build',
        runLint: 'npm run lint',
        runTest: 'npm test',
        auditJson: 'npm audit --json',
      };
    case 'pnpm':
    default:
      return {
        name: 'pnpm',
        runBuild: 'pnpm run build',
        runLint: 'pnpm run lint',
        runTest: 'pnpm test',
        auditJson: 'pnpm audit --json',
      };
  }
}
