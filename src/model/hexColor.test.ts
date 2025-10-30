// This import will correctly fail because './hexColor.ts' does not exist yet.
import { generateHexColorRegex } from './hexColor';

describe('generateHexColorRegex', () => {
  // Test Case 1: Default behavior (hash is optional)
  describe('with default options (hash optional)', () => {
    const regex = generateHexColorRegex();

    it('should match a 6-digit hex code with a hash', () => {
      expect(regex.test('#a1b2c3')).toBe(true);
    });

    it('should match a 3-digit hex code with a hash', () => {
      expect(regex.test('#f0c')).toBe(true);
    });

    it('should match a 6-digit hex code without a hash', () => {
      expect(regex.test('a1b2c3')).toBe(true);
    });

    it('should match a 3-digit hex code without a hash', () => {
      expect(regex.test('f0c')).toBe(true);
    });

    it('should not match invalid characters', () => {
      expect(regex.test('#g0g0g0')).toBe(false);
    });

    it('should not match invalid length', () => {
      expect(regex.test('#12345')).toBe(false);
    });
  });

  // Test Case 2: requireHash = true
  describe('with requireHash: true', () => {
    const regex = generateHexColorRegex({ requireHash: true });

    it('should match a 6-digit hex code with a hash', () => {
      expect(regex.test('#ffaa00')).toBe(true);
    });

    it('should match a 3-digit hex code with a hash', () => {
      expect(regex.test('#fff')).toBe(true);
    });

    it('should NOT match a 6-digit hex code without a hash', () => {
      expect(regex.test('ffaa00')).toBe(false);
    });

    it('should NOT match a 3-digit hex code without a hash', () => {
      expect(regex.test('fff')).toBe(false);
    });
  });
});
