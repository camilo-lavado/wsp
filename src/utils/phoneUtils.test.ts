import { describe, it, expect } from 'vitest';
import { normalizePhone } from '../utils/phoneUtils';

describe('normalizePhone', () => {
  it('should normalize valid CL phone numbers', () => {
    const result = normalizePhone('9 1234 5678', 'CL');
    expect(result.isValid).toBe(true);
    // libphonenumber-js usually formats CL mobile as +56 9 1234 5678
    expect(result.formatted).toBe('+56912345678'); 
  });

  it('should normalize numbers with country code included', () => {
    const result = normalizePhone('+56912345678');
    expect(result.isValid).toBe(true);
    expect(result.formatted).toBe('+56912345678');
  });

  it('should handle invalid numbers gracefully', () => {
    const result = normalizePhone('123');
    expect(result.isValid).toBe(false);
    expect(result.formatted).toBe('123');
  });

  it('should handle empty input', () => {
    const result = normalizePhone('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Empty');
  });

  it('should respect default country when provided', () => {
    // US number check
    const result = normalizePhone('2025550123', 'US');
    expect(result.isValid).toBe(true);
    expect(result.formatted).toBe('+12025550123');
  });
});
