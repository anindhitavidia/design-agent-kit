#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const cwd = process.cwd();
const configPath = join(cwd, 'design-kit.config.json');

if (!existsSync(configPath)) {
  console.log(`[Session Context]
No design-kit.config.json found in this repo.
Run \`/design-kit:init\` to set up design-kit here.`);
  process.exit(0);
}

let config;
try {
  config = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (e) {
  console.log(`[Session Context] design-kit.config.json is malformed (${e.message}). Fix or re-run /design-kit:init.`);
  process.exit(0);
}

const projectRoot = resolve(cwd, config.projectRoot || 'design-kit/projects');
if (!existsSync(projectRoot)) {
  // No projects yet; stay silent.
  process.exit(0);
}

const inProgress = [];
for (const name of readdirSync(projectRoot)) {
  const projDir = join(projectRoot, name);
  if (!statSync(projDir).isDirectory()) continue;
  const statusPath = join(projDir, 'STATUS.md');
  if (!existsSync(statusPath)) continue;
  const content = readFileSync(statusPath, 'utf8');
  const stateMatch = content.match(/^state:\s*([\w-]+)/m);
  const lastStageMatch = content.match(/^last_stage:\s*([\w-]+)/m);
  if (stateMatch && stateMatch[1] !== 'handed-off') {
    inProgress.push({
      name,
      state: stateMatch[1],
      lastStage: lastStageMatch ? lastStageMatch[1] : 'unknown'
    });
  }
}

if (inProgress.length === 0) {
  // Nothing in flight; stay silent.
  process.exit(0);
}

console.log(`[Session Context]
Design Kit — projects in flight:`);
for (const p of inProgress) {
  console.log(`  - ${p.name} (state: ${p.state}, last: ${p.lastStage})`);
}
console.log(`Resume any with: /design-kit:design-sprint <project-name>`);
