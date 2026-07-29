import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import {
  PackageInfo,
  PackageHealth,
  checkOutdatedDependencies,
  calculatePackageHealth,
  detectPackageManager,
  getPMCommands,
} from '@mindfiredigital/utils';

const execAsync = util.promisify(exec);

export async function checkBuildStatus(
  pkg: PackageInfo
): Promise<PackageHealth['buildStatus']> {
  try {
    if (pkg.scripts && pkg.scripts.build) {
      const pm = detectPackageManager(pkg.path);
      const cmds = getPMCommands(pm);
      await execAsync(cmds.runBuild, {
        cwd: pkg.path,
        maxBuffer: 10 * 1024 * 1024,
        env: { ...process.env, CI: 'true', FORCE_COLOR: '0' },
      });
      return 'success';
    }
    return 'unknown';
  } catch (error) {
    return 'failed';
  }
}

export async function checkTestCoverage(
  pkg: PackageInfo,
  coverageOverridePath?: string
): Promise<number> {
  try {
    const coveragePaths = [
      path.join(pkg.path, 'coverage', 'coverage-summary.json'),
      path.join(pkg.path, 'coverage', 'coverage-final.json'),
      path.join(pkg.path, 'coverage', 'lcov.info'),
      path.join(pkg.path, 'coverage', 'clover.xml'),
      path.join(pkg.path, 'coverage.json'),
    ];

    if (coverageOverridePath) {
      coveragePaths.unshift(path.join(pkg.path, coverageOverridePath));
    }

    for (const coveragePath of coveragePaths) {
      if (fs.existsSync(coveragePath)) {
        if (coveragePath.endsWith('coverage-summary.json') || coveragePath.endsWith('coverage.json')) {
          try {
            const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
            const pct =
              coverage.total?.lines?.pct ?? coverage.total?.statements?.pct;
            if (typeof pct === 'number') {
              return Math.round(pct);
            }
          } catch (error) {
            console.warn(`Error parsing coverage file for ${pkg.name}:`, error);
          }
        }

        if (coveragePath.endsWith('coverage-final.json')) {
          try {
            const data = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
            let totalStatements = 0;
            let coveredStatements = 0;

            for (const filePath of Object.keys(data)) {
              const fileData = data[filePath];
              if (fileData && fileData.s) {
                for (const stmtId of Object.keys(fileData.s)) {
                  totalStatements++;
                  if (fileData.s[stmtId] > 0) {
                    coveredStatements++;
                  }
                }
              }
            }

            if (totalStatements > 0) {
              return Math.round((coveredStatements / totalStatements) * 100);
            }
          } catch (error) {
            console.warn(`Error parsing coverage-final.json for ${pkg.name}:`, error);
          }
        }
      }
    }

    // If no coverage report file exists, return 0%
    return 0;
  } catch (error) {
    console.warn(`Error checking coverage for ${pkg.name}:`, error);
    return 0;
  }
}

export async function checkLintStatus(
  pkg: PackageInfo
): Promise<PackageHealth['lintStatus']> {
  try {
    if (pkg.scripts && pkg.scripts.lint) {
      const pm = detectPackageManager(pkg.path);
      const cmds = getPMCommands(pm);
      await execAsync(cmds.runLint, {
        cwd: pkg.path,
        maxBuffer: 10 * 1024 * 1024,
        env: { ...process.env, CI: 'true', FORCE_COLOR: '0' },
      });
      return 'pass';
    }
    return 'unknown';
  } catch (error) {
    return 'fail';
  }
}

export async function checkSecurityAudit(
  pkg: PackageInfo,
  rootPath?: string
): Promise<PackageHealth['securityAudit']> {
  try {
    let stdoutData = '';
    const pm = detectPackageManager(pkg.path);
    const cmds = getPMCommands(pm);
    const auditCwd = rootPath || pkg.path;

    try {
      const { stdout } = await execAsync(cmds.auditJson, {
        cwd: auditCwd,
        maxBuffer: 10 * 1024 * 1024,
        env: { ...process.env, CI: 'true', FORCE_COLOR: '0' },
      });
      stdoutData = stdout;
    } catch (execError: any) {
      if (execError.stdout) {
        stdoutData = execError.stdout;
      } else {
        return 'unknown';
      }
    }

    if (!stdoutData || !stdoutData.trim()) {
      return 'unknown';
    }

    const audit = JSON.parse(stdoutData.toString());

    const vulns = audit?.metadata?.vulnerabilities || audit?.vulnerabilities;

    if (vulns) {
      if (typeof vulns === 'object' && !Array.isArray(vulns)) {
        const totalVulns =
          (vulns.info || 0) +
          (vulns.low || 0) +
          (vulns.moderate || 0) +
          (vulns.high || 0) +
          (vulns.critical || 0) +
          (vulns.total || 0);

        const keysCount = audit?.vulnerabilities ? Object.keys(audit.vulnerabilities).length : 0;
        const finalCount = totalVulns || keysCount;

        return finalCount === 0 ? 'pass' : 'fail';
      }

      if (Array.isArray(vulns)) {
        return vulns.length === 0 ? 'pass' : 'fail';
      }
    }

    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

export async function assessPackageHealth(
  pkg: PackageInfo
): Promise<PackageHealth> {
  const buildStatus = await checkBuildStatus(pkg);
  const testCoverage = await checkTestCoverage(pkg);
  const lintStatus = await checkLintStatus(pkg);
  const securityAudit = await checkSecurityAudit(pkg);

  return calculatePackageHealth(
    buildStatus,
    testCoverage,
    lintStatus,
    securityAudit
  );
}

export async function findOutdatedPackages(
  packages: PackageInfo[]
): Promise<string[]> {
  const outdated: string[] = [];

  for (const pkg of packages) {
    const outdatedDeps = await checkOutdatedDependencies(pkg);
    if (outdatedDeps.length > 0) {
      outdated.push(pkg.name);
    }
  }

  return outdated;
}
