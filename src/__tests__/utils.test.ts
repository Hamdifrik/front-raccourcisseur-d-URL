import { describe, it, expect } from 'vitest';
import { generateShortId, urlSchema } from '../lib/utils';

describe('URL Shortener Utils', () => {
  describe('generateShortId', () => {
    it('should generate a string of the specified length', () => {
      const id = generateShortId(8);
      expect(id).toHaveLength(8);
    });

    it('should generate a string of default length (6) when no length is specified', () => {
      const id = generateShortId();
      expect(id).toHaveLength(6);
    });

    it('should only contain alphanumeric characters', () => {
      const id = generateShortId();
      expect(id).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  describe('urlSchema', () => {
    it('should validate correct URLs', () => {
      const result = urlSchema.safeParse({ url: 'https://example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid URLs', () => {
      const result = urlSchema.safeParse({ url: 'not-a-url' });
      expect(result.success).toBe(false);
    });
  });
});