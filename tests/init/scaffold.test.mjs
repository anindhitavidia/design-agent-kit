import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { scaffold } from '../../plugins/core/scripts/scaffold.mjs';

describe('scaffold', () => {
  let tmp;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'dak-test-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('writes all 8 templates into a clean repo', () => {
    const result = scaffold({ targetRoot: tmp });
    expect(result.created.length).toBe(9);
    expect(existsSync(join(tmp, 'design-kit.config.json'))).toBe(true);
    expect(existsSync(join(tmp, 'DESIGN.md'))).toBe(true);
    expect(existsSync(join(tmp, 'REVIEW.md'))).toBe(true);
    expect(existsSync(join(tmp, 'CODING_GUIDELINES.md'))).toBe(true);
    expect(existsSync(join(tmp, 'docs/context/brand.md'))).toBe(true);
    expect(existsSync(join(tmp, 'docs/context/design-system.md'))).toBe(true);
    expect(existsSync(join(tmp, 'docs/context/personas.md'))).toBe(true);
    expect(existsSync(join(tmp, 'docs/context/coding-rules.md'))).toBe(true);
  });

  it('skips existing files by default', () => {
    writeFileSync(join(tmp, 'DESIGN.md'), 'existing content');
    const result = scaffold({ targetRoot: tmp });
    expect(result.skipped).toContain('DESIGN.md');
    expect(readFileSync(join(tmp, 'DESIGN.md'), 'utf8')).toBe('existing content');
  });

  it('overwrites with force=true', () => {
    writeFileSync(join(tmp, 'DESIGN.md'), 'existing content');
    const result = scaffold({ targetRoot: tmp, force: true });
    expect(result.created).toContain('DESIGN.md');
    expect(readFileSync(join(tmp, 'DESIGN.md'), 'utf8')).not.toBe('existing content');
  });

  it('substitutes config values', () => {
    scaffold({
      targetRoot: tmp,
      config: { stackProfile: 'vue', projectRoot: 'projects' }
    });
    const config = JSON.parse(readFileSync(join(tmp, 'design-kit.config.json'), 'utf8'));
    expect(config.stackProfile).toBe('vue');
    expect(config.projectRoot).toBe('projects');
  });
});
