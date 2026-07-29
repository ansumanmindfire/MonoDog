import { Request, Response } from 'express';
import {
  getSystemHealth,
  getPackageHealthMetrics,
  getAllPackagesHealthMetrics,
  refreshPackagesHealth,
  triggerAsyncRefreshPackagesHealth,
  getHealthJobStatus,
} from '../services/health.service';

export const getHealth = (req: Request, res: Response) => {
  try {
    const health = getSystemHealth();

    res.json(health);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch health status',
    });
  }
};

export const getPackageHealth = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    const health = await getPackageHealthMetrics(name);

    res.json(health);
  } catch (error) {
    res
      .status(
        error instanceof Error && error.message === 'Package not found'
          ? 404
          : 500
      )
      .json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch health metrics',
      });
  }
};

export const getAllPackagesHealth = async (req: Request, res: Response) => {
  try {
    const rootPath = req.app.locals.rootPath;
    const response = await getAllPackagesHealthMetrics(rootPath);

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch health data from database',
    });
  }
};

export const refreshHealth = async (req: Request, res: Response) => {
  try {
    const rootPath = req.app.locals.rootPath;

    // Trigger async background job
    const jobStatus = triggerAsyncRefreshPackagesHealth(rootPath);

    res.status(202).json({
      success: true,
      message: 'Health refresh scan started in background',
      job: jobStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to start health scan',
    });
  }
};

export const getRefreshStatus = (req: Request, res: Response) => {
  try {
    const jobStatus = getHealthJobStatus();
    res.json({
      success: true,
      job: jobStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch health scan status',
    });
  }
};

export const getLiveStatus = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
};
