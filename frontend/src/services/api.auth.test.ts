import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { api } from './api.ts';

describe('Auth Service Validation Tests', () => {
  it('should successfully authenticate Elena Vance with valid credentials', async () => {
    const user = await api.login('elena.vance@company.com', 'Password123!');
    assert.ok(user);
    assert.equal(user.email, 'elena.vance@company.com');
    assert.equal(user.role, 'HR_MANAGER');
    assert.ok(user.permissions.includes('VIEW_SALARIES'));
  });

  it('should reject login when email is changed or unauthorized', async () => {
    await assert.rejects(
      async () => {
        await api.login('other.person@company.com', 'Password123!');
      },
      {
        message: /restricted to authorized HR administrators/i,
      }
    );
  });

  it('should reject login when password is incorrect', async () => {
    await assert.rejects(
      async () => {
        await api.login('elena.vance@company.com', 'WrongPassword!');
      },
      {
        message: /restricted to authorized HR administrators/i,
      }
    );
  });

  it('should reject login when credentials are blank', async () => {
    await assert.rejects(
      async () => {
        await api.login('', '');
      },
      {
        message: /restricted to authorized HR administrators/i,
      }
    );
  });
});
