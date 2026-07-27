import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitService } from '../../src/gitService';
import { exec } from 'child_process';

vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

describe('GitService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get all commits successfully with path filter', async () => {
    vi.mocked(exec).mockImplementation((cmd: any, opts: any, cb: any) => {
      if (cmd.includes('git rev-parse')) {
        cb(null, { stdout: 'true\n', stderr: '' });
      } else {
        cb(null, {
          stdout:
            'hash123|author1|2026-01-01T00:00:00Z|feat(ui): add button\nhash456|author2|2026-01-02T00:00:00Z|fix: bug resolution\nhash789|author3|2026-01-03T00:00:00Z|custom message\n',
          stderr: 'warning msg',
        });
      }
    });

    const git = new GitService('/repo');
    const commits = await git.getAllCommits('/repo/packages/ui');

    expect(commits).toHaveLength(3);
    expect(commits[0].type).toBe('feat');
    expect(commits[1].type).toBe('fix');
    expect(commits[2].type).toBe('other');
  });

  it('should return empty array if stdout is empty', async () => {
    vi.mocked(exec).mockImplementation((cmd: any, opts: any, cb: any) => {
      if (cmd.includes('git rev-parse')) {
        cb(null, { stdout: 'true\n', stderr: '' });
      } else {
        cb(null, { stdout: '', stderr: '' });
      }
    });

    const git = new GitService('/repo');
    const commits = await git.getAllCommits();
    expect(commits).toEqual([]);
  });

  it('should throw error if not inside a git repository', async () => {
    vi.mocked(exec).mockImplementation((cmd: any, opts: any, cb: any) => {
      cb(new Error('fatal: not a git repository'), {
        stdout: '',
        stderr: 'fatal',
      });
    });

    const git = new GitService('/invalid');
    await expect(git.getAllCommits()).rejects.toThrow('Not a git repository');
  });
});
