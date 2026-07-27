import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '../../../../icons/heroicons';
import { BuildOverviewProps } from '../types/ci.types';
import { formatDuration } from '../utils/ci.utils';

export default function BuildOverview({
  stats,
  onRefresh,
  loading = false,
}: BuildOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading text-lg">Build Statistics</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Builds */}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-caption font-medium">Total Builds</p>
              <p className="text-heading text-2xl">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Successful Builds */}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-caption font-medium">Successful</p>
              <p className="text-heading text-2xl text-success-600">
                {stats.successful}
              </p>
            </div>
          </div>
        </div>

        {/* Failed Builds */}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-error-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-error-600" />
            </div>
            <div className="ml-4">
              <p className="text-caption font-medium">Failed</p>
              <p className="text-heading text-2xl text-error-600">
                {stats.failed}
              </p>
            </div>
          </div>
        </div>

        {/* Running Builds */}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-info-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-info-600" />
            </div>
            <div className="ml-4">
              <p className="text-caption font-medium">Running</p>
              <p className="text-heading text-2xl text-info-600">
                {stats.running}
              </p>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-caption font-medium">Success Rate</p>
            <span
              className={`text-lg font-bold ${
                stats.successRate >= 90
                  ? 'text-success-600'
                  : stats.successRate >= 70
                    ? 'text-warning-600'
                    : 'text-error-600'
              }`}
            >
              {stats.successRate}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                stats.successRate >= 90
                  ? 'bg-success-500'
                  : stats.successRate >= 70
                    ? 'bg-warning-500'
                    : 'bg-error-500'
              }`}
              style={{ width: `${stats.successRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-heading text-lg">Performance Metrics</h2>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Avg Duration */}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-caption font-medium">Avg Duration</p>
              <p className="text-heading text-2xl text-primary-600">
                {formatDuration(stats.avgDuration)}
              </p>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-caption font-medium">Success Rate</p>
              <p className="text-heading text-2xl text-success-600">
                {stats.total > 0
                  ? Math.round((stats.successful / stats.total) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Failure Rate */}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-error-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-error-600" />
            </div>
            <div className="ml-4">
              <p className="text-caption font-medium">Failure Rate</p>
              <p className="text-heading text-2xl text-error-600">
                {stats.total > 0
                  ? Math.round((stats.failed / stats.total) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Active Builds */}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-info-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-info-600" />
            </div>
            <div className="ml-4">
              <p className="text-caption font-medium">Active Builds</p>
              <p className="text-heading text-2xl text-info-600">
                {stats.running}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
