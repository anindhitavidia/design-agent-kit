import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { scaffold } from '../../plugins/core/scripts/scaffold.mjs';
import { loadSchema, makeValidator } from '../schemas/_helpers.mjs';

describe('e2e: artifact contract integrity', () => {
  let tmp;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'dak-smoke-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('init scaffolds a working repo', () => {
    const result = scaffold({ targetRoot: tmp });
    expect(result.created.length).toBe(8);
    const config = JSON.parse(readFileSync(join(tmp, 'design-kit.config.json'), 'utf8'));
    expect(config.schemaVersion).toBe(1);
    expect(config.stackProfile).toBe('react-nextjs');
  });

  it('a fixture design spec validates against the schema', () => {
    const validate = makeValidator(loadSchema('design-spec'));
    const fixturePath = resolve('tests/fixtures/sample-spec.md');
    const content = readFileSync(fixturePath, 'utf8');
    const match = content.match(/^---\n([\s\S]+?)\n---/);
    expect(match).toBeTruthy();
    const yaml = match[1];
    const obj = parseFrontmatter(yaml);
    expect(validate(obj)).toBe(true);
  });

  it('an invalid spec missing components_needed fails validation', () => {
    const validate = makeValidator(loadSchema('design-spec'));
    expect(validate({
      stage: 2,
      project: 'broken',
      layout_pattern: 'form'
    })).toBe(false);
  });
});

function parseFrontmatter(yaml) {
  const obj = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    } else if (val === 'true' || val === 'false') {
      val = val === 'true';
    } else if (/^\d+$/.test(val)) {
      val = parseInt(val, 10);
    }
    obj[m[1]] = val;
  }
  return obj;
}
