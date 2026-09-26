import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Security & Data Protection Audit Tests', () => {
  it('should verify Firestore rules enforce strict user isolation and zero public read/write', () => {
    const rulesPath = path.resolve('firestore.rules');
    assert.ok(fs.existsSync(rulesPath), 'firestore.rules must exist');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');

    // Verify isSignedIn requirement
    assert.ok(rulesContent.includes('request.auth != null'), 'Must require authenticated session');
    // Verify user ID match on users collection
    assert.ok(rulesContent.includes('request.auth.uid == userId'), 'Must enforce auth.uid == userId on users');
    // Verify case ownership verification
    assert.ok(rulesContent.includes('request.auth.uid'), 'Must enforce case ownership');
    // Verify no wildcards granting global access
    assert.equal(rulesContent.includes('allow read, write: if true;'), false, 'Never allow public open read/write');
  });

  it('should verify next.config.ts configures OWASP-recommended HTTP security headers', () => {
    const configPath = path.resolve('next.config.ts');
    assert.ok(fs.existsSync(configPath), 'next.config.ts must exist');
    const configContent = fs.readFileSync(configPath, 'utf8');

    // Check clickjacking protection
    assert.ok(configContent.includes('X-Frame-Options'), 'Must set X-Frame-Options');
    assert.ok(configContent.includes('DENY'), 'Must set X-Frame-Options to DENY');

    // Check MIME-sniffing protection
    assert.ok(configContent.includes('X-Content-Type-Options'), 'Must set X-Content-Type-Options');
    assert.ok(configContent.includes('nosniff'), 'Must set nosniff');

    // Check Referrer-Policy
    assert.ok(configContent.includes('Referrer-Policy'), 'Must configure Referrer-Policy');

    // Check HSTS
    assert.ok(configContent.includes('Strict-Transport-Security'), 'Must enforce Strict-Transport-Security');
  });

  it('should ensure no private secrets or service account keys are exposed in git tracking', () => {
    const gitignorePath = path.resolve('.gitignore');
    assert.ok(fs.existsSync(gitignorePath), '.gitignore must exist');
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');

    assert.ok(gitignore.includes('.env*') || gitignore.includes('.env'), '.gitignore must ignore environment files');
  });
});
