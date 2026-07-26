import path from 'path';
import { GitService } from '../gitService';
import { AppLogger } from '../middleware/logger';

export const getPackageCommits = async (
  packagePath: string,
  rootPath?: string
) => {
  try {
    const decodedPath = decodeURIComponent(packagePath);
    const targetRoot =
      rootPath || process.env.MONODOG_TARGET_ROOT || process.cwd();

    const gitService = new GitService(targetRoot);

    const relativePath = path.isAbsolute(decodedPath)
      ? path.relative(targetRoot, decodedPath)
      : decodedPath;

    return await gitService.getAllCommits(relativePath);
  } catch (error) {
    AppLogger.error(
      `Failed to get package commits for ${packagePath}: ${error}`
    );
    return [];
  }
};
