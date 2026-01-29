const checkpoint = require('../lib/perf/checkpoint');

describe('perf checkpoint', () => {
  it('builds checkpoint message', () => {
    const message = checkpoint.buildCheckpointMessage({
      phase: 'baseline',
      id: 'perf-123',
      baselineVersion: 'v1.0.0',
      deltaSummary: 'latency -8%'
    });

    expect(message).toBe('perf: phase baseline [perf-123] baseline=v1.0.0 delta=latency -8%');
  });

  it('returns not a git repo when git is unavailable', () => {
    const result = checkpoint.commitCheckpoint({
      phase: 'baseline',
      id: 'perf-123'
    });

    expect(result.ok).toBe(false);
    expect(['not a git repo', 'nothing to commit']).toContain(result.reason);
  });
});
