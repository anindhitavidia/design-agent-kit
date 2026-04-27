import { describe, it, expect } from 'vitest';
import { loadSchema, makeValidator } from './_helpers.mjs';

describe('handoff-package schema', () => {
  const validate = makeValidator(loadSchema('handoff-package'));

  it('accepts valid handoff', () => {
    expect(validate({
      stage: 4,
      project: 'sso-rollout',
      component_specs: ['./component-spec.md'],
      a11y_report: './a11y-report.md',
      ready_for_engineering: true,
      screenshots_dir: './screenshots/',
      known_issues: ['safari focus ring on textinput']
    })).toBe(true);
  });

  it('accepts not-ready handoff', () => {
    expect(validate({
      stage: 4,
      project: 'p',
      component_specs: ['./c.md'],
      a11y_report: './a.md',
      ready_for_engineering: false
    })).toBe(true);
  });

  it('rejects missing ready_for_engineering', () => {
    expect(validate({
      stage: 4, project: 'p', component_specs: ['./c.md'], a11y_report: './a.md'
    })).toBe(false);
  });

  it('rejects empty component_specs', () => {
    expect(validate({
      stage: 4, project: 'p', component_specs: [], a11y_report: './a.md', ready_for_engineering: true
    })).toBe(false);
  });
});
