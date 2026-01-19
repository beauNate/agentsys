# Release Checklist

Reference this document when preparing a release.

## Pre-Release Checklist

- [ ] All tests pass (`npm test`)
- [ ] No uncommitted changes
- [ ] CHANGELOG.md updated with new version entry
- [ ] All version numbers updated (see table below)
- [ ] README.md "What's New" section updated
- [ ] Documentation reflects current features

---

## Version Locations

Update **ALL** these locations before release:

| File | Location |
|------|----------|
| `package.json` | `"version": "X.Y.Z"` |
| `mcp-server/index.js` | `version: 'X.Y.Z'` in Server config (~line 668) |
| `README.md` | Version badge `version-X.Y.Z-blue` |
| `README.md` | "What's New in vX.Y.Z" section |
| `.claude-plugin/plugin.json` | `"version": "X.Y.Z"` |
| `.claude-plugin/marketplace.json` | `"version"` (appears 6x) |
| `plugins/next-task/.claude-plugin/plugin.json` | `"version": "X.Y.Z"` |
| `plugins/ship/.claude-plugin/plugin.json` | `"version": "X.Y.Z"` |
| `plugins/deslop-around/.claude-plugin/plugin.json` | `"version": "X.Y.Z"` |
| `plugins/project-review/.claude-plugin/plugin.json` | `"version": "X.Y.Z"` |
| `plugins/reality-check/.claude-plugin/plugin.json` | `"version": "X.Y.Z"` |
| `CHANGELOG.md` | New entry at top |

**Quick version grep:**
```bash
grep -r '"version"' package.json .claude-plugin/ plugins/*/.claude-plugin/ mcp-server/index.js
```

---

## Version Types

- **Patch (x.x.X)**: Bug fixes, security patches, docs updates
- **Minor (x.X.0)**: New features, non-breaking changes
- **Major (X.0.0)**: Breaking changes, API changes

---

## CHANGELOG Entry

Add entry **before** bumping version numbers.

**Format** ([Keep a Changelog](https://keepachangelog.com/)):

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- **Feature Name** - Description (#PR)

### Changed
- **Component** - What changed (#PR)

### Fixed
- **Bug Name** - What was fixed (#PR)

### Performance
- **Optimization** - What improved (#PR)

### Security
- **Vulnerability** - What was patched (#PR)
```

**Guidelines:**
- Group changes under: `Added`, `Changed`, `Fixed`, `Removed`, `Performance`, `Security`
- Reference PR/issue numbers
- Write user-facing descriptions (what changed for plugin users)
- List breaking changes prominently

---

## Release Commands

```bash
# 1. Verify everything is ready
npm test
git status  # should be clean

# 2. Bump version (updates package.json, creates git tag)
npm version patch  # or minor/major

# 3. Push with tags
git push origin main --tags

# 4. Publish to npm
npm publish

# 5. Create GitHub release
gh release create vX.Y.Z --title "vX.Y.Z" --notes "See CHANGELOG.md"
```

---

## Post-Release Verification

- [ ] npm package published (`npm view awesome-slash version`)
- [ ] GitHub release created
- [ ] Git tag exists (`git tag -l`)
- [ ] Claude Code can install (`claude plugin add npm:awesome-slash`)
