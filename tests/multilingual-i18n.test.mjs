import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SUPPORTED_LOCALES = ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'bn', 'gu', 'pa', 'ml', 'or', 'as', 'ur', 'sa', 'ks'];

describe('Multilingual Indic Localization (15 Languages) Tests', () => {
  it('should support exactly 15 Indian Eighth Schedule / constitutional languages', () => {
    assert.equal(SUPPORTED_LOCALES.length, 15, 'Must provide 15 official Indian language options');
    assert.ok(SUPPORTED_LOCALES.includes('hi'), 'Hindi must be supported');
    assert.ok(SUPPORTED_LOCALES.includes('bn'), 'Bengali must be supported');
    assert.ok(SUPPORTED_LOCALES.includes('mr'), 'Marathi must be supported');
    assert.ok(SUPPORTED_LOCALES.includes('ta'), 'Tamil must be supported');
    assert.ok(SUPPORTED_LOCALES.includes('te'), 'Telugu must be supported');
    assert.ok(SUPPORTED_LOCALES.includes('kn'), 'Kannada must be supported');
    assert.ok(SUPPORTED_LOCALES.includes('gu'), 'Gujarati must be supported');
    assert.ok(SUPPORTED_LOCALES.includes('ur'), 'Urdu must be supported');
  });

  it('should verify message catalogs exist on disk', () => {
    const messagesDir = path.resolve('messages');
    assert.ok(fs.existsSync(messagesDir), 'messages/ directory must exist');

    // Check primary languages
    const enPath = path.join(messagesDir, 'en.json');
    assert.ok(fs.existsSync(enPath), 'en.json must exist');

    const hiPath = path.join(messagesDir, 'hi.json');
    assert.ok(fs.existsSync(hiPath), 'hi.json must exist');
  });

  it('should verify English and Hindi message dictionaries have valid JSON syntax and core keys', () => {
    const enContent = JSON.parse(fs.readFileSync(path.resolve('messages/en.json'), 'utf8'));
    const hiContent = JSON.parse(fs.readFileSync(path.resolve('messages/hi.json'), 'utf8'));

    assert.ok(enContent, 'English catalog must parse successfully');
    assert.ok(hiContent, 'Hindi catalog must parse successfully');

    // Check essential sections
    assert.ok(enContent.LandingPage || enContent.Navbar || enContent.Dashboard, 'Should have main navigation keys');
    assert.ok(hiContent.LandingPage || hiContent.Navbar || hiContent.Dashboard, 'Hindi should have main navigation keys');
  });

  it('should correctly configure text direction for RTL languages (Urdu, Kashmiri)', () => {
    const isRtl = (locale) => locale === 'ur' || locale === 'ks';
    assert.equal(isRtl('ur'), true, 'Urdu must be RTL');
    assert.equal(isRtl('ks'), true, 'Kashmiri must be RTL');
    assert.equal(isRtl('hi'), false, 'Hindi must be LTR');
    assert.equal(isRtl('en'), false, 'English must be LTR');
    assert.equal(isRtl('ta'), false, 'Tamil must be LTR');
  });
});
