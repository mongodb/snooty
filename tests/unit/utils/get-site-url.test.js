import { getSiteUrl } from '../../../src/utils/get-site-url';

describe('getSiteUrl', () => {
  it('returns the prefix for all www. properties, including prefix + project for mms and cloud', () => {
    process.env = {};
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'www.mongodb.com/docs',
      },
      writable: true,
    });

    expect(getSiteUrl('manual')).toBe('https://www.mongodb.com/docs');
    expect(getSiteUrl('mms')).toBe('https://www.mongodb.com/docs/ops-manager');
    expect(getSiteUrl('cloud-docs')).toBe('https://www.mongodb.com/docs/atlas');
  });
});
