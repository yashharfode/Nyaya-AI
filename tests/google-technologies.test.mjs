import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_STACK_MANIFEST, getGoogleTechnologyStack, isGoogleServiceActive } from '../src/lib/google-tech.ts';

describe('Google Technologies Ecosystem Integration Tests', () => {
  it('should verify Google Generative AI SDK is installed and instantiable', () => {
    assert.ok(GoogleGenerativeAI, 'GoogleGenerativeAI class should be defined');
    const dummyClient = new GoogleGenerativeAI('test-dummy-api-key-google-genai');
    assert.ok(dummyClient, 'Client should instantiate with valid API key placeholder');
    const model = dummyClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    assert.equal(model.model, 'models/gemini-1.5-flash', 'Gemini model should be properly referenced');
  });

  it('should verify Google Technology Stack Manifest entries', () => {
    const stack = getGoogleTechnologyStack();
    assert.ok(Array.isArray(stack), 'Google stack must be an array');
    assert.ok(stack.length >= 4, 'Should declare at least 4 integrated Google services');

    // Verify Google Gemini
    const geminiService = stack.find(s => s.service.includes('Gemini'));
    assert.ok(geminiService, 'Google Gemini must be present in stack');
    assert.equal(geminiService.category, 'AI/ML');
    assert.equal(geminiService.status, 'active');

    // Verify Google Firebase Auth
    const authService = stack.find(s => s.service.includes('Firebase'));
    assert.ok(authService, 'Google Firebase Auth must be present');
    assert.equal(authService.category, 'Identity');

    // Verify Google Cloud Firestore
    const firestoreService = stack.find(s => s.service.includes('Firestore'));
    assert.ok(firestoreService, 'Google Cloud Firestore must be present');
    assert.equal(firestoreService.category, 'Database');
  });

  it('should verify Google service status lookup utility', () => {
    assert.equal(isGoogleServiceActive('Gemini'), true);
    assert.equal(isGoogleServiceActive('Firebase'), true);
    assert.equal(isGoogleServiceActive('Firestore'), true);
    assert.equal(isGoogleServiceActive('NonExistentService'), false);
  });
});
