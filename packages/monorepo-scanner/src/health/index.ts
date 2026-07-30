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
        if (
          coveragePath.endsWith('coverage-summary.json') ||
          coveragePath.endsWith('coverage.json')
        ) {
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
            console.warn(
              `Error parsing coverage-final.json for ${pkg.name}:`,
              error
            );
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
    const targetRoot =
      rootPath || process.env.MONODOG_TARGET_ROOT || process.cwd();

    try {
      const { stdout } = await execAsync(cmds.auditJson, {
        cwd: targetRoot,
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

    // Calculate relative path of this package from workspace root
    let relativePkgPath = path
      .relative(targetRoot, pkg.path)
      .replace(/\\/g, '/');
    if (!relativePkgPath || relativePkgPath === '.') {
      relativePkgPath = '.';
    }

    const pathPrefixPattern1 = relativePkgPath.toLowerCase();
    const pathPrefixPattern2 = relativePkgPath
      .replace(/\//g, '__')
      .toLowerCase();
    const pkgNamePattern = (pkg.name || '').toLowerCase();

    let matchingPackageVulnerabilities = 0;

    // Check "actions" array format -- Pnpm
    if (Array.isArray(audit?.actions)) {
      for (const act of audit.actions) {
        if (Array.isArray(act.resolves)) {
          for (const res of act.resolves) {
            if (res.path) {
              const resPathLower = String(res.path).toLowerCase();
              if (
                resPathLower.startsWith(pathPrefixPattern1) ||
                resPathLower.startsWith(pathPrefixPattern2) ||
                (pkgNamePattern && resPathLower.startsWith(pkgNamePattern))
              ) {
                matchingPackageVulnerabilities++;
              }
            }
          }
        }
      }
    }

    // Check advisories / vulnerabilities format -- Bun / NPM / Yarn
    const advisories = audit?.advisories || audit?.vulnerabilities;
    if (advisories && typeof advisories === 'object') {
      for (const key of Object.keys(advisories)) {
        const item = advisories[key];
        const findings = item?.findings || item?.via;
        if (Array.isArray(findings)) {
          for (const f of findings) {
            const nodes =
              f?.nodes || f?.paths || (typeof f === 'string' ? [f] : []);
            if (Array.isArray(nodes)) {
              for (const node of nodes) {
                const nodeStr = String(node).toLowerCase();
                if (
                  nodeStr.startsWith(pathPrefixPattern1) ||
                  nodeStr.startsWith(pathPrefixPattern2) ||
                  (pkgNamePattern && nodeStr.startsWith(pkgNamePattern))
                ) {
                  matchingPackageVulnerabilities++;
                }
              }
            }
          }
        }
      }
    }

    // If audit JSON has no path breakdown keys, fall back to global metadata
    if (
      !audit.actions &&
      !audit.advisories &&
      !audit.vulnerabilities &&
      audit.metadata?.vulnerabilities
    ) {
      const vulns = audit.metadata.vulnerabilities;
      const totalVulns =
        (vulns.info || 0) +
        (vulns.low || 0) +
        (vulns.moderate || 0) +
        (vulns.high || 0) +
        (vulns.critical || 0) +
        (vulns.total || 0);

      return totalVulns === 0 ? 'pass' : 'fail';
    }

    return matchingPackageVulnerabilities === 0 ? 'pass' : 'fail';
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
