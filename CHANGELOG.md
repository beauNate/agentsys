# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-15

### Added
- **Test Infrastructure**: Jest test suite with 103 unit tests covering all core modules
  - `detect-platform.test.js` - Platform detection tests
  - `verify-tools.test.js` - Tool verification tests
  - `slop-patterns.test.js` - Pattern matching and secret detection tests
  - `review-patterns.test.js` - Framework pattern tests
- **Expanded Secret Detection**: 14 new patterns for comprehensive credential detection
  - JWT tokens, OpenAI API keys, GitHub tokens (PAT, fine-grained, OAuth)
  - AWS credentials, Google/Firebase API keys, Stripe API keys
  - Slack tokens/webhooks, Discord tokens/webhooks, SendGrid API keys
  - Twilio credentials, NPM tokens, Private keys, High-entropy strings
- **Plugin Dependencies**: Added `sharedLib` and `requires` fields to all plugin manifests
- **Pre-indexed Pattern Lookups**: O(1) lookup performance for patterns by language, severity, category
  - `getPatternsByCategory()`, `getPatternsForFrameworkCategory()`
  - `searchPatterns()` for full-text search across all patterns
  - `getPatternCount()`, `getTotalPatternCount()` for statistics

### Changed
- **Async Platform Detection**: Converted to async operations with `Promise.all` for parallel execution
  - `detectAsync()` runs all detections in parallel
  - Added async versions of all detection functions
- **Async Tool Verification**: Parallel tool checking reduces verification time from ~2s to ~200ms
  - `verifyToolsAsync()` checks all 26 tools in parallel
  - `checkToolAsync()` for individual async tool checks
- **File Caching**: Added `existsCached()` and `readFileCached()` to avoid redundant file reads

### Fixed
- Windows spawn deprecation warning by using `cmd.exe` directly instead of shell option
- Token exposure in `pr-merge.md` and `ship.md` - now uses `-K` config file approach
- Force push safety in `ship.md` - replaced `--force` with `--force-with-lease`
- JSON structure validation before accessing `config.environments` in platform detection
- Glob expansion issue in install scripts - now uses explicit for-loop iteration
- Numeric validation for PR number input in `/pr-merge`

### Security
- Added `deepFreeze()` to pattern objects for V8 optimization and immutability
- Input validation for tool commands and version flags (alphanumeric only)

## [1.0.0] - 2026-01-15

Initial release with full feature set.

### Added
- `/ship` command for complete PR workflow with deployment
- `/next-task` command for intelligent task prioritization
- `/deslop-around` command for AI slop cleanup
- `/project-review` command for multi-agent code review (with Phase 8 GitHub issue creation)
- `/pr-merge` command for intelligent PR merge procedure
- Platform detection scripts with caching
- Tool verification system
- Context optimization utilities
- Adapters for Codex CLI and OpenCode
- MIT License
- Security policy
- Contributing guidelines
