import { describe, it, expect } from 'vitest';
import { loadSchema, makeValidator } from './_helpers.mjs';

describe('data-intent schema', () => {
  const validate = makeValidator(loadSchema('data-intent'));

  it('accepts valid stage 1 frontmatter', () => {
    expect(validate({
      stage: 1,
      project: 'sso-rollout',
      intent_statement: 'Reduce SSO setup time from 20 min to 5 min',
      data_sources: ['ga4', 'support-tickets'],
      key_metrics: ['time_to_complete', 'drop_off_rate']
    })).toBe(true);
  });

  it('accepts minimal R-only frontmatter', () => {
    expect(validate({
      stage: 1,
      project: 'sso-rollout',
      intent_statement: 'Reduce SSO setup time'
    })).toBe(true);
  });

  it('rejects missing intent_statement', () => {
    expect(validate({ stage: 1, project: 'p' })).toBe(false);
  });

  it('rejects wrong stage number', () => {
    expect(validate({ stage: 2, project: 'p', intent_statement: 'x' })).toBe(false);
  });
});
