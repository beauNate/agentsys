/**
 * Agent Skills Open Standard Compliance Tests
 *
 * Validates:
 * 1. Agents that invoke skills have `Skill` tool in frontmatter
 * 2. Skill directory names match skill names in SKILL.md frontmatter
 * 3. Skill names follow the standard (lowercase, hyphens, max 64 chars)
 */

const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, '..', 'plugins');

/**
 * Parse frontmatter from markdown content
 * Handles both single-line and YAML list formats for tools
 * @param {string} content - Markdown file content
 * @returns {Object} - Parsed frontmatter fields
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  let currentKey = null;
  let collectingList = false;
  let listItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is a list item (starts with whitespace and -)
    if (collectingList && /^\s+-\s/.test(line)) {
      const item = line.replace(/^\s+-\s*/, '').trim();
      listItems.push(item);
      continue;
    }

    // If we were collecting a list and hit a non-list line, save the list
    if (collectingList) {
      frontmatter[currentKey] = listItems.join(', ');
      collectingList = false;
      listItems = [];
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Check if this starts a YAML list (value is empty or just whitespace)
    if (value === '' && i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1])) {
      currentKey = key;
      collectingList = true;
      listItems = [];
      continue;
    }

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  // Handle case where list is at the end
  if (collectingList) {
    frontmatter[currentKey] = listItems.join(', ');
  }

  return frontmatter;
}

/**
 * Check if agent content indicates it needs to invoke a skill
 * @param {string} content - Agent file content
 * @returns {Object} - { needsSkill: boolean, evidence: string[] }
 */
function detectSkillInvocationRequirement(content) {
  const patterns = [
    /MUST execute the [`']?([a-z0-9-]+)[`']? skill/gi,
    /MUST invoke the [`']?([a-z0-9-]+)[`']? skill/gi,
    /execute the [`']?([a-z0-9-]+)[`']? skill/gi,
    /invoke the [`']?([a-z0-9-]+)[`']? skill/gi,
    /You MUST execute the.*skill/gi,
    /You MUST invoke the.*skill/gi,
    /MUST execute.*skill to/gi,
    /Do not bypass the skill/gi,
    /Invoke your skill/gi
  ];

  const evidence = [];

  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      evidence.push(...matches);
    }
  }

  return {
    needsSkill: evidence.length > 0,
    evidence: [...new Set(evidence)] // Deduplicate
  };
}

/**
 * Check if tools list includes Skill
 * @param {string} toolsString - The tools field from frontmatter
 * @returns {boolean}
 */
function hasSkillTool(toolsString) {
  if (!toolsString) return false;
  // Tools can be comma-separated or space-separated
  const tools = toolsString.split(/[,\s]+/).map(t => t.trim());
  return tools.some(t => t === 'Skill' || t.startsWith('Skill,') || t.endsWith(',Skill'));
}

/**
 * Get all agent files from all plugins
 * @returns {Array<{plugin: string, file: string, path: string}>}
 */
function getAllAgentFiles() {
  const agents = [];
  const plugins = fs.readdirSync(pluginsDir).filter(f =>
    fs.statSync(path.join(pluginsDir, f)).isDirectory()
  );

  for (const plugin of plugins) {
    const agentsDir = path.join(pluginsDir, plugin, 'agents');
    if (fs.existsSync(agentsDir)) {
      const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        agents.push({
          plugin,
          file,
          path: path.join(agentsDir, file)
        });
      }
    }
  }

  return agents;
}

/**
 * Get all skill directories from all plugins
 * @returns {Array<{plugin: string, dirName: string, skillPath: string}>}
 */
function getAllSkillDirs() {
  const skills = [];
  const plugins = fs.readdirSync(pluginsDir).filter(f =>
    fs.statSync(path.join(pluginsDir, f)).isDirectory()
  );

  for (const plugin of plugins) {
    const skillsDir = path.join(pluginsDir, plugin, 'skills');
    if (fs.existsSync(skillsDir)) {
      const dirs = fs.readdirSync(skillsDir).filter(f => {
        const fullPath = path.join(skillsDir, f);
        return fs.statSync(fullPath).isDirectory() &&
               fs.existsSync(path.join(fullPath, 'SKILL.md'));
      });

      for (const dirName of dirs) {
        skills.push({
          plugin,
          dirName,
          skillPath: path.join(skillsDir, dirName, 'SKILL.md')
        });
      }
    }
  }

  return skills;
}

describe('Agent Skills Open Standard Compliance', () => {
  describe('agents that invoke skills have Skill tool', () => {
    const agents = getAllAgentFiles();

    test.each(agents.map(a => [a.plugin, a.file, a.path]))(
      '%s/%s has Skill tool if required',
      (plugin, file, agentPath) => {
        const content = fs.readFileSync(agentPath, 'utf8');
        const frontmatter = parseFrontmatter(content);
        const { needsSkill, evidence } = detectSkillInvocationRequirement(content);

        if (needsSkill) {
          const hasSkill = frontmatter && hasSkillTool(frontmatter.tools);

          if (!hasSkill) {
            // Provide detailed error message
            throw new Error(
              `Agent ${plugin}/${file} requires Skill tool but doesn't have it.\n` +
              `Evidence found: ${evidence.slice(0, 3).join('; ')}\n` +
              `Current tools: ${frontmatter?.tools || 'none'}\n` +
              `Fix: Add 'Skill' to the tools field in frontmatter`
            );
          }
        }

        // If we get here, either skill isn't needed or it's properly configured
        expect(true).toBe(true);
      }
    );
  });

  describe('skill directory names match skill names', () => {
    const skills = getAllSkillDirs();

    test.each(skills.map(s => [s.plugin, s.dirName, s.skillPath]))(
      '%s/skills/%s directory matches skill name',
      (plugin, dirName, skillPath) => {
        const content = fs.readFileSync(skillPath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        expect(frontmatter).not.toBeNull();
        expect(frontmatter.name).toBeDefined();

        if (frontmatter.name !== dirName) {
          throw new Error(
            `Skill directory/name mismatch in ${plugin}:\n` +
            `  Directory: ${dirName}\n` +
            `  Skill name: ${frontmatter.name}\n` +
            `Fix: Rename directory to match skill name, or update name in SKILL.md`
          );
        }
      }
    );
  });

  describe('skill names follow Agent Skills Open Standard', () => {
    const skills = getAllSkillDirs();

    test.each(skills.map(s => [s.plugin, s.dirName, s.skillPath]))(
      '%s/skills/%s has valid skill name format',
      (plugin, dirName, skillPath) => {
        const content = fs.readFileSync(skillPath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        expect(frontmatter).not.toBeNull();
        expect(frontmatter.name).toBeDefined();

        const name = frontmatter.name;

        // Check max length (64 chars)
        expect(name.length).toBeLessThanOrEqual(64);

        // Check pattern: lowercase letters, numbers, hyphens only
        const validPattern = /^[a-z0-9-]+$/;
        if (!validPattern.test(name)) {
          throw new Error(
            `Skill name "${name}" in ${plugin}/skills/${dirName} is invalid.\n` +
            `Must be: lowercase letters, numbers, and hyphens only.\n` +
            `Pattern: ^[a-z0-9-]+$`
          );
        }
      }
    );

    test.each(skills.map(s => [s.plugin, s.dirName, s.skillPath]))(
      '%s/skills/%s has description field',
      (plugin, dirName, skillPath) => {
        const content = fs.readFileSync(skillPath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        expect(frontmatter).not.toBeNull();

        if (!frontmatter.description) {
          throw new Error(
            `Skill ${plugin}/skills/${dirName} is missing required 'description' field.\n` +
            `The description should explain WHAT the skill does AND WHEN to use it.`
          );
        }

        // Check max length (1024 chars)
        expect(frontmatter.description.length).toBeLessThanOrEqual(1024);
      }
    );
  });

  describe('summary validation', () => {
    test('all agents requiring skills have Skill tool', () => {
      const agents = getAllAgentFiles();
      const violations = [];

      for (const { plugin, file, path: agentPath } of agents) {
        const content = fs.readFileSync(agentPath, 'utf8');
        const frontmatter = parseFrontmatter(content);
        const { needsSkill, evidence } = detectSkillInvocationRequirement(content);

        if (needsSkill && (!frontmatter || !hasSkillTool(frontmatter.tools))) {
          violations.push({
            agent: `${plugin}/${file}`,
            evidence: evidence[0]
          });
        }
      }

      if (violations.length > 0) {
        const msg = violations.map(v => `  - ${v.agent}: "${v.evidence}"`).join('\n');
        throw new Error(
          `Found ${violations.length} agents that invoke skills but lack Skill tool:\n${msg}`
        );
      }
    });

    test('all skill directories match their names', () => {
      const skills = getAllSkillDirs();
      const mismatches = [];

      for (const { plugin, dirName, skillPath } of skills) {
        const content = fs.readFileSync(skillPath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        if (frontmatter && frontmatter.name !== dirName) {
          mismatches.push({
            plugin,
            dirName,
            skillName: frontmatter.name
          });
        }
      }

      if (mismatches.length > 0) {
        const msg = mismatches.map(m =>
          `  - ${m.plugin}/skills/${m.dirName} (name: ${m.skillName})`
        ).join('\n');
        throw new Error(
          `Found ${mismatches.length} skill directory/name mismatches:\n${msg}`
        );
      }
    });
  });
});
