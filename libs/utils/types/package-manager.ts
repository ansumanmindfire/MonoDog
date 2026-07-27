export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export interface PMCommands {
  name: PackageManager;
  runBuild: string;
  runLint: string;
  runTest: string;
  auditJson: string;
}
