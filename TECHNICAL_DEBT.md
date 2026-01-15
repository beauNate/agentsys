# Technical Debt

Last updated: 2026-01-15
Review by: /project-review
Last review iteration: Round 1 Complete

## Summary

**Total Issues Found**: 32
**Issues Fixed**: 15
**Issues Remaining**: 17

**By Severity**:
- Critical: 2 found → 0 fixed (2 remaining - need design decisions)
- High: 10 found → 8 fixed (2 remaining)
- Medium: 10 found → 3 fixed (7 remaining)
- Low: 10 found → 4 fixed (6 remaining)

**Estimated Remaining Effort**: ~6-8 hours (mostly large-effort items)

---

## Fixed Issues (Round 1)

### ~~[Security] Command Injection in checkTool Function~~
**File**: plugins/*/lib/platform/verify-tools.js:23
**Status**: [x] FIXED - Now uses validated input + spawnSync/execFileSync with proper platform detection

### ~~[Security] Command Injection in lineAge Function~~
**File**: plugins/*/lib/utils/context-optimizer.js:72-73
**Status**: [x] FIXED - Added escapeShell() helper + line validation

### ~~[Security] Command Injection in findSourceFiles Function~~
**File**: plugins/*/lib/utils/context-optimizer.js:80-81
**Status**: [x] FIXED - Added sanitizeExtension() to allow only alphanumeric

### ~~[Security] Command Injection in authorCommitCount Function~~
**File**: plugins/*/lib/utils/context-optimizer.js:164-165
**Status**: [x] FIXED - Added escapeShell() for author parameter

### ~~[Security] Command Injection in fileExists Function~~
**File**: plugins/*/lib/utils/context-optimizer.js:172-173
**Status**: [x] FIXED - Added escapeSingleQuotes() for file parameter

### ~~[Security] ReDoS Vulnerability in isFileExcluded~~
**File**: plugins/*/lib/patterns/slop-patterns.js:280
**Status**: [x] FIXED - Pre-compiled regex cache with proper metacharacter escaping

### ~~[Security] Unsafe sed Command in Install Scripts~~
**File**: adapters/codex/install.sh:99, adapters/opencode/install.sh
**Status**: [x] FIXED - Added path escaping for sed replacement

### ~~[Performance] Unused path Module Import~~
**File**: plugins/*/lib/platform/detect-platform.js:14
**Status**: [x] FIXED - Removed unused import

### ~~[Performance] No Memoization of Detection Results~~
**File**: plugins/*/lib/platform/detect-platform.js:142-154
**Status**: [x] FIXED - Added caching with 60-second TTL

### ~~[Performance] Regex Created on Every isFileExcluded Call~~
**File**: plugins/*/lib/patterns/slop-patterns.js:279-282
**Status**: [x] FIXED - Pre-compiled regex cache

### ~~[Architecture] Root package.json References Non-Existent lib/~~
**File**: package.json:5
**Status**: [x] FIXED - Created shared lib/ directory at repository root

### ~~[Architecture] Adapter Install Scripts Hardcode Single Plugin~~
**File**: adapters/codex/install.sh:75, adapters/opencode/install.sh:74
**Status**: [x] FIXED - Now copies from $REPO_ROOT/lib/

### ~~[Architecture] Unused 'path' Module Import (Dead Code)~~
**File**: plugins/*/lib/platform/detect-platform.js:14
**Status**: [x] FIXED - Removed unused import

### ~~[Performance] String.toLowerCase() improvement~~
**File**: plugins/*/lib/patterns/review-patterns.js:302-304
**Status**: [x] FIXED - Added input validation

### ~~[Security] Input validation in hasPatternsFor~~
**File**: plugins/*/lib/patterns/review-patterns.js
**Status**: [x] FIXED - Added typeof check

---

## Remaining Issues

### Critical Issues

#### [Architecture] Massive Library Duplication Across All Plugins
**File**: plugins/*/lib/ (25 files total)
**Severity**: critical
**Effort**: medium (~2 hours)
**Description**: All 5 plugins have identical copies of 5 lib files. Files are now synchronized and shared lib/ exists at root, but plugins still contain copies for backwards compatibility.
**Fix**: Consider using symlinks or updating plugins to import from shared lib/ directly. Requires architectural decision about plugin isolation vs code sharing.
**Status**: [ ] Needs Design Decision

#### [Performance] Tool Verification Still Sequential
**File**: plugins/*/lib/platform/verify-tools.js:48-93
**Severity**: critical
**Effort**: large (~1.5 hours)
**Description**: verifyTools() calls checkTool() 25 times sequentially. Added per-call timeout but still runs sequentially. Parallel execution would reduce total time from ~2s to ~200ms.
**Fix**: Convert to async with Promise.all for parallel execution. Requires making checkTool async and updating all callers.
**Status**: [ ] Pending (Large Effort)

---

### High Priority

#### [Performance] Excessive Synchronous fs.existsSync Calls
**File**: plugins/*/lib/platform/detect-platform.js:22-70
**Severity**: high
**Effort**: medium (~1 hour)
**Description**: detect() function makes 20+ synchronous filesystem calls. Mitigated by adding caching, but initial call still blocks.
**Fix**: Convert to async fs.access with Promise.all for parallel checks.
**Status**: [ ] Pending (Mitigated by caching)

#### [Performance] Sequential execSync Calls Block Event Loop
**File**: plugins/*/lib/platform/detect-platform.js:80-130
**Severity**: high
**Effort**: medium (~1 hour)
**Description**: Spawns 4-5 git processes synchronously. Mitigated by caching results.
**Fix**: Convert to async exec with Promise.all.
**Status**: [ ] Pending (Mitigated by caching)

---

### Medium Priority

#### [Security] Environment Variable Token Exposure
**File**: plugins/pr-merge/commands/pr-merge.md:419
**Severity**: medium
**Effort**: medium (~30 min)
**Description**: GitLab token passed via command line, visible in process table.
**Fix**: Use environment variable inheritance or config file.
**Status**: [ ] Needs Design Decision

#### [Security] Force Push Without Confirmation
**File**: plugins/ship/commands/ship.md:781
**Severity**: medium
**Effort**: small (~20 min)
**Description**: Command performs force push without confirmation.
**Fix**: Add safety checks and use --force-with-lease.
**Status**: [ ] Needs Design Decision

#### [Performance] fs.readFileSync Redundancy
**File**: plugins/*/lib/platform/detect-platform.js:96-102
**Severity**: medium
**Effort**: medium (~30 min)
**Description**: File already checked with existsSync is read again.
**Fix**: Cache file reads during detection.
**Status**: [ ] Pending

#### [Architecture] No Test Infrastructure
**File**: package.json:8
**Severity**: medium
**Effort**: large (~4 hours)
**Description**: No test files exist, test script is placeholder.
**Fix**: Add Jest test framework and create unit tests.
**Status**: [ ] Pending (Large Effort)

#### [Architecture] Plugin Manifests Lack Dependencies
**File**: plugins/*/.claude-plugin/plugin.json
**Severity**: medium
**Effort**: small (~30 min)
**Description**: No declaration of dependencies on shared libraries.
**Fix**: Add dependencies field to plugin.json files.
**Status**: [ ] Pending

#### [Security] Unsanitized User Input in read -p
**File**: plugins/pr-merge/commands/pr-merge.md:82
**Severity**: low
**Effort**: small (~15 min)
**Description**: User input used without validation.
**Fix**: Add input validation for numeric values.
**Status**: [ ] Pending

#### [Security] Hardcoded Pattern Detection Gaps
**File**: plugins/*/lib/patterns/slop-patterns.js:207
**Severity**: low
**Effort**: medium (~1 hour)
**Description**: Simplistic regex for detecting secrets.
**Fix**: Expand pattern to include more secret formats.
**Status**: [ ] Pending

---

### Low Priority

#### [Performance] Repeated Object.entries Iteration
**File**: plugins/*/lib/patterns/slop-patterns.js:245-252
**Severity**: low
**Effort**: small (~20 min)
**Description**: Every call iterates all patterns.
**Fix**: Pre-compute indexed lookups at module load.
**Status**: [ ] Pending

#### [Performance] New Date() Objects Created Repeatedly
**File**: plugins/*/lib/platform/detect-platform.js:152, 164
**Severity**: low
**Effort**: small (~5 min)
**Description**: Creating Date objects adds GC pressure.
**Fix**: Cache timestamp or use Date.now().
**Status**: [ ] Fixed in detect(), remaining in error handler

#### [Performance] Large Static Pattern Objects Not Frozen
**File**: plugins/*/lib/patterns/slop-patterns.js:18-238
**Severity**: low
**Effort**: small (~15 min)
**Description**: Large mutable objects could be accidentally mutated.
**Fix**: Use Object.freeze().
**Status**: [ ] Pending

#### [Security] Unsafe JSON Parsing Without Structure Validation
**File**: plugins/*/lib/platform/detect-platform.js:98
**Severity**: low
**Effort**: small (~15 min)
**Description**: Parsed JSON not validated.
**Fix**: Validate expected structure.
**Status**: [ ] Pending

#### [Security] Unquoted Variable Expansion in Install Scripts
**File**: adapters/opencode/install.sh:74
**Severity**: low
**Effort**: small (~10 min)
**Description**: Glob pattern with variable.
**Fix**: Use more explicit copy pattern.
**Status**: [ ] Pending

---

## Design Decisions Required

The following issues require architectural decisions before fixing:

1. **Library Duplication Strategy**
   - Option A: Use symlinks (may not work on Windows)
   - Option B: Update plugins to import from shared lib/ (breaking change)
   - Option C: Keep copies synchronized (current approach)

2. **Token Exposure in Commands**
   - Need to decide on secret management approach for CI platforms

3. **Force Push Safety**
   - Need to decide if interactive confirmation works in all contexts
   - Consider using --force-with-lease by default

4. **Test Infrastructure**
   - Need to decide on test framework (Jest recommended)
   - Need to define coverage targets

---

## Progress Tracking

### Completed
- [x] Command Injection in checkTool
- [x] Command Injection in lineAge
- [x] Command Injection in findSourceFiles
- [x] Command Injection in authorCommitCount
- [x] Command Injection in fileExists
- [x] ReDoS Vulnerability
- [x] Unsafe sed Command
- [x] Unused path Import
- [x] No Detection Memoization
- [x] Regex Created Every Call
- [x] Root package.json Invalid Reference
- [x] Adapter Hardcoded Plugin Source
- [x] Dead Code (path import)
- [x] Input validation in review-patterns
- [x] Created shared lib/ directory

### Pending (Requires Design Decision)
- [ ] Massive Library Duplication
- [ ] Token Exposure in Commands
- [ ] Force Push Without Confirmation
- [ ] Test Infrastructure

### Pending (Large Effort)
- [ ] Sequential Tool Verification (async conversion)
- [ ] Excessive Synchronous fs.existsSync
- [ ] Sequential execSync Calls

### Pending (Small/Medium Effort)
- [ ] fs.readFileSync Redundancy
- [ ] Plugin Manifests Dependencies
- [ ] User Input Validation
- [ ] Pattern Detection Gaps
- [ ] Object.entries Iteration
- [ ] Date Objects
- [ ] Pattern Objects Frozen
- [ ] JSON Structure Validation
- [ ] Variable Expansion
