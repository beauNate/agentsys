# perf

Rigorous performance investigation workflow. `/perf` enforces sequential benchmarks, minimum run durations, and evidence-backed decision-making.

## Command

```
/perf
```

## What it does

- Establishes a baseline and persists results under `{state-dir}/perf/`
- Runs controlled experiments one at a time
- Performs profiling and hotspot analysis
- Consolidates findings into a single baseline per version

## Requirements

All behavior is governed by:
- `docs/perf-requirements.md`
- `docs/perf-research-methodology.md`

## Artifacts

- `{state-dir}/perf/investigation.json`
- `{state-dir}/perf/investigations/<id>.md`
- `{state-dir}/perf/baselines/<version>.json`
