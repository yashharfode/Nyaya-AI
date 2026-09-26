import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Core Statutory Penalty & Relief Calculator for Indian Legal Claims
function calculateStatutoryRelief(claimType, disputeAmount) {
  if (claimType === 'consumer_defect') {
    return {
      relief: 'Full refund plus compensation for mental harassment',
      forum: disputeAmount <= 5000000 ? 'District Commission (DCDRC)' : 'State Commission (SCDRC)',
      limitationPeriod: '2 Years from cause of action (Section 69 Consumer Protection Act)',
    };
  }

  if (claimType === 'cyber_fraud') {
    return {
      relief: 'FIR under Sec 318 BNS & Sec 66D IT Act, reversal via RBI Ombudsman / Banking Ombudsman',
      forum: 'Cyber Crime Police Station / Chief Judicial Magistrate',
      limitationPeriod: 'Immediate (Golden hour reporting within 2 hours)',
    };
  }

  if (claimType === 'tenancy_deposit') {
    return {
      relief: 'Refund of security deposit along with interest at 12% p.a. for wrongful withholding',
      forum: 'Rent Authority / Small Causes Court',
      limitationPeriod: '3 Years under Limitation Act, 1963',
    };
  }

  return { relief: 'Civil Suit for recovery', forum: 'Civil Court', limitationPeriod: '3 Years' };
}

describe('Statutory Relief & Legal Action Calculations Tests', () => {
  it('should map consumer dispute under ₹50 Lakhs to District Consumer Forum', () => {
    const res = calculateStatutoryRelief('consumer_defect', 150000);
    assert.equal(res.forum, 'District Commission (DCDRC)');
    assert.ok(res.limitationPeriod.includes('2 Years'));
  });

  it('should map consumer dispute exceeding ₹50 Lakhs to State Consumer Forum', () => {
    const res = calculateStatutoryRelief('consumer_defect', 6000000);
    assert.equal(res.forum, 'State Commission (SCDRC)');
  });

  it('should specify immediate golden hour protocol for financial cyber fraud', () => {
    const res = calculateStatutoryRelief('cyber_fraud', 25000);
    assert.ok(res.relief.includes('Sec 318 BNS'));
    assert.ok(res.limitationPeriod.includes('2 hours'));
  });

  it('should calculate statutory interest claim for wrongfully withheld security deposit', () => {
    const res = calculateStatutoryRelief('tenancy_deposit', 50000);
    assert.ok(res.relief.includes('12% p.a.'));
    assert.equal(res.forum, 'Rent Authority / Small Causes Court');
  });
});
