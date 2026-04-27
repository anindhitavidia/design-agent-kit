import { describe, it, expect } from 'vitest';
import { loadSchema, makeValidator } from './_helpers.mjs';

describe('brief schema', () => {
  const validate = makeValidator(loadSchema('brief'));

  it('accepts valid stage 2 brief', () => {
    expect(validate({
      stage: 2,
      project: 'sso-rollout',
      problem: 'Setup is too slow',
      target_users: ['it-admin'],
      success_criteria: ['<5 min setup'],
      constraints: ['no-new-deps'],
      out_of_scope: ['mobile']
    })).toBe(true);
  });

  it('accepts minimal R-only brief', () => {
    expect(validate({
      stage: 2,
      project: 'sso-rollout',
      problem: 'Setup is slow',
      target_users: ['it-admin']
    })).toBe(true);
  });

  it('rejects empty target_users', () => {
    expect(validate({
      stage: 2, project: 'p', problem: 'x', target_users: []
    })).toBe(false);
  });

  it('rejects missing problem', () => {
    expect(validate({ stage: 2, project: 'p', target_users: ['x'] })).toBe(false);
  });
});
