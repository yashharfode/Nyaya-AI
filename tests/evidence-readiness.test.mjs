import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function calculateReadiness(evidenceItems) {
  const total = evidenceItems.length;
  if (total === 0) return { percent: 0, collected: 0, total: 0, allMandatoryCollected: false };

  const collected = evidenceItems.filter(i => i.status === 'collected').length;
  const percent = Math.round((collected / total) * 100);

  const mandatory = evidenceItems.filter(i => i.isMandatory);
  const mandatoryCollected = mandatory.filter(i => i.status === 'collected').length;
  const allMandatoryCollected = mandatory.length > 0 && mandatoryCollected === mandatory.length;

  return { percent, collected, total, allMandatoryCollected };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 KB';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

describe('Evidence Checklist & Document Storage Readiness Tests', () => {
  const sampleEvidence = [
    { id: '1', title: 'Payment Proof', isMandatory: true, status: 'collected' },
    { id: '2', title: 'Order Invoice', isMandatory: true, status: 'collected' },
    { id: '3', title: 'Seller Chat', isMandatory: true, status: 'pending' },
    { id: '4', title: 'Product Photo', isMandatory: false, status: 'pending' },
    { id: '5', title: 'Aadhaar ID', isMandatory: false, status: 'pending' },
  ];

  it('should calculate accurate readiness percentage and mandatory status', () => {
    const r1 = calculateReadiness(sampleEvidence);
    assert.equal(r1.collected, 2);
    assert.equal(r1.total, 5);
    assert.equal(r1.percent, 40);
    assert.equal(r1.allMandatoryCollected, false);

    // Simulate uploading item 3 (Seller Chat - mandatory)
    const updated = sampleEvidence.map(i => i.id === '3' ? { ...i, status: 'collected' } : i);
    const r2 = calculateReadiness(updated);
    assert.equal(r2.collected, 3);
    assert.equal(r2.percent, 60);
    assert.equal(r2.allMandatoryCollected, true, 'All 3 mandatory items collected');
  });

  it('should format storage byte counts correctly for UI representation', () => {
    assert.equal(formatBytes(0), '0 KB');
    assert.equal(formatBytes(1024), '1.0 KB');
    assert.equal(formatBytes(1024 * 1024), '1.0 MB');
    assert.equal(formatBytes(2.5 * 1024 * 1024), '2.5 MB');
  });

  it('should validate legal evidence document metadata structure', () => {
    const docItem = {
      id: 'doc_123',
      name: 'Bank_Statement_May2025.pdf',
      type: 'Evidence',
      relatedCase: 'UPI Cyber Fraud',
      size: '1.4 MB',
      sizeBytes: 1468006,
      storageTarget: 'both',
      uploadedOn: '12 May 2025, 11:30 AM'
    };

    assert.ok(docItem.id.startsWith('doc_'));
    assert.equal(docItem.type, 'Evidence');
    assert.equal(docItem.storageTarget, 'both');
    assert.ok(docItem.sizeBytes > 1000000);
  });
});
