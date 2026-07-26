import { scanMonorepo, generateMonorepoStats } from '@mindfiredigital/utils';

export const getSystemInformation = () => {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    pid: process.pid,
    cwd: process.cwd(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    },
  };
};

export const getMonorepoStats = async (targetRoot?: string) => {
  const rootPath =
    targetRoot || process.env.MONODOG_TARGET_ROOT || process.cwd();
  const packages = await scanMonorepo(rootPath);
  const stats = generateMonorepoStats(packages);

  return {
    ...stats,
    timestamp: Date.now(),
    scanDuration: 0,
  };
};
