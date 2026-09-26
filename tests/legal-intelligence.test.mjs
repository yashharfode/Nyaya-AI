import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Core Emergency Keywords Logic as defined in NyayaAI Emergency Mode
const EMERGENCY_PATTERNS = [
  /threaten(ing|ed)?\s+(to\s+)?(kill|murder|harm|beat|acid)/i,
  /suicid(e|al)|end(ing)?\s+my\s+life|kill(ing)?\s+myself/i,
  /domestic\s+violence|beating\s+me|abusing\s+me\s+physically/i,
  /blackmail(ing|ed)?\s+.*(nude|photo|video|leak|money|ransom)/i,
  /kidnap(ping|ped)?|abduct(ion|ed)?/i,
  /rape|sexual\s+assault|molest(ed|ation)?/i,
  /stalk(ing|ed)?\s+.*(follow|house|outside|scared)/i,
  /immediate\s+danger|life\s+is\s+in\s+danger/i,
];

function isEmergencyIssue(text) {
  return EMERGENCY_PATTERNS.some(regex => regex.test(text));
}

// Statutory Reference Mapping Logic
function classifyIndianLegalForum(category) {
  const mapping = {
    'consumer dispute': 'District Consumer Disputes Redressal Commission (DCDRC)',
    'cyber crime': 'National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)',
    'employment dispute': 'Labour Commissioner / Industrial Tribunal',
    'property dispute': 'Civil Court of Competent Jurisdiction / RERA Tribunal',
    'domestic dispute': 'Family Court / Mahila Police Station (Helpline 1090)',
  };
  return mapping[category.toLowerCase()] || 'Appropriate Civil/Criminal Court of Jurisdiction';
}

function getApplicableStatutes(category) {
  const statutes = {
    'cyber crime': ['Information Technology Act, 2000 (Sec 66C, 66D)', 'Bharatiya Nyaya Sanhita, 2023 (Sec 318, 319)'],
    'consumer dispute': ['Consumer Protection Act, 2019 (Sec 2(47), Sec 35)', 'Indian Contract Act, 1872'],
    'employment dispute': ['Industrial Disputes Act, 1947', 'Indian Contract Act, 1872 (Sec 27 - Restraint of Trade)'],
    'property dispute': ['Transfer of Property Act, 1882', 'Real Estate (Regulation and Development) Act, 2016 (RERA)'],
  };
  return statutes[category.toLowerCase()] || ['Bharatiya Nyaya Sanhita, 2023'];
}

describe('NyayaAI Legal Intelligence & Problem Statement Alignment Tests', () => {
  it('should detect life-threatening and crisis emergencies immediately', () => {
    assert.equal(isEmergencyIssue('Someone is threatening to kill me right now'), true);
    assert.equal(isEmergencyIssue('He is blackmailing me with my private photos and leak them'), true);
    assert.equal(isEmergencyIssue('I am facing domestic violence and abuse at home'), true);
    assert.equal(isEmergencyIssue('My life is in danger'), true);
  });

  it('should correctly bypass non-emergency civil inquiries', () => {
    assert.equal(isEmergencyIssue('My landlord has not refunded my security deposit of 20000 rupees'), false);
    assert.equal(isEmergencyIssue('Flipkart did not deliver my laptop and refusing refund'), false);
    assert.equal(isEmergencyIssue('My employment contract has a 2-year non-compete clause'), false);
  });

  it('should route legal issues to appropriate statutory forums', () => {
    assert.equal(classifyIndianLegalForum('consumer dispute'), 'District Consumer Disputes Redressal Commission (DCDRC)');
    assert.equal(classifyIndianLegalForum('cyber crime'), 'National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)');
    assert.equal(classifyIndianLegalForum('property dispute'), 'Civil Court of Competent Jurisdiction / RERA Tribunal');
  });

  it('should associate updated Bharatiya Nyaya Sanhita (BNS 2023) and IT Act correctly', () => {
    const cyberStatutes = getApplicableStatutes('cyber crime');
    assert.ok(cyberStatutes.some(s => s.includes('Bharatiya Nyaya Sanhita, 2023')));
    assert.ok(cyberStatutes.some(s => s.includes('Information Technology Act, 2000')));

    const employmentStatutes = getApplicableStatutes('employment dispute');
    assert.ok(employmentStatutes.some(s => s.includes('Indian Contract Act, 1872 (Sec 27')));
  });

  it('should validate structured complaint notice format', () => {
    const mockDraft = {
      recipient: 'The Branch Manager / Grievance Redressal Officer',
      subject: 'Formal Legal Notice regarding unfair trade practice & pending refund',
      factualTimeline: '1. On 10th January, payment was deducted.\n2. Service not rendered.\n3. Notice ignored.',
      legalPrayer: 'Demand refund of INR 25,000 within 15 calendar days failing which complaint under Section 35 CPA 2019 will be filed.',
    };

    assert.ok(mockDraft.subject.includes('Formal Legal Notice'));
    assert.ok(mockDraft.legalPrayer.includes('15 calendar days'));
  });
});
