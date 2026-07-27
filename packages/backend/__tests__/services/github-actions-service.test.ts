import { describe, it, expect, vi, beforeEach } from 'vitest';
import https from 'https';
import { EventEmitter } from 'events';
import {
  requestOptions,
  listWorkflows,
  getWorkflowRuns,
  getWorkflowRun,
  getWorkflowRunJobs,
  getJobLogs,
  parseJobLogs,
  paginateJobLogs,
  buildJobLogsResponse,
  triggerWorkflow,
  cancelWorkflowRun,
  rerunWorkflow,
  enableWorkflow,
  disableWorkflow,
} from '../../src/services/github-actions-service';

vi.mock('https');

describe('GitHub Actions Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestOptions', () => {
    it('should build request options correctly', () => {
      const opts = requestOptions('POST', '/path', 'token123', '{"a":1}');
      expect(opts.hostname).toBe('api.github.com');
      expect(opts.method).toBe('POST');
      expect(opts.headers.Authorization).toBe('Bearer token123');
      expect(opts.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('parseJobLogs & paginateJobLogs & buildJobLogsResponse', () => {
    const mockJob: any = {
      id: 101,
      name: 'test-job',
      status: 'completed',
      conclusion: 'success',
      started_at: '2026-01-01T00:00:00Z',
      completed_at: '2026-01-01T00:01:00Z',
      steps: [
        {
          name: 'Build',
          status: 'completed',
          conclusion: 'success',
          started_at: '2026-01-01T00:00:05Z',
        },
      ],
    };

    it('should parse logs with group headers', () => {
      const rawLogs = `
\u001b[36m##[group]Build\u001b[0m
2026-01-01T00:00:06.123Z \u001b[32mCompiling typescript...\u001b[0m
##[endgroup]
\u001b[36m##[group]Test\u001b[0m
2026-01-01T00:00:10.123Z Running vitest...
`;
      const steps = parseJobLogs(rawLogs, mockJob);
      expect(steps.length).toBe(2);
      expect(steps[0].stepName).toBe('Build');
      expect(steps[0].logs[0].content).toContain('Compiling typescript...');
      expect(steps[1].stepName).toBe('Test');
    });

    it('should fallback to single Output step if no groups exist', () => {
      const rawLogs = 'Plain log line 1\nPlain log line 2';
      const steps = parseJobLogs(rawLogs, mockJob);
      expect(steps).toHaveLength(1);
      expect(steps[0].stepName).toBe('Output');
      expect(steps[0].logs).toHaveLength(2);
    });

    it('should paginate job logs correctly', () => {
      const steps = parseJobLogs(
        'Plain log 1\nPlain log 2\nPlain log 3',
        mockJob
      );
      const page1 = paginateJobLogs(steps, 0, 1);
      expect(page1.steps[0].logs).toHaveLength(1);
      expect(page1.hasMore).toBe(true);
      expect(page1.nextCursor).toBe(1);
    });

    it('should build full job logs response', () => {
      const res = buildJobLogsResponse(
        mockJob,
        'Plain log 1\nPlain log 2',
        0,
        10
      );
      expect(res.jobId).toBe(101);
      expect(res.totalLines).toBe(2);
      expect(res.hasMoreLogs).toBe(false);
    });
  });

  describe('makeGitHubRequest & HTTP Endpoints', () => {
    function setupMockRequest(
      statusCode: number,
      responseBody: string,
      headers: Record<string, string> = {}
    ) {
      vi.mocked(https.request).mockImplementationOnce(
        (opts: any, callback?: any) => {
          const req = new EventEmitter() as any;
          req.write = vi.fn();
          req.destroy = vi.fn();
          req.setTimeout = vi.fn();
          req.end = vi.fn(() => {
            if (callback) {
              const res = new EventEmitter() as any;
              res.statusCode = statusCode;
              res.headers = {
                'x-ratelimit-limit': '5000',
                'x-ratelimit-remaining': '4999',
                'x-ratelimit-reset': '100000',
                'x-ratelimit-used': '1',
                ...headers,
              };
              callback(res);
              res.emit('data', responseBody);
              res.emit('end');
            }
          });
          return req;
        }
      );
    }

    it('makeGitHubRequest should resolve with JSON data and rate limit info', async () => {
      setupMockRequest(200, JSON.stringify({ total_count: 5, workflows: [] }));

      const res = await listWorkflows('owner', 'repo', 'token');
      expect(res.workflows).toEqual([]);
      expect(res.rateLimit.remaining).toBe(4999);
    });

    it('getWorkflowRuns should query with all filter options', async () => {
      setupMockRequest(
        200,
        JSON.stringify({ total_count: 1, workflow_runs: [{ id: 1 }] })
      );

      const res = await getWorkflowRuns('owner', 'repo', 'token', {
        workflowId: '100',
        status: 'completed',
        conclusion: 'success',
        page: 1,
        per_page: 10,
      });

      expect(res.runs).toHaveLength(1);

      // Default no options
      setupMockRequest(
        200,
        JSON.stringify({ total_count: 0, workflow_runs: [] })
      );
      const resDefault = await getWorkflowRuns('owner', 'repo', 'token');
      expect(resDefault.runs).toEqual([]);
    });

    it('getWorkflowRuns with workflowPath should extract filename', async () => {
      setupMockRequest(
        200,
        JSON.stringify({ total_count: 1, workflow_runs: [{ id: 2 }] })
      );

      const res = await getWorkflowRuns('owner', 'repo', 'token', {
        workflowPath: '.github/workflows/deploy.yml',
      });

      expect(res.runs).toHaveLength(1);
    });

    it('getWorkflowRun & getWorkflowRunJobs should return data or throw on error', async () => {
      setupMockRequest(200, JSON.stringify({ id: 10 }));
      const runRes = await getWorkflowRun('owner', 'repo', 10, 'token');
      expect(runRes.run.id).toBe(10);

      setupMockRequest(500, 'Server error');
      await expect(
        getWorkflowRun('owner', 'repo', 10, 'token')
      ).rejects.toThrow();

      setupMockRequest(200, JSON.stringify({ total_count: 1, jobs: [] }));
      const jobsRes = await getWorkflowRunJobs('owner', 'repo', 10, 'token');
      expect(jobsRes.jobs).toEqual([]);

      setupMockRequest(404, 'Not found');
      await expect(
        getWorkflowRunJobs('owner', 'repo', 10, 'token')
      ).rejects.toThrow();
    });

    it('triggerWorkflow, cancelWorkflowRun, rerunWorkflow, enableWorkflow, disableWorkflow success & failure branches', async () => {
      setupMockRequest(204, '');
      const triggerRes = await triggerWorkflow('token', {
        owner: 'o',
        repo: 'r',
        workflow: '.github/workflows/ci.yml',
        ref: 'main',
      });
      expect(triggerRes.response.success).toBe(true);

      // Trigger failure branch
      setupMockRequest(400, 'Bad request');
      const triggerFail = await triggerWorkflow('token', {
        owner: 'o',
        repo: 'r',
        workflow: 'ci.yml',
        ref: 'main',
      });
      expect(triggerFail.response.success).toBe(false);

      setupMockRequest(200, '{}');
      const cancelRes = await cancelWorkflowRun('o', 'r', 1, 'token');
      expect(cancelRes.success).toBe(true);

      setupMockRequest(400, 'Err');
      const cancelFail = await cancelWorkflowRun('o', 'r', 1, 'token');
      expect(cancelFail.success).toBe(false);

      setupMockRequest(200, '{}');
      const rerunRes = await rerunWorkflow('o', 'r', 1, 'token', false);
      expect(rerunRes.success).toBe(true);

      setupMockRequest(400, 'Err');
      const rerunFail = await rerunWorkflow('o', 'r', 1, 'token', true);
      expect(rerunFail.success).toBe(false);

      setupMockRequest(200, '{}');
      const enableRes = await enableWorkflow('o', 'r', 'ci.yml', 'token');
      expect(enableRes.success).toBe(true);

      setupMockRequest(400, 'Err');
      const enableFail = await enableWorkflow('o', 'r', 'ci.yml', 'token');
      expect(enableFail.success).toBe(false);

      setupMockRequest(200, '{}');
      const disableRes = await disableWorkflow('o', 'r', 'ci.yml', 'token');
      expect(disableRes.success).toBe(true);

      setupMockRequest(400, 'Err');
      const disableFail = await disableWorkflow('o', 'r', 'ci.yml', 'token');
      expect(disableFail.success).toBe(false);
    });

    it('getJobLogs should handle direct response, empty logs, HTTP errors, and redirects', async () => {
      // Test direct response
      setupMockRequest(200, 'Direct log data');
      const res1 = await getJobLogs('o', 'r', 1, 'token');
      expect(res1.logs).toBe('Direct log data');

      // Test empty body
      setupMockRequest(200, '   ');
      const resEmpty = await getJobLogs('o', 'r', 1, 'token');
      expect(resEmpty.logs).toBe('');

      // Test HTTP error (404)
      setupMockRequest(404, 'Job logs missing');
      await expect(getJobLogs('o', 'r', 1, 'token')).rejects.toThrow(
        'GitHub API error: 404'
      );

      // Test redirect (302) to success
      vi.mocked(https.request).mockImplementationOnce(
        (opts: any, callback?: any) => {
          const req = new EventEmitter() as any;
          req.setTimeout = vi.fn();
          req.end = vi.fn(() => {
            if (callback) {
              const res = new EventEmitter() as any;
              res.statusCode = 302;
              res.headers = {
                location: 'https://logs.github.com/redirect-target',
              };
              callback(res);
              res.emit('end');
            }
          });
          return req;
        }
      );
      setupMockRequest(200, 'Redirected log content');
      const res2 = await getJobLogs('o', 'r', 1, 'token');
      expect(res2.logs).toBe('Redirected log content');

      // Test redirect (302) to error response
      vi.mocked(https.request).mockImplementationOnce(
        (opts: any, callback?: any) => {
          const req = new EventEmitter() as any;
          req.setTimeout = vi.fn();
          req.end = vi.fn(() => {
            if (callback) {
              const res = new EventEmitter() as any;
              res.statusCode = 302;
              res.headers = {
                location: 'https://logs.github.com/redirect-target',
              };
              callback(res);
              res.emit('end');
            }
          });
          return req;
        }
      );
      setupMockRequest(403, 'Forbidden after redirect');
      await expect(getJobLogs('o', 'r', 1, 'token')).rejects.toThrow(
        'GitHub API error: 403'
      );
    });

    it('makeGitHubRequest should catch 4xx errors and reject', async () => {
      setupMockRequest(401, JSON.stringify({ message: 'Unauthorized' }));
      await expect(listWorkflows('o', 'r', 'invalid')).rejects.toThrow(
        'GitHub API error: 401'
      );
    });
  });
});
