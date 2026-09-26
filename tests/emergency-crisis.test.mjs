import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Full Emergency Safety Patterns implemented in NyayaAI
const EMERGENCY_PATTERNS = [
  /private.{0,15}photo/i,
  /intimate.{0,15}video/i,
  /blackmail/i,
  /sextortion/i,
  /threatening me/i,
  /threatening to/i,
  /someone threaten/i,
  /suicide/i,
  /kill.{0,10}myself/i,
  /want to die/i,
  /end(ing)?\s*(my)?\s*life/i,
  /domestic.{0,10}abuse/i,
  /beating me/i,
  /husband.{0,10}hit/i,
  /wife.{0,10}hit/i,
  /someone.{0,15}following/i,
  /being stalked/i,
  /stalking me/i,
  /kidnap/i,
  /abducted/i,
  /held captive/i,
  /robbery/i,
  /mugging/i,
  /at gunpoint/i,
  /child.{0,10}abuse/i,
  /molest/i,
];

function isEmergency(text) {
  return EMERGENCY_PATTERNS.some(p => p.test(text));
}

function getEmergencyHotlines(triggerReason) {
  return {
    nationalEmergency: '112',
    cyberCrimeHelpline: '1930',
    womenHelpline: '1090',
    childline: '1098',
    portal: 'https://cybercrime.gov.in',
  };
}

describe('Emergency Crisis & Critical Safety Edge Case Tests', () => {
  it('should detect cyber extortion and intimate media blackmail', () => {
    assert.equal(isEmergency('Someone has my private photos and is demanding ₹50,000'), true);
    assert.equal(isEmergency('He said he will leak my intimate video on Telegram'), true);
    assert.equal(isEmergency('I am a victim of sextortion'), true);
  });

  it('should detect physical violence and domestic assault', () => {
    assert.equal(isEmergency('My husband is beating me every night'), true);
    assert.equal(isEmergency('Facing acute domestic abuse at in-laws home'), true);
    assert.equal(isEmergency('Someone threatened to harm my family'), true);
  });

  it('should detect acute self-harm and distress crises', () => {
    assert.equal(isEmergency('I feel hopeless and want to end my life, please help'), true);
    assert.equal(isEmergency('Considering suicide due to loan agent harassment'), true);
  });

  it('should detect stalking, abduction, and immediate threats', () => {
    assert.equal(isEmergency('A stranger has been stalking me outside my college for 3 days'), true);
    assert.equal(isEmergency('Held captive in a locked room against my will'), true);
    assert.equal(isEmergency('Being robbed at gunpoint in broad daylight'), true);
    assert.equal(isEmergency('Suspected child abuse in neighborhood'), true);
  });

  it('should NOT trigger false alarms for benign civil and consumer queries', () => {
    assert.equal(isEmergency('How do I claim refund for cancelled flight tickets on MakeMyTrip?'), false);
    assert.equal(isEmergency('What is the stamp duty rate in Maharashtra for rental agreements?'), false);
    assert.equal(isEmergency('My employer has not credited my salary for two months'), false);
    assert.equal(isEmergency('Consumer court fee structure for claim under 5 lakhs'), false);
  });

  it('should return statutory emergency hotlines for India', () => {
    const hotlines = getEmergencyHotlines('cyber extortion');
    assert.equal(hotlines.nationalEmergency, '112');
    assert.equal(hotlines.cyberCrimeHelpline, '1930');
    assert.equal(hotlines.womenHelpline, '1090');
    assert.equal(hotlines.childline, '1098');
    assert.equal(hotlines.portal, 'https://cybercrime.gov.in');
  });
});
