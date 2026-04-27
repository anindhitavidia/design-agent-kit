import { describe, it, expect } from 'vitest';
import { loadSchema, makeValidator } from './_helpers.mjs';

describe('status schema', () => {
  const validate = makeValidator(loadSchema('status'));

  it('accepts valid frontmatter', () => {
    const ok = validate({
      state: 'spec-ready',
      last_stage: '02-brief',
      last_run: '2026-04-27T15:30:00Z'
    });
    expect(ok).toBe(true);
  });

  it('accepts minimal frontmatter without optional last_run', () => {
    const ok = validate({
      state: 'wip',
      last_stage: '01-data-intent'
    });
    expect(ok).toBe(true);
  });

  it('rejects missing state', () => {
    expect(validate({ last_stage: '01-data-intent' })).toBe(false);
  });

  it('rejects unknown state value', () => {
    expect(validate({ state: 'shipped', last_stage: '04-handoff' })).toBe(false);
  });

  it('rejects missing last_stage', () => {
    expect(validate({ state: 'wip' })).toBe(false);
  });
});
