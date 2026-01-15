# Usage Examples

Real-world examples of using awesome-slash-commands in Claude Code.

---

## Example 1: Clean Up Debugging Code

**Scenario**: You have console.log statements and TODOs scattered in your code.

### In Claude Code Chat:

```
You: /deslop-around
```

**Claude's Response:**
```
I'll analyze your codebase for slop...

Detected: Node.js project, single-branch workflow

Found 8 issues:
1. src/app.js:15 - console.log("User logged in")
2. src/app.js:42 - // TODO: Add validation
3. src/utils.js:8 - console.log("Debug:", data)
4. src/api.js:23 - // FIXME: This is hacky
5. src/api.js:67 - empty catch block
6. src/models.js:34 - console.debug("Processing...")
7. src/config.js:12 - // TODO: Move to env vars
8. tests/setup.js:5 - console.log("Test mode")

Would you like me to:
a) Show detailed cleanup plan (report mode)
b) Apply fixes automatically (apply mode)
```

```
You: Apply fixes, but keep the console.log in tests

Claude: Applying fixes to production code only...

✓ Removed 5 console.log statements
✓ Removed 2 old TODO comments (>90 days old)
✓ Added logging to empty catch block
✓ Kept test console.logs (in tests/ directory)

Changes made:
- src/app.js: 2 fixes
- src/utils.js: 1 fix
- src/api.js: 2 fixes
- src/models.js: 1 fix
- src/config.js: 1 fix

Running tests... ✓ All tests pass

Ready to commit these changes!
```

---

## Example 2: Find What to Work On Next

**Scenario**: You have 20 GitHub issues and need to prioritize.

### In Claude Code Chat:

```
You: /next-task
```

**Claude's Response:**
```
Analyzing tasks from GitHub Issues...

Found 20 open issues
Checking codebase for already-implemented tasks...

Top 5 Priority Tasks:

1. [P1] Fix authentication timeout bug (#142)
   Source: GitHub Issue #142
   Status: Not implemented (verified - no fix in codebase)
   Priority Score: 85
   Why now:
   - Blocking issues #145 and #147
   - Reported 45 days ago (old bug)
   - High priority label
   - Related to recent work in src/auth/
   Estimated effort: Small (30 minutes)
   Files to modify: src/auth/session.ts

2. [P2] Add dark mode to settings (#89)
   Source: GitHub Issue #89
   Status: Partially done (Settings component exists, no dark mode)
   Priority Score: 60
   Why now:
   - Recent work in src/components/Settings.tsx
   - 10 👍 reactions from users
   - No blocking dependencies
   Estimated effort: Medium (2 hours)
   Files to modify:
   - src/components/Settings.tsx
   - src/hooks/useTheme.ts (create new)
   - src/styles/theme.ts

3. [P3] Improve API error messages (#67)
   ...

Which task would you like to work on? Or type /next-task --implement to start.
```

```
You: /next-task --implement

Claude: Great! Let's implement task #1: Fix authentication timeout bug

Creating branch: fix/auth-timeout-bug-142

Step 1: Investigating current implementation...
*reads src/auth/session.ts*

Found the issue: Session timeout is hardcoded to 5 minutes, should be configurable.

Implementing fix...
*updates code*
*writes tests*

✓ Fix implemented
✓ Tests written and passing
✓ Ready to ship

Would you like to run /ship to create PR and merge?
```

---

## Example 3: Get Code Review Before PR

**Scenario**: You want a thorough review before creating a PR.

### In Claude Code Chat:

```
You: I've finished the login feature. Can you do a full code review?
```

**Claude's Response:**
```
I'll use /project-review to thoroughly review your changes.

Detected: React + TypeScript project
Framework: React (will apply React-specific patterns)
Scope: Recent changes (last 3 commits)

Launching specialized review agents:
- security-expert
- performance-engineer
- test-quality-guardian
- frontend-specialist (React)

This will take 2-3 minutes...
```

**After Review:**
```
Review Complete! Found 4 issues:

CRITICAL Issues (1):
1. Security: src/api/auth.ts:45
   Issue: Password sent in URL parameters (visible in logs)
   Code: `fetch(`/api/login?password=${password}`)`
   Fix: Use POST body instead:
   ```typescript
   fetch('/api/login', {
     method: 'POST',
     body: JSON.stringify({ password })
   })
   ```

HIGH Priority (2):
2. React: src/components/LoginForm.tsx:23
   Issue: Missing useCallback for login handler (causes re-renders)
   Fix: Wrap in useCallback with proper dependencies

3. Testing: tests/login.test.tsx:15
   Issue: Missing test for failed login scenario
   Fix: Add test case for wrong password

MEDIUM Priority (1):
4. Performance: src/hooks/useAuth.ts:10
   Issue: Expensive calculation in every render
   Fix: Wrap in useMemo

Would you like me to fix these issues? (I'll fix them iteratively)
```

```
You: Yes, fix all critical and high priority issues

Claude: Fixing issues...

Round 1: Fixing critical security issue
✓ Updated auth.ts to use POST body
✓ Added security test

Round 2: Fixing React performance issue
✓ Added useCallback to LoginForm
✓ Added missing test case

Round 3: Re-running review to verify...
✓ No critical or high priority issues remain
✓ 1 medium priority issue remains (optional)

All critical issues resolved! Code is ready to ship.
```

---

## Example 4: Ship Feature to Production

**Scenario**: You've finished a feature and want to deploy it.

### In Claude Code Chat:

```
You: /ship
```

**Claude's Response:**
```
Starting complete PR workflow...

Phase 1: Pre-flight checks
✓ Detected: GitHub Actions CI
✓ Detected: Railway deployment (multi-branch: main → stable)
✓ Working directory has uncommitted changes
✓ On feature branch: feature/add-dark-mode

Phase 2: Committing current work
Analyzing changes...
- 3 files modified (Settings.tsx, useTheme.ts, theme.ts)
- Added dark mode toggle
- Created theme hook
- Updated theme configuration

Generated commit message:
"feat(ui): add dark mode toggle to settings

- Add dark mode switch in Settings component
- Create useTheme hook for theme management
- Add dark/light theme configurations
- Persist user preference in localStorage"

✓ Committed as: abc123f

Phase 3: Creating PR
✓ Pushed to origin/feature/add-dark-mode
✓ Created PR #156: "Add dark mode toggle to settings"
   URL: https://github.com/youruser/yourrepo/pull/156

Phase 4: Waiting for CI...
⏳ GitHub Actions running...
  - lint: ✓ passed
  - test: ✓ passed
  - build: ✓ passed
✓ All CI checks passed (2m 34s)

Phase 5: Quality review by agents...
Launching review agents in parallel...
  - code-reviewer: ✓ approved
  - silent-failure-hunter: ✓ approved
  - test-analyzer: ✓ approved (coverage: 95%)

Phase 6: Merging PR
✓ Merged PR #156 to main (squash strategy)
✓ Switched to main branch
✓ Pulled latest changes

Phase 7: Deploying to development...
⏳ Railway deploying to development environment...
✓ Deployed to: https://yourapp-dev.railway.app
✓ Health check passed (200 OK)
✓ Error rate acceptable (0 errors)

Phase 8: Validating development...
Running smoke tests...
✓ Dark mode toggle appears in settings
✓ Theme switches correctly
✓ Preference persists after reload

Phase 9: Deploying to production...
Merging main → stable...
✓ Merged to stable branch
⏳ Railway deploying to production...
✓ Deployed to: https://yourapp.railway.app
✓ Production health check passed

Phase 10: Validating production...
✓ Health check: 200 OK
✓ Error rate: 0 errors (last 5 min)
✓ Production is healthy

Phase 11: Cleanup
✓ Deleted feature branch
✓ Worktrees cleaned

✓ DEPLOYMENT COMPLETE!

Summary:
- PR #156 merged to main
- Deployed to development: https://yourapp-dev.railway.app
- Deployed to production: https://yourapp.railway.app
- All validation passed
- Feature is live!

Total time: 8 minutes
```

---

## Example 5: Merge Someone Else's PR

**Scenario**: A teammate created a PR that needs review and merging.

### In Claude Code Chat:

```
You: /pr-merge 143
```

**Claude's Response:**
```
Loading PR #143: "Add user profile page" by @teammate

PR Details:
- Files changed: 5
- Commits: 3
- Status: Open
- CI: ✓ Passed
- Reviews: 1 approval, 1 comment

Review comments found:
1. @reviewer: "Can we add validation for the email field?"
2. @reviewer: "Looks good! ✓"

Addressing review comment...
✓ Added email validation to profile form
✓ Added test for email validation
✓ Pushed changes
✓ Commented on PR: "Added email validation as requested"

Running quality validation agents...
- code-quality: ✓ approved
- security: ✓ approved
- test-coverage: ✓ approved (coverage maintained at 92%)

All checks passed, ready to merge!

Merging PR #143...
✓ Merged to main (squash)
✓ Branch deleted

Testing development deployment...
⏳ Waiting for deployment...
✓ Development deployed and validated

Merging to production...
✓ Merged main → stable
⏳ Waiting for production deployment...
✓ Production deployed and validated

✓ PR #143 MERGED AND DEPLOYED!

Summary:
- Addressed review comments
- All validation passed
- Deployed to development and production
- Feature is live

Team member @teammate notified of successful merge.
```

---

## Example 6: Quick Security Audit

**Scenario**: You want to quickly check for security issues.

### In Claude Code Chat:

```
You: /project-review --domain security --quick
```

**Claude's Response:**
```
Running focused security review (quick mode)...

Project: Node.js + Express
Framework patterns: Express security patterns loaded

Security Review Complete (1 pass, 45 seconds)

Found 2 security issues:

CRITICAL:
1. src/api/users.js:34 - SQL Injection vulnerability
   Code: `db.query(\`SELECT * FROM users WHERE id = ${req.params.id}\`)`
   Risk: Attacker can inject SQL and access/modify database
   Fix: Use parameterized queries:
   ```javascript
   db.query('SELECT * FROM users WHERE id = ?', [req.params.id])
   ```

HIGH:
2. src/middleware/auth.js:12 - Weak JWT secret
   Code: `jwt.sign(payload, 'secret123')`
   Risk: Easily guessable secret allows token forgery
   Fix: Use strong secret from environment variables:
   ```javascript
   jwt.sign(payload, process.env.JWT_SECRET)
   ```

Quick security audit complete.
Would you like me to fix these issues?
```

```
You: Yes, fix both

Claude: Fixing security issues...

✓ Fixed SQL injection (parameterized query)
✓ Fixed JWT secret (using env variable)
✓ Added JWT_SECRET to .env.example
✓ Updated documentation

Security issues resolved! Run full review with /project-review for comprehensive check.
```

---

## Tips for Best Results

### 1. Run Commands in Sequence

```
/deslop-around       # Clean up first
/project-review      # Get feedback
/ship                # Deploy when ready
```

### 2. Use Filters

```
/next-task bug              # Focus on bugs
/project-review --domain security   # Security only
/ship --dry-run             # Preview without executing
```

### 3. Combine with Claude's Analysis

```
You: Can you review the authentication code and then run /project-review on it?

Claude:
*reviews code manually first*
*then runs /project-review for automated checks*
*combines both perspectives*
```

### 4. Iterate on Issues

```
You: /project-review

Claude: Found 10 issues

You: Fix the critical ones

Claude: *fixes critical issues*

You: /project-review

Claude: Now only 3 medium issues remain
```

---

## Common Workflows

### Starting New Feature
```
1. /next-task --implement    # Pick task and start
2. *develop feature*
3. /deslop-around apply      # Clean up
4. /project-review           # Get feedback
5. /ship                     # Deploy
```

### Code Review Flow
```
1. /project-review --quick   # Quick check
2. Fix issues
3. /project-review           # Full review
4. Iterate until clean
5. /ship                     # Deploy
```

### Maintenance Day
```
1. /deslop-around report     # See all slop
2. /deslop-around apply      # Clean it up
3. /next-task                # See what else needs work
4. /project-review           # Full audit
```

### PR Review
```
1. /pr-merge 123             # Review and merge teammate's PR
2. Validate deployment
3. Monitor production
```

---

## Next Steps

- See [INSTALLATION.md](./INSTALLATION.md) for setup
- See [MANUAL_TESTING.md](./MANUAL_TESTING.md) for testing
- See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

**Start with `/deslop-around` - it's the safest and shows immediate value!**
