import { getSiteUrl } from '../../../src/utils/get-site-url';

describe('getSiteUrl', () => {
  it('returns docs.mongodb.com by default on docs. properties regardless of needsPrefix', () => {
    process.env = {};
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'docs.mongodb.com',
      },
      writable: true,
    });

    expect(getSiteUrl('manual')).toBe('https://docs.mongodb.com');
    expect(getSiteUrl('manual', false)).toBe('https://docs.mongodb.com');
  });

  it('returns subdomained projects for mms and cloud on docs. properties regardless of needsPrefix', () => {
    process.env = {};
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'docs.mongodb.com',
      },
      writable: true,
    });

    expect(getSiteUrl('mms')).toBe('https://docs.opsmanager.mongodb.com');
    expect(getSiteUrl('cloud-docs')).toBe('https://docs.atlas.mongodb.com');

    expect(getSiteUrl('mms', false)).toBe('https://docs.opsmanager.mongodb.com');
    expect(getSiteUrl('cloud-docs', false)).toBe('https://docs.atlas.mongodb.com');
  });

  it('returns only the base name for all www. properties by default', () => {
    process.env = {};
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'www.mongodb.com',
      },
      writable: true,
    });

    expect(getSiteUrl('manual')).toBe('https://www.mongodb.com');
    expect(getSiteUrl('mms')).toBe('https://www.mongodb.com');
    expect(getSiteUrl('cloud-docs')).toBe('https://www.mongodb.com');
  });

  it('returns the prefix for all www. properties when needsPrefix is true, including project for mms and cloud', () => {
    process.env = {};
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'www.mongodb.com',
      },
      writable: true,
    });

    expect(getSiteUrl('manual', true)).toBe('https://www.mongodb.com/docs-qa');
    expect(getSiteUrl('mms', true)).toBe('https://www.mongodb.com/docs-qa/opsmanager');
    expect(getSiteUrl('cloud-docs', true)).toBe('https://www.mongodb.com/docs-qa/atlas');
  });
});
