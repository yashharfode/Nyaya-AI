import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function auditClauseAgainstIndianLaw(clauseText) {
  const issues = [];

  // Section 27 Indian Contract Act (Agreement in restraint of trade is void)
  if (/non-compete|competing|restrain.{0,30}working/i.test(clauseText)) {
    issues.push({
      violates: 'Section 27, Indian Contract Act, 1872',
      severity: 'High Risk',
      reason: 'Post-employment non-compete covenants are completely void in India under Supreme Court precedent (Niranjan Shankar Golikari v. Century Spg & Percept D Mark v. Zaheer Khan).'
    });
  }

  // Salary / Security Deposit Forfeiture
  if (/forfeit.{0,30}(salary|deposit|dues)/i.test(clauseText)) {
    issues.push({
      violates: 'Section 74, Indian Contract Act, 1872',
      severity: 'High Risk',
      reason: 'Unreasonable penalty or automatic forfeiture clauses without actual proved damages are unlawful penalties.'
    });
  }

  // Arbitrary Eviction / Short Notice
  if (/evict.{0,30}(24|48)\s*hour/i.test(clauseText) || /vacate.{0,30}immediate/i.test(clauseText)) {
    issues.push({
      violates: 'Model Tenancy Act & Transfer of Property Act, 1882 (Sec 106)',
      severity: 'High Risk',
      reason: 'Landlords cannot evict tenants on 24-48 hour notice without statutory written notice of minimum 15 to 30 days.'
    });
  }

  return issues;
}

describe('Legal Contract & Loophole Auditing Engine Tests', () => {
  it('should flag post-employment 2-year non-compete clause as void under Section 27', () => {
    const clause = 'The employee shall not join any competing tech company in India for a period of 2 years after resignation.';
    const audit = auditClauseAgainstIndianLaw(clause);
    assert.equal(audit.length, 1);
    assert.ok(audit[0].violates.includes('Section 27'));
    assert.equal(audit[0].severity, 'High Risk');
  });

  it('should flag unconditional salary or deposit forfeiture clauses', () => {
    const clause = 'If the employee leaves before 1 year, the company shall forfeit all pending salary and bonus.';
    const audit = auditClauseAgainstIndianLaw(clause);
    assert.equal(audit.length, 1);
    assert.ok(audit[0].violates.includes('Section 74'));
  });

  it('should flag illegal 48-hour residential lease eviction clause', () => {
    const clause = 'The landlord reserves the right to evict the tenant within 48 hours for any rule violation.';
    const audit = auditClauseAgainstIndianLaw(clause);
    assert.equal(audit.length, 1);
    assert.ok(audit[0].violates.includes('Transfer of Property Act'));
  });

  it('should pass reasonable lawful standard contract clauses', () => {
    const clause = 'Either party may terminate this agreement by providing 30 days prior written notice.';
    const audit = auditClauseAgainstIndianLaw(clause);
    assert.equal(audit.length, 0, 'Standard 30-day notice is valid and should produce 0 violations');
  });
});
