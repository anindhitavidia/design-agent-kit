import { describe, it, expect } from 'vitest';
import { loadSchema, makeValidator } from './_helpers.mjs';

describe('design-spec schema', () => {
  const validate = makeValidator(loadSchema('design-spec'));

  it('accepts valid spec', () => {
    expect(validate({
      stage: 2,
      project: 'sso-rollout',
      layout_pattern: 'form',
      components_needed: ['Button', 'TextInput', 'Alert'],
      new_components: [],
      interactions: ['validate-on-blur'],
      states: ['empty', 'loading', 'error', 'success'],
      data_dependencies: ['/api/idp-list']
    })).toBe(true);
  });

  it('accepts minimal R-only spec', () => {
    expect(validate({
      stage: 2,
      project: 'sso-rollout',
      layout_pattern: 'form',
      components_needed: ['Button']
    })).toBe(true);
  });

  it('rejects missing layout_pattern', () => {
    expect(validate({
      stage: 2, project: 'p', components_needed: ['Button']
    })).toBe(false);
  });

  it('rejects empty components_needed', () => {
    expect(validate({
      stage: 2, project: 'p', layout_pattern: 'form', components_needed: []
    })).toBe(false);
  });

  it('rejects unknown layout_pattern', () => {
    expect(validate({
      stage: 2, project: 'p', layout_pattern: 'spaceship', components_needed: ['x']
    })).toBe(false);
  });
});
