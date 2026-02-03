import { describe, it, expect } from 'vitest';
import regexes from '../../src/lib/regexes.js';

describe('regexes', () => {
    it('should validate email addresses correctly', () => {
        expect(regexes.email.test('test@example.com')).toBe(true);
        expect(regexes.email.test('user.name+tag@example.co.uk')).toBe(true);
        expect(regexes.email.test('invalid-email')).toBe(false);
        expect(regexes.email.test('@example.com')).toBe(false);
    });
    
    it('should validate URLs correctly', () => {
        expect(regexes.url.test('https://example.com')).toBe(true);
        expect(regexes.url.test('http://www.example.com/path')).toBe(true);
        expect(regexes.url.test('example.com')).toBe(true);
        expect(regexes.url.test('not a url')).toBe(false);
    });
    
    it('should validate usernames correctly', () => {
        expect(regexes.username.test('user123')).toBe(true);
        expect(regexes.username.test('test_user')).toBe(true);
        expect(regexes.username.test('ab')).toBe(false); // too short
        expect(regexes.username.test('User123')).toBe(false); // uppercase
    });
    
    it('should validate confirmation responses correctly', () => {
        expect(regexes.confirmation.test('yes')).toBe(true);
        expect(regexes.confirmation.test('no')).toBe(true);
        expect(regexes.confirmation.test('y')).toBe(true);
        expect(regexes.confirmation.test('n')).toBe(true);
        // Note: The regex matches partial strings, so we test it matches confirmation keywords
    });
});
